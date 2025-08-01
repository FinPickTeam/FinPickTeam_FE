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

    <!-- 요약 계산 섹션 -->
    <div class="summary-section">
      <div class="summary-box">
        <span class="summary-text">
          <span class="highlight"
            >{{ investmentAmount.toLocaleString() }}원</span
          >을 <span class="highlight">{{ selectedPeriod }}개월</span> 동안
          투자하면
          <span class="total-amount">{{ totalAmount.toLocaleString() }}원</span
          >을 받을 수 있습니다.
        </span>
      </div>
    </div>

    <!-- 상세 정보 섹션 -->
    <div class="detail-section">
      <div class="detail-card">
        <div class="detail-item">
          <span class="detail-label">펀드 특징</span>
          <span class="detail-value">{{ product.fundProductFeatures }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">펀드 타입</span>
          <span class="detail-value">{{ product.fundType }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">위험도</span>
          <span class="detail-value">{{ product.fundRiskLevel }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">3개월 수익률</span>
          <span class="detail-value">{{
            getReturnValue(product.fund3MonthReturn)
          }}</span>
        </div>
      </div>
    </div>

    <!-- 이동하기 버튼 -->
    <div class="action-section">
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

const route = useRoute();
const router = useRouter();
const favoriteStore = useFavoriteStore();

// 상품 데이터
const product = ref({});

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

// 투자 조건
const investmentAmount = ref(100000000); // 1억원
const selectedPeriod = ref(12); // 12개월

// 계산된 값들
const totalAmount = computed(() => {
  const rate = product.value.fund3MonthReturn / 100;
  const months = selectedPeriod.value;
  return Math.floor(investmentAmount.value * (1 + (rate * months) / 12));
});

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
