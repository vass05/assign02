# HƯỚNG DẪN CHI TIẾT NỘI DUNG VÀ VỊ TRÍ CHÈN SƠ ĐỒ, ẢNH CODE, GIAO DIỆN VÀO BÁO CÁO ASSIGNMENT 02
## Môn học: Phát triển các hệ thống thông minh (Intelligent System Development) - PTIT
**Chủ đề:** *From Data Representation to a Deployable Intelligent System*  
**Sinh viên thực hiện:** Vũ Viết Anh (Mã SV: anhvv.060)  
**Thời lượng báo cáo khuyến nghị:** ~10 - 15 trang (Chuẩn IEEE / Báo cáo kỹ thuật PTIT)

---

> [!IMPORTANT]
> **QUY ƯỚC KÝ HIỆU TRONG HƯỚNG DẪN NÀY:**
> * 📍 **[VỊ TRÍ CHÈN]:** Vị trí chính xác trong từng chương/mục của file Word / LaTeX báo cáo.
> * 📷 **[NGUỒN LẤY ẢNH / CODE]:** Nơi bạn chụp ảnh màn hình (trong Jupyter Notebook, Terminal, hoặc Giao diện Web/Mobile).
> * ✍️ **[CHÚ THÍCH CẦN GHI]:** Tên hình / Chú thích (Caption) tiêu chuẩn cần ghi ngay dưới ảnh.

---

## MỤC LỤC BÁO CÁO & DANH MỤC HÌNH ẢNH / SƠ ĐỒ CẦN CHÈN

* **TRANG BÌA & THÔNG TIN CHUNG**
* **CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI & BỐI CẢNH 3 HỆ THỐNG THÔNG MINH**
* **CHƯƠNG 2: CƠ SỞ LÝ THUYẾT VỀ BIỂU DIỄN DỮ LIỆU & NGUYÊN TẮC HỆ THỐNG**
  * 📍 *[Sơ đồ 2.1]*: Quy trình Machine Learning Pipeline chuẩn & Chống Data Leakage
  * 📍 *[Sơ đồ 2.2]*: Tổng quan các kỹ thuật Biểu diễn dữ liệu (Numerical, Categorical, Text)
* **CHƯƠNG 3: HỆ THỐNG 1 - PHÂN LOẠI NGUY CƠ TIỂU ĐƯỜNG (DIABETES PREDICTION)**
  * 📍 *[Hình 3.1]*: Biểu đồ EDA phân tích Glucose, BMI, Insulin trước và sau điền khuyết
  * 📍 *[Ảnh Code 3.1]*: Đoạn mã nguồn xử lý Missing Values & Huấn luyện Pipeline
  * 📍 *[Hình 3.2]*: Biểu đồ so sánh 4 độ đo (Accuracy, Precision, Recall, F1) giữa các mô hình
  * 📍 *[Hình 3.3]*: Ma trận nhầm lẫn (Confusion Matrix) & Đường cong ROC
  * 📍 *[Ảnh Giao diện 3.4]*: Ảnh chụp Web Desktop và Mobile App của Hệ thống 1
* **CHƯƠNG 4: HỆ THỐNG 2 - HỒI QUY DỰ ĐOÁN GIÁ NHÀ ĐẤT (HOUSING PRICE PREDICTION)**
  * 📍 *[Hình 4.1]*: Biểu đồ phân phối Giá nhà trước vs sau Log-transform & Boxplot Diện tích
  * 📍 *[Hình 4.2]*: Ma trận hệ số tương quan Pearson Heatmap
  * 📍 *[Ảnh Code 4.1]*: Đoạn mã nguồn huấn luyện & đánh giá 5 mô hình hồi quy
  * 📍 *[Hình 4.3]*: Biểu đồ so sánh 5 độ đo ($R^2$, RMSE, MAE, MAPE, MedAE) của 5 mô hình
  * 📍 *[Hình 4.4]*: Biểu đồ phân tích phần dư (Residuals Plot) & Tầm quan trọng đặc trưng (Feature Importance)
  * 📍 *[Ảnh Code 4.2]*: Đoạn mã chuyển đổi XGBoost sang ONNX & Benchmark độ trễ
  * 📍 *[Ảnh Giao diện 4.5]*: Ảnh chụp Web Desktop và Mobile App ONNX Engine (Real-time)
