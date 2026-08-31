# ==============================================================================
# HỆ THỐNG 3: ĐỘNG CƠ NLP ĐA QUỐC GIA + QUẢN LÝ LỊCH SỬ DỰ ĐOÁN (HISTORY API)
# ==============================================================================

import os
import sys
import time
import re
import datetime
import urllib.request
import urllib.parse
import json
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify, send_from_directory

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.join(BASE_DIR, "..", "web")
MOBILE_DIR = os.path.join(BASE_DIR, "..", "mobile")
MODEL_DIR = os.path.join(BASE_DIR, "..", "model")

POSSIBLE_MODEL_PATHS = [
    os.path.join(MODEL_DIR, "final_customer_pipeline.joblib"),
    os.path.join(MODEL_DIR, "customer_pipeline.joblib"),
    os.path.join(BASE_DIR, "final_customer_pipeline.joblib"),
    os.path.join(BASE_DIR, "customer_pipeline.joblib")
]

pipeline = None
model_name = "TF-IDF + Logistic Regression (Multimodal Pipeline)"
label_map = {0: "Not Recommended / Churn Risk", 1: "Recommended / High Satisfaction"}

# Bộ nhớ lưu lịch sử dự đoán gần đây (tối đa 50 bản ghi)
PREDICTION_HISTORY = []

def load_ai_model():
    global pipeline, label_map, model_name
    for path in POSSIBLE_MODEL_PATHS:
        if os.path.exists(path):
            try:
                artifact = joblib.load(path)
                if isinstance(artifact, dict) and "pipeline" in artifact:
                    pipeline = artifact["pipeline"]
                    label_map = artifact.get("class_labels", label_map)
                    model_name = artifact.get("model_name", model_name)
                else:
                    pipeline = artifact
                print(f" [OK] Đã nạp thành công mô hình AI từ: {os.path.basename(path)}")
                return
            except Exception as e:
                print(f" [!] Lỗi khi nạp mô hình từ {path}: {e}")
    print(" [!] Cảnh báo: Chưa tìm thấy tệp mô hình customer pipeline.")

load_ai_model()

# ==============================================================================
# TỪ ĐIỂN CHUYÊN NGÀNH E-COMMERCE ĐA NGÔN NGỮ
# ==============================================================================
VIETNAMESE_LEXICON = [
    (r'\b(không thích|không ưng|không đẹp|không vừa|không hợp|không giống hình|không nên mua|không đáng tiền|không hài lòng)\b',
     'disappointed unflattering poor fit not as pictured do not buy not worth unsatisfied'),
    (r'\b(chẳng ra gì|không ra sao|quá tệ|chất lượng kém|kém chất lượng|quá thất vọng)\b',
     'terrible poor quality cheap material very disappointed'),
    (r'\b(rất thích|cực thích|mê mẩn|rất ưng|hoàn hảo|xuất sắc|tuyệt vời|tuyệt đẹp|quá đẹp|cực đẹp|rất đẹp|xinh xắn|dễ thương)\b',
     'love absolutely love perfect gorgeous wonderful stunning beautiful cute adorable'),
    (r'\b(vừa vặn|chuẩn size|tôn dáng|ôm dáng|vừa như in|mặc lên đẹp|chuẩn form|đúng mô tả|vừa người)\b',
     'fits well true to size flattering fits perfectly looks great accurate description comfortable fit'),
    (r'\b(chất vải đẹp|vải mềm|mát mẻ|dày dặn|chất lượng tốt|cao cấp|sang trọng|mềm mịn|thoáng mát|thoải mái)\b',
     'great fabric soft fabric high quality premium material luxurious breathable comfortable'),
    (r'\b(đáng tiền|giá hợp lý|rất hài lòng|nên mua|sẽ mua lại|ủng hộ shop|5 sao|hài lòng)\b',
     'worth the money good price highly satisfied recommend will buy again great purchase'),
    (r'\b(quá chật|quá rộng|quá dài|quá ngắn|kích nách|ngắn cũn|rộng thùng thình|form xấu|lệch size|bị chật|bị rộng)\b',
     'too small too tight too large too loose too short unflattering poor sizing awkward fit'),
    (r'\b(vải mỏng|vải xấu|thô ráp|bí bách|nhăn nhúm|co rút|bị co|phai màu|bung chỉ|rách|lỗi|chất rẻ tiền|hàng mã)\b',
     'very thin cheap fabric scratchy shrank after wash faded torn defective cheap quality'),
    (r'\b(thất vọng|rất tệ|chán|phí tiền|đừng mua|đã trả hàng|muốn trả lại|hoàn tiền|1 sao|tệ hại)\b',
     'disappointed terrible waste of money do not buy returned return refund one star awful'),
    (r'\b(váy|đầm)\b', 'dress'),
    (r'\b(áo sơ mi|áo thun|áo phông|áo kiểu|áo)\b', 'top shirt blouse'),
    (r'\b(quần jean|quần tây|quần dài|quần short|quần|chân váy)\b', 'pants jeans bottoms skirt'),
    (r'\b(áo khoác|áo len|blazer)\b', 'jacket coat sweater cardigan')
]

