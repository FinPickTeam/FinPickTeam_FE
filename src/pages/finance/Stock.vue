<template>
  <div class="stock-container">
    <!-- 상단 탭 -->
    <div class="tab-row">
      <span class="tab" @click="goTo('/finance/deposit')">예금</span>
      <span class="tab" @click="goTo('/finance/installment')">적금</span>
      <span class="tab" @click="goTo('/finance/fund')">펀드</span>
      <span class="tab active" @click="goTo('/finance/stock')">주식</span>
    </div>

    <!-- 추천/전체보기 탭 -->
    <div class="subtab-row">
      <span
        class="subtab"
        :class="{ active: activeSubtab === '추천' }"
        @click="changeSubtab('추천')"
        >추천</span
      >
      <span
        class="subtab"
        :class="{ active: activeSubtab === '전체 보기' }"
        @click="changeSubtab('전체 보기')"
        >전체 보기</span
      >
    </div>

    <!-- 추천 탭일 때 -->
    <div class="scroll-area" v-if="activeSubtab === '추천'">
      <!-- 투자 성향에 맞는 상품 확인하기 버튼 -->
      <div class="button-container">
        <button class="check-btn" @click="checkInvestmentProducts">
          투자 성향에 맞는 상품 확인하기
        </button>
      </div>

      <!-- 주식 상품 리스트 -->
      <div v-if="showProducts" class="products-container">
        <ProductCardList_stock />
      </div>
    </div>

    <!-- 전체 보기 탭일 때 -->
    <div class="scroll-area" v-else>
      <div class="search-filter-container">
        <div class="search-filter-row">
          <input
            v-model="searchKeyword"
            class="search-bar"
            type="text"
            placeholder="주식명을 검색해보세요"
          />
          <button class="filter-btn" @click="showFilter = !showFilter">
            <i class="fa-solid fa-filter"></i>
          </button>
        </div>

        <!-- 드롭다운 필터 -->
        <div v-if="showFilter" class="filter-dropdown">
          <div class="filter-group">
            <label>시장</label>
            <select v-model="selectedMarket">
              <option value="">전체</option>
              <option value="KOSPI">KOSPI</option>
              <option value="KOSDAQ">KOSDAQ</option>
            </select>
          </div>
          <div class="filter-group">
            <label>정렬</label>
            <select v-model="sortOption">
              <option value="name">이름순</option>
              <option value="price">가격순</option>
              <option value="change">등락률순</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 전체 상품 리스트 -->
      <div
        v-if="filteredAllProducts.length > 0"
        class="products-list-container"
      >
        <ProductCardList_stock :products="filteredAllProducts" />
      </div>
      <div v-else class="no-results">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>검색 조건에 맞는 주식이 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ProductCardList_stock from '@/components/finance/stock/ProductCardList_stock.vue';
import stockAllData from '@/components/finance/stock/stock_all.json';

const router = useRouter();
const showProducts = ref(false);

function goTo(path) {
  router.push(path);
}

function checkInvestmentProducts() {
  console.log('투자 성향에 맞는 상품 확인하기 클릭됨');
  showProducts.value = true;
}

const activeSubtab = ref('추천');
function changeSubtab(tabName) {
  activeSubtab.value = tabName;
  showProducts.value = false; // 추천 탭 누르면 초기화
}

// 전체보기용 상태
const searchKeyword = ref('');
const showFilter = ref(false);
const selectedMarket = ref('');
const sortOption = ref('name');

// 전체보기 필터링된 데이터
const filteredAllProducts = computed(() => {
  let result = stockAllData.data;

  // 🔍 키워드 검색
  if (searchKeyword.value) {
    result = result.filter((p) =>
      p.stockName
        ?.toLowerCase()
        .replace(/\s+/g, '')
        .includes(searchKeyword.value.toLowerCase().replace(/\s+/g, ''))
    );
  }

  // 🏦 시장 필터
  if (selectedMarket.value) {
    result = result.filter((p) => p.stockMarketType === selectedMarket.value);
  }

  // 📊 정렬
  if (sortOption.value === 'name') {
    result = [...result].sort((a, b) => a.stockName.localeCompare(b.stockName));
  } else if (sortOption.value === 'price') {
    result = [...result].sort((a, b) => {
      const priceA = Number(a.stockPrice.replace(/[+-]/, ''));
      const priceB = Number(b.stockPrice.replace(/[+-]/, ''));
      return priceB - priceA;
    });
  } else if (sortOption.value === 'change') {
    result = [...result].sort((a, b) => {
      const changeA = Number(a.stockChangeRate.replace(/[+-]/, ''));
      const changeB = Number(b.stockChangeRate.replace(/[+-]/, ''));
      return changeB - changeA;
    });
  }

  return result;
});
</script>

<style scoped>
.stock-container {
  max-width: 390px;
  margin: 0 auto;
  padding: 0px 16px;
  font-family: var(--font-main);
  height: calc(100vh - 56px); /* 전체 화면 높이 - 헤더/탭 높이 */
  display: flex;
  flex-direction: column;
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

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.check-btn {
  width: 220px;
  background: var(--color-main);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 4px 0;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-regular);
  cursor: pointer;
  transition: background 0.2s;
}

.check-btn:hover {
  background: var(--color-main-dark);
}

.products-container {
  margin-top: 20px;
  width: 100%;
}

/* 전체보기 탭 */
.search-filter-container {
  position: relative;
  margin-bottom: 16px;
}

.search-filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.search-bar {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-bg-border);
  font-size: 15px;
  background: var(--color-bg);
}

.filter-btn {
  background: var(--color-bg-light);
  border: none;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 18px;
  color: var(--color-main);
  display: flex;
  align-items: center;
}

.filter-dropdown {
  margin-top: 6px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px #0001;
  min-width: 220px;
  z-index: 10;
  position: relative;
}

.products-list-container {
  width: 100%;
}

.filter-group {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  min-width: 48px;
  font-size: 14px;
  color: #555;
}

.filter-group select {
  flex: 1;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 14px;
}

.no-results {
  margin-top: 40px;
  text-align: center;
  color: #888;
  font-size: 16px;
}

.no-results i {
  font-size: 24px;
  margin-bottom: 8px;
  display: block;
}
</style>
