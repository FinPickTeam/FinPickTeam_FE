<template>
  <div class="detail-container">
    <!-- 제목과 찜하기 -->
    <div class="title-section">
      <div class="title-with-heart">
        <img
          :src="getLogoUrl(product.fundManager)"
          :alt="`${product.fundManager} 로고`"
          class="bank-logo"
        />
        <h1 class="product-title">{{ product.fundProductName }}</h1>
        <i
          :class="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
          class="heart-icon"
          @click="toggleFavorite"
        ></i>
      </div>
    </div>

    <!-- 용어 하이라이팅 토글 버튼 -->
    <div class="toggle-section">
      <label class="toggle-label">
        <input
          type="checkbox"
          v-model="isHighlightEnabled"
          class="toggle-input"
        />
        <span class="toggle-slider"></span>
        <span class="toggle-text">금융 용어 하이라이팅</span>
      </label>
    </div>

    <!-- 수익률 차트 섹션 -->
    <div class="chart-section" v-if="product.fundReturnsData">
      <div class="chart-card">
        <h3 class="chart-title">펀드 수익률 추이</h3>
        <FundChart :returnsData="product.fundReturnsData" />
      </div>
    </div>

    <!-- 상세 정보 섹션 -->
    <div class="detail-section">
      <div class="detail-card">
        <div class="detail-item">
          <span
            class="detail-label"
            v-html="highlightTerms('펀드 특징')"
          ></span>
          <span
            class="detail-value"
            v-html="highlightTerms(product.fundProductFeatures)"
          ></span>
        </div>
        <div class="detail-item">
          <span
            class="detail-label"
            v-html="highlightTerms('펀드 타입')"
          ></span>
          <span
            class="detail-value"
            v-html="highlightTerms(product.fundType)"
          ></span>
        </div>
        <div class="detail-item">
          <span class="detail-label" v-html="highlightTerms('위험도')"></span>
          <span
            class="detail-value"
            v-html="highlightTerms(product.fundRiskLevel)"
          ></span>
        </div>
        <div class="detail-item">
          <span
            class="detail-label"
            v-html="highlightTerms('3개월 수익률')"
          ></span>
          <span
            class="detail-value"
            v-html="highlightTerms(getReturnValue(product.fund3MonthReturn))"
          ></span>
        </div>
        <div class="detail-item">
          <span class="detail-label" v-html="highlightTerms('설정일')"></span>
          <span
            class="detail-value"
            v-html="highlightTerms(product.fundStartDate)"
          ></span>
        </div>
        <div class="detail-item">
          <span class="detail-label" v-html="highlightTerms('순자산')"></span>
          <span
            class="detail-value"
            v-html="highlightTerms(product.fundNetAssetValue)"
          ></span>
        </div>
        <div class="detail-item">
          <span
            class="detail-label"
            v-html="highlightTerms('총보수비율')"
          ></span>
          <span
            class="detail-value"
            v-html="highlightTerms(product.fundTotalExpenseRatio)"
          ></span>
        </div>
      </div>
    </div>

    <!-- 이동하기 버튼 -->
    <div class="action-section">
      <p class="action-text">해당 상품을 보러가고 싶다면?</p>
      <p class="action-subtext">아래를 클릭하면 해당 페이지로 이동해요</p>
      <button class="action-btn" @click="goToProduct">이동하기</button>
    </div>

    <!-- 용어 설명 모달 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedTerm }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-definition">{{ selectedDefinition }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFavoriteStore } from '@/stores/favorite';
import FundChart from '../../components/finance/fund/FundChart.vue';

const route = useRoute();
const router = useRouter();
const favoriteStore = useFavoriteStore();

// 상품 데이터
const product = ref({});

// 용어 하이라이팅 관련 상태
const isHighlightEnabled = ref(false);
const showModal = ref(false);
const selectedTerm = ref('');
const selectedDefinition = ref('');
const financialTerms = ref([]);

