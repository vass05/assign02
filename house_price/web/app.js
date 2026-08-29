document.getElementById('predictForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const resultCard = document.getElementById('resultCard');
    const predictedPrice = document.getElementById('predictedPrice');
    const unitPrice = document.getElementById('unitPrice');

    const area = parseFloat(document.getElementById('area').value);
    const bedroom = parseFloat(document.getElementById('bedroom').value);
    const toilet = parseFloat(document.getElementById('toilet').value);
    const floors = parseFloat(document.getElementById('floors').value) || 2;

    submitBtn.innerHTML = '<span>Đang tính toán ONNX AI...</span>';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ area, bedroom, toilet, floors })
        });

        const data = await response.json();
        
        if (data.success) {
            predictedPrice.innerText = data.predicted_price_billion + ' Tỷ VNĐ';
            unitPrice.innerText = 'Đơn giá: ~ ' + data.price_per_m2_million + ' Triệu/m²';
            resultCard.style.display = 'block';
            
            if (data.engine) {
                document.getElementById('modelInfo').innerText = `Mô hình: ${data.model} (${data.engine})`;
            }
        } else {
            alert('Lỗi: ' + (data.error || 'Dự đoán thất bại'));
        }
    } catch (err) {
        alert('Không thể kết nối máy chủ API!');
    } finally {
        submitBtn.innerHTML = '<span>Dự Đoán Giá Nhà</span>';
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
    }
});
