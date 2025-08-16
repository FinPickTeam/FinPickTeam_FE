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
      <!-- 추천 CTA 버튼 + 안내문구(클릭 시 영구 숨김) -->
      <div class="recommend-container">
        <div class="recommend-content">
          <button
            class="btn-outline with-icon"
            @click="fetchStockRecommend"
            :disabled="isLoadingRecommend"
            :aria-busy="isLoadingRecommend ? 'true' : 'false'"
          >
            <i class="fa-solid fa-chart-line" aria-hidden="true"></i>
            <span>투자 성향에 맞는 상품 확인하기</span>
          </button>

          <p v-if="!hasRequestedRecommend" class="recommend-hint">
            지금 버튼을 누르면 맞춤 주식을 바로 확인할 수 있어요.
          </p>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoadingRecommend">
        <LoadingSpinner message="추천 상품을 불러오는 중..." />
      </div>

      <!-- 주식 상품 리스트 -->
      <div
        v-if="showProducts && !isLoadingRecommend"
        class="products-container"
      >
        <ProductCardList_stock :products="stockRecommendData" />
        <span class="subtab info-text">
          해당 종목은 다양한 시장 지표와 분석 결과를 바탕으로<br />
          사용자의 투자 성향에 맞게 추천되었습니다.
        </span>
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

      <!-- 로딩 상태 -->
      <div v-if="isLoadingAll">
        <LoadingSpinner message="상품 목록을 불러오는 중..." />
      </div>

      <!-- 전체 상품 리스트 -->
      <div
        v-else-if="filteredAllProducts && filteredAllProducts.length > 0"
        class="products-list-container"
      >
        <ProductCardList_stock :products="filteredAllProducts" />
      </div>
      <div v-else class="no-results">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>검색 조건에 맞는 주식이 없습니다.</p>
      </div>
    </div>

    <!-- 오른쪽 하단 비교 버튼 -->
    <div class="compare-button" @click="openCompare">추천좀</div>
    <!-- 바텀시트 -->
    <StockBottomSheet v-model:open="bottomSheetOpen" @confirm="goCompare" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductCardList_stock from '@/components/finance/stock/ProductCardList_stock.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { getStockList, getStockRecommendedList } from '@/api';
import { useFavoriteStore } from '@/stores/favorite';
import StockBottomSheet from '@/components/finance/stock/StockBottomSheet.vue';

const router = useRouter();
const showProducts = ref(false);
const isLoadingRecommend = ref(false);
const isLoadingAll = ref(false);
const stockAllData = ref([]);
const stockRecommendData = ref([]);
const fav = useFavoriteStore();

// 추천 안내 문구(버튼 클릭 후 영구 숨김)
const hasRequestedRecommend = ref(false);

// 모달창 관련
const bottomSheetOpen = ref(false);

onMounted(async () => {
  fetchStockList();
  fav.syncIdSet('STOCK');
});

const fetchStockList = async () => {
  isLoadingAll.value = true;
  try {
    const res = await getStockList();
    stockAllData.value = res.data ?? [];
  } catch (error) {
    console.log(error);
    stockAllData.value = [];
  } finally {
    isLoadingAll.value = false;
  }
};

