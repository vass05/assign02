document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mobileForm');
    const btn = document.getElementById('mBtnSubmit');
    const btnText = document.getElementById('mBtnText');
    const resultCard = document.getElementById('mResultCard');
    const badge = document.getElementById('mBadge');
    const title = document.getElementById('mTitle');
    const fill = document.getElementById('mGaugeFill');
    const safePct = document.getElementById('mSafePct');
    const riskPct = document.getElementById('mRiskPct');
    const advice = document.getElementById('mAdvice');

    const glucose = document.getElementById('m_glucose');
    const bmi = document.getElementById('m_bmi');
    const age = document.getElementById('m_age');

    document.getElementById('mSampleSafe').addEventListener('click', () => {
        glucose.value = 95;
        bmi.value = 22.0;
        age.value = 25;
    });

    document.getElementById('mSampleDanger').addEventListener('click', () => {
        glucose.value = 175;
        bmi.value = 36.4;
        age.value = 52;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        btn.disabled = true;
        btnText.innerText = 'Đang tính toán AI...';

        try {
            const res = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Glucose: parseFloat(glucose.value),
                    BMI: parseFloat(bmi.value),
                    Age: parseFloat(age.value)
                })
            });

            const data = await res.json();

            if (res.ok && data.success !== false) {
                const isDiabetic = (data.outcome === 1 || data.prediction === "Diabetic");
                const diabeticProb = data.diabetic_probability || 0;
                const nonDiabeticProb = data.non_diabetic_probability || 0;

                resultCard.className = 'mobile-result ' + (isDiabetic ? 'danger' : 'safe');
                badge.innerText = isDiabetic ? 'CẢNH BÁO NGUY CƠ CAO' : 'CHỈ SỐ AN TOÀN';
                title.innerText = isDiabetic ? 'Có Nguy Cơ Tiểu Đường' : 'Không Có Nguy Cơ';

                fill.style.width = diabeticProb + '%';
                safePct.innerText = 'An toàn: ' + nonDiabeticProb + '%';
                riskPct.innerText = 'Nguy cơ: ' + diabeticProb + '%';

                if (isDiabetic) {
                    advice.innerHTML = '⚠️ Chỉ số đường huyết hoặc BMI đang ở mức báo động. Khuyến cáo kiểm tra y tế chuyên khoa.';
                } else {
                    advice.innerHTML = '✅ Các chỉ số phản ánh thể trạng ổn định. Hãy tiếp tục duy trì chế độ sinh hoạt lành mạnh.';
                }

                resultCard.style.display = 'block';
                resultCard.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Lỗi: ' + (data.error || 'Không thể xử lý'));
            }
        } catch (err) {
            alert('Lỗi kết nối API di động: ' + err.message);
        } finally {
            btn.disabled = false;
            btnText.innerText = 'Phân Tích Ngay';
        }
    });
});
