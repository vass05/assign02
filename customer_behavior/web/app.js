document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('predictForm');
  const emptyState = document.getElementById('emptyState');
  const resultBox = document.getElementById('resultBox');
  const submitBtn = document.getElementById('submitBtn');
  const langSelect = document.getElementById('langSelect');
  const deptSelect = document.getElementById('departmentName');
  const divSelect = document.getElementById('divisionName');
  const reviewText = document.getElementById('reviewText');
  const ageInput = document.getElementById('age');
  const feedbackInput = document.getElementById('positiveFeedback');

  const historyTableWrapper = document.getElementById('historyTableWrapper');
  const historyEmpty = document.getElementById('historyEmpty');
  const historyTableBody = document.getElementById('historyTableBody');
  const historyCount = document.getElementById('historyCount');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  // Minimal Vector Icons
  const iconSuccess = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  const iconWarning = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;

  let currentLang = 'vi';
  let lastApiResponse = null;
  let historyData = [];

  const I18N = {
    vi: {
      brandTitle: 'Đánh Giá Mức Độ Hài Lòng Của Khách Hàng',
      brandSubtitle: 'Hệ thống thông minh dự đoán khách hàng có thích và muốn giới thiệu sản phẩm hay không',
      formTitle: 'Thông tin người mua & Lời nhận xét',
      labelAge: 'Độ tuổi của khách:',
      labelFeedback: 'Số người thấy nhận xét này hay:',
      labelDept: 'Loại trang phục:',
      labelDiv: 'Dòng sản phẩm:',
      labelReview: 'Lời nhận xét của khách hàng:',
      reviewPlaceholder: 'Nhập cảm nhận của khách hàng khi mặc thử sản phẩm...',
      defaultReview: 'Tôi rất thích chiếc váy này! Chất vải tuyệt đẹp, mặc vừa vặn và rất thoải mái cả ngày.',
      submitBtn: 'Kiểm Tra Mức Độ Hài Lòng',
      submitBtnLoading: 'Đang kiểm tra đánh giá...',
      resultTitle: 'Kết quả đánh giá từ mô hình AI',
      emptyText: 'Điền thông tin bên cạnh rồi bấm <b>"Kiểm Tra Mức Độ Hài Lòng"</b> để xem kết quả nhé!',
      recTitle: 'KHÁCH HÀNG RẤT HÀI LÒNG & SẼ GIỚI THIỆU',
      notRecTitle: 'KHÁCH HÀNG CHƯA HÀI LÒNG (CÓ THỂ TRẢ HÀNG)',
      confPrefix: 'Độ chính xác: ',
      probLabel: 'Mức độ hài lòng & muốn mua lại:',
      latencyLabel: 'Tốc độ xử lý',
      modelLabel: 'Mô hình AI đã chọn',
      suggestHeader: 'Gợi ý hành động & Giải pháp chăm sóc khách hàng:',
      summaryTitle: 'Tóm tắt thông tin:',
      summaryAge: 'Tuổi',
      summaryDept: 'Loại đồ',
      summaryReview: 'Nhận xét',
      historyTitle: 'Lịch sử đánh giá gần đây',
      clearHistoryBtn: 'Xóa lịch sử',
      historyEmptyText: 'Chưa có lịch sử đánh giá nào. Hãy thử nhập thông tin và kiểm tra nhé!',
      thTime: 'Thời gian',
      thCustomer: 'Khách hàng',
      thCategory: 'Loại đồ',
      thReview: 'Lời nhận xét',
      thResult: 'Kết quả',
      thConfidence: 'Độ tin cậy',
      thAction: 'Thao tác',
      btnReload: 'Nạp lại',
      tagRec: 'Hài lòng (Đề xuất)',
      tagNotRec: 'Chưa hài lòng',
      deptOptions: {
        Dresses: 'Váy đầm', Tops: 'Áo thời trang', Bottoms: 'Quần & Chân váy',
        Intimate: 'Đồ lót & Đồ ngủ', Jackets: 'Áo khoác', Trend: 'Hàng xu hướng mới'
      },
      divOptions: {
        General: 'Dòng phổ thông', 'General Petite': 'Dòng cho người nhỏ nhắn', Initmates: 'Dòng nội y'
      }
    },
    en: {
      brandTitle: 'Customer Satisfaction & Review Analysis',
      brandSubtitle: 'Smart AI predicting whether customers love the product and recommend it to friends',
      formTitle: 'Customer Details & Review Feedback',
      labelAge: 'Customer Age:',
      labelFeedback: 'People who found this review helpful:',
      labelDept: 'Clothing Category:',
      labelDiv: 'Product Line:',
      labelReview: 'Customer Review Text:',
      reviewPlaceholder: 'Enter customer feedback about how the product fits and feels...',
      defaultReview: 'I absolutely love this dress! The fabric is stunning, very flattering and comfortable to wear all day.',
      submitBtn: 'Check Customer Satisfaction',
      submitBtnLoading: 'Analyzing feedback...',
      resultTitle: 'AI Evaluation Results',
      emptyText: 'Fill in the information on the left and click <b>"Check Customer Satisfaction"</b> to view results!',
      recTitle: 'HIGHLY SATISFIED & WILL RECOMMEND',
      notRecTitle: 'NOT SATISFIED (RETURN OR CHURN RISK)',
      confPrefix: 'Confidence: ',
      probLabel: 'Satisfaction & Repeat Purchase Rate:',
      latencyLabel: 'Analysis Speed',
      modelLabel: 'Selected AI Model',
      suggestHeader: 'Actionable Solutions & Customer Care Recommendations:',
      summaryTitle: 'Information Summary:',
      summaryAge: 'Age',
      summaryDept: 'Category',
      summaryReview: 'Review',
      historyTitle: 'Recent Prediction History',
      clearHistoryBtn: 'Clear History',
      historyEmptyText: 'No evaluation history yet. Enter review details above to test!',
      thTime: 'Time',
      thCustomer: 'Customer',
      thCategory: 'Category',
      thReview: 'Review Snippet',
      thResult: 'Result',
      thConfidence: 'Confidence',
      thAction: 'Action',
      btnReload: 'Reload',
      tagRec: 'Satisfied (Recommend)',
      tagNotRec: 'Not Satisfied',
      deptOptions: {
        Dresses: 'Dresses', Tops: 'Tops & Blouses', Bottoms: 'Pants & Skirts',
        Intimate: 'Intimates & Sleepwear', Jackets: 'Jackets & Coats', Trend: 'Trending Styles'
      },
      divOptions: {
        General: 'General Line', 'General Petite': 'Petite Line', Initmates: 'Intimates Line'
      }
    },
    zh: {
      brandTitle: '客户满意度与评价智能分析',
      brandSubtitle: '智能AI预测客户是否喜爱并愿意推荐该产品',
      formTitle: '买家信息与真实评价',
      labelAge: '客户年龄：',
      labelFeedback: '认为该评价有用的点赞数：',
      labelDept: '服装品类：',
      labelDiv: '产品系列：',
      labelReview: '客户评价内容：',
      reviewPlaceholder: '请输入客户的真实试穿感受...',
      defaultReview: '我非常喜欢这条裙子！面料很棒，穿着非常合身，一整天都很舒适。',
      submitBtn: '立即分析满意度',
      submitBtnLoading: 'AI正在分析评价...',
      resultTitle: 'AI智能评估结果',
      emptyText: '请在左侧填写信息后点击 <b>"立即分析满意度"</b> 查看结果！',
      recTitle: '客户非常满意并愿意推荐购买',
      notRecTitle: '客户不满意（存在退货流失风险）',
      confPrefix: '准确度：',
      probLabel: '满意度及复购意愿：',
      latencyLabel: '分析速度',
      modelLabel: '选用AI模型',
      suggestHeader: '智能运营建议与客户关怀方案：',
      summaryTitle: '信息摘要：',
      summaryAge: '年龄',
      summaryDept: '品类',
      summaryReview: '评价',
      historyTitle: '最近评估历史记录',
      clearHistoryBtn: '清空历史',
      historyEmptyText: '暂无评估历史，请在上方填写信息测试！',
      thTime: '时间',
      thCustomer: '客户',
      thCategory: '品类',
      thReview: '评价内容',
      thResult: '结果',
      thConfidence: '置信度',
      thAction: '操作',
      btnReload: '加载',
      tagRec: '非常满意(推荐)',
      tagNotRec: '不满意',
      deptOptions: {
        Dresses: '连衣裙', Tops: '上衣与衬衫', Bottoms: '裤子与半身裙',
        Intimate: '内衣与家居服', Jackets: '外套与夹克', Trend: '潮流新品'
      },
      divOptions: {
        General: '常规系列', 'General Petite': '娇小身材系列', Initmates: '内衣系列'
      }
    },
    ko: {
      brandTitle: '고객 만족도 및 리뷰 감성 분석',
      brandSubtitle: '고객이 상품을 만족하고 추천할지 예측하는 스마트 AI 시스템',
      formTitle: '구매자 정보 및 리뷰 입력',
      labelAge: '고객 연령:',
      labelFeedback: '도움이 된 추천 수:',
      labelDept: '의류 카테고리:',
      labelDiv: '상품 라인:',
      labelReview: '고객 리뷰 내용:',
      reviewPlaceholder: '고객의 실제 착용 후기를 입력하세요...',
      defaultReview: '이 드레스 정말 마음에 들어요! 소재가 훌륭하고 핏이 예쁘며 하루 종일 편안합니다.',
      submitBtn: '만족도 분석하기',
      submitBtnLoading: '리뷰 분석 중...',
      resultTitle: 'AI 평가 결과',
      emptyText: '정보를 입력한 후 <b>"만족도 분석하기"</b> 버튼을 클릭하세요!',
      recTitle: '고객이 매우 만족하며 추천합니다',
      notRecTitle: '고객 불만족 (반품 및 이탈 위험)',
      confPrefix: '정확도: ',
      probLabel: '만족도 및 재구매 의향:',
      latencyLabel: '분석 속도',
      modelLabel: '선택된 AI 모델',
      suggestHeader: '스마트 해결 방안 및 고객 관리 추천:',
      summaryTitle: '정보 요약:',
      summaryAge: '연령',
      summaryDept: '카테고리',
      summaryReview: '리뷰',
      historyTitle: '최근 분석 히스토리',
      clearHistoryBtn: '기록 지우기',
      historyEmptyText: '분석 기록이 없습니다. 위에서 정보를 입력해 보세요!',
      thTime: '시간',
      thCustomer: '고객',
      thCategory: '카테고리',
      thReview: '리뷰 내용',
      thResult: '결과',
      thConfidence: '정확도',
      thAction: '관리',
      btnReload: '불러오기',
      tagRec: '만족 (추천)',
      tagNotRec: '불만족',
      deptOptions: {
        Dresses: '드레스/원피스', Tops: '상의/블라우스', Bottoms: '바지/스커트',
        Intimate: '이너웨어/잠옷', Jackets: '자켓/코트', Trend: '트렌드 신상품'
      },
      divOptions: {
        General: '일반 라인', 'General Petite': '쁘띠 라인 (아담 체형)', Initmates: '언더웨어 라인'
      }
    },
    ja: {
      brandTitle: '顧客満足度＆レビュー感情分析',
      brandSubtitle: 'お客様が商品を気に入り推薦するかを予測するAIシステム',
      formTitle: '購入者情報とレビュー内容',
      labelAge: 'お客様の年齢：',
      labelFeedback: '参考になった投票数：',
      labelDept: 'カテゴリー：',
      labelDiv: '商品ライン：',
      labelReview: 'レビュー本文：',
      reviewPlaceholder: '着用した感想や着心地を入力してください...',
      defaultReview: 'このドレスがとても気に入りました！生地が素晴らしく、着心地も一日中とても快適です。',
      submitBtn: '満足度を判定する',
      submitBtnLoading: '分析を実行中...',
      resultTitle: 'AIモデル判定結果',
      emptyText: '左側に情報を入力して <b>"満足度を判定する"</b> をクリックしてください！',
      recTitle: '大変満足しており他のお客様にも推薦',
      notRecTitle: '不満（返品・離脱のリスクあり）',
      confPrefix: '精度：',
      probLabel: '満足度＆リピート購入率：',
      latencyLabel: '処理速度',
      modelLabel: '選択AIモデル',
      suggestHeader: '改善提案およびカスタマーケア施策：',
      summaryTitle: '情報概要：',
      summaryAge: '年齢',
      summaryDept: 'カテゴリー',
      summaryReview: 'レビュー',
      historyTitle: '判定履歴一覧',
      clearHistoryBtn: '履歴消去',
      historyEmptyText: '判定履歴はありません。上記で入力してお試しください！',
      thTime: '日時',
      thCustomer: '顧客',
      thCategory: 'カテゴリー',
      thReview: 'レビュー概要',
      thResult: '判定結果',
      thConfidence: '信頼度',
      thAction: '操作',
      btnReload: '再設定',
      tagRec: '満足 (推奨)',
      tagNotRec: '不満',
      deptOptions: {
        Dresses: 'ドレス・ワンピース', Tops: 'トップス・ブラウス', Bottoms: 'ボトムス・スカート',
        Intimate: 'インナー・ルームウェア', Jackets: 'ジャケット・アウター', Trend: 'トレンド新着'
      },
      divOptions: {
        General: 'レギュラーライン', 'General Petite': 'プチサイズライン', Initmates: 'インナーライン'
      }
    },
    es: {
      brandTitle: 'Análisis de Satisfacción y Opinión del Cliente',
      brandSubtitle: 'IA inteligente que predice si los clientes aman el producto y lo recomiendan',
      formTitle: 'Datos del Comprador y Opinión',
      labelAge: 'Edad del cliente:',
      labelFeedback: 'Votos de reseña útil:',
      labelDept: 'Categoría de prenda:',
      labelDiv: 'Línea de producto:',
      labelReview: 'Opinión del cliente:',
      reviewPlaceholder: 'Escriba las sensaciones del cliente con el producto...',
      defaultReview: '¡Me encanta este vestido! La tela es hermosa, me queda muy bien y es súper cómodo todo el día.',
      submitBtn: 'Evaluar Satisfacción',
      submitBtnLoading: 'Analizando opinión...',
      resultTitle: 'Resultados de Evaluación IA',
      emptyText: '¡Complete los datos a la izquierda y presione <b>"Evaluar Satisfacción"</b> para ver resultados!',
      recTitle: 'CLIENTE MUY SATISFECHO Y RECOMENDARÁ',
      notRecTitle: 'CLIENTE INSATISFECHO (RIESGO DE DEVOLUCIÓN)',
      confPrefix: 'Confianza: ',
      probLabel: 'Nivel de satisfacción y recompra:',
      latencyLabel: 'Velocidad',
      modelLabel: 'Modelo IA Seleccionado',
      suggestHeader: 'Soluciones y Recomendaciones de Atención al Cliente:',
      summaryTitle: 'Resumen de Información:',
      summaryAge: 'Edad',
      summaryDept: 'Categoría',
      summaryReview: 'Opinión',
      historyTitle: 'Historial de Evaluaciones',
      clearHistoryBtn: 'Borrar Historial',
      historyEmptyText: 'No hay historial de evaluación todavía. ¡Ingrese datos arriba para probar!',
      thTime: 'Hora',
      thCustomer: 'Cliente',
      thCategory: 'Categoría',
      thReview: 'Opinión',
      thResult: 'Resultado',
      thConfidence: 'Confianza',
      thAction: 'Acción',
      btnReload: 'Cargar',
      tagRec: 'Satisfecho (Recomendado)',
      tagNotRec: 'Insatisfecho',
      deptOptions: {
        Dresses: 'Vestidos', Tops: 'Tops y Blusas', Bottoms: 'Pantalones y Faldas',
        Intimate: 'Lencería y Pijamas', Jackets: 'Chaquetas y Abrigos', Trend: 'Tendencias'
      },
      divOptions: {
        General: 'Línea General', 'General Petite': 'Línea Petite', Initmates: 'Línea de Lencería'
      }
    }
  };

  const allDefaultReviews = Object.values(I18N).map(item => item.defaultReview.trim());

  function updateLanguage(lang) {
    currentLang = lang;
    const t = I18N[lang];

    document.getElementById('t-brandTitle').innerText = t.brandTitle;
    document.getElementById('t-brandSubtitle').innerText = t.brandSubtitle;
    document.getElementById('t-formTitle').innerText = t.formTitle;
    document.getElementById('t-labelAge').innerText = t.labelAge;
    document.getElementById('t-labelFeedback').innerText = t.labelFeedback;
    document.getElementById('t-labelDept').innerText = t.labelDept;
    document.getElementById('t-labelDiv').innerText = t.labelDiv;
    document.getElementById('t-labelReview').innerText = t.labelReview;
    reviewText.placeholder = t.reviewPlaceholder;

    const currentVal = reviewText.value.trim();
    if (!currentVal || allDefaultReviews.includes(currentVal)) {
      reviewText.value = t.defaultReview;
    }

    document.getElementById('t-submitBtn').innerText = t.submitBtn;
    document.getElementById('t-resultTitle').innerText = t.resultTitle;
    document.getElementById('t-emptyText').innerHTML = t.emptyText;
    document.getElementById('t-probLabel').innerText = t.probLabel;
    document.getElementById('t-latencyLabel').innerText = t.latencyLabel;
    document.getElementById('t-modelLabel').innerText = t.modelLabel;
    document.getElementById('t-suggestHeader').innerText = t.suggestHeader;
    document.getElementById('t-summaryTitle').innerText = t.summaryTitle;

    // History I18N
    document.getElementById('t-historyTitle').innerText = t.historyTitle;
    document.getElementById('t-clearHistoryBtn').innerText = t.clearHistoryBtn;
    document.getElementById('t-historyEmptyText').innerText = t.historyEmptyText;
    document.getElementById('t-thTime').innerText = t.thTime;
    document.getElementById('t-thCustomer').innerText = t.thCustomer;
    document.getElementById('t-thCategory').innerText = t.thCategory;
    document.getElementById('t-thReview').innerText = t.thReview;
    document.getElementById('t-thResult').innerText = t.thResult;
    document.getElementById('t-thConfidence').innerText = t.thConfidence;
    document.getElementById('t-thAction').innerText = t.thAction;

    const currentDeptVal = deptSelect.value;
    Array.from(deptSelect.options).forEach(opt => {
      if (t.deptOptions[opt.value]) {
        opt.text = t.deptOptions[opt.value];
      }
    });
    deptSelect.value = currentDeptVal;

    const currentDivVal = divSelect.value;
    Array.from(divSelect.options).forEach(opt => {
      if (t.divOptions[opt.value]) {
        opt.text = t.divOptions[opt.value];
      }
    });
    divSelect.value = currentDivVal;

    if (lastApiResponse) {
      renderResults(lastApiResponse);
    }
    renderHistoryTable();
  }

  langSelect.addEventListener('change', (e) => {
    e.preventDefault();
    updateLanguage(e.target.value);
  });

  function renderResults(data) {
    lastApiResponse = data;
    const t = I18N[currentLang];

    emptyState.style.display = 'none';
    resultBox.style.display = 'block';

    const statusBadge = document.getElementById('statusBadge');
    const statusIcon = document.getElementById('statusIcon');
    const predTitle = document.getElementById('predTitle');
    const confSub = document.getElementById('confSub');
    const probText = document.getElementById('probText');
    const meterFill = document.getElementById('meterFill');
    const latencyVal = document.getElementById('latencyVal');
    const modelNameVal = document.getElementById('modelNameVal');
    const featureSummaryText = document.getElementById('featureSummaryText');
    const suggestionsCard = document.getElementById('suggestionsCard');
    const suggestionsList = document.getElementById('suggestionsList');

    if (data.predicted_class === 1) {
      statusBadge.className = 'status-badge rec';
      statusIcon.innerHTML = iconSuccess;
      predTitle.innerText = t.recTitle;
      meterFill.className = 'meter-fill rec';
      suggestionsCard.className = 'suggestions-card';
    } else {
      statusBadge.className = 'status-badge not-rec';
      statusIcon.innerHTML = iconWarning;
      predTitle.innerText = t.notRecTitle;
      meterFill.className = 'meter-fill not-rec';
      suggestionsCard.className = 'suggestions-card warning-mode';
    }

    confSub.innerText = `${t.confPrefix}${data.confidence}%`;
    probText.innerText = `${data.recommended_probability}%`;
    meterFill.style.width = `${data.recommended_probability}%`;
    latencyVal.innerText = `${data.latency_ms} ms`;
    if (data.model_name) {
      modelNameVal.innerText = data.model_name;
    }

    const sList = data.suggestions && data.suggestions[currentLang] ? data.suggestions[currentLang] : (data.suggestions ? data.suggestions.en : []);
    suggestionsList.innerHTML = sList.map(s => `<li>${s}</li>`).join('');

    const payloadAge = ageInput.value;
    const payloadDept = deptSelect.options[deptSelect.selectedIndex].text;
    const payloadReview = reviewText.value;
    featureSummaryText.innerText = `${t.summaryAge}: ${payloadAge} • ${t.summaryDept}: ${payloadDept} • ${t.summaryReview}: "${payloadReview.substring(0, 50)}..."`;
  }

  // ==============================================================================
  // QUẢN LÝ LỊCH SỬ DỰ ĐOÁN (HISTORY FUNCTIONS)
  // ==============================================================================
  async function fetchHistory() {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.success) {
        historyData = data.history;
        renderHistoryTable();
      }
    } catch (e) {
      console.warn('Chưa thể lấy lịch sử:', e);
    }
  }

  function renderHistoryTable() {
    const t = I18N[currentLang];
    historyCount.innerText = historyData.length;

    if (!historyData || historyData.length === 0) {
      historyTableWrapper.style.display = 'none';
      historyEmpty.style.display = 'block';
      return;
    }

    historyEmpty.style.display = 'none';
    historyTableWrapper.style.display = 'block';

    historyTableBody.innerHTML = historyData.map(item => {
      const isRec = item.predicted_class === 1;
      const tagClass = isRec ? 'badge-res-tag rec' : 'badge-res-tag not-rec';
      const tagText = isRec ? t.tagRec : t.tagNotRec;
      const deptDisplay = t.deptOptions[item.department] || item.department;

      return `
        <tr>
          <td style="font-size: 0.82rem; color: var(--text-muted); white-space: nowrap;">${item.timestamp}</td>
          <td><b>${item.age}</b> tuổi (${item.feedback} thích)</td>
          <td>${deptDisplay}</td>
          <td style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.review}">
            ${item.review}
          </td>
          <td><span class="${tagClass}">${tagText}</span></td>
          <td><b>${item.confidence}%</b></td>
          <td>
            <button type="button" class="btn-reload-item" onclick="reloadHistoryItem(${item.id})">
              ${t.btnReload}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.reloadHistoryItem = function(id) {
    const item = historyData.find(h => h.id === id);
    if (!item) return;

    ageInput.value = item.age;
    feedbackInput.value = item.feedback;
    deptSelect.value = item.department;
    divSelect.value = item.division || 'General';
    reviewText.value = item.review;

    form.scrollIntoView({ behavior: 'smooth' });
  };

  clearHistoryBtn.addEventListener('click', async () => {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ lịch sử đánh giá không?')) return;
    try {
      const res = await fetch('/api/history', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        historyData = [];
        renderHistoryTable();
      }
    } catch (e) {
      alert('Không thể xóa lịch sử!');
    }
  });

  // Gửi Form Dự Đoán
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      age: parseInt(ageInput.value),
      positiveFeedbackCount: parseInt(feedbackInput.value),
      departmentName: deptSelect.value,
      divisionName: divSelect.value,
      reviewText: reviewText.value
    };

    const t = I18N[currentLang];
    submitBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <span>${t.submitBtnLoading}</span>
    `;
    submitBtn.disabled = true;

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        renderResults(data);
        await fetchHistory(); // Tự động cập nhật bảng lịch sử
      } else {
        alert('Lỗi: ' + (data.error || 'Dự đoán thất bại'));
      }
    } catch (err) {
      alert('Không thể kết nối máy chủ! Hãy đảm bảo server đang chạy ở cổng 5002.');
    } finally {
      submitBtn.innerHTML = `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        <span id="t-submitBtn">${t.submitBtn}</span>
      `;
      submitBtn.disabled = false;
    }
  });

  // Tải lịch sử ban đầu
  fetchHistory();
});