const fetchStockRecommend = async () => {
  hasRequestedRecommend.value = true; // 클릭 시 문구 영구 숨김
  isLoadingRecommend.value = true;
  try {
    const res = await getStockRecommendedList(20);
    stockRecommendData.value = res.data ?? [];
    showProducts.value = true;
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingRecommend.value = false;
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
  if (selectedSortType.value === tagValue) {
    selectedSortType.value = '';
    selectedOrderType.value = '';
  } else {
    selectedSortType.value = tagValue;
    if (!selectedOrderType.value) {
      selectedOrderType.value = tagValue === 'name' ? 'asc' : 'desc';
    }
  }
}

function toggleOrderTypeTag(tagValue) {
  selectedOrderType.value =
    selectedOrderType.value === tagValue ? '' : tagValue;
  if (selectedOrderType.value && !selectedSortType.value) {
    selectedSortType.value = 'name';
  }
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

// 비교 바텀시트
function openCompare() {
  bottomSheetOpen.value = true;
}

function goCompare(ids) {
  if (!Array.isArray(ids) || ids.length !== 3) return;
  const [main, a, b] = ids;
  router.push(`/finance/stock/compare/${main}?with=${a},${b}`);
}

// 유틸
const toNum = (v) => {
  const n = Number(String(v ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const cmpStr = (a, b) =>
  String(a ?? '').localeCompare(String(b ?? ''), 'ko', {
    numeric: true,
    sensitivity: 'base',
  });

// 필터링
const filteredAllProducts = computed(() => {
  let result = Array.isArray(stockAllData.value)
    ? stockAllData.value.slice()
    : [];

  // 중복 제거 (stockCode 기준)
  const seen = new Set();
  result = result.filter((p) => {
    const code = p?.stockCode;
    if (!code || seen.has(code)) return false;
    seen.add(code);
    return true;
  });

  // 키워드 검색
  if (searchKeyword.value) {
    const q = searchKeyword.value.toLowerCase().replace(/\s+/g, '');
    result = result.filter((p) =>
      String(p.stockName ?? '')
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(q)
    );
  }

  // 시장 필터
  if (selectedMarkets.value.length > 0) {
    result = result.filter((p) =>
      selectedMarkets.value.includes(p.stockMarketType || '')
    );
  }

  // 등락률 필터
  if (selectedChangeRates.value.length > 0) {
    result = result.filter((p) => {
      const r = toNum(p.stockChangeRate);
      return selectedChangeRates.value.some((range) => {
        if (range === '상승') return r > 0;
        if (range === '하락') return r < 0;
        if (range === '보합') return Math.abs(r) < 1e-9;
        return false;
      });
    });
  }

  // 정렬
  if (selectedSortType.value && selectedOrderType.value) {
    const dir = selectedOrderType.value === 'desc' ? -1 : 1;
    const key = selectedSortType.value;
    const getter =
      key === 'name'
        ? (p) => String(p.stockName ?? '')
        : key === 'price'
        ? (p) => toNum(p.stockPrice)
        : key === 'volume'
        ? (p) => toNum(p.stockVolume)
        : () => 0;

    result.sort((a, b) => {
      const av = getter(a);
      const bv = getter(b);
      let cmp = key === 'name' ? cmpStr(av, bv) : av - bv;
      if (cmp === 0) return cmpStr(a.stockName, b.stockName) * dir; // 보조 정렬
      return cmp * dir;
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
  height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 100px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scroll-area::-webkit-scrollbar {
  display: none;
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
}
.subtab.active {
  color: var(--color-main-light);
  border-bottom: 2px solid var(--color-main-light);
}

.info-text {
  position: relative;
  display: flex;
  justify-content: center;
}

.button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 20px;
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

/* 추천 CTA + 안내 문구 */
.recommend-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.recommend-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.recommend-hint {
  font-size: 13px;
  color: #666;
  margin: 0;
  text-align: center;
}

/* 추천 버튼: 메인 컬러 */
.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 240px;
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  border: none;
  background: var(--color-main);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.2px;
  transition: background-color 0.15s ease, transform 0.06s ease;
}
.btn-outline.with-icon i {
  font-size: 16px;
}
.btn-outline:hover {
  background: var(--color-main-dark);
}
.btn-outline:active {
  transform: translateY(1px);
}
.btn-outline[disabled],
.btn-outline[aria-busy='true'] {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 비교 버튼(FAB) */
.compare-button {
  position: fixed;
  bottom: 80px;
  right: 10px;
  width: 60px;
  height: 60px;
  background: var(--color-main);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
</style>
