<template>
  <div class="mypage-container">
    <main class="main-content">
      <h1>찜한 상품</h1>
      <ProductCardList_deposit :products="favorites" />
    </main>
  </div>
</template>

<script setup>
import { useFavoriteStore } from '@/stores/favorite.js';
import ProductCardList_deposit from '@/components/finance/deposit/ProductCardList_deposit.vue';
const favoriteStore = useFavoriteStore();
const favorites = favoriteStore.favorites;
</script>