CHINESE_LEXICON = [
    (r'(不喜欢|不合适|不好看|质量差|不推荐|不要买|缩水|退货|太小|太大|很失望|极差)',
     'do not like poor fit ugly poor quality do not recommend do not buy shrank returned too small too large very disappointed terrible'),
    (r'(非常喜欢|很喜欢|太好看了|面料很棒|很舒服|很合身|显瘦|物美价廉|五星好评|推荐购买|完美|版型好)',
     'love absolutely love gorgeous great fabric comfortable fits well flattering good value five stars recommend perfect flattering fit'),
    (r'(连衣裙|裙子)', 'dress'), (r'(上衣|衬衫)', 'top shirt'), (r'(裤子|半身裙)', 'pants skirt'), (r'(外套|大衣)', 'jacket coat')
]

KOREAN_LEXICON = [
    (r'(별로|실망|마음에 안 들어요|사이즈 안 맞음|너무 작음|너무 큼|품질 나쁨|반품|사지 마세요|구김|원단 안 좋음)',
     'terrible disappointed do not like poor fit too small too large poor quality returned do not buy wrinkled cheap fabric'),
    (r'(정말 좋아요|너무 예뻐요|인생템|마음에 쏙 들어요|소재 훌륭|핏이 예쁨|편안함|강력 추천|재구매 의향|완벽)',
     'love absolutely love beautiful gorgeous great material flattering fit comfortable highly recommend will buy again perfect'),
    (r'(드레스|원피스)', 'dress'), (r'(상의|블라우스|셔츠)', 'top shirt blouse'), (r'(바지|스커트)', 'pants skirt'), (r'(자켓|코트|아우터)', 'jacket coat')
]

JAPANESE_LEXICON = [
    (r'(がっかり|最悪|期待外れ|小さすぎる|大きすぎる|品質が悪い|安っぽい|返品|買わない方がいい|不快)',
     'disappointed terrible disappointing too small too large poor quality cheap fabric returned do not buy uncomfortable'),
    (r'(とても気に入りました|最高|すごく可愛い|生地が良い|着心地が良い|ぴったり|スタイル良く見える|大満足|おすすめ|リピート)',
     'love absolutely love best very cute great fabric comfortable fits perfectly flattering very satisfied highly recommend repeat'),
    (r'(ドレス|ワンピース)', 'dress'), (r'(トップス|ブラウス)', 'top shirt'), (r'(パンツ|スカート)', 'pants skirt'), (r'(ジャケット|アウター)', 'jacket coat')
]

SPANISH_LEXICON = [
    (r'\b(no me gusta|decepcionada|mala calidad|muy pequeño|muy grande|no queda bien|devolución|no comprar|horrible)\b',
     'do not like disappointed poor quality too small too large poor fit return do not buy horrible'),
    (r'\b(me encanta|hermoso|excelente calidad|queda perfecto|muy cómodo|buena tela|recomiendo mucho|cinco estrellas)\b',
     'love beautiful excellent quality fits perfectly comfortable great fabric highly recommend five stars'),
    (r'\b(vestido)\b', 'dress'), (r'\b(blusa|camisa|top)\b', 'top shirt blouse'), (r'\b(pantalones|falda)\b', 'pants skirt'), (r'\b(chaqueta|abrigo)\b', 'jacket coat')
]

