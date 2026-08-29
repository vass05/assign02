# ==============================================================================
# HỆ THỐNG THÔNG MINH DỰ ĐOÁN NGUY CƠ TIỂU ĐƯỜNG (DIABETES PREDICTION)
# Backend REST API Service & Web / Mobile Client Server
# ==============================================================================

import os
import pickle
import socket
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, send_from_directory

import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

import joblib

# Khởi tạo Flask Application
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIABETES_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
WEB_DIR = os.path.join(DIABETES_DIR, "web")
MOBILE_DIR = os.path.join(DIABETES_DIR, "mobile")
MODEL_DIR = os.path.join(DIABETES_DIR, "model")

app = Flask(__name__)

# ==============================================================================
# 1. QUẢN LÝ VÀ NẠP MÔ HÌNH HỌC MÁY (MODEL PERSISTENCE)
# ==============================================================================
POSSIBLE_PATHS = [
    os.path.join(MODEL_DIR, "diabetes.sav"),
    os.path.join(DIABETES_DIR, "..", "diabetes.sav"),
    os.path.join(BASE_DIR, "diabetes.sav"),
    "diabetes.sav"
]

model = None
preprocessor = None

def load_model():
    """Tải mô hình KNN / ML đã huấn luyện từ tệp binary .sav."""
    global model, preprocessor
    for p in POSSIBLE_PATHS:
        if os.path.exists(p):
            try:
                try:
                    obj = joblib.load(p)
                except Exception:
                    with open(p, "rb") as file:
                        obj = pickle.load(file)

                if isinstance(obj, dict):
                    model = obj.get("model", obj)
                    preprocessor = obj.get("preprocessor", None)
                else:
                    model = obj
                    preprocessor = None

                print(f" [OK] Loaded diabetes model successfully from: {os.path.basename(p)}")
                return
            except Exception as e:
                print(f" [!] Error loading model file {os.path.basename(p)}: {e}")
    print(" [!] Warning: 'diabetes.sav' not found!")

load_model()

def get_local_ip():
    """Lấy địa chỉ IP mạng nội bộ (Wi-Fi) để phục vụ truy cập từ điện thoại di động."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


# ==============================================================================
# 2. ĐIỀU HƯỚNG GIAO DIỆN WEB & MOBILE CLIENT (SERVE CLIENTS)
# ==============================================================================

@app.route("/", methods=["GET"])
def serve_web():
    """
    Phục vụ giao diện Web Desktop từ thư mục ../web/.
    Nếu phát hiện trình duyệt di động, có thể tự động chuyển sang /mobile.
    """
    user_agent = request.headers.get('User-Agent', '').lower()
    is_mobile = any(keyword in user_agent for keyword in ['android', 'iphone', 'ipad', 'mobile'])
    if is_mobile and request.args.get('desktop') != 'true':
        return send_from_directory(MOBILE_DIR, "index.html")
    return send_from_directory(WEB_DIR, "index.html")


@app.route("/web/<path:filename>")
def serve_web_assets(filename):
    """Phục vụ các file css/js/ảnh trong thư mục web/."""
    return send_from_directory(WEB_DIR, filename)


@app.route("/mobile", methods=["GET"])
def serve_mobile():
    """Phục vụ giao diện chuyên biệt cho Điện thoại di động từ thư mục ../mobile/."""
    return send_from_directory(MOBILE_DIR, "index.html")


@app.route("/mobile/<path:filename>")
def serve_mobile_assets(filename):
    """Phục vụ các file css/js/ảnh trong thư mục mobile/."""
    return send_from_directory(MOBILE_DIR, filename)


# ==============================================================================
# 3. CỔNG RESTFUL API THEO CHUẨN APPENDIX C
# ==============================================================================

@app.route("/predict", methods=["POST"])
@app.route("/diabetes/v1/predict", methods=["POST"])
def predict():
    """
    API endpoint nhận dữ liệu dạng JSON:
    Request body: { "Glucose": 120, "BMI": 25.5, "Age": 35 }
    Response body: { "prediction": "Non-diabetic", "confidence": "78.95%", ... }
    """
    global model
    if model is None:
        return jsonify({
            "success": False,
            "error": "Mô hình dự đoán chưa sẵn sàng. Vui lòng kiểm tra file 'diabetes.sav'."
        }), 500

    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            data = request.form.to_dict()

        if not data:
            return jsonify({"success": False, "error": "Thiếu dữ liệu đầu vào (JSON hoặc Form)!"}), 400

        # Trích xuất 3 đặc trưng lâm sàng cốt lõi
        glucose = float(data.get("Glucose", data.get("glucose", 0)))
        bmi = float(data.get("BMI", data.get("bmi", 0)))
        age = float(data.get("Age", data.get("age", 0)))

        # Định dạng chuẩn DataFrame tương ứng với mô hình đã học
        input_df = pd.DataFrame([[glucose, bmi, age]], columns=["Glucose", "BMI", "Age"])

        # 1. Dự đoán nhãn phân loại (Outcome: 0 hoặc 1)
        prediction = model.predict(input_df)
        outcome = int(prediction[0])
        result_text = "Diabetic" if outcome == 1 else "Non-diabetic"

        # 2. Tính toán xác suất tin cậy (Confidence score)
        try:
            proba = model.predict_proba(input_df)[0]
            non_diabetic_prob = round(float(proba[0]) * 100, 2)
            diabetic_prob = round(float(proba[1]) * 100, 2)
            confidence = round(float(np.max(proba)) * 100, 2)
        except Exception:
            non_diabetic_prob = 0.0 if outcome == 1 else 100.0
            diabetic_prob = 100.0 if outcome == 1 else 0.0
            confidence = 100.0

        # Phản hồi JSON theo đặc tả Appendix C
        return jsonify({
            "success": True,
            "prediction": result_text,
            "outcome": outcome,
            "confidence": f"{confidence}%",
            "non_diabetic_probability": non_diabetic_prob,
            "diabetic_probability": diabetic_prob,
            "input": {
                "Glucose": glucose,
                "BMI": bmi,
                "Age": age
            }
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route("/api/health", methods=["GET"])
def health():
    """Kiểm tra sức khỏe hệ thống (Health Check)."""
    return jsonify({
        "status": "running",
        "service": "Diabetes Intelligent System",
        "model_loaded": model is not None,
        "web_dir": os.path.exists(WEB_DIR),
        "mobile_dir": os.path.exists(MOBILE_DIR)
    })


# ==============================================================================
# 4. KHỞI ĐỘNG SERVER
# ==============================================================================
if __name__ == "__main__":
    ip = get_local_ip()
    port = 5000

    print("\n" + "=" * 70)
    print(" DIABETES INTELLIGENT SYSTEM SERVER STARTED SUCCESSFULLY")
    print("=" * 70)
    print(f" [1] Web Desktop Portal:        http://localhost:{port}")
    print(f" [2] Mobile Web Client:        http://{ip}:{port}/mobile")
    print(f" [3] RESTful API Endpoint POST: http://localhost:{port}/predict")
    print("=" * 70 + "\n")

    app.run(host="0.0.0.0", port=port, debug=False)
