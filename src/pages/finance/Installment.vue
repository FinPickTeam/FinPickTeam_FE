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
              <div class="summary-item-box">
                <span class="summary-item-value">{{ savingTypeText }}</span>
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
      <div v-if="isLoadingRecommend">
        <LoadingSpinner message="추천 상품을 불러오는 중..." />
      </div>
      <div class="recommend-product-container">
        <ProductCardList
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
    <div class="scroll-area" v-else-if="activeSubtab === '전체 보기'">
      <div class="search-filter-container">
        <div class="search-filter-row">
          <input
            v-model="searchKeyword"
            class="search-bar"
            type="text"
            placeholder="적금 상품명을 검색해보세요"
          />
          <button class="filter-btn" @click="openFilter">
            <i class="fa-solid fa-filter"></i>
          </button>
        </div>

        <!-- 태그 필터 (드롭다운) -->
        <div v-if="showFilter" class="filter-dropdown">
          <!-- 은행 섹션 -->
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

          <!-- 금리 구간 섹션 -->
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

          <!-- 버튼 영역: 초기화 / 확인 -->
          <div class="filter-actions">
            <button class="reset-btn" @click="resetPending">초기화</button>
            <button class="apply-btn" @click="applyFilter">확인</button>
          </div>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoadingAll">
        <LoadingSpinner message="상품 목록을 불러오는 중..." />
      </div>

      <!-- 전체 상품 리스트 -->
      <div
        v-else-if="filteredAllInstallment && filteredAllInstallment.length > 0"
        class="products-list-container"
      >
        <ProductCardList :products="filteredAllInstallment" />
      </div>
      <div v-else class="no-results">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>검색 조건에 맞는 적금 상품이 없습니다.</p>
      </div>
    </div>
    <MyData :open="show" @close="show = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ProductInputForm from '../../components/finance/installment/ProductInputForm_installment.vue';
import ProductCardList from '../../components/finance/installment/ProductCardList_installment.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { getInstallmentList, getInstallmentRecommendList } from '@/api';
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
  period: '1년',
  amount: 100000,
  savingType: '자유적립식',
  selectedPrefer: [],
});
const fav = useFavoriteStore();
const myDataStore = useMyDataStore();

// 전체보기용 상태
const searchKeyword = ref('');

// 드롭다운 표시
const showFilter = ref(false);

// ✅ "적용된" 필터 (실제 리스트에 반영되는 값)
const selectedTargets = ref([]); // 은행
const selectedInterests = ref([]); // 금리 구간

// ✅ "대기(pending) 중" 필터 (드롭다운에서 임시 선택)
const pendingTargets = ref([]);
const pendingInterests = ref([]);

const periodText = computed(() => formData.value.period || '-');
const amountText = computed(() =>
  Number(formData.value.amount ?? 0).toLocaleString()
);
const savingTypeText = computed(() => formData.value.savingType || '-');

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

onMounted(() => {
  fetchInstallmentList();
  fav.syncIdSet('INSTALLMENT');
  if (!myDataStore.linked) {
    show.value = true;
  }
});

// 적금 상품 목록 가져오기
const fetchInstallmentList = async (params) => {
  isLoadingAll.value = true;
  try {
    const res = await getInstallmentList(params);
    allProducts.value = res.data ?? [];
  } catch (e) {
    console.log(e);
  } finally {
    isLoadingAll.value = false;
  }
};

// 적금 추천 목록 가져오기
const fetchInstallmentRecommendation = async (receivedFormData) => {
  isLoadingRecommend.value = true;
  try {
    const params = {
      amount: receivedFormData.amount,
      period: toMonths(receivedFormData.period),
    };
    const body = {
      autoTransfer: receivedFormData.filterObject.autoTransfer,
      couponUsed: receivedFormData.filterObject.couponUsed,
      openBanking: receivedFormData.filterObject.openBanking,
      utilityPayment: receivedFormData.filterObject.utilityPayment,
      marketingConsent: receivedFormData.filterObject.marketingConsent,
      housingSubscription: receivedFormData.filterObject.housingSubscription,
      greenMission: receivedFormData.filterObject.greenMission,
      incomeTransfer: receivedFormData.filterObject.incomeTransfer,
      newCustomer: receivedFormData.filterObject.newCustomer,
    };
    const res = await getInstallmentRecommendList(params, body);
    recommendProducts.value = res?.data ?? [];
  } catch (e) {
    console.log(e);
  } finally {
    isLoadingRecommend.value = false;
  }
};

