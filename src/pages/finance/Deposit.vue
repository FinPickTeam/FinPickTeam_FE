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
                <span class="summary-item-value">{{ periodText }}</span>
              </div>
              <div class="summary-item-box">
                <span class="summary-item-value">월 {{ amountText }}원</span>
              </div>
              <div v-if="preferSummary" class="summary-item-box">
                <span class="summary-item-value">{{ preferSummary }}</span>
              </div>
            </div>
          </div>
          <button class="edit-btn" @click="hideSearchResults">수정</button>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoadingRecommend" class="loading-section">
        <LoadingSpinner message="추천 상품을 불러오는 중..." />
      </div>
      <div class="recommend-card-list">
        <ProductCardList_deposit
          v-if="showResults && !isLoadingRecommend"
          :products="recommendProducts"
        />
        <span
          v-if="showResults && !isLoadingRecommend"
          class="subtab info-text"
        >
          선택한 우대 조건과 사용자의 투자 성향을 <br />
          종합 분석해 선정한 상품입니다.
        </span>
      </div>
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
        <!-- ⬇️ 토글 대신 openFilter 사용 -->
        <button class="filter-btn" @click="openFilter">
          <i class="fa-solid fa-filter"></i>
        </button>
      </div>

      <!-- 태그 필터 (임시 선택 → 확인 시 반영) -->
      <div v-if="showFilter" class="filter-dropdown">
        <!-- 은행 -->
        <div class="filter-section">
          <h4 class="filter-section-title">은행</h4>
          <div class="tag-container">
            <button
              v-for="tag in targetTags"
              :key="tag.value"
              class="filter-tag"
              :class="{ active: pendingTargets.includes(tag.value) }"
              @click="togglePendingTag('bank', tag.value)"
            >
              {{ tag.label }}
            </button>
          </div>
        </div>

        <!-- 금리 구간 (기본금리 기준) -->
        <div class="filter-section">
          <h4 class="filter-section-title">금리 구간</h4>
          <div class="tag-container">
            <button
              v-for="tag in interestTags"
              :key="tag.value"
              class="filter-tag"
              :class="{ active: pendingInterests.includes(tag.value) }"
              @click="togglePendingTag('interest', tag.value)"
            >
              {{ tag.label }}
            </button>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="filter-action-row">
          <!-- 임시선택만 초기화 -->
          <button class="reset-btn" @click="resetPending">초기화</button>
          <!-- 임시선택 → 실제적용 -->
          <button class="complete-btn" @click="applyFilter">선택 완료</button>
        </div>
      </div>

      <!-- 로딩 -->
      <div v-if="isLoadingAll">
        <LoadingSpinner message="상품 목록을 불러오는 중..." />
      </div>

      <!-- 전체 상품 리스트 -->
      <div v-else-if="filteredAllDeposit && filteredAllDeposit.length > 0">
        <ProductCardList_deposit :products="filteredAllDeposit" />
      </div>
      <div v-else class="no-results">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>검색 조건에 맞는 상품이 없습니다.</p>
      </div>
    </div>
    <MyData :open="show" @close="show = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ProductInputForm from '@/components/finance/deposit/ProductInputForm_deposit.vue';
import ProductCardList_deposit from '@/components/finance/deposit/ProductCardList_deposit.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { getDepositList, getDepositRecommendList } from '@/api';
import { useFavoriteStore } from '@/stores/favorite';
import { useMyDataStore } from '@/stores/MyData';
import MyData from '@/components/finance/deposit/MyData.vue';

const router = useRouter();
const activeSubtab = ref('추천');
const recommendProducts = ref([]);
const isLoadingRecommend = ref(false);
const isLoadingAll = ref(false);
const allProducts = ref([]);
const showResults = ref(false);
const isSummaryMode = ref(false);
const summaryText = ref('');
const formData = ref({
  amountRaw: 1000000,
  period: '1년',
  selectedPrefer: [],
});
const fav = useFavoriteStore();

const myDataStore = useMyDataStore();

// 검색/필터 UI 상태
const searchKeyword = ref('');
const showFilter = ref(false);

// ✅ 실제 적용되는 값
const selectedTargets = ref([]); // 은행
const selectedInterests = ref([]); // 금리 구간

// ✅ 드롭다운에서 임시 선택되는 값
const pendingTargets = ref([]);
const pendingInterests = ref([]);

const MAX_PREFER_CHARS = 24;

const periodText = computed(() => formData.value.period || '-');
const amountText = computed(() =>
  Number(
    formData.value.amount ?? formData.value.amountRaw ?? 0
  ).toLocaleString()
);

