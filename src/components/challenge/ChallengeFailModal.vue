<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">챌린지 실패</h2>
      </div>

      <div class="modal-body">
        <div class="fail-icon">
          <div class="fail-circle">
            <span class="fail-x">✕</span>
          </div>
        </div>

        <div class="fail-message">
          <h3 class="fail-title">{{ challengeTitle }}</h3>
          <p class="fail-description">
            아쉽게도 챌린지 목표를 달성하지 못했습니다.<br />
            하지만 포기하지 마세요! 다시 도전해보세요.
          </p>
        </div>

        <div class="fail-stats">
          <div class="stat-item">
            <span class="stat-label">목표 달성률</span>
            <span class="stat-value"
              >{{ Math.round(progressRate * 100) }}%</span
            >
          </div>
          <div class="stat-item">
            <span class="stat-label">목표 금액</span>
            <span class="stat-value">{{ goalValue.toLocaleString() }}원</span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="retry-button" @click="handleRetry">다시 도전하기</button>
        <button class="home-button" @click="handleGoHome">
          홈으로 돌아가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  challengeTitle: {
    type: String,
    default: '챌린지',
  },
  progressRate: {
    type: Number,
    default: 0,
  },
  goalValue: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['close', 'retry']);

const handleOverlayClick = () => {
  emit('close');
};

const handleRetry = () => {
  emit('retry');
};

const handleGoHome = () => {
  router.push('/challenge');
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 24px 24px 0 24px;
  text-align: center;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.modal-body {
  padding: 24px;
}

.fail-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.fail-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.fail-x {
  font-size: 40px;
  color: white;
  font-weight: bold;
}

.fail-message {
  text-align: center;
  margin-bottom: 24px;
}

.fail-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px 0;
}

.fail-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.fail-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.modal-footer {
  padding: 0 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.retry-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(
    to right,
    var(--color-main),
    var(--color-main-light)
  );
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.retry-button:hover {
  transform: translateY(-2px);
}

.home-button {
  width: 100%;
  padding: 16px;
  background-color: #f8f9fa;
  color: #666;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.home-button:hover {
  background-color: #e9ecef;
}

/* 애니메이션 */
.modal-overlay {
  animation: fadeIn 0.3s ease;
}

.modal-content {
  animation: slideIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
