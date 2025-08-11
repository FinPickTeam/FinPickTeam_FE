<template>
  <div class="mypage-container">
    <header class="favorite-header">
      <i class="fas fa-chevron-left back-icon" @click="goBack"></i>
      <h1>찜한 상품</h1>
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
    <Navbar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import { getWishlist } from '@/api'; // /v1/wishlist : { status, message, data: { depositList, fundList, ... } }

import ProductCardList_deposit from '@/components/finance/deposit/ProductCardList_deposit.vue';
import ProductCardList_stock from '@/components/finance/stock/ProductCardList_stock.vue';
import ProductCardList_fund from '@/components/finance/fund/ProductCardList_fund.vue';
import ProductCardList_installment from '@/components/finance/installment/ProductCardList_installment.vue';

const router = useRouter();
function goBack() {
  router.back();
}

// ✅ 화면에 뿌릴 배열은 ref로 두고 API 응답으로 채움
const depositFavorites = ref([]);
const installmentFavorites = ref([]);
const stockFavorites = ref([]);
const fundFavorites = ref([]);

onMounted(async () => {
  // 너의 getWishlist가 axios에서 res.data를 반환한다면 아래 payload 계산이 안전함
  const res = await getWishlist(); // 예: { status, message, data: { ... } }  또는 바로 { depositList, ... }
  const payload = res?.data ?? res; // 두 경우 모두 커버
  const lists = payload?.data ?? payload; // 중첩 대비

  depositFavorites.value = lists?.depositList ?? [];
  installmentFavorites.value =
    lists?.installmentList ?? lists?.installList ?? [];
  stockFavorites.value = lists?.stockList ?? [];
  fundFavorites.value = lists?.fundList ?? [];

  // 디버그
  console.log(
    '[wishlist] deposit:',
    depositFavorites.value.length,
    'install:',
    installmentFavorites.value.length,
    'stock:',
    stockFavorites.value.length,
    'fund:',
    fundFavorites.value.length
  );
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
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
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
  font-size: 24px;
  color: #333;
  cursor: pointer;
  z-index: 2;
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
