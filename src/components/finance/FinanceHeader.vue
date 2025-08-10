<template>
  <header class="finance-header">
    <button class="icon-btn back-btn" @click="goBack">
      <i class="fas fa-chevron-left"></i>
    </button>
    <div class="header-icons">
      <button class="icon-btn" @click="goToDictionary">
        <i class="fas fa-search"></i>
      </button>
      <button class="icon-btn heart-btn" @click="toggleFavorite">
        <i
          :class="['fas', isFavorite ? 'fa-heart' : 'fa-heart']"
          style="color: #e25a5a"
        ></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isFavorite = ref(true); // 하트 활성화 여부(임시)

const goBack = () => {
  // 상세 페이지인 경우 이전 페이지로 이동
  if (router.currentRoute.value.name?.includes('Detail')) {
    router.back();
  } else {
    // 메인 금융 페이지인 경우 홈으로 이동
    router.push('/');
  }
};
const goToDictionary = () => {
  router.push('/dictionary');
};
const toggleFavorite = () => {
  router.push('/finance/favorite-products');
};
</script>

<style scoped>
.finance-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 390px;
  background: var(--color-bg-light);
  min-height: 80px;
  z-index: 100;
}
.icon-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
}
.back-btn {
  margin-left: 10px;
}
.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--font-size-title-main);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  letter-spacing: 1px;
}
.header-icons {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  padding-right: 15px;
}
.heart-btn i {
  color: #e25a5a;
  font-size: 24px;
}
</style>
