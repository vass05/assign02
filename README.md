# 🎓 ASSIGNMENT 02: FROM DATA REPRESENTATION TO A DEPLOYABLE INTELLIGENT SYSTEM

**Học phần:** Phát triển các hệ thống thông minh (Intelligent System Development)  
**Sinh viên thực hiện:** Vũ Viết Anh  
**Mã sinh viên:** `anhvv.060`  
**Học viện Công nghệ Bưu chính Viễn thông (PTIT)**

---

## 🏛️ TỔNG QUAN 3 HỆ THỐNG THÔNG MINH TRONG DỰ ÁN

| Hệ thống | Thư mục | Bản chất bài toán ML | Kỹ thuật biểu diễn đặc trưng | Cổng dịch vụ (Port) | Động cơ suy luận AI |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **Hệ thống 1: Dự đoán Tiểu đường** | `diabetes/` | Phân loại nhị phân (*Classification*) | Bảng số học lâm sàng (`StandardScaler`) | `5000` | Scikit-Learn Engine (`diabetes.sav`) |
| **Hệ thống 2: Dự đoán Giá nhà đất** | `house_price/` | Hồi quy biến liên tục (*Regression*) | Bảng số học lệch phải (`Log-transform`) | `5001` | **ONNX Runtime Engine (`.onnx`)** |
| **Hệ thống 3: Đánh giá TMĐT** | `customer_behavior/` | Phân loại đa phương thức (*Multimodal*) | **Bảng số + TF-IDF Văn bản** (`ColumnTransformer`) | `5002` | Scikit-Learn Multimodal Pipeline |

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY TỪNG HỆ THỐNG

### 1️⃣ Khởi chạy Hệ thống 1 (Dự đoán Tiểu đường)
```powershell
python Assignment_02/diabetes/api/app.py
```
* **Desktop Web:** `http://localhost:5000`
* **Mobile Web:** `http://localhost:5000/mobile`
* **REST API:** `POST http://localhost:5000/predict`

---

### 2️⃣ Khởi chạy Hệ thống 2 (Dự đoán Giá nhà đất - ONNX Engine)
```powershell
python Assignment_02/house_price/api/app.py
```
* **Desktop Web:** `http://localhost:5001`
* **Mobile Web:** `http://localhost:5001/mobile`
* **REST API:** `POST http://localhost:5001/predict`

---

### 3️⃣ Khởi chạy Hệ thống 3 (Phân tích Đánh giá Khách hàng TMĐT)
```powershell
python Assignment_02/customer_behavior/api/app.py
```
* **Desktop Web:** `http://localhost:5002`
* **Mobile Web:** `http://localhost:5002/mobile`
* **REST API:** `POST http://localhost:5002/predict`

---

## 📂 CẤU TRÚC THƯ MỤC CHUẨN ĐỒNG BỘ 100%

```
Assignment_02/
├── diabetes/                 # Hệ thống 1: Tiểu đường (Phân loại nhị phân)
│   ├── api/app.py
│   ├── data/diabetes.csv
│   ├── model/diabetes.sav
│   ├── notebook/diabetes.ipynb
│   ├── web/ (index.html, style.css, app.js)
│   └── mobile/ (index.html, style.css, app.js)
│
├── house_price/              # Hệ thống 2: Giá nhà đất (Hồi quy liên tục, ONNX)
│   ├── api/app.py
│   ├── data/vietnam_housing_dataset.csv
│   ├── model/best_housing_model.onnx
│   ├── notebook/house_price.ipynb
│   ├── web/ (index.html, style.css, app.js)
│   └── mobile/ (index.html, style.css, app.js)
│
├── customer_behavior/        # Hệ thống 3: Hành vi TMĐT (Đa phương thức Bảng + TF-IDF)
│   ├── api/app.py
│   ├── data/Womens Clothing E-Commerce Reviews.csv
│   ├── model/final_customer_pipeline.joblib
│   ├── notebook/customer_behavior.ipynb
│   ├── web/ (index.html, style.css, app.js)
│   └── mobile/ (index.html, style.css, app.js)
│
└── README.md
```
