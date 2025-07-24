<template>
  <div class="deposit-container">
    <!-- 상단 탭 -->
    <div class="tab-row">
      <span class="tab active">예금</span>
      <span class="tab" @click="goTo('/finance/installment')">적금</span>
      <span class="tab" @click="goTo('/finance/fund')">펀드</span>
      <span class="tab" @click="goTo('/finance/stock')">주식</span>
    </div>

    <!-- 추천/전체보기 탭 -->
    <div class="subtab-row">
      <span class="subtab active">추천</span>
      <span class="subtab">전체 보기</span>
    </div>

    <!-- 조건 입력 폼 -->
    <ProductInputForm @show-products="showProducts = true" />

    <!-- 안내 문구 -->
    <div class="info-text" v-if="!showProducts">
      수익률 좋은 상품이 궁금하신가요?<br />
      버튼만 누르면 확인하실 수 있어요 <span class="emoji">👇</span>
    </div>

    <!-- 추천 상품 리스트 -->
    <ProductCardList_deposit v-if="showProducts" />
  </div>
</template>

<script setup>
import ProductInputForm from '@/components/finance/ProductInputForm.vue';
import ProductCardList_deposit from '@/components/finance/deposit/ProductCardList_deposit.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const showProducts = ref(false);

function goTo(path) {
  router.push(path);
}
</script>

<style scoped>
.deposit-container {
  max-width: 390px;
  margin: 0 auto;
  padding: 0px 16px;
  font-family: var(--font-main);
}

.tab-row {
  display: flex;
  gap: 12px;
  font-size: var(font-size-body-large);
  font-weight: var(--font-weight-medium);
  margin-bottom: 8px;
  align-items: baseline;
}

.tab {
  color: var(--color-text-light);
  cursor: pointer;
  padding-bottom: 4px;
}

.tab.active {
  color: var(--color-main);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-title-sub);
}

.subtab-row {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
}

.subtab {
  flex: 1 1 0;
  text-align: center;
  color: #888;
  cursor: pointer;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
  font-size: 15px;
  /* 필요하다면 높이, 라인하이트 등 추가 */
}

.subtab.active {
  color: var(--color-main-light);
  border-bottom: 2px solid var(--color-main-light);
}

.info-text {
  margin-top: 36px;
  font-size: var(--font-size-body-large);
  color: var(--color-text);
  text-align: center;
  font-weight: var(--font-weight-medium);
  line-height: 1.6;
}

.emoji {
  font-size: 20px;
  vertical-align: middle;
}
</style>
