document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('mobileForm');
  const resultCard = document.getElementById('mResultCard');
  const submitBtn = document.getElementById('mSubmitBtn');
  const mLangSelect = document.getElementById('mLangSelect');
  const mAge = document.getElementById('mAge');
  const mFeedback = document.getElementById('mFeedback');
  const mDept = document.getElementById('mDept');
  const mReview = document.getElementById('mReview');

  const mHistoryList = document.getElementById('mHistoryList');
  const mHistoryEmpty = document.getElementById('mHistoryEmpty');
  const mClearHistoryBtn = document.getElementById('mClearHistoryBtn');

  // Minimal Vector Icons
  const iconSuccess = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  const iconWarning = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;

  let currentLang = 'vi';
  let lastApiResponse = null;
  let historyData = [];

  const I18N = {
    vi: {
      title: 'Đánh Giá Khách Hàng',
      subtitle: 'Dự đoán độ hài lòng & đề xuất',
      labelAge: 'Tuổi của khách:',
      labelFeedback: 'Số lượt thích:',
      labelDept: 'Loại trang phục:',
      labelReview: 'Lời nhận xét của khách:',
      reviewPlaceholder: 'Nhập cảm nhận của khách hàng...',
      defaultReview: 'Tôi rất thích chiếc váy này! Chất vải tuyệt đẹp, mặc vừa vặn và rất thoải mái cả ngày.',
      submit: 'Kiểm Tra Ngay',
      submitLoading: 'Đang kiểm tra...',
      recTitle: 'KHÁCH HÀNG RẤT HÀI LÒNG',
      notRecTitle: 'KHÁCH HÀNG CHƯA HÀI LÒNG',
      confPrefix: 'Độ chính xác: ',
      probLabel: 'Tỷ lệ hài lòng:',
      latencyLabel: 'Tốc độ xử lý:',
      suggestTitle: 'Gợi ý hành động & Giải pháp:',
      historyTitle: 'Lịch sử đánh giá',
      clearHistory: 'Xóa',
      historyEmpty: 'Chưa có lịch sử đánh giá nào.',
      tagRec: 'Hài lòng',
      tagNotRec: 'Chưa hài lòng',
      btnReload: 'Nạp',
      deptOptions: {
        Dresses: 'Váy đầm', Tops: 'Áo thời trang', Bottoms: 'Quần & Chân váy',
        Intimate: 'Đồ lót & Đồ ngủ', Jackets: 'Áo khoác', Trend: 'Hàng xu hướng mới'
      }
    },
    en: {
      title: 'Customer Reviews',
      subtitle: 'Predict satisfaction & recommendations',
      labelAge: 'Customer Age:',
      labelFeedback: 'Helpful Likes:',
      labelDept: 'Clothing Category:',
      labelReview: 'Customer Review:',
      reviewPlaceholder: 'Enter customer feedback...',
      defaultReview: 'I absolutely love this dress! The fabric is stunning, very flattering and comfortable to wear all day.',
      submit: 'Check Now',
      submitLoading: 'Checking...',
      recTitle: 'HIGHLY SATISFIED CUSTOMER',
      notRecTitle: 'UNSATISFIED CUSTOMER',
      confPrefix: 'Confidence: ',
      probLabel: 'Satisfaction Rate:',
      latencyLabel: 'Speed:',
      suggestTitle: 'Actionable Solutions:',
      historyTitle: 'Evaluation History',
      clearHistory: 'Clear',
      historyEmpty: 'No evaluation history yet.',
      tagRec: 'Satisfied',
      tagNotRec: 'Unsatisfied',
      btnReload: 'Load',
      deptOptions: {
        Dresses: 'Dresses', Tops: 'Tops & Blouses', Bottoms: 'Pants & Skirts',
        Intimate: 'Intimates & Sleepwear', Jackets: 'Jackets & Coats', Trend: 'Trending Styles'
      }
    },
    zh: {
      title: '客户评价分析',
      subtitle: '预测满意度与推荐意愿',
      labelAge: '客户年龄：',
      labelFeedback: '有用点赞：',
      labelDept: '服装品类：',
      labelReview: '客户评价内容：',
      reviewPlaceholder: '请输入试穿感受...',
      defaultReview: '我非常喜欢这条裙子！面料很棒，穿着非常合身，一整天都很舒适。',
      submit: '立即分析',
      submitLoading: '分析中...',
      recTitle: '客户非常满意并推荐',
      notRecTitle: '客户不满意（流失风险）',
      confPrefix: '准确度：',
      probLabel: '满意度意愿：',
      latencyLabel: '分析速度：',
      suggestTitle: '智能运营关怀建议：',
      historyTitle: '评估历史记录',
      clearHistory: '清空',
      historyEmpty: '暂无评估历史记录。',
      tagRec: '满意',
      tagNotRec: '不满意',
      btnReload: '加载',
      deptOptions: {
        Dresses: '连衣裙', Tops: '上衣与衬衫', Bottoms: '裤子与半身裙',
        Intimate: '内衣与家居服', Jackets: '外套与夹克', Trend: '潮流新品'
      }
    },
    ko: {
      title: '고객 리뷰 감성 분석',
      subtitle: '만족도 및 추천 의향 예측',
      labelAge: '고객 연령:',
      labelFeedback: '추천 수:',
      labelDept: '의류 카테고리:',
      labelReview: '고객 리뷰:',
      reviewPlaceholder: '후기를 입력하세요...',
      defaultReview: '이 드레스 정말 마음에 들어요! 소재가 훌륭하고 핏이 예쁘며 하루 종일 편안합니다.',
      submit: '분석하기',
      submitLoading: '분석 중...',
      recTitle: '고객이 매우 만족합니다',
      notRecTitle: '고객 불만족 (이탈 위험)',
      confPrefix: '정확도: ',
      probLabel: '만족도 비율:',
      latencyLabel: '처리 속도:',
      suggestTitle: '스마트 해결 방안:',
      historyTitle: '분석 히스토리',
      clearHistory: '삭제',
      historyEmpty: '분석 기록이 없습니다.',
      tagRec: '만족',
      tagNotRec: '불만족',
      btnReload: '불러오기',
      deptOptions: {
        Dresses: '드레스/원피스', Tops: '상의/블라우스', Bottoms: '바지/스커트',
        Intimate: '이너웨어/잠옷', Jackets: '자켓/코트', Trend: '트렌드 신상품'
      }
    },
    ja: {
      title: '顧客レビュー分析',
      subtitle: '満足度と推薦判定',
      labelAge: 'お客様の年齢：',
      labelFeedback: '参考投票：',
      labelDept: 'カテゴリー：',
      labelReview: 'レビュー本文：',
      reviewPlaceholder: '感想を入力してください...',
      defaultReview: 'このドレスがとても気に入りました！生地が素晴らしく、着心地も一日中とても快適です。',
      submit: '判定する',
      submitLoading: '分析中...',
      recTitle: '大変満足（推奨）',
      notRecTitle: '不満（離脱リスク）',
      confPrefix: '精度：',
      probLabel: '満足度率：',
      latencyLabel: '処理速度：',
      suggestTitle: '改善提案・施策：',
      historyTitle: '判定履歴',
      clearHistory: '消去',
      historyEmpty: '判定履歴はありません。',
      tagRec: '満足',
      tagNotRec: '不満',
      btnReload: '適用',
      deptOptions: {
        Dresses: 'ドレス・ワンピース', Tops: 'トップス・ブラウス', Bottoms: 'ボトムス・スカート',
        Intimate: 'インナー・ルームウェア', Jackets: 'ジャケット・アウター', Trend: 'トレンド新着'
      }
    },
    es: {
      title: 'Opinión del Cliente',
      subtitle: 'Predicción de satisfacción y recomendación',
      labelAge: 'Edad del cliente:',
      labelFeedback: 'Votos útiles:',
      labelDept: 'Categoría de prenda:',
      labelReview: 'Opinión del cliente:',
      reviewPlaceholder: 'Ingrese su opinión...',
      defaultReview: '¡Me encanta este vestido! La tela es hermosa, me queda muy bien y es súper cómodo todo el día.',
      submit: 'Evaluar Ahora',
      submitLoading: 'Evaluando...',
      recTitle: 'CLIENTE MUY SATISFECHO',
      notRecTitle: 'CLIENTE INSATISFECHO',
      confPrefix: 'Confianza: ',
      probLabel: 'Tasa de satisfacción:',
      latencyLabel: 'Velocidad:',
      suggestTitle: 'Recomendaciones y Soluciones:',
      historyTitle: 'Historial',
      clearHistory: 'Borrar',
      historyEmpty: 'No hay historial aún.',
      tagRec: 'Satisfecho',
      tagNotRec: 'Insatisfecho',
      btnReload: 'Cargar',
      deptOptions: {
        Dresses: 'Vestidos', Tops: 'Tops y Blusas', Bottoms: 'Pantalones y Faldas',
        Intimate: 'Lencería y Pijamas', Jackets: 'Chaquetas y Abrigos', Trend: 'Tendencias'
      }
    }
  };

  const allDefaultReviews = Object.values(I18N).map(item => item.defaultReview.trim());

  function updateLanguage(lang) {
    currentLang = lang;
    const t = I18N[lang];

    document.getElementById('m-t-title').innerText = t.title;
    document.getElementById('m-t-subtitle').innerText = t.subtitle;
    document.getElementById('m-t-labelAge').innerText = t.labelAge;
    document.getElementById('m-t-labelFeedback').innerText = t.labelFeedback;
    document.getElementById('m-t-labelDept').innerText = t.labelDept;
    document.getElementById('m-t-labelReview').innerText = t.labelReview;
    mReview.placeholder = t.reviewPlaceholder;

    const currentVal = mReview.value.trim();
    if (!currentVal || allDefaultReviews.includes(currentVal)) {
      mReview.value = t.defaultReview;
    }

    document.getElementById('m-t-submit').innerText = t.submit;
    document.getElementById('m-t-probLabel').innerText = t.probLabel;
    document.getElementById('m-t-latencyLabel').innerText = t.latencyLabel;
    document.getElementById('m-t-suggestTitle').innerText = t.suggestTitle;

    document.getElementById('m-t-historyTitle').innerText = t.historyTitle;
    mClearHistoryBtn.innerText = t.clearHistory;
    mHistoryEmpty.innerText = t.historyEmpty;

    const currentDeptVal = mDept.value;
    Array.from(mDept.options).forEach(opt => {
      if (t.deptOptions[opt.value]) {
        opt.text = t.deptOptions[opt.value];
      }
    });
    mDept.value = currentDeptVal;

    if (lastApiResponse) {
      renderMobileResults(lastApiResponse);
    }
    renderMobileHistory();
  }

  mLangSelect.addEventListener('change', (e) => {
    e.preventDefault();
    updateLanguage(e.target.value);
  });

  function renderMobileResults(data) {
    lastApiResponse = data;
    const t = I18N[currentLang];

    resultCard.style.display = 'block';

    const statusBadge = document.getElementById('mStatusBadge');
    const mIcon = document.getElementById('mIcon');
    const title = document.getElementById('mTitle');
    const conf = document.getElementById('mConfidence');
    const prob = document.getElementById('mProb');
    const fill = document.getElementById('mFill');
    const latency = document.getElementById('mLatency');
    const mSuggestBox = document.getElementById('mSuggestBox');
    const mSuggestList = document.getElementById('mSuggestList');

    if (data.predicted_class === 1) {
      statusBadge.className = 'm-badge rec';
      mIcon.innerHTML = iconSuccess;
      title.innerText = t.recTitle;
      fill.className = 'progress-fill rec';
      mSuggestBox.className = 'm-suggest-box';
    } else {
      statusBadge.className = 'm-badge not-rec';
      mIcon.innerHTML = iconWarning;
      title.innerText = t.notRecTitle;
      fill.className = 'progress-fill not-rec';
      mSuggestBox.className = 'm-suggest-box warning-mode';
    }

    conf.innerText = `${t.confPrefix}${data.confidence}%`;
    prob.innerText = `${data.recommended_probability}%`;
    fill.style.width = `${data.recommended_probability}%`;
    latency.innerText = `${data.latency_ms} ms`;

    const sList = data.suggestions && data.suggestions[currentLang] ? data.suggestions[currentLang] : (data.suggestions ? data.suggestions.en : []);
    mSuggestList.innerHTML = sList.map(s => `<li>${s}</li>`).join('');

    resultCard.scrollIntoView({ behavior: 'smooth' });
  }

  async function fetchHistory() {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.success) {
        historyData = data.history;
        renderMobileHistory();
      }
    } catch (e) {
      console.warn('History fetch error', e);
    }
  }

  function renderMobileHistory() {
    const t = I18N[currentLang];
    if (!historyData || historyData.length === 0) {
      mHistoryList.style.display = 'none';
      mHistoryEmpty.style.display = 'block';
      return;
    }

    mHistoryEmpty.style.display = 'none';
    mHistoryList.style.display = 'flex';

    mHistoryList.innerHTML = historyData.map(item => {
      const isRec = item.predicted_class === 1;
      const tagText = isRec ? t.tagRec : t.tagNotRec;
      const tagColor = isRec ? '#065F46' : '#991B1B';

      return `
        <div class="m-history-item" onclick="reloadMobileHistoryItem(${item.id})">
          <div class="m-history-item-top">
            <b style="color: ${tagColor}">${tagText} (${item.confidence}%)</b>
            <span style="color: #94A3B8">${item.timestamp.split(' - ')[0]}</span>
          </div>
          <div class="m-history-review">"${item.review}"</div>
          <div style="color: #64748B; display: flex; justify-content: space-between;">
            <span>${item.age} tuổi • ${item.department}</span>
            <span style="color: var(--primary); font-weight: 700;">${t.btnReload} ↵</span>
          </div>
        </div>
      `;
    }).join('');
  }

  window.reloadMobileHistoryItem = function(id) {
    const item = historyData.find(h => h.id === id);
    if (!item) return;

    mAge.value = item.age;
    mFeedback.value = item.feedback;
    mDept.value = item.department;
    mReview.value = item.review;

    form.scrollIntoView({ behavior: 'smooth' });
  };

  mClearHistoryBtn.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/history', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        historyData = [];
        renderMobileHistory();
      }
    } catch (e) {}
  });

  // Submit Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      age: parseInt(mAge.value),
      positiveFeedbackCount: parseInt(mFeedback.value),
      departmentName: mDept.value,
      divisionName: 'General',
      reviewText: mReview.value
    };

    const t = I18N[currentLang];
    submitBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <span>${t.submitLoading}</span>
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
        renderMobileResults(data);
        await fetchHistory();
      } else {
        alert('Lỗi: ' + (data.error || 'Dự đoán thất bại'));
      }
    } catch (err) {
      alert('Không thể kết nối máy chủ API!');
    } finally {
      submitBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        <span id="m-t-submit">${t.submit}</span>
      `;
      submitBtn.disabled = false;
    }
  });

  fetchHistory();
});
