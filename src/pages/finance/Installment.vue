<template>
  <div class="installment-container">
    <!-- 상단 탭 -->
    <div class="tab-row">
      <span class="tab" @click="goTo('/finance/deposit')">예금</span>
      <span class="tab active" @click="goTo('/finance/installment')">적금</span>
      <span class="tab" @click="goTo('/finance/fund')">펀드</span>
      <span class="tab" @click="goTo('/finance/stock')">주식</span>
    </div>

    <!-- 추천/전체보기 탭 -->
    <div class="subtab-row">
      <span
        class="subtab"
        :class="{ active: activeSubtab === '추천' }"
        @click="changeSubtab('추천')"
      >
        추천
      </span>
      <span
        class="subtab"
        :class="{ active: activeSubtab === '전체 보기' }"
        @click="changeSubtab('전체 보기')"
      >
        전체 보기
      </span>
    </div>

    <!-- 추천 탭일 때 -->
    <div class="scroll-area" v-if="activeSubtab === '추천'">
      <ProductInputForm />
      <ProductCardList :products="recommendProducts" />
    </div>

    <!-- 전체 보기 탭일 때 -->
    <div class="scroll-area" v-else>
      <div class="info-text">
        <span class="emoji">📊</span> 전체 적금 상품을 확인해보세요
      </div>
      <ProductCardList :products="allProducts" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductInputForm from '../../components/finance/installment/ProductInputForm_installment.vue';
import ProductCardList from '../../components/finance/installment/ProductCardList_installment.vue';
import recommendData from '../../components/finance/installment/installment_recommend.json';
import allData from '../../components/finance/installment/installment_all.json';

const router = useRouter();
const activeSubtab = ref('추천');
const recommendProducts = ref([]);
const allProducts = ref([]);

onMounted(() => {
  // 추천 상품 데이터 로드
  if (recommendData.status === 200 && recommendData.data) {
    recommendProducts.value = recommendData.data;
  }

  // 전체 상품 데이터 로드
  if (allData.status === 200 && allData.data) {
    allProducts.value = allData.data;
  }
});

function goTo(path) {
  router.push(path);
}

function changeSubtab(tabName) {
  activeSubtab.value = tabName;
}
</script>

<style scoped>
.installment-container {
  max-width: 390px;
  margin: 0 auto;
  padding: 0px 16px;
  font-family: var(--font-main);
  height: calc(100vh - 56px); /* 전체 화면 높이 - 헤더/탭 높이 */
  display: flex;
  flex-direction: column;
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
  color: #888;
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

.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 100px; /* 네비게이션바 가리는 문제 방지 */
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE, Edge */
}

.scroll-area::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.info-text {
  margin-top: 36px;
  font-size: 17px;
  color: #222;
  text-align: center;
  font-weight: 500;
  line-height: 1.6;
}

.emoji {
  font-size: 20px;
  vertical-align: middle;
}
</style>
