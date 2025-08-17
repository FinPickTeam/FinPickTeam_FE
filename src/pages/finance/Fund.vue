<template>
  <div class="fund-container">
    <!-- 상단 탭 -->
    <div class="tab-row">
      <span class="tab" @click="goTo('/finance/deposit')">예금</span>
      <span class="tab" @click="goTo('/finance/installment')">적금</span>
      <span class="tab active" @click="goTo('/finance/fund')">펀드</span>
      <span class="tab" @click="goTo('/finance/stock')">주식</span>
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
      <!-- 로딩 상태 -->
      <div v-if="isLoadingPropensity" class="button-container">
        <LoadingSpinner message="투자성향을 확인하는 중..." />
      </div>

      <!-- 투자성향이 불완전한 경우 -->
      <div v-else-if="hasIncompletePropensity">
        <div class="propensity-card">
          <div class="propensity-card__left">
            <div class="propensity-badge">STEP</div>
            <h3 class="propensity-title">
              투자 성향 검사를<br />완료해 주세요
            </h3>
            <p class="propensity-desc">
              📝 펀드 추천을 받기 위해선 추가적인 조사가 필요해요!<br />
              이를 통해 더 나은 결과를 드릴 수 있어요
            </p>
            <button class="cta-btn" @click="goToInvestmentTest">
              투자성향 검사 완료하기
              <span class="cta-arrow" aria-hidden="true">→</span>
            </button>
            <p class="cta-help">약 1~2분 소요 • 언제든 다시 수정할 수 있어요</p>
          </div>
          <div class="propensity-card__right" aria-hidden="true">
            <div class="ring ring--1"></div>
            <div class="ring ring--2"></div>
            <div class="ring ring--3"></div>
          </div>
        </div>
      </div>

      <!-- 투자성향이 완전한 경우 -->
      <div v-else class="recommend-container">
        <div class="recommend-content">
          <button
            class="btn-outline with-icon"
            @click="fetchFundRecommendedList"
            :disabled="isLoadingRecommend"
            :aria-busy="isLoadingRecommend ? 'true' : 'false'"
          >
            <i class="fa-solid fa-chart-line" aria-hidden="true"></i>
            <span>투자 성향에 맞는 상품 확인하기</span>
          </button>

          <!-- 처음 한 번만 보이고, 누르면 영구히 숨김 -->
          <p v-if="!hasRequestedRecommend" class="recommend-hint">
            지금 버튼을 누르면 맞춤 상품을 바로 확인할 수 있어요.
          </p>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoadingRecommend">
        <LoadingSpinner message="추천 상품을 불러오는 중..." />
      </div>

      <!-- 펀드 상품 리스트 -->
      <div
        v-if="showProducts && !isLoadingRecommend && fundRecommendData"
        class="products-container"
      >
        <ProductCardList_fund :funds="fundRecommendData || []" />
        <span class="subtab info-text">
          시장 흐름과 상품 특성을 고려하여,<br />
          사용자의 투자 성향에 맞게 선별된 추천 결과입니다.
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
            placeholder="펀드명을 검색해보세요"
          />
          <button class="filter-btn" @click="openFilter">
            <i class="fa-solid fa-filter"></i>
          </button>
        </div>

        <!-- 태그 필터 -->
        <div v-if="showFilter" class="filter-dropdown">
          <div class="filter-section">
            <h4 class="filter-section-title">펀드 타입</h4>
            <div class="tag-container">
              <button
                v-for="tag in fundTypeTags"
                :key="tag.value"
                class="filter-tag"
                :class="{ active: draftFundTypes.includes(tag.value) }"
                @click="toggleDraftFundType(tag.value)"
              >
                {{ tag.label }}
              </button>
            </div>
          </div>

          <div class="filter-section">
            <h4 class="filter-section-title">위험도</h4>
            <div class="tag-container">
              <button
                v-for="tag in riskTags"
                :key="tag.value"
                class="filter-tag"
                :class="{ active: draftRisks.includes(tag.value) }"
                @click="toggleDraftRisk(tag.value)"
              >
                {{ tag.label }}
              </button>
            </div>
          </div>

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
        v-else-if="filteredAllFunds && filteredAllFunds.length > 0"
        class="products-list-container"
      >
        <ProductCardList_fund :funds="filteredAllFunds" />
      </div>
      <div v-else class="no-results">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>검색 조건에 맞는 펀드가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductCardList_fund from '@/components/finance/fund/ProductCardList_fund.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import {
  checkSurveyCompletion,
  getProfileByUserId,
  getFundList,
  getFundRecommendedList,
} from '@/api';
import { useFavoriteStore } from '@/stores/favorite';
import { useProfileStore } from '@/stores/profile.js';

