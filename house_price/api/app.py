# ==============================================================================
# HỆ THỐNG THÔNG MINH DỰ ĐOÁN GIÁ NHÀ ĐẤT VIỆT NAM (HOUSING PRICE PREDICTION)
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

try:
    import onnxruntime as ort
    HAS_ONNX = True
except ImportError:
    HAS_ONNX = False

# Khởi tạo Flask Application
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HOUSING_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
WEB_DIR = os.path.join(HOUSING_DIR, "web")
MOBILE_DIR = os.path.join(HOUSING_DIR, "mobile")
MODEL_DIR = os.path.join(HOUSING_DIR, "model")

app = Flask(__name__)

# ==============================================================================
# 1. QUẢN LÝ VÀ NẠP MÔ HÌNH HỌC MÁY (MODEL PERSISTENCE & ONNX RUNTIME)
# ==============================================================================
ONNX_PATHS = [
    os.path.join(MODEL_DIR, "best_housing_model.onnx"),
    os.path.join(HOUSING_DIR, "..", "DATA", "best_housing_model.onnx"),
    os.path.join(BASE_DIR, "best_housing_model.onnx"),
    "best_housing_model.onnx"
]

PKL_PATHS = [
    os.path.join(MODEL_DIR, "best_housing_model.pkl"),
    os.path.join(HOUSING_DIR, "..", "DATA", "best_housing_model.pkl"),
    os.path.join(BASE_DIR, "best_housing_model.pkl"),
    "best_housing_model.pkl"
]

model = None
model_type = None
onnx_input_name = None
onnx_num_features = 4

def load_model():
    """Tải mô hình XGBoost (ONNX hoặc PKL) từ thư mục model/."""
    global model, model_type, onnx_input_name, onnx_num_features
    
    # 1. Ưu tiên nạp ONNX Runtime
    if HAS_ONNX:
        for p in ONNX_PATHS:
            if os.path.exists(p):
                try:
                    session = ort.InferenceSession(p)
                    model = session
                    model_type = "onnx"
                    input_meta = session.get_inputs()[0]
                    onnx_input_name = input_meta.name
                    if input_meta.shape and len(input_meta.shape) > 1 and input_meta.shape[1] is not None:
                        onnx_num_features = int(input_meta.shape[1])
                    else:
                        onnx_num_features = 4
                    print(f" [OK] Loaded ONNX model successfully from: {os.path.basename(p)}")
                    print(f"      - Engine: ONNX Runtime Engine")
                    print(f"      - Input features: {onnx_num_features}")
                    return
                except Exception as e:
                    print(f" [!] Error loading ONNX file: {e}")

    # 2. Phuong an du phong: Nap Scikit-learn / XGBoost Pickle
    for p in PKL_PATHS:
        if os.path.exists(p):
            try:
                with open(p, "rb") as f:
                    model = pickle.load(f)
                model_type = "pickle"
                print(f" [OK] Loaded Pickle model from: {os.path.basename(p)}")
                return
            except Exception as e:
                print(f" [!] Error reading pickle file: {e}")

    print(" [!] Warning: 'best_housing_model.onnx' or '.pkl' not found!")

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
    Nếu phát hiện trình duyệt di động, tự động chuyển sang giao diện mobile.
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
@app.route("/api/predict", methods=["POST"])
def predict():
    """
    Endpoint REST API xử lý yêu cầu dự đoán giá từ Desktop hoặc Mobile.
    Yêu cầu dữ liệu JSON:
    {
        "area": 65.0,
        "bedroom": 3.0,
        "toilet": 2.0,
        "floors": 3.0 (tùy chọn)
    }
    """
    global model, model_type, onnx_input_name, onnx_num_features
    if model is None:
        return jsonify({
            "success": False,
            "error": "Mô hình chưa được nạp. Vui lòng kiểm tra file best_housing_model.onnx!"
        }), 500

    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            data = request.form.to_dict()

        area = float(data.get("area", 60.0))
        bedroom = float(data.get("bedroom", 2.0))
        toilet = float(data.get("toilet", 2.0))
        floors = float(data.get("floors", 2.0))

        # Kiểm tra tính hợp lệ của đầu vào
        if area <= 0:
            return jsonify({"success": False, "error": "Diện tích phải lớn hơn 0"}), 400

        # 1. Dự đoán với ONNX Runtime Engine
        if model_type == "onnx":
            if onnx_num_features == 4:
                input_array = np.array([[area, bedroom, toilet, floors]], dtype=np.float32)
            else:
                input_array = np.array([[area, bedroom, toilet]], dtype=np.float32)

            outputs = model.run(None, {onnx_input_name: input_array})
            log_pred = float(outputs[0].flatten()[0])
            real_price = float(np.expm1(log_pred))

        # 2. Dự đoán dự phòng với Scikit-learn / XGBoost Pickle
        else:
            input_df = pd.DataFrame([{
                "area": area,
                "bedroom": bedroom,
                "toilet": toilet,
                "floors": floors
            }])
            # Nếu model pickle chỉ nhận 3 features
            if hasattr(model, "n_features_in_") and model.n_features_in_ == 3:
                input_df = input_df[["area", "bedroom", "toilet"]]

            log_pred = model.predict(input_df)
            real_price = float(np.expm1(log_pred[0]))

        # Đảm bảo giá hợp lý (> 0.1 tỷ)
        real_price = max(0.1, real_price)
        price_per_m2 = (real_price * 1000.0) / area  # Triệu VNĐ / m²

        return jsonify({
            "success": True,
            "model": "XGBoost Regressor",
            "engine": "ONNX Runtime Engine" if model_type == "onnx" else "Scikit-Learn Pickle",
            "predicted_price_billion": round(real_price, 2),
            "price_per_m2_million": round(price_per_m2, 1),
            "input": {
                "area": area,
                "bedroom": bedroom,
                "toilet": toilet,
                "floors": floors
            }
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route("/api/health", methods=["GET"])
@app.route("/health", methods=["GET"])
def health():
    """Kiểm tra trạng thái sẵn sàng của dịch vụ API."""
    return jsonify({
        "status": "healthy",
        "service": "Vietnam Housing Price Prediction AI",
        "model_loaded": model is not None,
        "model_type": model_type,
        "engine": "ONNX Runtime" if model_type == "onnx" else "Scikit-Learn"
    })


# ==============================================================================
# 4. ĐIỂM KHỞI CHẠY SERVER
# ==============================================================================
if __name__ == "__main__":
    ip = get_local_ip()
    port = 5001  # Port 5001 for Housing API
    print("\n" + "=" * 75)
    print(" VIETNAM HOUSING PRICE PREDICTION AI (ONNX ENGINE) SERVER STARTED")
    print("=" * 75)
    print(f" [1] Desktop Web UI:       http://localhost:{port}")
    print(f" [2] Mobile Client UI:     http://{ip}:{port}/mobile")
    print(f" [3] REST API Endpoint:    http://localhost:{port}/predict")
    print(f" [4] Health Check:         http://localhost:{port}/api/health")
    print("=" * 75 + "\n")
    app.run(host="0.0.0.0", port=port, debug=False)
