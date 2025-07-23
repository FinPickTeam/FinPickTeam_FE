<template>
  <div class="product-card">
    <!-- 은행 로고 -->
    <div class="bank-logo">
      <img
        src="@/assets/bank_logo/국민은행.png"
        alt="KB 로고"
        class="logo-img"
      />
    </div>
    <!-- 텍스트 정보 -->
    <div class="card-main">
      <div class="card-title-row">
        <span class="product-title">스마트모아Dream정기예금</span>
        <span
          class="heart"
          :class="{ active: isFavorite }"
          @click="toggleFavorite"
          >♥</span
        >
      </div>
      <div class="product-summary">Digital KB의 대표 정기예금</div>
      <div class="product-info-row">12개월 기준</div>
      <div class="rate-row">
        <span class="max-rate">최고 연 2.45%</span>
        <span class="basic-rate">기본 연 2.15%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const isFavorite = ref(false);
function toggleFavorite() {
  isFavorite.value = !isFavorite.value;
}
</script>

<style scoped>
.product-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 #0002;
  padding: 8px 20px 10px 80px; /* 왼쪽 패딩을 로고 공간만큼 확보 */
  width: 350px;
  font-family: var(--font-main);
  margin-bottom: 16px;
}
.bank-logo {
  position: absolute;
  left: 20px;
  top: 10px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 50%;
}
.card-main {
  min-width: 0;
}
.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.product-title {
  font-size: var(--font-size-title-sub);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}
.heart {
  color: var(--color-bg-accent);
  font-size: 30px;
  cursor: pointer;
  margin-left: 8px;
  user-select: none;
  transition: color 0.2s;
}
.heart.active {
  color: #e11d48;
}
.product-summary {
  font-size: 0.98rem;
  color: #888;
  margin-bottom: 2px;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
.product-info-row {
  font-size: 0.92rem;
  color: #8e74e3;
  margin-bottom: 2px;
  margin-top: 2px;
}
.rate-row {
  display: flex;
  gap: 16px;
  align-items: baseline;
  margin-top: 2px;
}
.max-rate {
  color: #7c3aed;
  font-size: 1.02rem;
  font-weight: 600;
}
.basic-rate {
  color: #5b7fff;
  font-size: 1.02rem;
  font-weight: 500;
}
</style>
