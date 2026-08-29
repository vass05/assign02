document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictionForm');
    const btnSubmit = document.getElementById('btnSubmit');
    const btnText = document.getElementById('btnText');
    const resultPanel = document.getElementById('resultPanel');
    const resultBadge = document.getElementById('resultBadge');
    const resultTitle = document.getElementById('resultTitle');
    const gaugeBar = document.getElementById('gaugeBar');
    const safeText = document.getElementById('safeText');
    const dangerText = document.getElementById('dangerText');
    const adviceMessage = document.getElementById('adviceMessage');

    const glucoseInput = document.getElementById('glucose');
    const bmiInput = document.getElementById('bmi');
    const ageInput = document.getElementById('age');

    // Nút thử nghiệm nhanh: Mẫu khỏe mạnh
    document.getElementById('btnSampleSafe').addEventListener('click', () => {
        glucoseInput.value = 95;
        bmiInput.value = 22.0;
        ageInput.value = 25;
    });

    // Nút thử nghiệm nhanh: Mẫu nguy cơ cao
    document.getElementById('btnSampleDanger').addEventListener('click', () => {
        glucoseInput.value = 175;
        bmiInput.value = 36.4;
        ageInput.value = 52;
    });

    // Xử lý gửi biểu mẫu
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const glucose = parseFloat(glucoseInput.value);
        const bmi = parseFloat(bmiInput.value);
        const age = parseFloat(ageInput.value);

        btnSubmit.disabled = true;
        btnText.innerText = 'Đang phân tích dữ liệu lâm sàng...';
        btnSubmit.style.opacity = '0.75';

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Glucose: glucose, BMI: bmi, Age: age })
            });

            const data = await response.json();

            if (response.ok && data.success !== false) {
                const isDiabetic = (data.outcome === 1 || data.prediction === "Diabetic");
                const diabeticProb = data.diabetic_probability || 0;
                const nonDiabeticProb = data.non_diabetic_probability || 0;

                resultPanel.className = 'result-panel ' + (isDiabetic ? 'danger' : 'safe');
                resultBadge.innerText = isDiabetic ? '⚠️ CẢNH BÁO NGUY CƠ CAO' : ' CHỈ SỐ AN TOÀN';
                resultTitle.innerText = isDiabetic ? 'Có Nguy Cơ Mắc Tiểu Đường' : 'Không Có Nguy Cơ Tiểu Đường';

                gaugeBar.style.width = diabeticProb + '%';
                safeText.innerText = 'Bình thường: ' + nonDiabeticProb + '%';
                dangerText.innerText = 'Nguy cơ: ' + diabeticProb + '%';

                if (isDiabetic) {
                    adviceMessage.innerHTML = '⚠️ <b>Khuyến cáo y khoa:</b> Chỉ số đường huyết hoặc BMI của bạn đang ở ngưỡng cảnh báo cao. Hãy giảm tiêu thụ đường tinh luyện, kiểm soát cân nặng và sớm tham vấn ý kiến bác sĩ chuyên khoa.';
                } else {
                    adviceMessage.innerHTML = '✅ <b>Khuyến cáo y khoa:</b> Các chỉ số hiện tại phản ánh thể trạng ổn định. Hãy tiếp tục duy trì chế độ dinh dưỡng cân bằng và tập luyện thể thao thường xuyên.';
                }

                resultPanel.style.display = 'block';
                resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                alert('Lỗi: ' + (data.error || 'Không thể xử lý yêu cầu dự đoán'));
            }
        } catch (err) {
            alert('Không thể kết nối đến máy chủ REST API: ' + err.message);
        } finally {
            btnSubmit.disabled = false;
            btnText.innerText = 'Phân Tích & Dự Đoán Bệnh';
            btnSubmit.style.opacity = '1';
        }
    });
});
