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
            <div class="summary-text-container">
              <div class="summary-item-box">
                <span class="summary-item-value">{{ formData.period }}</span>
              </div>
              <div class="summary-item-box">
                <span class="summary-item-value"
                  >월 {{ formData.amountRaw.toLocaleString() }}원</span
                >
              </div>
              <div class="summary-item-box">
                <span class="summary-item-value">{{
                  formData.depositType
                }}</span>
              </div>
              <div
                v-if="formData.selectedPrefer.length > 0"
                class="summary-item-box"
              >
                <span class="summary-item-value">{{
                  formData.selectedPrefer.join(', ')
                }}</span>
              </div>
            </div>
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

      <!-- 태그 필터 -->
      <div v-if="showFilter" class="filter-dropdown">
        <!-- 대상 섹션 -->
        <div class="filter-section">
          <h4 class="filter-section-title">은행</h4>
          <div class="tag-container">
            <button
              v-for="tag in targetTags"
              :key="tag.value"
              class="filter-tag"
              :class="{ active: selectedTargets.includes(tag.value) }"
              @click="toggleTargetTag(tag.value)"
            >
              {{ tag.label }}
            </button>
          </div>
        </div>

        <!-- 관심/특징 섹션 -->
        <div class="filter-section">
          <h4 class="filter-section-title">금리 구간</h4>
          <div class="tag-container">
            <button
              v-for="tag in interestTags"
              :key="tag.value"
              class="filter-tag"
              :class="{ active: selectedInterests.includes(tag.value) }"
              @click="toggleInterestTag(tag.value)"
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
import { getDepositList } from '@/api';

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

// 태그 필터 관련 상태
const searchKeyword = ref('');
const showFilter = ref(false);
const selectedTargets = ref([]);
const selectedInterests = ref([]);

// 태그 데이터
const targetTags = ref([
  { value: 'KB국민은행', label: 'KB국민은행' },
  { value: 'NH농협은행', label: 'NH농협은행' },
  { value: 'IBK기업은행', label: 'IBK기업은행' },
  { value: 'KDB산업은행', label: 'KDB산업은행' },
  { value: 'SC제일은행', label: 'SC제일은행' },
  { value: '수협은행', label: '수협은행' },
  { value: '우리은행', label: '우리은행' },
  { value: '하나은행', label: '하나은행' },
  { value: '카카오뱅크', label: '카카오뱅크' },
  { value: '케이뱅크', label: '케이뱅크' },
  { value: '토스뱅크', label: '토스뱅크' },
  { value: 'iM뱅크', label: 'iM뱅크' },
  { value: '광주은행', label: '광주은행' },
  { value: '전북은행', label: '전북은행' },
  { value: '신한은행', label: '신한은행' },
  { value: '제주은행', label: '제주은행' },
  { value: '경남은행', label: '경남은행' },
  { value: '부산은행', label: '부산은행' },
]);

const interestTags = ref([
  { value: '1% 미만', label: '1% 미만' },
  { value: '1~2%', label: '1~2%' },
  { value: '2~3%', label: '2~3%' },
  { value: '3~4%', label: '3~4%' },
  { value: '4~5%', label: '4~5%' },
  { value: '5% 이상', label: '5% 이상' },
]);

onMounted(async () => {
  try {
    allProducts.value = await getDepositList();
  } catch (e) {
    console.error(e);
  }
  // 추천 상품 데이터 로드
  recommendProducts.value = recommendData;

  // 전체 상품 데이터 로드
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

// 태그 토글 함수들
function toggleTargetTag(tagValue) {
  const index = selectedTargets.value.indexOf(tagValue);
  if (index > -1) {
    selectedTargets.value.splice(index, 1);
  } else {
    selectedTargets.value.push(tagValue);
  }
}

function toggleInterestTag(tagValue) {
  const index = selectedInterests.value.indexOf(tagValue);
  if (index > -1) {
    selectedInterests.value.splice(index, 1);
  } else {
    selectedInterests.value.push(tagValue);
  }
}

function closeFilter() {
  showFilter.value = false;
}

// 기존 필터 상태 (태그 필터로 대체될 예정)
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
  flex: 1;
  min-width: 0; /* flex 아이템이 축소될 수 있도록 */
}

.summary-text-container {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  padding-right: 8px;
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE, Edge */
}

.summary-text-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.summary-item-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 8px 6px;
  min-width: 30px;
  flex-shrink: 0;
}

.summary-item-label {
  font-size: 11px;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 2px;
  text-align: center;
}

.summary-item-value {
  font-size: 12px;
  color: #333;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
}

.summary-label {
  font-weight: var(--font-weight-medium);
  color: #555;
  font-size: 14px;
  flex-shrink: 0;
}

.summary-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
}

.edit-btn {
  background-color: var(--color-main);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 48px;
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
  width: 360px;
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
