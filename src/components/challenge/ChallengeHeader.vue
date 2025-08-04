<template>
  <header class="challenge-header">
    <button class="icon-btn" @click="goBack">
      <i class="fas fa-chevron-left"></i>
    </button>

    <div class="header-icons">
      <button class="icon-btn" @click="goToEdit">
        <i class="fas fa-pen-to-square"></i>
      </button>
      <button class="icon-btn" @click="goToDelete">
        <i class="fas fa-landmark"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const goBack = () => router.back();
const goToEdit = () => router.push('/challenge/edit'); // 원하는 경로로 수정
const goToDelete = () => router.push('/challenge/delete'); // 원하는 경로로 수정
</script>

<style scoped>
.challenge-header {
  width: 100%;
  max-width: 390px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to right, #c8c4f8, var(--color-main-dark));
  padding: 0 16px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: white;
  cursor: pointer;
  padding: 6px;
}

.header-icons {
  display: flex;
  gap: 12px;
}
</style>