* **CHƯƠNG 5: HỆ THỐNG 3 - KHÁM PHÁ HÀNH VI KHÁCH HÀNG E-COMMERCE (CUSTOMER BEHAVIOR)**
  * 📍 *[Sơ đồ 5.1]*: Sơ đồ kiến trúc kết hợp đa phương thức (Multimodal Fusion: Tabular + TF-IDF Text)
  * 📍 *[Ảnh Code 5.1]*: Đoạn mã trích xuất TF-IDF và ghép nối vector đặc trưng
  * 📍 *[Hình 5.2]*: Biểu đồ phân cụm / phân loại các nhóm khách hàng tiềm năng
  * 📍 *[Ảnh Giao diện 5.3]*: Ảnh chụp Web Desktop và Mobile App của Hệ thống 3
* **CHƯƠNG 6: PHÂN TÍCH SO SÁNH CHÉO 3 HỆ THỐNG (CROSS-APPLICATION COMPARISON)**
  * 📍 *[Bảng 6.1]*: Ma trận so sánh toàn diện 10 tiêu chí giữa 3 hệ thống
  * 📍 *[Hình 6.1]*: Biểu đồ Radar so sánh 3 hệ thống theo 5 trục kỹ thuật
* **CHƯƠNG 7: THẢO LUẬN CHUYÊN SÂU & TRẢ LỜI 4 CÂU HỎI CỐT LÕI**
* **CHƯƠNG 8: KIẾN TRÚC TRIỂN KHAI & THIẾT KẾ RESTFUL API**
  * 📍 *[Sơ đồ 8.1]*: Sơ đồ kiến trúc tổng thể 3 tầng (Client - Flask Server - Engine)
  * 📍 *[Ảnh Code 8.1]*: Mẫu JSON Request & Response của API `/predict`
* **CHƯƠNG 9: KẾT QUẢ THỰC NGHIỆM & BỘ SƯU TẬP ẢNH MINH CHỨNG TOÀN DIỆN**
* **CHƯƠNG 10: TỔNG KẾT & HƯỚNG PHÁT TRIỂN**
* **TÀI LIỆU THAM KHẢO**

---

# CHI TIẾT NỘI DUNG TỪNG CHƯƠNG VÀ VỊ TRÍ CHÈN HÌNH

---

## 📄 TRANG BÌA & THÔNG TIN CHUNG
* **Tên trường/viện:** HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG (PTIT)
* **Khoa:** Công nghệ thông tin
* **Tên môn học:** Phát triển các hệ thống thông minh (Intelligent System Development)
* **Tên báo cáo:** BÁO CÁO BÀI TẬP LỚN SỐ 02: TỪ BIỂU DIỄN DỮ LIỆU ĐẾN HỆ THỐNG THÔNG MINH CÓ THỂ TRIỂN KHAI (*From Data Representation to a Deployable Intelligent System*)
* **Giảng viên hướng dẫn:** [Tên Thầy/Cô phụ trách]
* **Sinh viên thực hiện:** Vũ Viết Anh - MSSV: anhvv.060
* **Năm học:** 2024 - 2025 / Kì 1 Năm 4

---

## 📌 CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI & BỐI CẢNH 3 HỆ THỐNG THÔNG MINH

### 1.1. Bối cảnh và Mục tiêu Đề tài
* Trình bày quá trình chuyển dịch từ việc thử nghiệm mô hình Machine Learning trong Jupyter Notebook sang việc xây dựng **Hệ thống thông minh hoàn chỉnh có thể triển khai (Deployable Intelligent System)**.
* Nhấn mạnh vai trò của **Biểu diễn dữ liệu (Data Representation)**: Biểu diễn dữ liệu quyết định giới hạn trần hiệu năng (*performance upper bound*) của toàn bộ hệ thống.

### 1.2. Giới thiệu tóm tắt 3 Hệ thống thực nghiệm
1. **Hệ thống 1 - Phân loại Nguy cơ Tiểu đường (Diabetes Prediction):** Phân loại nhị phân (*Binary Classification*) dựa trên chỉ số lâm sàng.
2. **Hệ thống 2 - Hồi quy Dự đoán Giá Nhà Đất (Housing Price Prediction):** Hồi quy biến mục tiêu liên tục (*Continuous Regression*) bất động sản Việt Nam 2024.
3. **Hệ thống 3 - Khám phá Hành vi Khách hàng E-commerce (Customer Behavior Discovery):** Phân loại/Phân cụm đa phương thức (*Multimodal Tabular + Text*).

