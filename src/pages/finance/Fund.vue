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
          <div class="button-container">
            <button class="check-btn incomplete" @click="goToInvestmentTest">
              투자성향 검사 완료하기
            </button>
          </div>
          <div class="info-text">
            <span class="emoji">📝</span>
            <br />
            투자성향 검사를 완료하면<br />맞춤형 펀드를 추천받을 수 있어요!
          </div>
        </div>

        <!-- 투자성향이 완전한 경우 -->
        <div v-else>
          <div class="button-container">
            <button class="check-btn" @click="fetchFundRecommendedList">
              투자 성향에 맞는 상품 확인하기
            </button>
          </div>
          <div class="info-text">
            <span class="emoji">💡</span>
            <br />
            투자 성향에 맞는 펀드를 추천받아보세요!
          </div>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="isLoadingRecommend">
          <LoadingSpinner message="추천 상품을 불러오는 중..." />
        </div>

        <!-- 펀드 상품 리스트 -->
        <div
          v-if="showProducts && !isLoadingRecommend && fundRecommendData.data"
          class="products-container"
        >
          <ProductCardList_fund :funds="fundRecommendData.data || []" />
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
            <!-- 펀드 타입 섹션 -->
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

            <!-- 위험도 섹션 -->
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
  import { checkSurveyCompletion, getProfileByUserId, getFundList, getFundRecommendedList } from '@/api';
  import { useFavoriteStore } from '@/stores/favorite';
  import {useProfileStore} from '@/stores/profile.js'

  const router = useRouter();
  const showProducts = ref(false);
  const isLoadingRecommend = ref(false);
  const isLoadingAll = ref(false);
  const fundAllData = ref([]);
  const fundRecommendData = ref([]);
  const fav = useFavoriteStore();
  const profile=useProfileStore();

  // 투자성향 관련 상태
  const investmentPropensity = ref(null);
  const hasIncompletePropensity = ref(false);
  const isLoadingPropensity = ref(false);

  // 확정된(실제로 목록을 거르는) 값
  const selectedFundTypes = ref([]);
  const selectedRisks = ref([]);

  // 드래프트(팝업에서만 바뀌는 임시 값)
  const draftFundTypes = ref([]);
  const draftRisks = ref([]);

  onMounted(() => {
    initializeRecommendTab();
    fetchFundList();
    fav.syncIdSet('FUND');
  });

  const initializeRecommendTab = async () => {
    isLoadingPropensity.value = true;
    investmentPropensity.value = null;
    try {
      // 1. 설문 완료 여부를 '한 번만' 확인합니다.
      const completionResponse = await checkSurveyCompletion();

      if (completionResponse.data === false) {
        // 2a. 설문이 미완료 상태이면, 즉시 설문 페이지로 보냅니다.
        console.log("설문 미완료 상태. 추가 설문 페이지로 이동합니다.");
        const profileResponse = await getProfileByUserId();
        profile.loadAnswers(profileResponse.data);
        router.push('/mypage/financetest/profile-step-6?from=fund');
        return; // 여기서 함수 실행을 중단하여 더 이상 진행하지 않도록 합니다.
      }

      // 2b. 설문을 완료했다면, 상세 정보를 가져옵니다.
      hasIncompletePropensity.value = false;
      const profileResponse = await getProfileByUserId();
      investmentPropensity.value = profileResponse.data;
      console.log('투자성향 상세 정보:', investmentPropensity.value);

    } catch (error) {
      console.error("투자성향 정보 확인 중 오류 발생", error);
      // 에러 발생 시에도 설문 페이지로 보내는 것이 안전합니다.
      router.push('/mypage/financetest/profile-step-6?from=fund');
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
    showProducts.value = false; // 추천 탭 누르면 초기화

    // 추천 탭으로 돌아올 때 투자성향 재확인
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
    // 🔍 키워드 검색
    if (searchKeyword.value) {
      list = list.filter((fund) =>
        fund.fundProductName
          ?.toLowerCase()
          .replace(/\s+/g, '')
          .includes(searchKeyword.value.toLowerCase().replace(/\s+/g, ''))
      );
    }

    // 🏦 펀드 타입 필터
    if (selectedFundTypes.value.length > 0) {
      list = list.filter((fund) =>
        selectedFundTypes.value.includes(fund.fundType || '')
      );
    }

    // ⚠️ 위험도 필터
    if (selectedRisks.value.length > 0) {
      list = list.filter((fund) =>
        selectedRisks.value.includes(fund.fundRiskLevel || '')
      );
    }
    console.log('전체 데이터 확인', list);
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

  // 투자성향 조회 및 null 값 체크
  const fetchInvestmentPropensity = async () => {

    // 로딩 상태 시작 및 이전 데이터 초기화
    isLoadingPropensity.value = true;
    investmentPropensity.value = null;

    try {
      // 10문항 설문 완료 여부를 먼저 API로 확인
      const completionResponse = await checkSurveyCompletion();

      // 서버 응답에 따라 분기 처리
      if (completionResponse.data === true) {
        // 설문을 완료했다면, 미완료 상태를 'false'로 설정
        hasIncompletePropensity.value = false;

        // 추가로 '내 투자성향 상세 정보'를 API로 조회
        const profileResponse = await getProfileByUserId();
        investmentPropensity.value = profileResponse.data;
        console.log('투자성향 상세 정보:', investmentPropensity.value);

      } else {
        //3-1 설문을 완료하지 않았다면, 미완료 상태를 'true'로 설정
        hasIncompletePropensity.value = true;
        console.log('투자성향 미완료 상태입니다.');
      }
    } catch (error) {
      //API 호출 중 에러 발생 시 처리
      console.error("투자성향 정보 확인 중 오류 발생", error);
      //에러 발생 시에도 사용자가 다음 행동을 할 수 있도록 미완료 상태로 처리
      hasIncompletePropensity.value = true;
    } finally {
      //모든 과정이 끝나면 로딩 상태 종료
      isLoadingPropensity.value = false;
    }
  };

  // 투자성향 검사 페이지로 이동
  const goToInvestmentTest = () => {
    router.push('/mypage/financetest/profile-step-6?from=fund');
  };

  const fetchFundRecommendedList = async () => {
    isLoadingRecommend.value = true;
    try {
      console.log('투자 성향에 맞는 상품 확인하기 클릭됨');
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

  .check-btn.incomplete {
    background: var(--color-main);
  }

  .check-btn.incomplete:hover {
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