const router = useRouter();
const showProducts = ref(false);
const isLoadingRecommend = ref(false);
const isLoadingAll = ref(false);
const fundAllData = ref([]);
const fundRecommendData = ref([]);
const fav = useFavoriteStore();
const profile = useProfileStore();

// 투자성향 관련 상태
const investmentPropensity = ref(null);
const hasIncompletePropensity = ref(false);
const isLoadingPropensity = ref(false);

// 추천 안내 문구 노출 제어(클릭 후 영구 숨김)
const hasRequestedRecommend = ref(false);

// 확정된(실제로 목록을 거르는) 값
const selectedFundTypes = ref([]);
const selectedRisks = ref([]);

// 드래프트(팝업에서만 바뀌는 임시 값)
const draftFundTypes = ref([]);
const draftRisks = ref([]);

onMounted(async () => {
  await initializeRecommendTab();
  await fetchFundList();
  fav.syncIdSet('FUND');
});

const initializeRecommendTab = async () => {
  isLoadingPropensity.value = true;
  investmentPropensity.value = null;
  try {
    const completionResponse = await checkSurveyCompletion();

    if (completionResponse.data === false) {
      hasIncompletePropensity.value = true;
      try {
        const profileResponse = await getProfileByUserId();
        profile.loadAnswers(profileResponse.data);
      } catch (_) {}
    } else {
      hasIncompletePropensity.value = false;
      const profileResponse = await getProfileByUserId();
      investmentPropensity.value = profileResponse.data;
      profile.loadAnswers(profileResponse.data);
    }
  } catch (error) {
    console.error('투자성향 정보 확인 중 오류 발생', error);
    hasIncompletePropensity.value = true;
  } finally {
    isLoadingPropensity.value = false;
  }
};

const fetchFundList = async () => {
  isLoadingAll.value = true;
  try {
    const res = await getFundList();
    fundAllData.value = res.data ?? [];
  } catch (error) {
    console.log('펀드 전체 목록 조회 실패', error);
  } finally {
    isLoadingAll.value = false;
  }
};

function goTo(path) {
  router.push(path);
}

const activeSubtab = ref('추천');
function changeSubtab(tabName) {
  activeSubtab.value = tabName;
  showProducts.value = false;

  if (tabName === '추천') {
    fetchInvestmentPropensity();
  }
}

// 태그 토글 함수들
function toggleDraftFundType(tag) {
  const i = draftFundTypes.value.indexOf(tag);
  i > -1 ? draftFundTypes.value.splice(i, 1) : draftFundTypes.value.push(tag);
}
function toggleDraftRisk(tag) {
  const i = draftRisks.value.indexOf(tag);
  i > -1 ? draftRisks.value.splice(i, 1) : draftRisks.value.push(tag);
}

// 전체보기용 상태
const searchKeyword = ref('');
const showFilter = ref(false);

// 태그 데이터
const fundTypeTags = ref([
  { value: '주식형', label: '주식형' },
  { value: '채권형', label: '채권형' },
  { value: '혼합형', label: '혼합형' },
]);

const riskTags = ref([
  { value: '높은 위험', label: '높은 위험' },
  { value: '보통 위험', label: '보통 위험' },
  { value: '낮은 위험', label: '낮은 위험' },
]);

// 전체보기 필터링된 데이터
const filteredAllFunds = computed(() => {
  let list = Array.isArray(fundAllData.value) ? fundAllData.value : [];
  if (searchKeyword.value) {
    list = list.filter((fund) =>
      fund.fundProductName
        ?.toLowerCase()
        .replace(/\s+/g, '')
        .includes(searchKeyword.value.toLowerCase().replace(/\s+/g, ''))
    );
  }

  if (selectedFundTypes.value.length > 0) {
    list = list.filter((fund) =>
      selectedFundTypes.value.includes(fund.fundType || '')
    );
  }

  if (selectedRisks.value.length > 0) {
    list = list.filter((fund) =>
      selectedRisks.value.includes(fund.fundRiskLevel || '')
    );
  }
  return list;
});