def translate_online_fast(text, target_lang='en'):
    try:
        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl={target_lang}&dt=t&q=" + urllib.parse.quote(text)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=0.8) as response:
            result = json.loads(response.read().decode('utf-8'))
            translated_text = "".join([sentence[0] for sentence in result[0] if sentence[0]])
            return translated_text
    except Exception:
        return None

def preprocess_multilingual_review(text_raw):
    text = str(text_raw).strip()
    if not text:
        return ""

    is_pure_english = bool(re.match(r'^[a-zA-Z0-9\s.,!?\'"-]+$', text))
    if is_pure_english:
        return text.lower()

    online_translation = translate_online_fast(text, target_lang='en')
    if online_translation and len(online_translation.split()) > 2:
        return online_translation.lower()

    translated_tokens = []
    for pat, rep in VIETNAMESE_LEXICON:
        if re.search(pat, text, flags=re.IGNORECASE):
            translated_tokens.append(rep)
    for pat, rep in CHINESE_LEXICON:
        if re.search(pat, text):
            translated_tokens.append(rep)
    for pat, rep in KOREAN_LEXICON:
        if re.search(pat, text):
            translated_tokens.append(rep)
    for pat, rep in JAPANESE_LEXICON:
        if re.search(pat, text):
            translated_tokens.append(rep)
    for pat, rep in SPANISH_LEXICON:
        if re.search(pat, text, flags=re.IGNORECASE):
            translated_tokens.append(rep)

    if translated_tokens:
        return " ".join(translated_tokens).lower()

    return text.lower()

