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
        <button class="check-btn" @click="fetchStockRecommend">
          투자 성향에 맞는 상품 확인하기
        </button>
      </div>

      <!-- 주식 상품 리스트 -->
      <div v-if="showProducts" class="products-container">
        <ProductCardList_stock :products="stockRecommendData.data" />
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

        <!-- 태그 필터 -->
        <div v-if="showFilter" class="filter-dropdown">
          <!-- 시장 섹션 -->
          <div class="filter-section">
            <h4 class="filter-section-title">시장</h4>
            <div class="tag-container">
              <button
                v-for="tag in marketTags"
                :key="tag.value"
                class="filter-tag"
                :class="{ active: selectedMarkets.includes(tag.value) }"
                @click="toggleMarketTag(tag.value)"
              >
                {{ tag.label }}
              </button>
            </div>
          </div>

          <!-- 등락률 구간 섹션 -->
          <div class="filter-section">
            <h4 class="filter-section-title">등락률 구간</h4>
            <div class="tag-container">
              <button
                v-for="tag in changeRateTags"
                :key="tag.value"
                class="filter-tag"
                :class="{ active: selectedChangeRates.includes(tag.value) }"
                @click="toggleChangeRateTag(tag.value)"
              >
                {{ tag.label }}
              </button>
            </div>
          </div>

          <!-- 분류 섹션 -->
          <div class="filter-section">
            <h4 class="filter-section-title">분류</h4>
            <div class="tag-container">
              <button
                v-for="tag in sortTypeTags"
                :key="tag.value"
                class="filter-tag"
                :class="{ active: selectedSortType === tag.value }"
                @click="toggleSortTypeTag(tag.value)"
              >
                {{ tag.label }}
              </button>
            </div>
          </div>
          <!-- 정렬 섹션 -->
          <div class="filter-section">
            <h4 class="filter-section-title">정렬</h4>
            <div class="tag-container">
              <button
                v-for="tag in orderTypeTags"
                :key="tag.value"
                class="filter-tag"
                :class="{ active: selectedOrderType === tag.value }"
                @click="toggleOrderTypeTag(tag.value)"
              >
                {{ tag.label }}
              </button>
            </div>
          </div>

          <!-- 선택 완료 버튼 -->
          <div class="filter-complete-section">
            <button class="complete-btn" @click="closeFilter">선택 완료</button>
          </div>
        </div>
      </div>

      <!-- 전체 상품 리스트 -->
      <div
        v-if="filteredAllProducts && filteredAllProducts.length > 0"
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductCardList_stock from '@/components/finance/stock/ProductCardList_stock.vue';
import { getStockList, getStockRecommendedList } from '@/api';
import { useFavoriteStore } from '@/stores/favorite';

const router = useRouter();
const showProducts = ref(false);
const stockAllData = ref([]);
const stockRecommendData = ref([]);
const fav = useFavoriteStore();

onMounted(async () => {
  fetchStockList();
  fav.syncIdSet('STOCK');
});

const fetchStockList = async () => {
  try {
    const res = await getStockList();
    stockAllData.value = res.data ?? [];
  } catch (error) {
    console.log(error);
    stockAllData.value = [];
  }
};

const fetchStockRecommend = async () => {
  try {
    console.log('투자 성향에 맞는 상품 확인하기 클릭됨');
    const res = await getStockRecommendedList(5);
    stockRecommendData.value = res.data ?? [];
    showProducts.value = true;
  } catch (error) {
    console.log(error);
  }
};

function goTo(path) {
  router.push(path);
}

const activeSubtab = ref('추천');
function changeSubtab(tabName) {
  activeSubtab.value = tabName;
  showProducts.value = false; // 추천 탭 누르면 초기화
}

// 태그 토글 함수들
function toggleMarketTag(tagValue) {
  const index = selectedMarkets.value.indexOf(tagValue);
  if (index > -1) {
    selectedMarkets.value.splice(index, 1);
  } else {
    selectedMarkets.value.push(tagValue);
  }
}

function toggleChangeRateTag(tagValue) {
  const index = selectedChangeRates.value.indexOf(tagValue);
  if (index > -1) {
    selectedChangeRates.value.splice(index, 1);
  } else {
    selectedChangeRates.value.push(tagValue);
  }
}