function openFilter() {
  draftFundTypes.value = [...selectedFundTypes.value];
  draftRisks.value = [...selectedRisks.value];
  showFilter.value = true;
}

function closeFilter() {
  selectedFundTypes.value = [...draftFundTypes.value];
  selectedRisks.value = [...draftRisks.value];
  showFilter.value = false;
}

// 투자성향 조회 (추천 탭 복귀 시 사용)
const fetchInvestmentPropensity = async () => {
  isLoadingPropensity.value = true;
  investmentPropensity.value = null;

  try {
    const completionResponse = await checkSurveyCompletion();

    if (completionResponse.data === true) {
      hasIncompletePropensity.value = false;
      const profileResponse = await getProfileByUserId();
      investmentPropensity.value = profileResponse.data;
      profile.loadAnswers(profileResponse.data);
    } else {
      hasIncompletePropensity.value = true;
      try {
        const profileResponse = await getProfileByUserId();
        profile.loadAnswers(profileResponse.data);
      } catch (_) {}
    }
  } catch (error) {
    console.error('투자성향 정보 확인 중 오류 발생', error);
    hasIncompletePropensity.value = true;
  } finally {
    isLoadingPropensity.value = false;
  }
};

// 투자성향 검사 페이지로 이동
const goToInvestmentTest = () => {
  router.push('/profile-step-6?from=fund');
};

const fetchFundRecommendedList = async () => {
  hasRequestedRecommend.value = true; // ← 클릭 즉시 안내문구 영구 숨김
  isLoadingRecommend.value = true;
  try {
    const res = await getFundRecommendedList();
    fundRecommendData.value = res.data ?? [];
    showProducts.value = true;
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingRecommend.value = false;
  }
};
</script>

<style scoped>
.fund-container {
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

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.products-container {
  margin-top: 10px;
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
.info-text {
  position: relative;
  display: flex;
  justify-content: center;
}

.complete-btn:hover {
  background: var(--color-main-dark);
}

/* ===== Incomplete Propensity CTA Card ===== */
.propensity-card {
  display: grid;
  grid-template-columns: 1fr 96px;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-top: 16px;
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f7f5ff 0%, #ffffff 60%);
  border: 1px solid var(--color-bg-border);
  box-shadow: 0 6px 14px rgba(93, 68, 201, 0.06);
}

.propensity-card__left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.propensity-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #6f5de7;
  background: #edeaff;
  border: 1px solid #ddd7ff;
  padding: 6px 10px;
  border-radius: 20px;
}

.propensity-title {
  margin: 0;
  font-size: 18px;
  line-height: 1.35;
  color: #1e1e1e;
  font-weight: 800;
}

.propensity-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #585a66;
}

.cta-btn {
  margin-top: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  box-shadow: 0 6px 18px rgba(111, 93, 231, 0.28);
  transition: transform 0.08s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(111, 93, 231, 0.35);
}

.cta-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(111, 93, 231, 0.22);
}

.cta-arrow {
  display: inline-block;
  transform: translateX(0);
  transition: transform 0.15s ease;
}

.cta-btn:hover .cta-arrow {
  transform: translateX(2px);
}

.cta-help {
  margin: 0;
  font-size: 12px;
  color: #8b8ea0;
}

/* 오른쪽 장식 링(비주얼) */
.propensity-card__right {
  position: relative;
  width: 96px;
  height: 96px;
}

.ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(111, 93, 231, 0.15);
  animation: ringPulse 3s ease-in-out infinite;
}

.ring--2 {
  inset: 10px;
  border-color: rgba(111, 93, 231, 0.2);
  animation-delay: 0.6s;
}

.ring--3 {
  inset: 20px;
  border-color: rgba(111, 93, 231, 0.28);
  animation-delay: 1.2s;
}

@keyframes ringPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.03);
    opacity: 1;
  }
}

/* 추천 CTA + 안내 문구 */
.recommend-container {
  display: flex;
  justify-content: center;
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
</style>
