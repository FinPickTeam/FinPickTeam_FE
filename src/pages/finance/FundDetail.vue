<template>
  <div class="detail-container">
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-section">
      <div class="loading-spinner"></div>
      <p class="loading-text">상품 정보를 불러오는 중...</p>
    </div>

    <!-- 제목과 찜하기 -->
    <div v-else class="title-section">
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
      <!-- 용어 하이라이팅 토글 버튼 -->
      <div v-if="!isLoading" class="toggle-section">
        <label class="toggle-label">
          <input
            type="checkbox"
            v-model="isHighlightEnabled"
            class="toggle-input"
          />
          <span class="toggle-text">단어 마법사</span>
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    <!-- 수익률 차트 섹션 -->
    <div class="chart-section" v-if="product.fundReturnsData && !isLoading">
      <div class="chart-card">
        <h3 class="chart-title">펀드 수익률 추이</h3>
        <FundChart :returnsData="product.fundReturnsData" />
      </div>
    </div>

    <!-- 상세 정보 섹션 -->
    <div class="detail-section" v-if="product.fundProductName">
      <div class="detail-card">
        <div class="detail-item">
          <span class="detail-label">
            <FinancialTermSystem
              text="펀드 특징"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
          <span class="detail-value">
            <FinancialTermSystem
              :text="product.fundProductFeatures"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">
            <FinancialTermSystem
              text="펀드 타입"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
          <span class="detail-value">
            <FinancialTermSystem
              :text="product.fundType"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">
            <FinancialTermSystem
              text="위험도"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
          <span class="detail-value">
            <FinancialTermSystem
              :text="product.fundRiskLevel"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">
            <FinancialTermSystem
              text="3개월 수익률"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
          <span class="detail-value">
            <FinancialTermSystem
              :text="getReturnValue(product.fund3MonthReturn)"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">
            <FinancialTermSystem
              text="설정일"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
          <span class="detail-value">
            <FinancialTermSystem
              :text="product.fundStartDate"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">
            <FinancialTermSystem
              text="순자산"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
          <span class="detail-value">
            <FinancialTermSystem
              :text="product.fundNetAssetValue"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">
            <FinancialTermSystem
              text="총보수비율"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
          <span class="detail-value">
            <FinancialTermSystem
              :text="product.fundTotalExpenseRatio"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
        </div>
      </div>
    </div>

    <!-- 이동하기 버튼 -->
    <div class="action-section" v-if="product.fundProductName">
      <p class="action-text">해당 상품을 보러가고 싶다면?</p>
      <p class="action-subtext">아래를 클릭하면 해당 페이지로 이동해요</p>
      <button class="action-btn" @click="goToProduct">이동하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFavoriteStore } from '@/stores/favorite';
import FundChart from '../../components/finance/fund/FundChart.vue';
import FinancialTermSystem from '@/components/finance/FinancialTermSystem.vue';

const route = useRoute();
const router = useRouter();
const favoriteStore = useFavoriteStore();

// 상품 데이터
const product = ref({});
const isLoading = ref(true);

// 용어 하이라이팅 관련 상태
const isHighlightEnabled = ref(false);
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
          isLoading.value = false;
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

onMounted(async () => {
  console.log('상품 ID:', route.params.id);
  await loadProductData();
  await loadFinancialTerms();
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

/* 로딩 스타일 */
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 14px;
  color: #666;
  margin: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 토글 버튼 스타일 */
.toggle-section {
  margin-bottom: 0;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
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
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 10px;
  transition: background-color 0.3s ease;
  margin-left: 8px;
}

.toggle-slider:before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked ~ .toggle-slider {
  background-color: var(--color-main);
}

.toggle-input:checked ~ .toggle-slider:before {
  transform: translateX(20px);
}

.toggle-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 하이라이팅된 용어 스타일 */
:deep(.highlighted-term) {
  background-color: #ffff00;
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
</style>
