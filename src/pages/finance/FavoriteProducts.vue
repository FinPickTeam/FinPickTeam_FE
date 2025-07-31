<template>
  <div class="mypage-container">
    <header class="favorite-header">
      <i class="fa-solid fa-angle-left back-icon" @click="goBack"></i>
      <h1>찜한 상품</h1>
      <div class="header-divider"></div>
    </header>

    <main class="main-content">
      <!-- 예금 상품 -->
      <div v-if="depositFavorites.length > 0">
        <div class="group-title">예금 상품</div>
        <ProductCardList_deposit :products="depositFavorites" />
      </div>

      <!-- 적금 상품 -->
      <div v-if="installmentFavorites.length > 0">
        <div class="group-title">적금 상품</div>
        <ProductCardList_installment :products="installmentFavorites" />
      </div>

      <!-- 주식 상품 -->
      <div v-if="stockFavorites.length > 0">
        <div class="group-title">주식 상품</div>
        <ProductCardList_stock :products="stockFavorites" />
      </div>

      <!-- 펀드 상품 -->
      <div v-if="fundFavorites.length > 0">
        <div class="group-title">펀드 상품</div>
        <ProductCardList_fund :funds="fundFavorites" />
      </div>

      <!-- 찜한 상품이 없을 때 -->
      <div
        v-if="
          depositFavorites.length === 0 &&
          installmentFavorites.length === 0 &&
          stockFavorites.length === 0 &&
          fundFavorites.length === 0
        "
        class="no-favorites"
      >
        <p>찜한 상품이 없습니다.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoriteStore } from '@/stores/favorite.js';
import ProductCardList_deposit from '@/components/finance/deposit/ProductCardList_deposit.vue';
import ProductCardList_stock from '@/components/finance/stock/ProductCardList_stock.vue';
import ProductCardList_fund from '@/components/finance/fund/ProductCardList_fund.vue';
import ProductCardList_installment from '@/components/finance/installment/ProductCardList_installment.vue';

const router = useRouter();
const favoriteStore = useFavoriteStore();

function goBack() {
  router.back();
}

// 예금 상품과 주식 상품을 분리
const depositFavorites = computed(() => {
  return favoriteStore.favorites.filter((item) => item.depositProductName);
});

const stockFavorites = computed(() => {
  return favoriteStore.favorites.filter((item) => item.stockName);
});

const fundFavorites = computed(() => {
  return favoriteStore.favorites.filter((item) => item.name && item.type);
});

const installmentFavorites = computed(() => {
  return favoriteStore.favorites.filter((item) => item.installmentProductName);
});
</script>

<style scoped>
.mypage-container {
  max-width: 540px;
  margin: 0 auto;
  background: var(--color-bg-light);
  min-height: 100vh;
  font-family: var(--font-main);
}

.favorite-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px 20px 10px 10px;
  background: var(--color-bg-light);
  position: relative;
}

.favorite-header h1 {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #222;
  position: relative;
}

.back-icon {
  position: absolute;
  left: 10px;
  top: 18px;
  font-size: 22px;
  color: #333;
  cursor: pointer;
  z-index: 2;
}

.header-divider {
  width: 100%;
  height: 1px;
  background: #f0f0f0;
  margin: 12px 0 0 0;
}

.main-content {
  padding: 16px;
  height: calc(100vh - 120px);
  overflow-y: auto;
  background: var(--color-bg-light);
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE, Edge */
}

.main-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.group-title {
  font-size: 15px;
  font-weight: 600;
  color: #888;
  margin: 0px 0 10px 10px;
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
