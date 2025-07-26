<template>
  <div class="mypage-container">
    <main class="main-content">
      <h1>찜한 상품</h1>

      <!-- 예금 상품 -->
      <div v-if="depositFavorites.length > 0">
        <h2>예금 상품</h2>
        <ProductCardList_deposit :products="depositFavorites" />
      </div>

      <!-- 주식 상품 -->
      <div v-if="stockFavorites.length > 0">
        <h2>주식 상품</h2>
        <ProductCardList_stock :products="stockFavorites" />
      </div>

      <!-- 찜한 상품이 없을 때 -->
      <div
        v-if="depositFavorites.length === 0 && stockFavorites.length === 0"
        class="no-favorites"
      >
        <p>찜한 상품이 없습니다.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFavoriteStore } from '@/stores/favorite.js';
import ProductCardList_deposit from '@/components/finance/deposit/ProductCardList_deposit.vue';
import ProductCardList_stock from '@/components/finance/stock/ProductCardList_stock.vue';

const favoriteStore = useFavoriteStore();

// 예금 상품과 주식 상품을 분리
const depositFavorites = computed(() => {
  return favoriteStore.favorites.filter((item) => item.depositProductName);
});

const stockFavorites = computed(() => {
  return favoriteStore.favorites.filter((item) => item.stockName);
});
</script>

<style scoped>
.mypage-container {
  max-width: 390px;
  margin: 0 auto;
  padding: 16px;
  font-family: var(--font-main);
}

.main-content {
  min-height: calc(100vh - 120px);
}

h1 {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-text);
  margin-bottom: 20px;
  text-align: center;
}

h2 {
  font-size: 18px;
  font-weight: bold;
  color: var(--color-main);
  margin: 20px 0 10px 0;
}

.no-favorites {
  text-align: center;
  margin-top: 50px;
  color: var(--color-text-light);
}

.no-favorites p {
  font-size: 16px;
}
</style>
