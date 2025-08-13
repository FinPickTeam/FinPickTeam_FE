<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <!-- 경고 아이콘 -->
      <div class="warning-icon">
        <div class="warning-circle">
          <span class="warning-exclamation">!</span>
        </div>
      </div>

      <!-- 제목 -->
      <h2 class="modal-title">포인트 부족</h2>

      <!-- 포인트 정보 -->
      <div class="points-info">
        <div class="points-detail">
          <div class="detail-item">
            <span class="detail-label">현재 보유 포인트</span>
            <span class="detail-value current-points"
              >{{ currentPoints?.toLocaleString() }}P</span
            >
          </div>
          <div class="detail-item">
            <span class="detail-label">필요 포인트</span>
            <span class="detail-value required-points"
              >{{ requiredPoints?.toLocaleString() }}P</span
            >
          </div>
          <div class="detail-item">
            <span class="detail-label">부족한 포인트</span>
            <span class="detail-value insufficient-points"
              >{{ insufficientAmount?.toLocaleString() }}P</span
            >
          </div>
        </div>
      </div>

      <!-- 안내 메시지 -->
      <div class="info-message">
        <p class="info-description">
          챌린지 생성에 필요한 포인트가 부족합니다.<br />
          다른 챌린지에 참여해보세요!
        </p>
      </div>

      <!-- 액션 버튼들 -->
      <div class="modal-actions">
        <button class="btn btn-cancel" @click="handleCancel">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  currentPoints: {
    type: Number,
    default: 0,
  },
  requiredPoints: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['close', 'charge']);

const insufficientAmount = computed(() => {
  return Math.max(0, props.requiredPoints - props.currentPoints);
});

const handleOverlayClick = () => {
  emit('close');
};

const handleCancel = () => {
  emit('close');
};

const handleCharge = () => {
  emit('charge');
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
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.warning-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.warning-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff9800, #ffb74d);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(255, 152, 0, 0.3);
  animation: pulse 0.6s ease;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.warning-exclamation {
  font-size: 36px;
  color: white;
  font-weight: bold;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 20px 0;
  font-family: var(--font-main);
}

.points-info {
  background: #fff3e0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  text-align: left;
}

.points-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ffe0b2;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: #666;
  font-family: var(--font-main);
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-main);
}

.current-points {
  color: #4caf50;
}

.required-points {
  color: #2196f3;
}

.insufficient-points {
  color: #f44336;
  font-weight: 700;
}

.info-message {
  margin-bottom: 32px;
}

.info-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  font-family: var(--font-main);
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cancel {
  background: #f1f3f4;
  color: #666;
}

.btn-cancel:hover {
  background: #e8eaed;
  transform: translateY(-1px);
}

.btn-charge {
  background: linear-gradient(135deg, #ff9800, #ffb74d);
  color: white;
}

.btn-charge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}
</style>
