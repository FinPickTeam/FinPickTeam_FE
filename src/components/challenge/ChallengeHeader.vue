<template>
  <header class="challenge-header">
    <div class="header-left">
      <button class="icon-btn" @click="goBack">
        <i class="fas fa-chevron-left"></i>
      </button>
      <h1 v-if="title" class="header-title">{{ title }}</h1>
    </div>

    <div class="header-icons">
      <button class="icon-btn" @click="goToCreate">
        <i class="fas fa-pen-to-square"></i>
      </button>
      <button class="icon-btn" @click="goToRanking">
        <i class="fas fa-landmark"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});

const router = useRouter();

const goBack = () => router.back();
const goToCreate = () => router.push('/challenge2/create'); // 원하는 경로로 수정
const goToRanking = () => router.push('/challenge2/ranking'); // 원하는 경로로 수정
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

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: white;
  cursor: pointer;
  padding: 6px;
}

.header-title {
  color: white;
  font-size: 18px;
  font-weight: bold;
  font-family: var(--font-main);
  margin: 0;
}

.header-icons {
  display: flex;
  gap: 12px;
}
</style>
