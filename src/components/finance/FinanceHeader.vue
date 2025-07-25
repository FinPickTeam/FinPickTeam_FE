<template>
  <header class="finance-header">
    <button class="icon-btn back-btn" @click="goBack">
      <i class="fas fa-chevron-left"></i>
    </button>
    <span class="header-title">재테크</span>
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
  router.back();
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
  position: relative;
  background: var(--color-bg-light);
  padding: 5px 0;
  min-height: 80px;
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
  margin-right: 8px;
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
}
.heart-btn i {
  color: #e25a5a;
  font-size: 24px;
}
</style>
