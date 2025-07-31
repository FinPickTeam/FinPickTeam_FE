<template>
  <div class="detail-container">
    <!-- 제목과 찜하기 -->
    <div class="title-section">
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
    </div>

    <!-- 요약 계산 섹션 -->
    <div class="summary-section">
      <div class="summary-box">
        <span class="summary-text">
          <span class="highlight"
            >{{ investmentAmount.toLocaleString() }}원</span
          >을 <span class="highlight">{{ selectedPeriod }}개월</span> 동안
          투자하면 총<span class="total-amount"
            >{{ totalAmount.toLocaleString() }}원</span
          >을 수령하실 수 있습니다.
        </span>
      </div>
    </div>

    <!-- 상세 정보 섹션 -->
    <div class="detail-section">
      <div class="detail-card">
        <div class="detail-item">
          <span class="detail-label">상품특징</span>
          <span class="detail-value">{{
            product.installmentProductFeatures
          }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">계약기간</span>
          <span class="detail-value">{{
            product.installmentContractPeriod
          }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">가입금액</span>
          <span class="detail-value">{{
            product.installmentSubscriptionAmount
          }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">금리</span>
          <span class="detail-value"
            >({{ selectedPeriod }}개월 기준) 기본
            {{ product.installmentBasicRate }}% 최고
            {{ product.installmentMaxRate }}%</span
          >
        </div>
        <div class="detail-item">
          <span class="detail-label">우대 이율</span>
          <span class="detail-value">{{
            product.installmentPreferentialRate
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

// 상품 데이터 (실제로는 API에서 가져올 데이터)
const product = ref({
  installmentBankName: 'KB국민은행',
  installmentProductName: 'KB맑은하늘적금',
  installmentContractPeriod: '1년제, 2년제, 3년제',
  installmentType: '자유적립식',
  installmentSubscriptionAmount: '1만원 이상',
  installmentBasicRate: 2.45,
  installmentMaxRate: 3.25,
  installmentPreferentialRate:
    '맑은하늘을 위한 미션별 제공조건을 달성하는 경우 각 미션별 우대이율 제공 - 1년제 최고 연 0.8%p, 2년제 최고 연 0.9%p, 3년제 최고 연 1.0%p ① 종이통장 줄이기 미션: 연 0.1%p ② 종이서식 줄이기 미션: 연 0.2%p ③ 대중교통 미션: 1년제 연 0.4%p, 2년제 연 0.5%p, 3년제 연 0.6%p ④ 퀴즈미션: 연 0.1%p',
  installmentProductFeatures:
    '맑은하늘을 위한 생활 속 작은 실천에 대해 우대금리를 제공하고, 대중교통/자전거상해 관련 무료 보험서비스(최대 2억원 보장)를 제공하는 친환경 특화 상품',
  installmentSummary: '맑은하늘 만들고 금리도 Up',
  installmentLink:
    'https://obank.kbstar.com/quics?page=C016613&cc=b061496:b061645&isNew=Y&prcode=DP01000942',
});

// 투자 조건
const investmentAmount = ref(100000000); // 1억원
const selectedPeriod = ref(12); // 12개월

// 계산된 값들
const totalAmount = computed(() => {
  const rate = product.value.installmentMaxRate / 100;
  const months = selectedPeriod.value;
  return Math.floor(investmentAmount.value * (1 + (rate * months) / 12));
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

onMounted(() => {
  // 실제로는 route.params.id를 사용해서 API에서 상품 데이터를 가져옴
  console.log('상품 ID:', route.params.id);
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
