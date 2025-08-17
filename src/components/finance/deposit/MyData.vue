<template>
  <div v-if="open" class="modal-backdrop" @click.self="close">
    <div class="modal">
      <div class="modal-header">
        <div class="icon-container">
          <i class="fas fa-database"></i>
        </div>
        <h3 class="modal-title">마이데이터 연동</h3>
        <button class="close-btn" @click="close">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-content">
        <p class="modal-description">
          마이데이터를 연동하면<br />
          <strong>더 정확한 맞춤 추천</strong>을 받을 수 있어요
        </p>
      </div>

      <div class="modal-actions">
        <button class="btn-primary" @click="goToOpenBanking">
          <i class="fas fa-link"></i>
          연동하기
        </button>
        <button class="btn-secondary" @click="close">나중에 하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const props = defineProps({
  open: { type: Boolean, default: false },
});
const emits = defineEmits(['close']);
const router = useRouter();

function close() {
  emits('close');
}

function goToOpenBanking() {
  close();
  router.push('/openbanking');
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

.modal {
  background: #fff;
  border-radius: 20px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  background: #fff;
  color: var(--color-main, #6b46c1);
  padding: 24px 24px 20px;
  position: relative;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}

.icon-container {
  width: 60px;
  height: 60px;
  background: var(--color-main, #6b46c1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.icon-container i {
  font-size: 24px;
  color: white;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
  color: var(--color-main, #6b46c1);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: var(--color-main, #6b46c1);
  transform: scale(1.1);
}

.modal-content {
  padding: 24px;
}

.modal-description {
  font-size: 16px;
  color: #374151;
  margin: 0 0 24px;
  line-height: 1.6;
  text-align: center;
}

.modal-description strong {
  color: var(--color-main, #6b46c1);
  font-weight: 600;
}

.modal-actions {
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-primary {
  background: var(--color-main, #6b46c1);
  color: white;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(107, 70, 193, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(107, 70, 193, 0.5);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: #f3f4f6;
  color: #6b7280;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #e5e7eb;
  color: #374151;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .modal {
    width: 95%;
    margin: 20px;
  }

  .modal-header {
    padding: 20px 20px 16px;
  }

  .modal-content {
    padding: 20px;
  }

  .modal-actions {
    padding: 0 20px 20px;
  }

  .icon-container {
    width: 50px;
    height: 50px;
  }

  .icon-container i {
    font-size: 20px;
  }

  .modal-title {
    font-size: 18px;
  }
}
</style>
