<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <!-- 제목 -->
      <h2 class="modal-title">챌린지 실패</h2>
      <div class="fail-icon">
        <div class="fail-circle">
          <span class="fail-x">✕</span>
        </div>
      </div>

      <div class="fail-message">
        <p class="fail-description">
          아쉽게도 챌린지 목표를 달성하지 못했습니다.<br />
          하지만 포기하지 마세요! 다시 도전해보세요.
        </p>
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
  challengeResult: {
    type: Object,
    default: () => ({
      resultType: 'FAIL',
      actualRewardPoint: 0,
      savedAmount: 0,
      stockRecommendation: null,
    }),
  },
});

const emit = defineEmits(['close']);

const handleOverlayClick = () => {
  emit('close');
};

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
  background-color: rgba(0, 0, 0, 0.5);
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

.modal-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 20px 0;
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
  margin-bottom: 24px;
}

.fail-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
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