# ==============================================================================
# GỢI Ý HÀNH ĐỘNG THÔNG MINH
# ==============================================================================
def generate_actionable_suggestions(pred_class, review_text, dept, age):
    text_lower = review_text.lower()
    
    if pred_class == 0:
        is_size = any(w in text_lower for w in ['size', 'chật', 'rộng', 'dài', 'ngắn', 'không vừa', 'fit', 'tight', 'loose', '小', '大', '작', '크', 'サイズ', 'pequeño', 'grande'])
        is_fabric = any(w in text_lower for w in ['vải', 'chất', 'co', 'nhăn', 'mỏng', 'rẻ tiền', 'fabric', 'material', 'cheap', 'shrank', '面料', '재질', '生地', 'tela'])
        
        if is_size:
            return {
                "vi": ["Hỗ trợ đổi size miễn phí tận nhà trong vòng 48 giờ để giữ chân khách hàng.", "Cập nhật lại bảng hướng dẫn chọn size chi tiết hơn trên trang sản phẩm."],
                "en": ["Offer free home size exchange within 48 hours to retain the customer.", "Update detailed sizing guide and measurements on the product page."],
                "zh": ["在48小时内提供免费上门换码服务，以挽留客户。", "在产品详情页更新更准确详细的尺码对照表。"],
                "ko": ["고객 유지를 위해 48시간 이내 무료 맞춤 교환 서비스를 제공합니다.", "상품 상세 페이지에 더욱 정확한 사이즈 가이드를 업데이트합니다."],
                "ja": ["顧客維持のため、48時間以内に無料のサイズ交換サービスを提供します。", "商品ページにより詳細なサイズ測定ガイドを更新します。"],
                "es": ["Ofrezca cambio de talla gratis a domicilio en 48 horas para retener al cliente.", "Actualice la guía de tallas con medidas más precisas en la página del producto."]
            }
        elif is_fabric:
            return {
                "vi": ["Gửi tặng voucher giảm giá 20% cho đơn hàng tiếp theo kèm lời xin lỗi chân thành.", "Phản hồi với bộ phận sản xuất về chất lượng vải và độ bền sau khi giặt của lô hàng này."],
                "en": ["Send a 20% discount coupon for the next purchase with a sincere apology.", "Report fabric quality and wash durability feedback to the manufacturing team."],
                "zh": ["附上真诚歉意并赠送下次购买的20%优惠券。", "向生产部门反馈该批次面料质量及洗涤耐久性问题。"],
                "ko": ["진심 어린 사과와 함께 다음 구매 시 사용 가능한 20% 할인 쿠폰을 발송합니다.", "생산팀에 해당 원단의 품질 및 세탁 후 내구성 문제를 보고합니다."],
                "ja": ["次回のお買い物で使える20％割引クーポンを丁寧な謝罪とともにお送りします。", "生産部門に生地の品質および洗濯後の耐久性について改善をフィードバックします。"],
                "es": ["Envíe un cupón del 20% de descuento para su próxima compra con una sincera disculpa.", "Reporte la calidad y durabilidad de la tela al equipo de fabricación."]
            }
        else:
            return {
                "vi": ["Nhân viên CSKH chủ động gọi điện lắng nghe và hỗ trợ đổi/trả hàng nhanh chóng.", "Gửi mã ưu đãi đặc biệt để bù đắp trải nghiệm mua sắm chưa ưng ý."],
                "en": ["Customer service team should proactively reach out to assist with returns.", "Issue a special apology promo code to compensate for the unsatisfactory experience."],
                "zh": ["客服团队主动联系客户协助办理快速退换货。", "发放专属补偿优惠码以改善客户购物体验。"],
                "ko": ["고객센터에서 선제적으로 연락하여 반품 및 교환을 지원합니다.", "불만족스러운 쇼핑 경험을 보상하기 위해 특별 할인 코드를 발급합니다."],
                "ja": ["カスタマーサポートが積極的に連絡し、迅速な返品・交換をサポートします。", "ご満足いただけなかった体験を補償するため特別優待コードを発行します。"],
                "es": ["El equipo de soporte debe comunicarse para facilitar la devolución rápida.", "Emita un código promocional especial para compensar la experiencia insatisfactoria."]
            }
    else:
        return {
            "vi": [
                "Mời khách hàng gửi ảnh chụp thực tế khi mặc để nhận 50 điểm tích lũy thành viên.",
                f"Gợi ý thêm các mẫu phụ kiện phối cùng trang phục {dept} phù hợp với độ tuổi {int(age)}.",
                "Tặng mã giới thiệu bạn bè nhận ưu đãi 10% cho cả hai người."
            ],
            "en": [
                "Invite customer to share photo reviews to receive 50 loyalty reward points.",
                f"Recommend matching accessories and styling tips for {dept} category.",
                "Provide a refer-a-friend code giving 10% discount for both."
            ],
            "zh": [
                "邀请客户晒图好评即可获赠50积分奖励。",
                f"为{int(age)}岁年龄段推荐适合搭配{dept}系列的时尚配饰。",
                "赠送好友推荐码，双方均可享受10%的购物优惠。"
            ],
            "ko": [
                "포토 리뷰 작성 시 회원 50 마일리지 포인트를 적립해 드립니다.",
                f"{int(age)}세 고객 취향에 맞춘 {dept} 어울림 코디 및 액세서리를 추천합니다.",
                "친구 추천 할인 코드를 발급하여 추천인과 친구 모두 10% 할인을 제공합니다."
            ],
            "ja": [
                "着こなし写真のレビュー投稿で50ポイントをプレゼントします。",
                f"{int(age)}代のお客様に似合う{dept}のコーディネート小物を提案します。",
                "お友達紹介クーポンを発行し、双方が10％割引を受けられます。"
            ],
            "es": [
                "Invite al cliente a compartir fotos con la prenda para ganar 50 puntos de fidelidad.",
                f"Recomiende accesorios a juego y combinaciones ideales para la categoría {dept}.",
                "Ofrezca un código para invitar a amigos con un 10% de descuento para ambos."
            ]
        }

# ==============================================================================
# ENDPOINTS GIAO DIỆN & API DỰ ĐOÁN
# ==============================================================================
@app.route("/", methods=["GET"])
def serve_web():
    user_agent = request.headers.get('User-Agent', '').lower()
    is_mobile = any(kw in user_agent for kw in ['android', 'iphone', 'ipad', 'mobile'])
    if is_mobile and request.args.get('desktop') != 'true':
        return send_from_directory(MOBILE_DIR, "index.html")
    return send_from_directory(WEB_DIR, "index.html")

@app.route("/web/<path:filename>")
def serve_web_assets(filename):
    return send_from_directory(WEB_DIR, filename)

@app.route("/mobile", methods=["GET"])
def serve_mobile():
    return send_from_directory(MOBILE_DIR, "index.html")

@app.route("/mobile/<path:filename>")
def serve_mobile_assets(filename):
    return send_from_directory(MOBILE_DIR, filename)

