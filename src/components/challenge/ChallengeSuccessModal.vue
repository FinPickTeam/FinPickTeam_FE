<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">챌린지 성공</h2>

      <div class="success-icon">
        <i class="fas fa-trophy"></i>
      </div>

      <div class="challenge-info">
        <h3 class="challenge-title">
          <span class="highlight-amount">
            {{
              Number(challengeResult?.savedAmount || 0).toLocaleString()
            }}원 </span
          >을 아꼈어요
        </h3>
        <p class="success-description">
          축하합니다! 챌린지 목표를 달성했습니다.<br />
          당신의 노력이 빛나는 순간입니다!
        </p>
      </div>

      <!-- 추천 주식 (있을 때만) -->
      <div
        v-if="challengeResult?.stockRecommendation"
        class="stock-recommendation"
      >
        <h4 class="recommendation-title">추천 주식</h4>
        <div class="stock-card" @click="goToStockDetail">
          <div class="stock-logo">
            <img
              v-if="challengeResult.stockRecommendation.stockLogoUrl"
              :src="challengeResult.stockRecommendation.stockLogoUrl"
              :alt="challengeResult.stockRecommendation.stockName + ' 로고'"
              class="logo-image"
            />
            <div v-else class="logo-placeholder">
              <i class="fas fa-building"></i>
            </div>
          </div>

          <div class="stock-info">
            <div class="stock-header">
              <span class="stock-name">{{
                challengeResult.stockRecommendation.stockName
              }}</span>
              <span class="stock-summary">{{
                challengeResult.stockRecommendation.stockSummary
              }}</span>
            </div>

            <div class="stock-main">
              <span class="stock-price" :class="{ up: isUp, down: isDown }">
                {{ displayPrice }}
              </span>
            </div>

            <div class="stock-footer">
              <span class="stock-change" :class="{ up: isUp, down: isDown }">
                <span class="stock-change-label">전일대비</span>
                <span class="stock-change-gap">{{ displayChange }}</span>
                <span class="stock-rate">{{ displayRate }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 보상 정보 -->
      <div class="reward-card">
        <i class="fas fa-coins"></i>
        <span
          >{{
            Number(challengeResult?.actualRewardPoint || 0).toLocaleString()
          }}
          포인트 보상</span
        >
      </div>

      <div class="modal-actions">
        <button class="btn btn-secondary" @click="closeModal">
          <i class="fas fa-times"></i>
          닫기
        </button>
        <button class="btn btn-primary" @click="goToNextChallenge">
          다음 챌린지 시작
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  // ✅ 예시 기본값 제거, 실제 API 결과만 받도록 강제
  challengeResult: { type: Object, required: true },
});

const emit = defineEmits(['close']);
const closeModal = () => emit('close');
const goToNextChallenge = () => {
  closeModal();
  router.push('/challenge/recruiting-list');
};

const goToStockDetail = () => {
  const stockCode = props.challengeResult?.stockRecommendation?.stockCode;
  if (stockCode) {
    closeModal();
    router.push(`/finance/stock/${stockCode}`);
  }
};

const handleOverlayClick = () => closeModal();

/** 가격/등락률 포맷 */
const displayPrice = computed(() => {
  const price = props.challengeResult?.stockRecommendation?.stockPrice;
  const numericPrice =
    typeof price === 'string' ? Number(price.replace(/[+-]/, '')) : price;
  return Number(numericPrice || 0).toLocaleString();
});

const isUp = computed(() => {
  const rate = String(
    props.challengeResult?.stockRecommendation?.stockChangeRate ?? ''
  );
  return (
    rate.startsWith('+') || (!rate.startsWith('-') && parseFloat(rate) > 0)
  );
});

const isDown = computed(() => {
  const rate = String(
    props.challengeResult?.stockRecommendation?.stockChangeRate ?? ''
  );
  return (
    rate.startsWith('-') || (!rate.startsWith('+') && parseFloat(rate) < 0)
  );
});

