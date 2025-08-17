<template>
  <div class="favorite-page">
    <header class="favorite-header">
      <i class="fas fa-chevron-left back-icon" @click="goBack"></i>
      <h1>찜한 상품</h1>
      <i class="fas fa-chevron-left ghost"></i>
    </header>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-section">
      <div class="loading-spinner"></div>
      <p class="loading-text">찜 목록 불러오는 중...</p>
    </div>

    <!-- 본문 -->
    <main v-else class="main-content">
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

      <!-- 펀드 상품 -->
      <div v-if="fundFavorites.length > 0">
        <div class="group-title">펀드 상품</div>
        <ProductCardList_fund
          :funds="fundFavorites"
          @favorite-removed="handleFundFavoriteRemoved"
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
import Navbar from '@/components/Navbar.vue';
import { getWishlist } from '@/api';
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

// 화면에 뿌릴 배열은 ref로 두고 API 응답으로 채움
const depositFavorites = ref([]);
const installmentFavorites = ref([]);
const stockFavorites = ref([]);
const fundFavorites = ref([]);
const isLoading = ref(true);

// 찜 해제 시 리스트에서 제거
const handleDepositFavoriteRemoved = (product) => {
  const productId = product.id || product.depositProductId;
  const i = depositFavorites.value.findIndex(
    (item) => item.id === productId || item.depositProductId === productId
  );
  if (i > -1) depositFavorites.value.splice(i, 1);
};

const handleInstallmentFavoriteRemoved = (product) => {
  const productId = product.id || product.installmentProductId;
  const i = installmentFavorites.value.findIndex(
    (item) => item.id === productId || item.installmentProductId === productId
  );
  if (i > -1) installmentFavorites.value.splice(i, 1);
};

const handleStockFavoriteRemoved = (product) => {
  const productId = product.stockCode || product.stockName;
  const i = stockFavorites.value.findIndex(
    (item) => item.stockCode === productId || item.stockName === productId
  );
  if (i > -1) stockFavorites.value.splice(i, 1);
};

const handleFundFavoriteRemoved = (product) => {
  const productId = product.id || product.fundId;
  const i = fundFavorites.value.findIndex(
    (item) => item.id === productId || item.fundId === productId
  );
  if (i > -1) fundFavorites.value.splice(i, 1);
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

onMounted(async () => {
  try {
    await favoriteStore.syncAllIdSets();

    await delay(300); // UX용 살짝 대기 (선택)
    const res = await getWishlist();

    // 항상 객체가 되도록 안전 파싱
    const lists = res?.data?.data ?? res?.data ?? res ?? {};

    depositFavorites.value = lists.depositList ?? [];
    installmentFavorites.value =
      lists.installmentList ?? lists.installList ?? [];
    stockFavorites.value = lists.stockList ?? [];
    fundFavorites.value = lists.fundList ?? [];
  } catch (err) {
    console.error('Favorite init error:', err);
    depositFavorites.value = [];
    installmentFavorites.value = [];
    stockFavorites.value = [];
    fundFavorites.value = [];
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.favorite-page {
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
  /* position: flex;  ← 잘못된 속성 제거 */
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
  width: 32px;
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
  display: none;
}

.group-title {
  font-size: 15px;
  font-weight: 600;
  color: #888;
  margin: 0 0 10px 10px;
}

.no-favorites {
  text-align: center;
  margin-top: 50px;
  color: var(--color-text-light);
}
.no-favorites p {
  font-size: 16px;
}

.loading-section {
  height: 100dvh;
  background-color: var(--color-bg-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}
.loading-text {
  font-size: 14px;
  color: #666;
  margin: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
