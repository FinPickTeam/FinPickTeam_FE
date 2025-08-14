<template>
  <Teleport to="body">
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <!-- 축하 애니메이션 배경 -->
        <div class="celebration-bg">
          <div class="confetti confetti-1"></div>
          <div class="confetti confetti-2"></div>
          <div class="confetti confetti-3"></div>
          <div class="confetti confetti-4"></div>
          <div class="confetti confetti-5"></div>
        </div>

        <!-- 메인 콘텐츠 -->
        <div class="modal-body">
          <!-- 축하 아이콘 -->
          <div class="celebration-icon">
            <div class="icon-circle">
              <i class="fas fa-gift"></i>
            </div>
          </div>

          <!-- 제목 -->
          <h2 class="modal-title">가입을 축하합니다!</h2>

          <!-- 포인트 정보 -->
          <div class="points-info">
            <div class="points-amount">
              <span class="amount-number">+100P</span>
            </div>
            <p class="points-description">가입 축하 포인트가 지급되었습니다!</p>
          </div>

          <!-- 버튼 -->
          <div class="modal-actions">
            <button class="btn-primary" @click="closeModal">확인</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  border-radius: 20px;
  padding: 0;
  max-width: 320px;
  width: 90%;
  position: relative;
  overflow: hidden;
  transform: scale(1);
  opacity: 1;
  transition: all 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.celebration-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #ffd700;
  animation: confetti-fall 3s linear infinite;
}

.confetti-1 {
  left: 10%;
  animation-delay: 0s;
  background: #ff6b6b;
}

.confetti-2 {
  left: 30%;
  animation-delay: 0.5s;
  background: #4ecdc4;
}

.confetti-3 {
  left: 50%;
  animation-delay: 1s;
  background: #45b7d1;
}

.confetti-4 {
  left: 70%;
  animation-delay: 1.5s;
  background: #96ceb4;
}

.confetti-5 {
  left: 90%;
  animation-delay: 2s;
  background: #feca57;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(400px) rotate(360deg);
    opacity: 0;
  }
}

.modal-body {
  padding: 32px 24px;
  text-align: center;
  position: relative;
}

.celebration-icon {
  margin-bottom: 20px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.icon-circle i {
  font-size: 36px;
  color: #ffffff;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.modal-title {
  color: #000;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 24px 0;
}

.points-info {
  margin-bottom: 32px;
}

.points-amount {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 12px;
}

.amount-number {
  font-size: 48px;
  font-weight: 900;
  color: var(--color-main);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.amount-unit {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-main-light-2);
  margin-left: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.points-description {
  color: #666;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
}

.usage-guide {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.guide-title {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  text-align: center;
}

.guide-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guide-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.guide-item i {
  width: 20px;
  color: var(--color-main-light-2);
  font-size: 16px;
}

.modal-actions {
  display: flex;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(169, 154, 254, 0.3);
  min-width: 120px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(169, 154, 254, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .modal-content {
    max-width: 300px;
    width: 95%;
  }

  .modal-body {
    padding: 24px 20px;
  }

  .modal-title {
    font-size: 20px;
  }

  .amount-number {
    font-size: 40px;
  }

  .amount-unit {
    font-size: 20px;
  }
}
</style>
