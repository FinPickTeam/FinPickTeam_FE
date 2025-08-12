<template>
  <div class="mypage-container">
    <header class="favorite-header">
      <i class="fas fa-chevron-left back-icon" @click="goBack"></i>
      <h1>찜한 상품</h1>
      <i class="fas fa-chevron-left ghost"></i>
    </header>

    <main class="main-content">
      <!-- 예금 상품 -->
      <div v-if="depositFavorites.length > 0">
        <div class="group-title">예금 상품</div>
        <ProductCardList_deposit
          :products="depositFavorites"
          @favorite-removed="handleDepositFavoriteRemoved"
        />
      </div>

      <!-- 적금 상품 -->
      <div v-if="installmentFavorites.length > 0">
        <div class="group-title">적금 상품</div>
        <ProductCardList_installment
          :products="installmentFavorites"
          @favorite-removed="handleInstallmentFavoriteRemoved"
        />
      </div>

      <!-- 주식 상품 -->
      <div v-if="stockFavorites.length > 0">
        <div class="group-title">주식 상품</div>
        <ProductCardList_stock
          :products="stockFavorites"
          @favorite-removed="handleStockFavoriteRemoved"
        />
      </div>

      <!-- 펀드 상품 -->
      <div v-if="fundFavorites.length > 0">
        <div class="group-title">펀드 상품</div>
        <ProductCardList_fund
          :funds="fundFavorites"
          @favorite-removed="handleFundFavoriteRemoved"
        />
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
    <Navbar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getActivePinia } from 'pinia';
import Navbar from '@/components/Navbar.vue';
import { getWishlist } from '@/api'; // /v1/wishlist : { status, message, data: { depositList, fundList, ... } }
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

// ✅ 화면에 뿌릴 배열은 ref로 두고 API 응답으로 채움
const depositFavorites = ref([]);
const installmentFavorites = ref([]);
const stockFavorites = ref([]);
const fundFavorites = ref([]);

// 찜 해제 시 리스트에서 제거하는 함수들
const handleDepositFavoriteRemoved = (product) => {
  const productId = product.id || product.depositProductId;
  const index = depositFavorites.value.findIndex(
    (item) => item.id === productId || item.depositProductId === productId
  );
  if (index > -1) {
    depositFavorites.value.splice(index, 1);
  }
};

const handleInstallmentFavoriteRemoved = (product) => {
  const productId = product.id || product.installmentProductId;
  const index = installmentFavorites.value.findIndex(
    (item) => item.id === productId || item.installmentProductId === productId
  );
  if (index > -1) {
    installmentFavorites.value.splice(index, 1);
  }
};

const handleStockFavoriteRemoved = (product) => {
  const productId = product.stockCode || product.stockName;
  const index = stockFavorites.value.findIndex(
    (item) => item.stockCode === productId || item.stockName === productId
  );
  if (index > -1) {
    stockFavorites.value.splice(index, 1);
  }
};

const handleFundFavoriteRemoved = (product) => {
  const productId = product.id || product.fundId;
  const index = fundFavorites.value.findIndex(
    (item) => item.id === productId || item.fundId === productId
  );
  if (index > -1) {
    fundFavorites.value.splice(index, 1);
  }
};

onMounted(async () => {
  try {
    // 1) 즐겨찾기 ID세트 동기화 + 목록 로딩을 병렬 처리
    const [_, wishlistRes] = await Promise.all([
      favoriteStore.syncAllIdSets(), // 내부에서 무결성 보장
      getWishlist(),
    ]);

    // 2) 응답 파싱 (중복 제거)
    const payload = Array.isArray(wishlistRes)
      ? wishlistRes
      : wishlistRes?.data ?? wishlistRes;
    const lists = payload; // 한 번만 풀기

    depositFavorites.value = lists?.depositList ?? [];
    installmentFavorites.value =
      lists?.installmentList ?? lists?.installList ?? [];
    stockFavorites.value = lists?.stockList ?? [];
    fundFavorites.value = lists?.fundList ?? [];

    if (stockFavorites.value.length > 0) {
      const s0 = stockFavorites.value[0];
    }
  } catch (err) {
    console.error('Favorite init error:', err);
  }
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
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-light);
  position: relative;
  padding: 0 15px;
}

.favorite-header h1 {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #222;
  position: flex;
}

.back-icon {
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
}
.back-icon,
.ghost {
  width: 32px; /* 실제 아이콘 너비에 맞춰 조정 */
  font-size: 24px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ghost {
  visibility: hidden;
}
.main-content {
  padding: 16px;
  height: calc(100vh - 130px);
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