// 🔎 전체보기 필터링된 데이터
const filteredAllInstallment = computed(() => {
  const list = Array.isArray(allProducts.value) ? allProducts.value : [];

  // 1) 키워드
  const q = (searchKeyword.value ?? '').toLowerCase().replace(/\s+/g, '');
  let out = q
    ? list.filter((d) =>
        (d.installmentProductName ?? '')
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(q)
      )
    : list;

  // 2) 은행 필터 (확인 눌러 반영된 selectedTargets)
  if (selectedTargets.value.length > 0) {
    out = out.filter((d) => {
      const bank = getBankName(d);
      return selectedTargets.value.includes(bank);
    });
  }

  // 3) 금리 구간 필터 (확인 눌러 반영된 selectedInterests)
  if (selectedInterests.value.length > 0) {
    out = out.filter((d) => {
      const rate = getMaxRate(d); // 숫자(% 제외)로 파싱
      return interestRangeMatch(rate, selectedInterests.value);
    });
  }

  return out;
});

// ===== Helper =====

// 기간 문자열 → 개월 수
function toMonths(periodLabel) {
  if (typeof periodLabel === 'number') return periodLabel;
  const m = String(periodLabel).match(/(\d+)/);
  if (!m) return 12;
  const n = Number(m[1]);
  return /년/.test(periodLabel) ? n * 12 : n;
}

function goTo(path) {
  router.push(path);
}

function changeSubtab(tabName) {
  activeSubtab.value = tabName;
}

function showSearchResults(receivedFormData) {
  showResults.value = true;
  formData.value = receivedFormData;
  summaryText.value = 'show'; // 표시 트리거만
  fetchInstallmentRecommendation(receivedFormData);
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

// ====== 필터 드롭다운 동작 (임시 선택 → 확인 시 반영) ======

function openFilter() {
  // 현재 적용된 값 → 임시 선택 복사
  pendingTargets.value = [...selectedTargets.value];
  pendingInterests.value = [...selectedInterests.value];
  showFilter.value = true;
}

function togglePendingTag(kind, value) {
  const arr = kind === 'bank' ? pendingTargets.value : pendingInterests.value;
  const idx = arr.indexOf(value);
  if (idx > -1) arr.splice(idx, 1);
  else arr.push(value);
}

function resetPending() {
  pendingTargets.value = [];
  pendingInterests.value = [];
}

function applyFilter() {
  // 임시 선택을 실제 적용 값으로 복사
  selectedTargets.value = [...pendingTargets.value];
  selectedInterests.value = [...pendingInterests.value];
  closeFilter();
}

function closeFilter() {
  showFilter.value = false;
}

// ====== 데이터 파싱/매칭 유틸 ======

function getBankName(d) {
  return d.installmentBankName;
}

function getMaxRate(d) {
  const raw = d.installmentBasicRate;
  if (typeof raw === 'number') return raw;
  // "5.2%" 같은 문자열 → 5.2
  const matched = String(raw).match(/[\d.]+/);
  return matched ? Number(matched[0]) : 0;
}

function interestRangeMatch(rate, ranges) {
  if (rate == null || isNaN(rate)) return false;

  const inRange = (label) => {
    switch (label) {
      case '1% 미만':
        return rate < 1;
      case '1~2%':
        return rate >= 1 && rate < 2;
      case '2~3%':
        return rate >= 2 && rate < 3;
      case '3~4%':
        return rate >= 3 && rate < 4;
      case '4~5%':
        return rate >= 4 && rate < 5;
      case '5% 이상':
        return rate >= 5;
      default:
        return true;
    }
  };

  return ranges.some(inRange);
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
.installment-container {
  max-width: 390px;
  margin: 0 auto;
  padding: 0px 16px;
  font-family: var(--font-main);
  height: calc(100vh - 56px);
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

.info-text {
  position: relative;
  display: flex;
  justify-content: center;
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
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
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
.recommend-product-container {
  margin-top: 16px;
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

/* 버튼 영역 */
.filter-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
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
.apply-btn {
  background: var(--color-main);
  color: #fff;
}
.apply-btn:hover {
  background: var(--color-main-dark);
}
</style>