---

## 📌 CHƯƠNG 2: CƠ SỞ LÝ THUYẾT VỀ BIỂU DIỄN DỮ LIỆU & NGUYÊN TẮC HỆ THỐNG

### 2.1. Biểu diễn dữ liệu dưới dạng ma trận $X \in \mathbb{R}^{N \times d}$
* Mô tả toán học: Tập dữ liệu gồm $N$ mẫu, mỗi mẫu có $d$ chiều đặc trưng $\mathbf{x}_i \in \mathbb{R}^d$, tạo thành ma trận $X \in \mathbb{R}^{N \times d}$ và vector mục tiêu $y \in \mathbb{R}^N$.

### 2.2. Ba Nguyên tắc Cốt lõi từ Lecture 02 (Core Principles)
1. **Nguyên tắc 1 (Representation Upper Bound):** Biểu diễn quyết định chất lượng tối đa của mô hình.
2. **Nguyên tắc 2 (Consistent Preprocessing):** Tiền xử lý lúc Training và lúc Inference phải dùng chung tham số thống kê đã fit để tránh *Train-Serve Skew*.
3. **Nguyên tắc 3 (Strict Data Leakage Prevention):** Chia Train/Test trước khi fit bất kỳ bộ scaler hay encoder nào.

---

> 📍 **[VỊ TRÍ CHÈN SƠ ĐỒ 2.1]: Chèn ngay sau Mục 2.2**
> * 📷 **[NGUỒN LẤY]:** Vẽ sơ đồ khối hoặc chèn sơ đồ luồng dữ liệu Pipeline:
> ```
> Raw Data --> [Train/Test Split] ---> Train Data (80%) ----> [fit_transform()] ---> Train Model
>                                 ---> Test Data (20%)  ----> [transform() only] --> Evaluate
> New Request (Inference) -----------------------------------> [transform() only] --> Predict Output
> ```
> * ✍️ **[CHÚ THÍCH]:** *Sơ đồ 2.1: Quy trình Machine Learning Pipeline chuẩn đảm bảo tính nhất quán và chống rò rỉ dữ liệu (Data Leakage).*

---

### 2.3. Các Kỹ thuật Xử lý & Biểu diễn Đặc trưng
* **Mã hóa phân loại (Categorical Encoding):** One-Hot Encoding, Ordinal Encoding, Target Encoding.
* **Chuẩn hóa số (Numerical Scaling):** StandardScaler, MinMaxScaler, Log-transform $y' = \ln(1+y)$.
* **Biểu diễn văn bản (Text Representation):** TF-IDF Vectorizer ($N$-grams, Term Frequency - Inverse Document Frequency).

---

> 📍 **[VỊ TRÍ CHÈN SƠ ĐỒ 2.2]: Chèn ở cuối Mục 2.3**
> * 📷 **[NGUỒN LẤY]:** Sơ đồ phân nhánh các phương pháp Data Representation theo từng dạng dữ liệu (Số học, Phân loại, Văn bản).
> * ✍️ **[CHÚ THÍCH]:** *Sơ đồ 2.2: Bản đồ các kỹ thuật biểu diễn dữ liệu tương ứng với từng kiểu biến đầu vào.*

---

## 📌 CHƯƠNG 3: HỆ THỐNG 1 - PHÂN LOẠI NGUY CƠ TIỂU ĐƯỜNG (DIABETES PREDICTION)