const displayChange = computed(() => {
  const predictedPrice = String(
    props.challengeResult?.stockRecommendation?.stockPredictedPrice ?? ''
  );
  const isPositive = predictedPrice.startsWith('+');
  const numericValue = predictedPrice.replace(/[+-]/g, '');
  return (isPositive ? '▲' : '▼') + ' ' + numericValue;
});

const displayRate = computed(() => {
  const rate = String(
    props.challengeResult?.stockRecommendation?.stockChangeRate ?? ''
  );
  if (rate.startsWith('+') || rate.startsWith('-')) return rate + '%';
  if (rate === '' || isNaN(Number(rate))) return '';
  return '+' + rate + '%';
});

// 실제 데이터 확인을 위한 로깅 (computed 값들 뒤에 배치)
watch(
  () => props.challengeResult,
  (newResult) => {
    console.log('=== ChallengeSuccessModal - challengeResult 데이터 ===');
    console.log('전체 challengeResult:', newResult);
    console.log('stockRecommendation:', newResult?.stockRecommendation);

    if (newResult?.stockRecommendation) {
      console.log('주식 추천 상세 데이터:');
      console.log('- stockName:', newResult.stockRecommendation.stockName);
      console.log('- stockCode:', newResult.stockRecommendation.stockCode);
      console.log('- stockPrice:', newResult.stockRecommendation.stockPrice);
      console.log(
        '- stockPredictedPrice:',
        newResult.stockRecommendation.stockPredictedPrice
      );
      console.log(
        '- stockChangeRate:',
        newResult.stockRecommendation.stockChangeRate
      );
      console.log(
        '- stockSummary:',
        newResult.stockRecommendation.stockSummary
      );
      console.log(
        '- stockLogoUrl:',
        newResult.stockRecommendation.stockLogoUrl
      );
    } else {
      console.log(
        '⚠️ stockRecommendation이 없습니다. 주식 추천 카드가 표시되지 않습니다.'
      );
    }

    console.log('=== computed 값들 ===');
    console.log('- displayPrice:', displayPrice.value);
    console.log('- isUp:', isUp.value);
    console.log('- isDown:', isDown.value);
    console.log('- displayChange:', displayChange.value);
    console.log('- displayRate:', displayRate.value);
    console.log('==========================================');
  },
  { immediate: true }
);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  max-width: 400px;
  width: 100%;
  position: relative;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
}

.success-icon i {
  font-size: 36px;
  color: #fff;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 20px 0;
}

.challenge-info {
  margin-bottom: 24px;
}

.challenge-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.success-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.highlight-amount {
  color: var(--color-main);
  font-weight: bold;
  font-size: 20px;
}

.reward-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
  border: 2px solid #ffd700;
}

.reward-card i {
  font-size: 18px;
  color: #ffd700;
}

.reward-card span {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.stock-recommendation {
  margin-bottom: 24px;
}

.recommendation-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px 0;
  text-align: left;
}

.stock-card {
  display: flex;
  align-items: center;
  background: var(--color-bg);
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 #0002;
  padding: 10px 18px;
  width: 100%;
  font-family: var(--font-main);
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.stock-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 #0004;
}

.stock-logo {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: white;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 24px;
}

.stock-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stock-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stock-name {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-title-sub);
  color: var(--color-text);
}

.stock-summary {
  color: #aaa;
  font-size: var(--font-size-body);
}

.stock-main {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.stock-price {
  font-size: var(--font-size-title-main);
  font-weight: bold;
  color: #e11d48;
}

.stock-price.up {
  color: var(--color-accent);
}

.stock-price.down {
  color: var(--color-accent-2);
}

.stock-footer {
  font-size: var(--font-size-body-large);
  color: var(--color-text-light);
  margin-top: 2px;
}

.stock-change.up {
  color: var(--color-accent);
  font-weight: var(--font-weight-bold);
}

.stock-change.down {
  color: var(--color-accent-2);
  font-weight: var(--font-weight-bold);
}

.stock-change-label {
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}

.stock-rate {
  margin-left: 6px;
}

.stock-change-gap {
  margin-left: 6px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(
    135deg,
    var(--color-main),
    var(--color-main-dark)
  );
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(107, 70, 193, 0.3);
}

.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #e9ecef;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
