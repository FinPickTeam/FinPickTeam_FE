<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <!-- 제목 -->
      <h2 class="modal-title">챌린지 성공🎉</h2>
      <!-- 성공 아이콘 -->
      <div class="success-icon">
        <i class="fas fa-trophy"></i>
      </div>

      <!-- 챌린지 정보 -->
      <div class="challenge-info">
        <h3 class="challenge-title">
          <span class="highlight-amount"
            >{{ challengeResult.savedAmount.toLocaleString() }}원</span
          >을 아꼈어요
        </h3>
        <p class="success-description">
          축하합니다! 챌린지 목표를 달성했습니다.<br />
          당신의 노력이 빛나는 순간입니다!
        </p>
      </div>

      <!-- 보상 정보 -->

      <div class="stock-card">
        <div class="stock-header">
          <div class="stock-info">
            <h5 class="stock-name">
              {{ challengeResult.stockRecommendation.stockName }}
            </h5>
            <p class="stock-code">
              {{ challengeResult.stockRecommendation.stockCode }}
            </p>
          </div>
          <div class="stock-price">
            <span class="current-price"
              >{{
                challengeResult.stockRecommendation.currentPrice.toLocaleString()
              }}원</span
            >
            <span
              class="price-change"
              :class="{
                positive: challengeResult.stockRecommendation.priceChange > 0,
                negative: challengeResult.stockRecommendation.priceChange < 0,
              }"
            >
              {{ challengeResult.stockRecommendation.priceChange > 0 ? '+' : ''
              }}{{
                challengeResult.stockRecommendation.priceChange.toLocaleString()
              }}원 ({{
                challengeResult.stockRecommendation.priceChangeRate > 0
                  ? '+'
                  : ''
              }}{{
                challengeResult.stockRecommendation.priceChangeRate.toFixed(2)
              }}%)
            </span>
          </div>
        </div>
      </div>
      <!-- 보상 정보 -->

      <div class="reward-card">
        <i class="fas fa-coins"></i>
        <span>{{ challengeResult.actualRewardPoint }} 포인트 보상</span>
      </div>

      <!-- 액션 버튼들 -->
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
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  challenge: {
    type: Object,
    default: () => ({
      title: '매일 5천원 저축하기',
      description: '매일 5천원씩 저축하여 30일 동안 15만원 모으기',
      targetAmount: 150000,
      currentAmount: 150000,
      duration: 30,
    }),
  },
  challengeResult: {
    type: Object,
    default: () => ({
      resultType: 'SUCCESS_WIN',
      actualRewardPoint: 110,
      savedAmount: 450000,
      stockRecommendation: null,
    }),
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const goToNextChallenge = () => {
  closeModal();
  router.push('/challenge/recruiting-list');
};
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

/* .reward-section {
  margin-bottom: 32px;
  padding: 20px;
  background: var(--color-bg-light);
  border-radius: 12px;
} */

.stock-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stock-info {
  text-align: left;
}

.stock-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 4px 0;
}

.stock-code {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.stock-price {
  text-align: right;
}

.current-price {
  font-size: 20px;
  font-weight: bold;
  color: var(--color-main);
}

.price-change {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.price-change.positive {
  color: var(--color-success);
}

.price-change.negative {
  color: var(--color-danger);
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