### 3.1. Phân tích Dữ liệu & Xử lý Khuyết thiếu
* Bộ dữ liệu Pima Indians Diabetes (768 dòng, 8 đặc trưng lâm sàng).
* Phát hiện các giá trị 0 phi logic ở `Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, `BMI` -> Thay bằng `NaN` và điền khuyết bằng `SimpleImputer(strategy='median')`.

---

> 📍 **[VỊ TRÍ CHÈN HÌNH 3.1 & ẢNH CODE 3.1]: Chèn tại Mục 3.1**
> * 📷 **[NGUỒN LẤY HÌNH 3.1]:** Chụp biểu đồ Histogram / Boxplot phân phối của các biến lâm sàng từ `Assignment_02/diabetes/notebook/diabetes_system.ipynb` (Mục 7 EDA).
> * ✍️ **[CHÚ THÍCH HÌNH 3.1]:** *Hình 3.1: Phân phối các chỉ số lâm sàng của tập dữ liệu Pima Indians trước và sau khi xử lý giá trị khuyết thiếu.*
> * 📷 **[NGUỒN LẤY ẢNH CODE 3.1]:** Chụp đoạn code tạo `Pipeline` với `SimpleImputer` và `StandardScaler` trong notebook (Mục 5 & 21).
> * ✍️ **[CHÚ THÍCH ẢNH CODE 3.1]:** *Ảnh Code 3.1: Mã nguồn xây dựng Scikit-Learn Pipeline tiền xử lý dữ liệu chuẩn.*

---

### 3.2. Huấn luyện, Đánh giá & Đối sánh Mô hình
* So sánh các thuật toán: K-Nearest Neighbors (KNN với $K=19$), Logistic Regression, Random Forest, SVM.
* Đánh giá theo 4 độ đo: Accuracy, Precision, Recall, F1-Score, ROC-AUC.

---

> 📍 **[VỊ TRÍ CHÈN HÌNH 3.2 & HÌNH 3.3]: Chèn tại Mục 3.2**
> * 📷 **[NGUỒN LẤY HÌNH 3.2]:** Chụp bảng so sánh và biểu đồ cột so sánh Accuracy / F1-Score của 4 mô hình trong notebook (Mục 18).
> * ✍️ **[CHÚ THÍCH HÌNH 3.2]:** *Hình 3.2: Biểu đồ đối sánh hiệu năng phân loại giữa KNN, Logistic Regression, Random Forest và SVM.*
> * 📷 **[NGUỒN LẤY HÌNH 3.3]:** Chụp ảnh Confusion Matrix (Ma trận nhầm lẫn) và đường cong ROC-AUC của mô hình tốt nhất từ notebook (Mục 19).
> * ✍️ **[CHÚ THÍCH HÌNH 3.3]:** *Hình 3.3: Ma trận nhầm lẫn và đường cong ROC của mô hình KNN ($K=19$).*

---

### 3.3. Đóng gói & Triển khai Giao diện Web / Mobile
* Lưu trữ mô hình vào file nhị phân `diabetes.sav` / `diabetes_pipeline.joblib`.
* Backend Flask REST API `POST /predict` tại cổng `5000`.

---

> 📍 **[VỊ TRÍ CHÈN ẢNH GIAO DIỆN 3.4]: Chèn tại Mục 3.3**
> * 📷 **[NGUỒN LẤY]:** Chạy lệnh `python "Assignment_02/diabetes/api/app.py"`, mở trình duyệt chụp giao diện Web Desktop (`http://localhost:5000`) và giao diện Mobile (`http://localhost:5000/mobile`).
> * ✍️ **[CHÚ THÍCH]:** *Hình 3.4: Giao diện Web Desktop và Mobile App thực tế của Hệ thống dự đoán nguy cơ tiểu đường.*

---

## 📌 CHƯƠNG 4: HỆ THỐNG 2 - HỒI QUY DỰ ĐOÁN GIÁ NHÀ ĐẤT (HOUSING PRICE PREDICTION)

### 4.1. Khảo sát Dữ liệu & Kỹ thuật Biến đổi Log-scale
* Bộ dữ liệu Vietnam Housing Dataset (> 21.000 mẫu).
* Phân phối giá nhà bị lệch phải cực đoan -> Áp dụng Log-transform $y = \ln(1+\text{price})$ để ổn định phương sai (homoscedasticity).

---

> 📍 **[VỊ TRÍ CHÈN HÌNH 4.1 & HÌNH 4.2]: Chèn tại Mục 4.1**
> * 📷 **[NGUỒN LẤY HÌNH 4.1]:** Chụp đồ thị phân phối giá nhà (Histogram KDE Log-scale) và Boxplot diện tích từ Cell EDA trong `house_price_system.ipynb` (Mục 7).
> * ✍️ **[CHÚ THÍCH HÌNH 4.1]:** *Hình 4.1: Phân phối giá nhà đất ở thang đo log(1 + price) và diện tích thực tế.*
> * 📷 **[NGUỒN LẤY HÌNH 4.2]:** Chụp ma trận tương quan nhiệt (Pearson Correlation Heatmap) giữa diện tích, phòng ngủ, toilet, số tầng và giá nhà (Mục 7).
> * ✍️ **[CHÚ THÍCH HÌNH 4.2]:** *Hình 4.2: Ma trận hệ số tương quan Pearson giữa các thuộc tính bất động sản.*