// 단일 선택 토글 함수들
function toggleSortTypeTag(tagValue) {
  selectedSortType.value = selectedSortType.value === tagValue ? '' : tagValue;
}

function toggleOrderTypeTag(tagValue) {
  selectedOrderType.value =
    selectedOrderType.value === tagValue ? '' : tagValue;
}

function closeFilter() {
  showFilter.value = false;
}

// 전체보기용 상태
const searchKeyword = ref('');
const showFilter = ref(false);
const selectedMarkets = ref([]);
const selectedChangeRates = ref([]);
const selectedSortType = ref('');
const selectedOrderType = ref('');

// 태그 데이터
const marketTags = ref([
  { value: 'KOSPI', label: 'KOSPI' },
  { value: 'KOSDAQ', label: 'KOSDAQ' },
]);

const changeRateTags = ref([
  { value: '상승', label: '상승' },
  { value: '하락', label: '하락' },
  { value: '보합', label: '보합' },
]);

const sortTypeTags = ref([
  { value: 'name', label: '이름순' },
  { value: 'price', label: '가격순' },
  { value: 'volume', label: '거래량순' },
]);

const orderTypeTags = ref([
  { value: 'asc', label: '오름차순' },
  { value: 'desc', label: '내림차순' },
]);

// 전체보기 필터링된 데이터
const filteredAllProducts = computed(() => {
  let result = stockAllData.value;

  // 중복 제거 (stockCode 기준)
  const uniqueStocks = [];
  const seenCodes = new Set();

  for (let stock of result) {
    if (!seenCodes.has(stock.stockCode)) {
      seenCodes.add(stock.stockCode);
      uniqueStocks.push(stock);
    }
  }

  result = uniqueStocks;

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
  if (selectedMarkets.value.length > 0) {
    result = result.filter((p) =>
      selectedMarkets.value.includes(p.stockMarketType || '')
    );
  }

  // 📈 등락률 구간 필터
  if (selectedChangeRates.value.length > 0) {
    result = result.filter((p) => {
      const changeRate = Number((p.stockChangeRate || '0').replace(/[+-]/, ''));
      return selectedChangeRates.value.some((range) => {
        if (range === '상승') return changeRate > 0;
        if (range === '하락') return changeRate < 0;
        if (range === '보합') return changeRate === 0;
        return false;
      });
    });
  }

  // 📊 정렬
  if (selectedSortType.value && selectedOrderType.value) {
    result = [...result].sort((a, b) => {
      let comparison = 0;

      if (selectedSortType.value === 'name') {
        comparison = (a.stockName || '').localeCompare(b.stockName || '');
      } else if (selectedSortType.value === 'price') {
        const priceA = Number((a.stockPrice || '0').replace(/[^\d.-]/g, ''));
        const priceB = Number((b.stockPrice || '0').replace(/[^\d.-]/g, ''));
        comparison = priceA - priceB;
      } else if (selectedSortType.value === 'volume') {
        const volumeA = Number(a.stockVolume || '0');
        const volumeB = Number(b.stockVolume || '0');
        comparison = volumeA - volumeB;
      }

      return selectedOrderType.value === 'desc' ? -comparison : comparison;
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
  font-size: 20px;
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
  z-index: 1000;
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
  width: 360px;
  z-index: 1000;
  position: absolute;
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

/* 태그 필터 스타일 */
.filter-section {
  margin-bottom: 20px;
}

.filter-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  margin-top: 0;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--color-bg-border);
  background: var(--color-bg);
  color: var(--color-text-light);
  font-size: var(--font-size-body);
  border-radius: 12px;
  padding: 7px 14px;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: border 0.2s, color 0.2s, background 0.2s;
  white-space: nowrap;
}

.filter-tag:hover {
  border-color: var(--color-main);
  color: var(--color-main);
}

.filter-tag.active {
  border: 1.5px solid var(--color-main);
  color: var(--color-main);
  background: #f3f0fa;
}

.filter-complete-section {
  margin-top: 20px;
  padding-top: 16px;
  text-align: center;
}

.complete-btn {
  background: var(--color-main);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
}

.complete-btn:hover {
  background: var(--color-main-dark);
}
</style>
