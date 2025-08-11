<template>
  <teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <!-- 경고 아이콘 -->
        <div class="warning-icon">
          <div class="warning-circle">
            <span class="warning-exclamation">!</span>
          </div>
        </div>

        <!-- 제목 -->
        <h2 class="modal-title">챌린지 참여 제한</h2>

        <!-- 참여 현황 정보 -->
        <div class="participation-info">
          <div class="info-item">
            <span class="info-label">개인 챌린지</span>
            <span class="info-value">{{ personalCount }}/3</span>
          </div>
          <div class="info-item">
            <span class="info-label">소그룹 챌린지</span>
            <span class="info-value">{{ groupCount }}/3</span>
          </div>
        </div>

        <!-- 안내 메시지 -->
        <div class="info-message">
          <p class="info-description">
            개인 챌린지와 소그룹 챌린지는 각각 최대 3개까지 참여할 수
            있습니다.<br />
            새로운 챌린지를 생성하려면 기존 챌린지를 완료해주세요.
          </p>
        </div>

        <!-- 액션 버튼들 -->
        <div class="modal-actions">
          <button class="btn btn-cancel" @click="handleCancel">확인</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  isVisible: { type: Boolean, default: false },
  personalCount: { type: Number, default: 0 },
  groupCount: { type: Number, default: 0 },
});

const emit = defineEmits(['close']);

const handleOverlayClick = () => {
  emit('close');
};
const handleCancel = () => {
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

.warning-icon {
  margin-bottom: 16px;
}

.warning-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.warning-exclamation {
  color: white;
  font-size: 40px;
  font-weight: bold;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #222;
  margin: 0 0 20px 0;
}

.participation-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.info-item:first-child {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 12px;
  margin-bottom: 8px;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #4318d1;
}

.info-message {
  margin-bottom: 24px;
}

.info-description {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: linear-gradient(
    135deg,
    var(--color-main),
    var(--color-main-dark)
  );
  color: white;
}

.btn-cancel:hover {
  background-color: #3b16b8;
}
</style>