---

### 4.2. Huấn luyện 5 Mô hình Hồi quy theo 5 Độ đo Chuẩn

| Mô hình | $R^2$ Score (Cao là tốt) | RMSE (Tỷ VNĐ) | MAE (Tỷ VNĐ) | MAPE (%) | MedAE (Tỷ VNĐ) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **XGBoost Regressor** | **0.3236** | **1.8037** | **1.4436** | **30.58%** | **1.2320** |
| **LightGBM Regressor** | 0.3238 | 1.8036 | 1.4441 | 30.60% | 1.2459 |
| **Gradient Boosting** | 0.3137 | 1.8170 | 1.4596 | 30.89% | 1.2562 |
| **Random Forest** | 0.2695 | 1.8746 | 1.4573 | 31.06% | 1.1805 |
| **Ridge Regression** | 0.1959 | 1.9667 | 1.5877 | 33.68% | 1.3950 |

---

> 📍 **[VỊ TRÍ CHÈN ẢNH CODE 4.1, HÌNH 4.3 & HÌNH 4.4]: Chèn tại Mục 4.2**
> * 📷 **[NGUỒN LẤY ẢNH CODE 4.1]:** Chụp đoạn code vòng lặp huấn luyện 5 mô hình hồi quy với hàm `fit()` trong notebook (Mục 15 & 18).
> * ✍️ **[CHÚ THÍCH ẢNH CODE 4.1]:** *Ảnh Code 4.1: Đoạn mã huấn luyện và tính toán 5 độ đo hồi quy cho 5 mô hình.*
> * 📷 **[NGUỒN LẤY HÌNH 4.3]:** Chụp biểu đồ so sánh 5 độ đo ($R^2$, RMSE, MAE, MAPE, MedAE) giữa các mô hình (Mục 18).
> * ✍️ **[CHÚ THÍCH HÌNH 4.3]:** *Hình 4.3: Biểu đồ đối sánh hiệu năng 5 mô hình hồi quy giá nhà đất.*
> * 📷 **[NGUỒN LẤY HÌNH 4.4]:** Chụp đồ thị phân tích phần dư (Residuals Plot) và biểu đồ Feature Importance (Mục 19 & 20).
> * ✍️ **[CHÚ THÍCH HÌNH 4.4]:** *Hình 4.4: Biểu đồ phân tích phần dư và mức độ quan trọng của các đặc trưng (Feature Importance).*

---

### 4.3. Chuyển đổi ONNX Runtime Engine & Triển khai Web/Mobile
* Xuất mô hình sang file `best_housing_model.onnx`.
* **Benchmark thời gian suy luận (Latency):**
  * Pickle Model: ~ 2.8 ms
  * **ONNX Runtime Engine: ~ 0.35 ms (Nhanh hơn gấp 8 lần!)**

---

> 📍 **[VỊ TRÍ CHÈN ẢNH CODE 4.2 & ẢNH GIAO DIỆN 4.5]: Chèn tại Mục 4.3**
> * 📷 **[NGUỒN LẤY ẢNH CODE 4.2]:** Chụp đoạn code dùng `onnxmltools.convert_xgboost()` và cell đo lường thời gian suy luận `time.time()` trong notebook (Mục 21 & 23).
> * ✍️ **[CHÚ THÍCH ẢNH CODE 4.2]:** *Ảnh Code 4.2: Mã nguồn chuyển đổi mô hình sang ONNX Runtime và kiểm thử độ trễ suy luận.*
> * 📷 **[NGUỒN LẤY ẢNH GIAO DIỆN 4.5]:** Mở trình duyệt chụp giao diện Web Desktop (`http://localhost:5001`) và Mobile Client (`http://localhost:5001/mobile`) đang hiển thị kết quả Tỷ VNĐ + Triệu/m².
> * ✍️ **[CHÚ THÍCH ẢNH GIAO DIỆN 4.5]:** *Hình 4.5: Giao diện Web Desktop và Mobile Client ứng dụng AI Dự đoán Giá Nhà Đất với ONNX Runtime.*

---

## 📌 CHƯƠNG 5: HỆ THỐNG 3 - KHÁM PHÁ HÀNH VI KHÁCH HÀNG E-COMMERCE (CUSTOMER BEHAVIOR)

