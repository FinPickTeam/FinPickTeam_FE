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
      <ProductInputForm
        v-if="!showResults"
        :is-summary-mode="isSummaryMode"
        :form-data="formData"
        @search-completed="showSearchResults"
        @toggle-summary-mode="toggleSummaryMode"
      />

      <!-- 조건 요약 텍스트 -->
      <div v-if="summaryText" class="summary-text-box">
        <div class="summary-content">
          <div class="summary-info">
            <span class="summary-label"
              >🔍 <span class="summary-text">{{ summaryText }}</span>
            </span>
          </div>
          <button class="edit-btn" @click="hideSearchResults">수정</button>
        </div>
      </div>

      <ProductCardList_deposit
        v-if="showResults"
        :products="recommendProducts"
      />
    </div>

    <!-- 전체 보기 탭일 때 -->
    <div class="scroll-area" v-else>
      <div class="search-filter-row">
        <input
          v-model="searchKeyword"
          class="search-bar"
          type="text"
          placeholder="상품명을 검색해보세요"
        />
        <button class="filter-btn" @click="showFilter = !showFilter">
          <i class="fa-solid fa-filter"></i>
        </button>
      </div>

      <!-- 드롭다운 필터 -->
      <div v-if="showFilter" class="filter-dropdown">
        <div class="filter-group">
          <label>은행</label>
          <select v-model="selectedBank">
            <option value="">전체</option>
            <option value="KB국민은행">KB국민은행</option>
            <option value="신한은행">신한은행</option>
            <option value="하나은행">하나은행</option>
            <!-- ...필요한 은행 추가 -->
          </select>
        </div>
        <div class="filter-group">
          <label>기간</label>
          <select v-model="selectedPeriod">
            <option value="">전체</option>
            <option value="6">6개월</option>
            <option value="12">12개월</option>
            <option value="24">24개월</option>
            <!-- ...필요한 기간 추가 -->
          </select>
        </div>
        <div class="filter-group">
          <label>정렬</label>
          <select v-model="sortOption">
            <option value="rate">금리순</option>
            <option value="name">이름순</option>
          </select>
        </div>
      </div>

      <!-- 전체 상품 리스트 -->
      <div v-if="filteredAllProducts.length > 0">
        <ProductCardList_deposit :products="filteredAllProducts" />
      </div>
      <div v-else class="no-results">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>검색 조건에 맞는 상품이 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ProductInputForm from '@/components/finance/deposit/ProductInputForm_deposit.vue';
import ProductCardList_deposit from '@/components/finance/deposit/ProductCardList_deposit.vue';
import recommendData from '@/components/finance/deposit/deposit_recommend.json';
import allData from '@/components/finance/deposit/deposit_all.json';

const router = useRouter();
const activeSubtab = ref('추천');
const recommendProducts = ref([]);
const allProducts = ref([]);
const showResults = ref(false);
const isSummaryMode = ref(false);
const summaryText = ref('');
const formData = ref({
  amountRaw: 100000,
  period: '1년',
  depositType: '정기예금',
  selectedPrefer: [],
});

onMounted(() => {
  // 추천 상품 데이터 로드
  recommendProducts.value = recommendData;

  // 전체 상품 데이터 로드
  allProducts.value = allData;
});

function goTo(path) {
  router.push(path);
}

function changeSubtab(tabName) {
  activeSubtab.value = tabName;
}

function showSearchResults(receivedFormData) {
  showResults.value = true;

  // 폼 데이터 저장
  formData.value = receivedFormData;

  // 요약 텍스트 생성
  const preferText =
    receivedFormData.selectedPrefer.length > 0
      ? receivedFormData.selectedPrefer.length === 1
        ? receivedFormData.selectedPrefer[0]
        : receivedFormData.selectedPrefer.length === 2
        ? receivedFormData.selectedPrefer.join('+')
        : receivedFormData.selectedPrefer[0] +
          '+' +
          receivedFormData.selectedPrefer[1] +
          ' 외 ' +
          (receivedFormData.selectedPrefer.length - 2) +
          '건'
      : '';

  summaryText.value = `${
    receivedFormData.period
  } | 월 ${receivedFormData.amountRaw.toLocaleString()}원 | ${
    receivedFormData.depositType
  }${preferText ? ' | ' + preferText : ''}`;
}

function hideSearchResults() {
  showResults.value = false;
  summaryText.value = '';
}

function toggleSummaryMode() {
  isSummaryMode.value = !isSummaryMode.value;
  if (!isSummaryMode.value) {
    hideSearchResults();
  }
}

// 전체보기용 상태
const searchKeyword = ref('');
const showFilter = ref(false);
const selectedBank = ref('');
const selectedPeriod = ref('');
const sortOption = ref('rate');

// 전체보기 필터링된 데이터
const filteredAllProducts = computed(() => {
  let result = allProducts.value;

  // 🔍 키워드 검색
  if (searchKeyword.value) {
    result = result.filter((p) =>
      p.depositProductName
        ?.toLowerCase()
        .replace(/\s+/g, '')
        .includes(searchKeyword.value.toLowerCase().replace(/\s+/g, ''))
    );
  }

  // 🏦 은행 필터
  if (selectedBank.value) {
    result = result.filter((p) => p.depositBankName === selectedBank.value);
  }

  // �� 기간 필터 (주의: 문자열 비교가 정확하지 않을 수 있음 → 단순 포함 포함으로 처리 가능)
  if (selectedPeriod.value) {
    result = result.filter((p) =>
      p.depositContractPeriod?.includes(selectedPeriod.value)
    );
  }

  // 📊 정렬
  if (sortOption.value === 'rate') {
    result = [...result].sort((a, b) => b.depositMaxRate - a.depositMaxRate);
  } else if (sortOption.value === 'name') {
    result = [...result].sort((a, b) =>
      a.depositProductName.localeCompare(b.depositProductName)
    );
  }

  return result;
});
</script>

<style scoped>
.deposit-container {
  max-width: 390px;
  margin: 0 auto;
  padding: 0px 16px;
  font-family: var(--font-main);
  height: calc(100vh - 56px); /* 예: 전체 화면 높이 - 헤더/탭 높이 */
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

.summary-text-box {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.summary-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-label {
  font-weight: var(--font-weight-medium);
  color: #555;
  font-size: 14px;
}

.summary-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.edit-btn {
  background-color: var(--color-main);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: var(--font-weight-medium);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 50px;
  height: 32px;
  flex-shrink: 0;
}

.edit-btn:hover {
  background-color: var(--color-main-dark);
}

/* 전체보기 탭 */
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
  position: absolute;
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

.filter-group select,
.rate-input {
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
