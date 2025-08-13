<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <!-- 확인 아이콘 -->
      <div class="confirm-icon">
        <div class="confirm-circle">
          <span class="confirm-question">?</span>
        </div>
      </div>

      <!-- 제목 -->
      <h2 class="modal-title">챌린지 참여 확인</h2>

      <!-- 챌린지 정보 -->
      <div class="challenge-preview" v-if="challenge">
        <h3 class="challenge-name">{{ challenge.title }}</h3>
        <div class="challenge-details">
          <div class="detail-item">
            <span class="detail-label">목표 금액</span>
            <span class="detail-value"
              >{{ challenge.goalValue?.toLocaleString() }}원</span
            >
          </div>
          <div class="detail-item">
            <span class="detail-label">참여 기간</span>
            <span class="detail-value">{{
              formatDateRange(challenge.startDate, challenge.endDate)
            }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">현재 참여자</span>
            <span class="detail-value"
              >{{ challenge.participantsCount?.toLocaleString() }}명</span
            >
          </div>
        </div>
      </div>

      <!-- 확인 메시지 -->
      <div class="confirm-message">
        <p class="confirm-description">
          이 챌린지에 참여하시겠습니까?<br />
          참여 후에는 목표 달성을 위해 함께 노력해주세요!
        </p>
      </div>

      <!-- 액션 버튼들 -->
      <div class="modal-actions">
        <button class="btn btn-cancel" @click="handleCancel">취소</button>
        <button class="btn btn-confirm" @click="handleConfirm">참여하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  challenge: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'confirm']);

const handleOverlayClick = () => {
  emit('close');
};

const handleCancel = () => {
  emit('close');
};

const handleConfirm = () => {
  emit('confirm');
};

const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';

  const start = new Date(startDate);
  const end = new Date(endDate);

  const formatDate = (date) => {
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  return `${formatDate(start)} ~ ${formatDate(end)}`;
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

.confirm-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.confirm-circle {
  width: 80px;
  height: 80px;
  /* background: linear-gradient(135deg, #2196F3, #42A5F5); */
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(33, 150, 243, 0.3);
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

.confirm-question {
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

.challenge-preview {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  text-align: left;
}

.challenge-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
  text-align: center;
  font-family: var(--font-main);
}

.challenge-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
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
  color: #333;
  font-family: var(--font-main);
}

.confirm-message {
  margin-bottom: 32px;
}

.confirm-description {
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

.btn-confirm {
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  color: white;
}

.btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--color-main-rgb), 0.3);
}
</style>