// 태그 데이터
const targetTags = ref([
  { value: 'KB국민은행', label: 'KB국민은행' },
  { value: '농협은행', label: 'NH농협은행' },
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

const show = ref(false);

onMounted(async () => {
  fetchDepositList();
  fav.syncIdSet('DEPOSIT');
  if (!myDataStore.linked) show.value = true;
});

const fetchDepositList = async () => {
  isLoadingAll.value = true;
  try {
    const res = await getDepositList();
    allProducts.value = res.data ?? [];
  } catch (e) {
    console.error(e);
  } finally {
    isLoadingAll.value = false;
  }
};

function goTo(path) {
  router.push(path);
}
function changeSubtab(tabName) {
  activeSubtab.value = tabName;
}

// 추천
function showSearchResults(receivedFormData) {
  showResults.value = true;
  formData.value = receivedFormData;

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
  } | 월 ${receivedFormData.amount.toLocaleString()}원${
    preferText ? ' | ' + preferText : ''
  }`;
  fetchDepositRecommendation(receivedFormData);
}

const fetchDepositRecommendation = async (receivedFormData) => {
  try {
    const params = {
      amount: receivedFormData.amount,
      period: toMonths(receivedFormData.period),
    };
    const body = {
      newCustomer: receivedFormData.filterObject.newCustomer,
      salaryTransfer: receivedFormData.filterObject.salaryTransfer,
      cardUsage: receivedFormData.filterObject.cardUsage,
      internetMobileBanking:
        receivedFormData.filterObject.internetMobileBanking,
      marketingConsent: receivedFormData.filterObject.marketingConsent,
      housingSubscription: receivedFormData.filterObject.housingSubscription,
      couponUsed: receivedFormData.filterObject.couponUsed,
    };
    const res = await getDepositRecommendList(params, body);
    recommendProducts.value = res?.data ?? [];
  } catch (e) {
    console.log(e);
  } finally {
    isLoadingRecommend.value = false;
  }
};

const toNum = (v) => {
  if (v == null) return NaN;
  const n = Number(String(v).replace(/[^\d.+-]/g, ''));
  return Number.isFinite(n) ? n : NaN;
};

const INTEREST_RANGE = {
  '1% 미만': { min: -Infinity, max: 1 },
  '1~2%': { min: 1, max: 2 },
  '2~3%': { min: 2, max: 3 },
  '3~4%': { min: 3, max: 4 },
  '4~5%': { min: 4, max: 5 },
  '5% 이상': { min: 5, max: Infinity },
};

// 기본금리 필터 매칭 (depositBasicRate 기준)
function matchInterestRanges(product) {
  if (!selectedInterests.value.length) return true;

  const rate = toNum(product.depositBasicRate);
  if (!Number.isFinite(rate)) return false;

  return selectedInterests.value.some((label) => {
    const r = INTEREST_RANGE[label];
    return r ? rate >= r.min && rate < r.max : false;
  });
}

// 전체보기 목록 필터
const filteredAllDeposit = computed(() => {
  let out = Array.isArray(allProducts.value) ? allProducts.value : [];

  // 검색어
  const q = (searchKeyword.value ?? '').toLowerCase().replace(/\s+/g, '');
  if (q) {
    out = out.filter((d) =>
      (d.depositProductName ?? '').toLowerCase().replace(/\s+/g, '').includes(q)
    );
  }

  // 은행 (적용된 값만)
  if (selectedTargets.value.length) {
    const set = new Set(selectedTargets.value);
    out = out.filter((p) => set.has(p.depositBankName));
  }

  // 금리 구간 (적용된 값만)
  out = out.filter((p) => matchInterestRanges(p));

  return out;
});

function toMonths(periodLabel) {
  if (typeof periodLabel === 'number') return periodLabel;
  const m = String(periodLabel).match(/(\d+)/);
  if (!m) return 12;
  const n = Number(m[1]);
  return /년/.test(periodLabel) ? n * 12 : n;
}

function hideSearchResults() {
  showResults.value = false;
  summaryText.value = '';
}

function toggleSummaryMode() {
  isSummaryMode.value = !isSummaryMode.value;
  if (!isSummaryMode.value) hideSearchResults();
}

/* ===== 필터 드롭다운: 임시선택 → 확인 시 반영 ===== */

// 열기: 현재 적용값을 임시값으로 복사
function openFilter() {
  pendingTargets.value = [...selectedTargets.value];
  pendingInterests.value = [...selectedInterests.value];
  showFilter.value = true;
}

// 임시 토글
function togglePendingTag(kind, tagValue) {
  const arr = kind === 'bank' ? pendingTargets.value : pendingInterests.value;
  const idx = arr.indexOf(tagValue);
  if (idx > -1) arr.splice(idx, 1);
  else arr.push(tagValue);
}

// 임시선택 초기화
function resetPending() {
  pendingTargets.value = [];
  pendingInterests.value = [];
}

// 적용(확인): 임시값 → 실제값 복사
function applyFilter() {
  selectedTargets.value = [...pendingTargets.value];
  selectedInterests.value = [...pendingInterests.value];
  showFilter.value = false;
}

// 요약 표시용
const preferSummary = computed(() => {
  const raw = formData.value.selectedPrefer || [];
  const arr = [...new Set(raw.filter(Boolean).map((s) => String(s).trim()))];
  if (arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  return `${arr[0]} 외 ${arr.length - 1}건`;
});
</script>

<style scoped>
/* (기존 스타일 그대로) */
.deposit-container {
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
  color: var(--color-text-light);
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

.emoji {
  font-size: 20px;
  vertical-align: middle;
}
.summary-text-box {
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
  min-width: 0;
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
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.summary-text-container::-webkit-scrollbar {
  display: none;
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
.summary-item-value {
  font-size: 12px;
  color: #333;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
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
.info-text {
  position: relative;
  display: flex;
  justify-content: center;
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
  z-index: 10;
  position: absolute;
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

.recommend-card-list {
  margin-top: 16px;
}
.filter-action-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
}
.reset-btn,
.complete-btn {
  flex: 1;
  padding: 10px 0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
}
.reset-btn {
  background: #f1f3f5;
  color: #333;
}
.reset-btn:hover {
  background: #e9ecef;
}
.complete-btn {
  background: var(--color-main-dark);
  color: white;
}
.complete-btn:hover {
  background: #3b5bdb;
}
</style>