### 5.1. Dữ liệu Đa phương thức (Multimodal Tabular + Text)
* Đặc trưng bảng: Tuổi, Thu nhập, Điểm chi tiêu, Tần suất mua, Thời gian phiên.
* Đặc trưng văn bản: Ý kiến phản hồi / Nhận xét sản phẩm gần nhất (`Customer_Review`).

### 5.2. Kỹ thuật Biểu diễn Ghép nối Đặc trưng (Feature Fusion)
* Văn bản được làm sạch và chuyển đổi qua **TF-IDF Vectorizer** ($d_{\text{text}} = 100$).
* Ghép nối vector: $\mathbf{x}_{\text{fused}} = [\mathbf{x}_{\text{num\_scaled}} \,\|\, \mathbf{x}_{\text{cat\_ohe}} \,\|\, \mathbf{x}_{\text{tfidf\_text}}]$.

---

> 📍 **[VỊ TRÍ CHÈN SƠ ĐỒ 5.1 & ẢNH CODE 5.1]: Chèn tại Mục 5.2**
> * 📷 **[NGUỒN LẤY SƠ ĐỒ 5.1]:** Sơ đồ khối minh họa luồng xử lý: Nhánh Dữ liệu bảng (StandardScaler) + Nhánh Dữ liệu văn bản (TF-IDF) -> `FeatureUnion` / `ColumnTransformer` -> Vector kết hợp $\mathbf{x}_{\text{fused}}$ -> Classifier.
> * ✍️ **[CHÚ THÍCH SƠ ĐỒ 5.1]:** *Sơ đồ 5.1: Kiến trúc ghép nối đặc trưng đa phương thức (Multimodal Feature Fusion).*
> * 📷 **[NGUỒN LẤY ẢNH CODE 5.1]:** Chụp đoạn code Scikit-Learn `ColumnTransformer` hoặc hàm ghép nối đặc trưng số + văn bản trong notebook hệ thống 3.
> * ✍️ **[CHÚ THÍCH ẢNH CODE 5.1]:** *Ảnh Code 5.1: Mã nguồn trích xuất đặc trưng TF-IDF và kết hợp vector đa phương thức.*

---

### 5.3. Huấn luyện Mô hình & Triển khai Giao diện E-commerce
* Phân loại khách hàng thành các nhóm: *High-Value, Churn-Risk, Budget-Hunter, Loyal*.
* Lưu trữ `preprocessor.joblib` và `customer_model.joblib`.

---

> 📍 **[VỊ TRÍ CHÈN HÌNH 5.2 & ẢNH GIAO DIỆN 5.3]: Chèn tại Mục 5.3**
> * 📷 **[NGUỒN LẤY HÌNH 5.2]:** Chụp biểu đồ phân cụm (Scatter plot / PCA 2D) hoặc Confusion Matrix của bộ phân loại khách hàng trong notebook hệ thống 3.
> * ✍️ **[CHÚ THÍCH HÌNH 5.2]:** *Hình 5.2: Biểu đồ trực quan hóa các phân khúc hành vi khách hàng thương mại điện tử.*
> * 📷 **[NGUỒN LẤY ẢNH GIAO DIỆN 5.3]:** Chụp màn hình giao diện Web và Mobile phân tích khách hàng của hệ thống 3.
> * ✍️ **[CHÚ THÍCH ẢNH GIAO DIỆN 5.3]:** *Hình 5.3: Giao diện Web và Mobile hệ thống phân tích hành vi khách hàng E-commerce.*

---

## 📌 CHƯƠNG 6: PHÂN TÍCH SO SÁNH CHÉO 3 HỆ THỐNG (CROSS-APPLICATION COMPARISON)

*(Phần bắt buộc để đạt điểm tối đa theo đề bài Assignment 02)*

---

> 📍 **[VỊ TRÍ CHÈN BẢNG 6.1]: Chèn ở đầu Chương 6**

### Bảng 6.1: Ma trận So sánh Toàn diện giữa 3 Hệ thống Thông minh:

| Tiêu chí so sánh | Hệ thống 1: Tiểu đường (Diabetes) | Hệ thống 2: Giá nhà đất (House Price) | Hệ thống 3: Khách hàng E-commerce |
| :--- | :--- | :--- | :--- |
| **Loại bài toán Học máy** | Phân loại nhị phân (*Binary Classification*) | Hồi quy biến liên tục (*Continuous Regression*) | Phân loại / Phân cụm đa lớp (*Multimodal Classification*) |
| **Bản chất dữ liệu đầu vào** | Bảng thuần số học lâm sàng (*Pure Numerical Tabular*) | Bảng dữ liệu bất động sản thực tế (*Tabular with log target*) | Đa phương thức: Bảng số liệu + Văn bản tự nhiên (*Tabular + Text*) |
| **Không gian biểu diễn ($d$)** | Thấp ($d = 8$ chiều) | Thấp ($d = 4$ chiều) | Trung bình - Cao ($d \approx 100 - 150$ chiều do TF-IDF) |
| **Phương pháp tiền xử lý cốt lõi** | Median Imputer + Robust/Standard Scaling | Log-transform $y = \ln(1+\text{price})$ + IQR Outlier Filtering | TF-IDF Vectorizer + StandardScaler + Concatenation |
| **Mô hình tối ưu nhất** | KNN ($K=19$) / Random Forest | XGBoost Regressor (Tuned) | Random Forest / XGBoost Classifier |
| **Độ đo đánh giá chính** | Accuracy, Precision, Recall, F1-Score, ROC-AUC | $R^2$ Score, RMSE, MAE, MAPE, MedAE | Accuracy, Macro F1-Score, Confusion Matrix |
| **Định dạng triển khai (Model Persistence)** | Pickle binary (`.sav` / `.joblib`) | **ONNX Runtime Engine (`.onnx`)** + Pickle | Joblib Pipeline (`preprocessor + model`) |
| **Độ trễ suy luận (Inference Latency)** | Rất nhanh (~ 1.5 ms) | Siêu tốc (**< 0.5 ms** nhờ ONNX Engine) | Trung bình (~ 3 - 5 ms do bước biến đổi TF-IDF) |
| **Khả năng giải thích (Interpretability)** | Cao (Chỉ số Glucose, BMI) | Rất cao (Feature Importance: Diện tích) | Trung bình (Trọng số từ khóa TF-IDF + Bảng số liệu) |
| **Thách thức kỹ thuật lớn nhất** | Dữ liệu thiếu ẩn dưới giá trị 0 | Phân phối giá bị lệch phải cực đoan | Rò rỉ từ vựng (Vocab Leakage) lúc biến đổi TF-IDF |

---

> 📍 **[VỊ TRÍ CHÈN HÌNH 6.1]: Chèn ngay sau Bảng 6.1**
> * 📷 **[NGUỒN LẤY]:** Biểu đồ Radar Chart (mạng nhện) so sánh 3 ứng dụng theo 5 trục: *(1) Độ phức tạp dữ liệu, (2) Số chiều đặc trưng, (3) Tốc độ suy luận, (4) Khả năng giải thích, (5) Tính linh hoạt triển khai di động*.
> * ✍️ **[CHÚ THÍCH]:** *Hình 6.1: Biểu đồ Radar so sánh đa chiều giữa 3 hệ thống thông minh.*

---

## 📌 CHƯƠNG 7: THẢO LUẬN CHUYÊN SÂU & TRẢ LỜI 4 CÂU HỎI CỐT LÕI

*(Trình bày đầy đủ câu trả lời cho 4 câu hỏi lý thuyết cốt lõi)*

* **Câu hỏi 1 (Train-Serve Skew):** Giải thích tại sao việc sai lệch tiền xử lý lúc inference sẽ làm trôi dạt phân phối dữ liệu đầu vào $\mathbf{x}_{\text{infer}}$, khiến hàm mục tiêu dự đoán sai hoàn toàn.
* **Câu hỏi 2 (Data Leakage):** Trình bày cơ chế "Fit on Train only, Transform on Test/Serve" và việc đóng gói bằng `Pipeline`.
* **Câu hỏi 3 (Representation Upper Bound):** Tác động của Log-transform (triệt tiêu heteroscedasticity) và TF-IDF (loại bỏ nhiễu từ dừng) đến việc nâng cao trần hiệu năng của thuật toán.
* **Câu hỏi 4 (Pickle vs ONNX Runtime):** So sánh chi tiết ưu thế vượt trội của ONNX (đa nền tảng, độc lập Python, tối ưu đồ thị tính toán, tốc độ suy luận nhanh gấp 8 lần) khi triển khai trên Mobile.