// 금융 용어 사전 로드
const loadFinancialTerms = async () => {
  try {
    console.log('금융 용어 사전 로드 시작');
    const response = await fetch(
      '/src/pages/home/financial_dictionary_parsed.json'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    financialTerms.value = await response.json();
    console.log(
      '금융 용어 사전 로드 완료:',
      financialTerms.value.length,
      '개 용어'
    );
  } catch (error) {
    console.error('금융 용어 사전 로드 실패:', error);
    financialTerms.value = [];
  }
};

// 안전한 HTML 이스케이프 함수
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// 용어 하이라이팅 함수 (안전한 방식)
const highlightTerms = (text) => {
  if (!isHighlightEnabled.value || !text) return text;

  // 이미 하이라이팅된 텍스트인지 확인
  if (text.includes('highlighted-term')) {
    return text; // 이미 처리된 텍스트는 그대로 반환
  }

  let highlightedText = escapeHtml(text);

  // 용어를 길이 순으로 정렬 (긴 용어부터 매칭)
  const sortedTerms = [...financialTerms.value].sort(
    (a, b) => b.term.length - a.term.length
  );

  sortedTerms.forEach((term) => {
    const escapedTerm = escapeHtml(term.term);
    // HTML 태그 내부를 제외하고 매칭하는 정규식
    const regex = new RegExp(`(?<!<[^>]*?)(${escapedTerm})(?![^<]*?>)`, 'g');

    highlightedText = highlightedText.replace(regex, (match) => {
      return `<span class="highlighted-term" data-term="${escapeHtml(
        term.term
      )}" data-definition="${escapeHtml(term.definition)}">${match}</span>`;
    });
  });

  return highlightedText;
};

// 모달 표시 함수
const showTermModal = (term, definition) => {
  selectedTerm.value = term;
  selectedDefinition.value = definition;
  showModal.value = true;
};

// 모달 닫기 함수
const closeModal = () => {
  showModal.value = false;
};

// 클릭 이벤트 핸들러 (전역에서 호출)
const handleTermClick = (event) => {
  if (event.target.classList.contains('highlighted-term')) {
    const term = event.target.dataset.term;
    const definition = event.target.dataset.definition;
    showTermModal(term, definition);
  }
};

// 데이터 로드 함수
const loadProductData = async () => {
  try {
    // 먼저 전체 상품 목록에서 해당 상품을 찾습니다
    const allResponse = await fetch(
      '/src/components/finance/fund/fund_all.json'
    );
    const allProducts = await allResponse.json();

    const requestedProductName = route.params.id;
    const foundProduct = allProducts.data.find(
      (p) => p.fundProductName === requestedProductName
    );

    if (foundProduct) {
      // 상품이 존재하면 상세 정보를 로드합니다
      const detailResponse = await fetch(
        '/src/components/finance/fund/fund_detail.json'
      );
      const detailData = await detailResponse.json();

      if (detailData.status === 200 && detailData.data) {
        // 상세 정보의 상품명이 요청된 상품명과 일치하는지 확인
        if (detailData.data.fundProductName === requestedProductName) {
          product.value = detailData.data;
        } else {
          console.error('상세 정보의 상품명이 일치하지 않습니다');
          router.push('/404');
          return;
        }
      } else {
        console.error('상세 정보 로드 실패:', detailData.message);
        router.push('/404');
        return;
      }
    } else {
      console.error('상품을 찾을 수 없습니다:', requestedProductName);
      router.push('/404');
      return;
    }
  } catch (error) {
    console.error('상품 데이터 로드 실패:', error);
    router.push('/404');
    return;
  }
};

// 찜하기 상태
const isFavorite = computed(() => {
  return favoriteStore.isFavorite(product.value);
});

// 수익률 표시 함수
function getReturnValue(returnValue) {
  if (returnValue === null || returnValue === undefined || returnValue === '') {
    return 'N/A';
  }

  // 숫자인 경우 퍼센트로 표시
  if (typeof returnValue === 'number') {
    return `${returnValue > 0 ? '+' : ''}${returnValue.toFixed(2)}%`;
  }

  // 문자열인 경우 그대로 표시
  return returnValue;
}

// 메서드들
function goBack() {
  router.back();
}

function toggleFavorite() {
  if (isFavorite.value) {
    favoriteStore.removeFavorite(product.value);
  } else {
    favoriteStore.addFavorite(product.value);
  }
}

function goToProduct() {
  window.open(product.value.fundLink, '_blank');
}

const fundLogoMap = {
  'KB 자산운용': 'KB 자산운용.png',
};

const getLogoUrl = (fundManager) => {
  if (!fundManager) {
    return '/src/assets/fund_logo/KB 자산운용.png';
  }
  const fileName = fundLogoMap[fundManager];
  if (!fileName) {
    return '/src/assets/fund_logo/KB 자산운용.png';
  }
  return `/src/assets/fund_logo/${fileName}`;
};

onMounted(() => {
  console.log('상품 ID:', route.params.id);
  loadProductData();
  loadFinancialTerms();

  // 클릭 이벤트 리스너 추가
  document.addEventListener('click', handleTermClick);
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  document.removeEventListener('click', handleTermClick);
});
</script>

<style scoped>
.detail-container {
  max-width: 390px;
  margin: 0 auto;
  padding: 16px;
  font-family: var(--font-main);
  background: var(--color-bg-light);
  min-height: 100vh;
}

.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0px 0 8px 0;
}

.title-with-heart {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bank-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.product-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
  flex: 1;
}

.heart-icon {
  font-size: 16px;
  color: #ff4757;
  cursor: pointer;
}

/* 토글 버튼 스타일 */
.toggle-section {
  margin-bottom: 16px;
}

.toggle-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  background-color: #ccc;
  border-radius: 12px;
  transition: background-color 0.3s;
  margin-right: 8px;
}

.toggle-slider:before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle-input:checked + .toggle-slider {
  background-color: var(--color-main);
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.toggle-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 하이라이팅된 용어 스타일 */
:deep(.highlighted-term) {
  background-color: #fff3cd;
  color: #856404;
  padding: 2px 4px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: underline;
  transition: background-color 0.2s;
}

:deep(.highlighted-term:hover) {
  background-color: #ffeaa7;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  min-width: 80px;
  flex-shrink: 0;
}

.detail-value {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  flex: 1;
  margin-left: 16px;
}

.chart-section {
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  text-align: center;
}

.action-section {
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-top: 20px;
}

.action-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.action-subtext {
  font-size: 12px;
  color: #666;
  margin-bottom: 16px;
}

.action-btn {
  background: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 90%;
  width: 350px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: var(--color-main);
  color: white;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-definition {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin: 0;
}
</style>
