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
      <!-- 투자 성향에 맞는 상품 확인하기 버튼 -->
      <div class="button-container">
        <button class="check-btn" @click="checkInvestmentProducts">
          투자 성향에 맞는 상품 확인하기
        </button>
      </div>

      <!-- 펀드 상품 리스트 -->
      <div v-if="showProducts" class="products-container">
        <ProductCardList_fund :funds="fundRecommendData.data" />
      </div>

      <!-- 추천 상품이 없을 때 안내 메시지 -->
      <div v-else-if="!showProducts" class="info-text">
        <span class="emoji">💡</span>
        <br />
        투자 성향에 맞는 펀드를 추천받아보세요!
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
          <button class="filter-btn" @click="showFilter = !showFilter">
            <i class="fa-solid fa-filter"></i>
          </button>
        </div>

        <!-- 드롭다운 필터 -->
        <div v-if="showFilter" class="filter-dropdown">
          <div class="filter-group">
            <label>펀드 타입</label>
            <select v-model="selectedType">
              <option value="">전체</option>
              <option value="주식형">주식형</option>
              <option value="채권형">채권형</option>
              <option value="혼합형">혼합형</option>
            </select>
          </div>
          <div class="filter-group">
            <label>위험도</label>
            <select v-model="selectedRisk">
              <option value="">전체</option>
              <option value="높은 위험">높은 위험</option>
              <option value="보통 위험">보통 위험</option>
              <option value="낮은 위험">낮은 위험</option>
            </select>
          </div>
          <div class="filter-group">
            <label>정렬</label>
            <select v-model="sortOption">
              <option value="name">이름순</option>
              <option value="return">수익률순</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 전체 상품 리스트 -->
      <div v-if="filteredAllFunds.length > 0" class="products-list-container">
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ProductCardList_fund from '@/components/finance/fund/ProductCardList_fund.vue';
import fundAllData from '@/components/finance/fund/fund_all.json';
import fundRecommendData from '@/components/finance/fund/fund_recommend.json';

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
const selectedType = ref('');
const selectedRisk = ref('');
const sortOption = ref('name');

// 전체보기 필터링된 데이터
const filteredAllFunds = computed(() => {
  let result = fundAllData.data;

  // 🔍 키워드 검색
  if (searchKeyword.value) {
    result = result.filter((fund) =>
      fund.name
        ?.toLowerCase()
        .replace(/\s+/g, '')
        .includes(searchKeyword.value.toLowerCase().replace(/\s+/g, ''))
    );
  }

  // 🏦 펀드 타입 필터
  if (selectedType.value) {
    result = result.filter((fund) => fund.type === selectedType.value);
  }

  // ⚠️ 위험도 필터
  if (selectedRisk.value) {
    result = result.filter((fund) => fund.risk === selectedRisk.value);
  }

  // 📊 정렬
  if (sortOption.value === 'name') {
    result = [...result].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption.value === 'return') {
    result = [...result].sort((a, b) => {
      const returnA = Number(a.returnRate.replace('%', ''));
      const returnB = Number(b.returnRate.replace('%', ''));
      return returnB - returnA;
    });
  }

  return result;
});
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
