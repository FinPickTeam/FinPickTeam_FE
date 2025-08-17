<template>
  <div v-if="open" class="modal-backdrop" @click.self="close">
    <div class="modal">
      <h3 class="modal-title">마이데이터 연동 안내</h3>
      <p class="modal-text">
        마이데이터를 연동하면<br />
        더 정확한 추천을 받을 수 있어요.
      </p>
      <div class="modal-actions">
        <button class="btn-primary" @click="goToOpenBanking">연동하기</button>
        <button class="btn-secondary" @click="close">닫기</button>
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
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}
.modal-text {
  font-size: 14px;
  color: #444;
  margin-bottom: 20px;
  line-height: 1.4;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.btn-primary {
  flex: 1;
  background: #4a3aff;
  color: #fff;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.btn-secondary {
  flex: 1;
  background: #f1f3f5;
  color: #333;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
</style>