---

## 📌 CHƯƠNG 8: KIẾN TRÚC TRIỂN KHAI & THIẾT KẾ RESTFUL API

### 8.1. Sơ đồ Kiến trúc Hệ thống 3 Tầng (3-Tier Architecture)

---

> 📍 **[VỊ TRÍ CHÈN SƠ ĐỒ 8.1]: Chèn tại Mục 8.1**
> * 📷 **[NGUỒN LẤY]:** Sơ đồ khối thể hiện 3 tầng tương tác:
>   * *Client Layer:* Web Browser Desktop (HTML5/CSS3) & Mobile Client App.
>   * *Backend Server Layer:* Flask REST API (`app.py`), Route dispatcher, Input validation.
>   * *Model Engine Layer:* ONNX Runtime Engine / Scikit-Learn Pipeline (`.onnx`, `.sav`, `.joblib`).
> * ✍️ **[CHÚ THÍCH]:** *Sơ đồ 8.1: Kiến trúc hệ thống tổng thể 3 tầng từ giao diện người dùng đến động cơ suy luận AI.*

---

### 8.2. Thiết kế REST API & Mẫu Dữ liệu Giao tiếp

---

> 📍 **[VỊ TRÍ CHÈN ẢNH CODE 8.1]: Chèn tại Mục 8.2**
> * 📷 **[NGUỒN LẤY]:** Chụp đoạn JSON Request Payload và Response JSON thực tế khi gọi API `/predict` (từ Postman, Terminal cURL, hoặc file `api/app.py`).
> * ✍️ **[CHÚ THÍCH]:** *Ảnh Code 8.1: Cấu trúc JSON Request và Response tiêu chuẩn của cổng REST API.*

---

### 8.3. Hướng dẫn Cài đặt & Tái lập Kết quả (Reproducibility)
* Cấu hình môi trường qua `requirements.txt`.
* Cố định random seed: `random_state = 42`.
* Lệnh khởi chạy các dịch vụ trên local server.

---

## 📌 CHƯƠNG 9: KẾT QUẢ THỰC NGHIỆM & BỘ SƯU TẬP ẢNH MINH CHỨNG TOÀN DIỆN

*Tại chương này, bạn gom lại và trình bày một bộ sưu tập ảnh chất lượng cao làm bằng chứng thực nghiệm:*

1. **Bộ ảnh Jupyter Notebook:** 3 ảnh chụp màn hình 3 file `.ipynb` chạy hoàn tất 23 mục không có lỗi.
2. **Bộ ảnh Terminal / Console:** 3 ảnh chụp khởi động server Flask API và nạp thành công mô hình ONNX / Pickle.
3. **Bộ ảnh Giao diện Web Desktop:** 3 ảnh chụp màn hình giao diện Desktop của 3 hệ thống.
4. **Bộ ảnh Giao diện Mobile App:** 3 ảnh chụp màn hình giao diện trên thiết bị di động của 3 hệ thống.

---

## 📌 CHƯƠNG 10: TỔNG KẾT & HƯỚNG PHÁT TRIỂN

### 10.1. Đánh giá Kết quả đạt được theo Appendix F (Checklist 34 tiêu chí)
* Hoàn thành đầy đủ 100% các tiêu chí từ Biểu diễn dữ liệu, Huấn luyện, Đánh giá, Đóng gói mô hình ONNX đến Triển khai Web/Mobile.

### 10.2. Hạn chế & Hướng phát triển tiếp theo
* Bổ sung dữ liệu không gian địa lý (GIS / tọa độ vị trí) cho bài toán Bất động sản.
* Nâng cấp mô hình ngôn ngữ lớn (LLM Embeddings) cho bài toán E-commerce.
* Đóng gói Docker Container và triển khai Cloud Hosting (AWS, GCP).

---

## 📚 TÀI LIỆU THAM KHẢO
1. PTIT Intelligent System Development Course - Lecture 02: *Data Representation & System Architecture*.
2. Scikit-Learn Documentation: *Pipelines, Model Persistence and Evaluation Metrics*.
3. ONNX Runtime Documentation: *High-Performance Inference across Platforms*.
4. D. Chen, *XGBoost: A Scalable Tree Boosting System*, KDD 2016.
5. Pima Indians Diabetes Database - UCI Machine Learning Repository / Kaggle.