@app.route("/predict", methods=["POST"])
def predict():
    global pipeline, PREDICTION_HISTORY
    if pipeline is None:
        return jsonify({"success": False, "error": "Mô hình AI chưa sẵn sàng."}), 500

    try:
        t0 = time.time()
        data = request.get_json(force=True, silent=True) or request.form.to_dict() or {}

        age = float(data.get("age", 34))
        feedback_count = float(data.get("positiveFeedbackCount", 0))
        dept_name = str(data.get("departmentName", "Dresses"))
        div_name = str(data.get("divisionName", "General"))
        review_raw = str(data.get("reviewText", ""))
        
        # Tiền xử lý đa ngôn ngữ
        review_clean = preprocess_multilingual_review(review_raw)
        review_len = len(review_clean.split())

        input_df = pd.DataFrame([{
            "Age": age,
            "Positive Feedback Count": feedback_count,
            "Review_Length": review_len,
            "Department Name": dept_name,
            "Division Name": div_name,
            "Clean_Review": review_clean
        }])

        pred_class = int(pipeline.predict(input_df)[0])
        pred_probs = pipeline.predict_proba(input_df)[0]
        latency_ms = round((time.time() - t0) * 1000, 2)

        rec_prob = round(float(pred_probs[1]) * 100, 2)
        not_rec_prob = round(float(pred_probs[0]) * 100, 2)
        confidence = round(float(np.max(pred_probs)) * 100, 2)

        suggestions = generate_actionable_suggestions(pred_class, review_raw, dept_name, age)

        # Lưu vào Lịch sử dự đoán
        history_item = {
            "id": int(time.time() * 1000),
            "timestamp": datetime.datetime.now().strftime("%H:%M:%S - %d/%m/%Y"),
            "age": int(age),
            "feedback": int(feedback_count),
            "department": dept_name,
            "division": div_name,
            "review": review_raw,
            "predicted_class": pred_class,
            "prediction": "Recommended" if pred_class == 1 else "Not Recommended",
            "confidence": confidence,
            "recommended_probability": rec_prob,
            "latency_ms": latency_ms
        }
        PREDICTION_HISTORY.insert(0, history_item)
        if len(PREDICTION_HISTORY) > 50:
            PREDICTION_HISTORY = PREDICTION_HISTORY[:50]

        return jsonify({
            "success": True,
            "prediction": "Recommended" if pred_class == 1 else "Not Recommended",
            "predicted_class": pred_class,
            "confidence": confidence,
            "recommended_probability": rec_prob,
            "not_recommended_probability": not_rec_prob,
            "latency_ms": latency_ms,
            "model_name": "TF-IDF + Logistic Regression",
            "suggestions": suggestions,
            "input_summary": {
                "age": int(age),
                "department": dept_name,
                "review_snippet": review_raw[:60] + ("..." if len(review_raw) > 60 else "")
            }
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

# ==============================================================================
# ENDPOINTS QUẢN LÝ LỊCH SỬ DỰ ĐOÁN (GET & DELETE /api/history)
# ==============================================================================
@app.route("/api/history", methods=["GET"])
def get_history():
    return jsonify({
        "success": True,
        "count": len(PREDICTION_HISTORY),
        "history": PREDICTION_HISTORY
    })

@app.route("/api/history", methods=["DELETE"])
def clear_history():
    global PREDICTION_HISTORY
    PREDICTION_HISTORY = []
    return jsonify({
        "success": True,
        "message": "Đã xóa toàn bộ lịch sử dự đoán."
    })

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "UP",
        "service": "E-Commerce Multimodal AI System (Cross-Lingual + History)",
        "model_loaded": pipeline is not None,
        "history_count": len(PREDICTION_HISTORY)
    })

if __name__ == "__main__":
    port = 5002
    print("\n" + "=" * 75)
    print(" HỆ THỐNG 3: ĐỘNG CƠ DỰ ĐOÁN ĐA NGÔN NGỮ & LỊCH SỬ ĐÁNH GIÁ")
    print("=" * 75)
    print(f" -> Desktop Web: http://localhost:{port}")
    print(f" -> Mobile Web:  http://localhost:{port}/mobile")
    print("=" * 75 + "\n")
    app.run(host="0.0.0.0", port=port, debug=False)
