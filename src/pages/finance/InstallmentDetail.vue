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
          :src="getLogoUrl(product.installmentBankName)"
          :alt="`${product.installmentBankName} 로고`"
          class="bank-logo"
        />
        <h1 class="product-title">{{ product.installmentProductName }}</h1>
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

    <!-- 요약 계산 섹션 -->
    <div class="summary-section" v-if="product.installmentProductName">
      <div class="summary-box">
        <FinancialTermSystem
          :text="summaryText"
          :financial-terms="financialTerms"
          :is-enabled="isHighlightEnabled"
        />
      </div>
    </div>

    <!-- 상세 정보 섹션 -->
    <div class="detail-section" v-if="product.installmentProductName">
      <div class="detail-card">
        <div class="detail-item">
          <span class="detail-label">
            <FinancialTermSystem
              text="상품특징"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
          <span class="detail-value">
            <FinancialTermSystem
              :text="product.installmentProductFeatures"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">
            <FinancialTermSystem
              text="계약기간"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
          <span class="detail-value">
            <FinancialTermSystem
              :text="product.installmentContractPeriod"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">
            <FinancialTermSystem
              text="가입금액"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
          <span class="detail-value">
            <FinancialTermSystem
              :text="product.installmentSubscriptionAmount"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">
            <FinancialTermSystem
              text="금리"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
          <span class="detail-value">
            <FinancialTermSystem
              :text="rateText"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">
            <FinancialTermSystem
              text="우대 이율"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
          <span class="detail-value">
            <FinancialTermSystem
              :text="product.installmentPreferentialRate"
              :financial-terms="financialTerms"
              :is-enabled="isHighlightEnabled"
            />
          </span>
        </div>
      </div>
    </div>

    <!-- 이동하기 버튼 -->
    <div class="action-section" v-if="product.installmentProductName">
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
    const response = await fetch(
      '/src/components/finance/installment/installment_all.json'
    );
    const allProducts = await response.json();

    // URL 파라미터의 상품명과 일치하는 상품 찾기
    const requestedProductName = route.params.id;
    const foundProduct = allProducts.data.find(
      (product) => product.installmentProductName === requestedProductName
    );

    if (foundProduct) {
      // 상세 정보를 위해 installment_detail.json도 로드
      try {
        const detailResponse = await fetch(
          '/src/components/finance/installment/installment_detail.json'
        );
        const detailData = await detailResponse.json();

        // 상세 정보의 상품명과 요청된 상품명이 일치하는지 확인
        if (detailData.data.installmentProductName === requestedProductName) {
          // 상세 정보와 기본 정보를 합침
          product.value = {
            ...foundProduct,
            ...detailData.data,
          };
          isLoading.value = false;
        } else {
          // 상세 정보가 없거나 상품명이 일치하지 않으면 404 페이지로 리다이렉트
          router.push('/404');
          return;
        }
      } catch (detailError) {
        // 상세 정보 로드 실패 시에도 404 페이지로 리다이렉트
        router.push('/404');
        return;
      }
    } else {
      // 상품을 찾지 못했으면 404 페이지로 리다이렉트
      router.push('/404');
      return;
    }
  } catch (error) {
    console.error('상품 데이터 로드 실패:', error);
    // 에러 발생 시에도 404 페이지로 리다이렉트
    router.push('/404');
    return;
  }
};

// 투자 조건
const investmentAmount = ref(100000000); // 1억원
const selectedPeriod = ref(12); // 12개월

// 계산된 값들
const totalAmount = computed(() => {
  if (!product.value.installmentMaxRate) return 0;
  const rate = product.value.installmentMaxRate / 100;
  const months = selectedPeriod.value;
  return Math.floor(investmentAmount.value * (1 + (rate * months) / 12));
});

// 요약 텍스트
const summaryText = computed(() => {
  if (!product.value.installmentMaxRate) {
    return `${investmentAmount.value.toLocaleString()}원을 ${
      selectedPeriod.value
    }개월 동안 투자하면 수익을 계산할 수 없습니다.`;
  }
  return `${investmentAmount.value.toLocaleString()}원을 ${
    selectedPeriod.value
  }개월 동안 투자하면 최대${totalAmount.value.toLocaleString()}원수령하실 수 있습니다.`;
});

// 금리 텍스트
const rateText = computed(() => {
  if (
    !product.value.installmentBasicRate ||
    !product.value.installmentMaxRate
  ) {
    return '금리 정보를 불러오는 중입니다.';
  }
  return `(${selectedPeriod.value}개월 기준) 기본 ${product.value.installmentBasicRate}% 최고 ${product.value.installmentMaxRate}%`;
});

// 찜하기 상태
const isFavorite = computed(() => {
  return favoriteStore.isFavorite(product.value);
});

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
  window.open(product.value.installmentLink, '_blank');
}

const bankLogoMap = {
  KB국민은행: 'KB국민은행.png',
  NH농협은행: 'NH농협은행.png',
  IBK기업은행: 'IBK기업은행.png',
  KDB산업은행: 'KDB산업은행.png',
  SC제일은행: 'SC제일은행.png',
  수협은행: '수협은행.png',
  우리은행: '우리은행.png',
  하나은행: '하나은행.png',
  카카오뱅크: '카카오뱅크.png',
  케이뱅크: '케이뱅크.png',
  토스뱅크: '토스뱅크.png',
  iM뱅크: 'iM뱅크.png',
  광주은행: '광주은행, 전북은행.png',
  전북은행: '광주은행, 전북은행.png',
  신한은행: '신한은행, 제주은행.png',
  제주은행: '신한은행, 제주은행.png',
  경남은행: '경남은행, 부산은행.png',
  부산은행: '경남은행, 부산은행.png',
};

const getLogoUrl = (bankName) => {
  if (!bankName) {
    return '/src/assets/bank_logo/KB국민은행.png';
  }
  const fileName = bankLogoMap[bankName];
  if (!fileName) {
    return '/src/assets/bank_logo/KB국민은행.png';
  }
  return `/src/assets/bank_logo/${fileName}`;
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

.summary-section {
  margin-bottom: 20px;
}

.summary-box {
  background: var(--color-bg);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.summary-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.highlight {
  font-size: var(--font-size-body-large);
  font-weight: var(--font-weight-bold);
  color: var(--color-main);
  padding: 2px 0px;
  border-radius: 4px;
}

.total-amount {
  font-size: var(--font-size-body-large);
  font-weight: var(--font-weight-bold);
  color: var(--color-main);
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
