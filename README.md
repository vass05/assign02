# ASSIGNMENT 02: FROM DATA REPRESENTATION TO A DEPLOYABLE INTELLIGENT SYSTEM
**Môn học:** Phát triển các hệ thống thông minh (Intelligent System Development) - PTIT  
**Sinh viên thực hiện:** Vũ Viết Anh (anhvv.060)

---

## 📂 CẤU TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

```
Assignment_02/
├── diabetes/              # Hệ thống 1: Phân loại Nguy cơ Tiểu đường (Binary Classification)
│   ├── data/              # Dữ liệu Pima Indians Diabetes
│   ├── notebook/          # Jupyter Notebook chuẩn 23 mục (Appendix B)
│   ├── model/             # Mô hình lưu trữ (diabetes.sav)
│   ├── api/               # Backend Flask REST API (app.py)
│   ├── web/               # Giao diện Web Desktop
│   └── mobile/            # Giao diện Mobile Web App
├── house_price/           # Hệ thống 2: Hồi quy Dự đoán Giá Nhà Đất (Housing Price Regression)
│   ├── data/              # Dữ liệu Bất động sản Việt Nam 2024
│   ├── notebook/          # Jupyter Notebook chuẩn 23 mục (Appendix B)
│   ├── model/             # Mô hình ONNX Runtime & Pickle
│   ├── api/               # Backend Flask REST API (app.py)
│   ├── web/               # Giao diện Web Desktop
│   └── mobile/            # Giao diện Mobile Web App
├── customer_behavior/     # Hệ thống 3: Đa phương thức Bảng + Văn bản (E-commerce Customer Behavior)
│   ├── data/
│   ├── notebook/
│   ├── model/
│   ├── api/
│   ├── web/
│   └── mobile/
└── report/                # Báo cáo kỹ thuật tổng hợp & Hướng dẫn viết báo cáo
    └── Noi_dung_bao_cao_Assignment_02.md
```

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY (QUICK START)

### 1. Cài đặt môi trường:
```bash
pip install -r diabetes/requirements.txt
# hoặc
pip install -r house_price/requirements.txt
```

### 2. Khởi chạy Hệ thống 1 (Diabetes Prediction):
```bash
python diabetes/api/app.py
```
* **Web Desktop:** `http://localhost:5000`
* **Mobile Client:** `http://localhost:5000/mobile`

### 3. Khởi chạy Hệ thống 2 (Housing Price Prediction):
```bash
python house_price/api/app.py
```
* **Web Desktop:** `http://localhost:5001`
* **Mobile Client:** `http://localhost:5001/mobile`
