<template>
  <div class="detail-container">
    <!-- 로딩 상태 -->
    <div v-show="isLoading" class="loading-section">
      <div class="loading-spinner"></div>
      <p class="loading-text">상품 정보를 불러오는 중...</p>
    </div>

    <!-- 제목과 찜하기 -->
    <div v-show="!isLoading" class="title-section">
      <div class="title-with-heart">
        <h1 class="product-title">{{ product.stockName }}</h1>
        <i
          :class="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
          class="heart-icon"
          @click="toggleFavorite"
        ></i>
      </div>
      <!-- 용어 하이라이팅 토글 버튼 -->
      <div class="toggle-section">
        <label class="toggle-label">
          <input
            type="checkbox"
            v-model="isHighlightEnabled"
            class="toggle-input"
          />
          <span class="toggle-text">단어 마법사</span>
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>
    <div class="content-scroll">
      <!-- 수익률 차트 섹션 -->
      <div
        class="chart-section"
        v-if="unref(product).stockChartData && !isLoading"
      >
        <div class="chart-card">
          <h3 class="chart-title">주가 상승률</h3>
          <StockChart :chart-data="unref(product).stockChartData" />
        </div>
      </div>

      <!-- 투자 시뮬레이션 섹션 -->
      <div v-show="!isLoading" class="stock-simulation">
        <div class="simulation-container">
          <div class="simulation-title">
            <span class="s-title">투자 시뮬레이션 </span>
            <!-- 시작/로딩 아이콘 버튼 -->
            <img
              :src="currentIcon"
              :class="['start-icon', { spinning: simulationLoading }]"
              alt="시작"
              role="button"
              tabindex="0"
              @click="getSimulationReturns"
              @keydown.enter.space.prevent="getSimulationReturns"
            />
          </div>
          <div class="select-date-panel">
            <div class="select-date">
              <input type="date" v-model="startDate" />
            </div>
            <div class="select-date">~</div>
            <div class="select-date">
              <input type="date" v-model="endDate" />
            </div>
          </div>
          <div class="result-content">
            <span v-if="!simulationLoading && !hasResult" class="reuslt-text"
              >시작·종료 날짜를 입력 후 검색 아이콘을 누르면 <br />투자 결과를
              볼 수 있습니다.</span
            >
            <span v-if="!simulationLoading && hasResult" class="result-text">
              {{ formattedStartDate }}부터 {{ formattedEndDate }}까지
              <br />100만원을 투자했다면
              <span
                class="result-value"
                :class="{ red: isProfit, blue: isLoss, gray: isFlat }"
              >
                {{ formattedAbsAmount }}원</span
              >의 <span v-if="isProfit">수익</span
              ><span v-if="!isProfit">손실</span>이 발생했습니다.
            </span>
            <span v-if="simulationLoading" class="result-text">
              {{ product.stockName }}의 수익률을 계산중입니다.
            </span>
          </div>
        </div>
      </div>

      <!-- 상세 정보 섹션 -->
      <div class="detail-section" v-if="product.stockName">
        <div class="detail-card">
          <div class="detail-item">
            <span class="detail-label">
              <FinancialTermSystem
                text="주가"
                :financial-terms="financialTerms"
                :is-enabled="isHighlightEnabled"
              />
            </span>
            <span class="detail-value">
              <FinancialTermSystem
                :text="product.stockPrice + '원'"
                :financial-terms="financialTerms"
                :is-enabled="isHighlightEnabled"
              />
              /
              <span
                :class="
                  product.stockChangeRate.startsWith('-')
                    ? 'negative'
                    : 'positive'
                "
              >
                {{ product.stockPredictedPrice }}원
              </span>
              /
              <span
                :class="
                  product.stockChangeRate.startsWith('-')
                    ? 'negative'
                    : 'positive'
                "
              >
                {{ product.stockChangeRate }}%
              </span>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">
              <FinancialTermSystem
                text="연중 H/L"
                :financial-terms="financialTerms"
                :is-enabled="isHighlightEnabled"
              />
            </span>
            <span class="detail-value">
              <FinancialTermSystem
                :text="`${String(product.stockYearHigh).replace(
                  /^[-+]/,
                  ''
                )}원 / ${String(product.stockYearLow).replace(/^[-+]/, '')}원`"
                :financial-terms="financialTerms"
                :is-enabled="isHighlightEnabled"
              />
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">
              <FinancialTermSystem
                text="액면가"
                :financial-terms="financialTerms"
                :is-enabled="isHighlightEnabled"
              />
            </span>
            <span class="detail-value">
              <FinancialTermSystem
                :text="product.stockFaceValue + '원'"
                :financial-terms="financialTerms"
                :is-enabled="isHighlightEnabled"
              />
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">
              <FinancialTermSystem
                text="시가총액"
                :financial-terms="financialTerms"
                :is-enabled="isHighlightEnabled"
              />
            </span>
            <span class="detail-value">
              <FinancialTermSystem
                :text="`${Number(
                  product.stockMarketCap
                ).toLocaleString()}억 원`"
                :financial-terms="financialTerms"
                :is-enabled="isHighlightEnabled"
              />
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">
              <FinancialTermSystem
                text="당기순이익"
                :financial-terms="financialTerms"
                :is-enabled="isHighlightEnabled"
              />
            </span>
            <span class="detail-value">
              <FinancialTermSystem
                :text="`${Number(
                  product.stockSalesAmount
                ).toLocaleString()}억 원`"
                :financial-terms="financialTerms"
                :is-enabled="isHighlightEnabled"
              />
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">
              <FinancialTermSystem
                text="PER"
                :financial-terms="financialTerms"
                :is-enabled="isHighlightEnabled"
              />
            </span>
            <span class="detail-value">
              <FinancialTermSystem
                :text="product.stockPer"
                :financial-terms="financialTerms"
                :is-enabled="isHighlightEnabled"
              />
            </span>
          </div>
        </div>
      </div>
      <!-- 이동하기 버튼 -->
      <div class="action-section" v-if="!isLoading">
        <p class="action-text">
          찜한 주식과 나의 종목, 지금 바로 비교해 보세요!
        </p>
        <p class="action-subtext">아래 버튼을 눌러 비교 페이지로 이동합니다</p>
        <button class="action-btn" @click="goToProduct">이동하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, unref } from 'vue';
import { useRoute } from 'vue-router';
import { useFavoriteStore } from '@/stores/favorite';
import FinancialTermSystem from '@/components/finance/FinancialTermSystem.vue';
import { getStockDetail, getStockReturns } from '@/api';
import StockChart from '@/components/finance/stock/StockChart.vue';
import loadingImg from '@/assets/stock_logo/loading.png';
import startImg from '@/assets/stock_logo/start.png';

const route = useRoute();
const favoriteStore = useFavoriteStore();

// 상품 데이터
const product = ref({});
const isLoading = ref(true);

// 용어 하이라이팅 관련 상태
const isHighlightEnabled = ref(false);
const financialTerms = ref([]);

// 투자 시뮬레이션
const startDate = ref('');
const endDate = ref('');
const simulationResult = ref('');
const simulationLoading = ref(false);
const hasResult = computed(() => !!String(simulationResult.value ?? '').trim());

const profitNumber = computed(() => {
  const v = simulationResult.value;
  const n =
    typeof v === 'number' ? v : Number(String(v).replace(/[^\d.-]/g, '')); // 기호/문자 제거
  return Number.isNaN(n) ? 0 : n;
});

const isProfit = computed(() => profitNumber.value > 0);
const isLoss = computed(() => profitNumber.value < 0);
const isFlat = computed(() => profitNumber.value === 0);
const currentIcon = computed(() =>
  simulationLoading.value ? loadingImg : startImg
);

// "+27,182" 같은 문자열/숫자 모두 처리 → "27,182"로 반환
const formattedAbsAmount = computed(() => {
  const s = String(simulationResult.value ?? '').trim();
  if (!s) return '';
  // 숫자와 음수 기호만 남기고 나머지(+, 콤마, 공백 등) 제거
  const n = Number(s.replace(/[^0-9-]/g, ''));
  if (Number.isNaN(n)) return '';
  return Math.abs(n).toLocaleString('ko-KR'); // 3자리마다 쉼표
});

onMounted(async () => {
  isLoading.value = true;
  try {
    await favoriteStore.syncAllIdSets();
    await Promise.all([fetchStockDetail(), loadFinancialTerms()]);
  } finally {
    isLoading.value = false;
  }
});

// 날짜 포맷 (yyyy년 mm월 dd일)
const formattedStartDate = computed(() => {
  if (!startDate.value) return '';
  const [y, m, d] = startDate.value.split('-');
  return `${y}년 ${m}월 ${d}일`;
});

const formattedEndDate = computed(() => {
  if (!endDate.value) return '';
  const [y, m, d] = endDate.value.split('-');
  return `${y}년 ${m}월 ${d}일`;
});

// 수익률 얻기
const getSimulationReturns = async () => {
  // 1) 입력 검증
  if (!startDate.value || !endDate.value) {
    console.warn('날짜를 선택하세요.');
    return;
  }
  if (startDate.value > endDate.value) {
    console.warn('시작일이 종료일보다 늦습니다.');
    return;
  }

  simulationLoading.value = true;
  try {
    // 2) 날짜 포맷: YYYYMMDD
    const apiStartDate = startDate.value.replace(/-/g, '');
    const apiEndDate = endDate.value.replace(/-/g, '');

    // 3) 종목코드(필요 시 6자리 보장)
    const stockCode = String(route.params.id).padStart(6, '0');

    const params = { stockCode, startDate: apiStartDate, endDate: apiEndDate };

    // 4) 비동기 호출 (await 필수)
    const res = await getStockReturns(params); // { status, message, data: "+27,182" }
    simulationResult.value = res?.data ?? '';
    // isProfit은 computed가 자동 계산
  } catch (err) {
    console.error(err);
    simulationResult.value = ''; // 실패 시 결과 비우기
  } finally {
    simulationLoading.value = false;
  }
};

// 금융 용어 사전 로드
const loadFinancialTerms = async () => {
  try {
    console.log('금융 용어 사전 로드 시작');
    const response = await fetch(
      '/src/pages/home/financial_dictionary_parsed.json'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    financialTerms.value = await response.json();
    console.log(
      '금융 용어 사전 로드 완료:',
      financialTerms.value.length,
      '개 용어'
    );
  } catch (error) {
    console.error('금융 용어 사전 로드 실패:', error);
    financialTerms.value = [];
  }
};

// 데이터 로드 함수
const fetchStockDetail = async () => {
  try {
    const stockCode = route.params.id;
    const res = await getStockDetail(stockCode);
    product.value = res.data ?? [];
  } catch (error) {
    console.log(error);
  }
};

// 찜하기 상태
const isFavorite = computed(() => {
  return favoriteStore.isFavorite(product.value);
});

function toggleFavorite() {
  if (isFavorite.value) {
    favoriteStore.removeFavorite(product.value);
  } else {
    favoriteStore.addFavorite(product.value);
  }
}
</script>

<style scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  height: calc(100dvh - 140px);
  max-width: 390px;
  margin: 0 auto;
  padding: 16px;
  font-family: var(--font-main);
  background: var(--color-bg-light);
}

.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0px 0 8px 0;
}

.title-with-heart {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bank-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.product-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
  flex: 1;
}

.heart-icon {
  font-size: 19px;
  color: #ff4757;
  cursor: pointer;
}

/* 로딩 스타일 */
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 14px;
  color: #666;
  margin: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.positive {
  color: red;
}
.negative {
  color: blue;
}

/* 토글 버튼 스타일 */
.toggle-section {
  margin-bottom: 0;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
}

.toggle-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 10px;
  transition: background-color 0.3s ease;
  margin-left: 8px;
}

.toggle-slider:before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked ~ .toggle-slider {
  background-color: var(--color-main);
}

.toggle-input:checked ~ .toggle-slider:before {
  transform: translateX(20px);
}

.toggle-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 하이라이팅된 용어 스타일 */
:deep(.highlighted-term) {
  background-color: #ffff00;
  color: #856404;
  padding: 2px 4px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: underline;
  transition: background-color 0.2s;
}

:deep(.highlighted-term:hover) {
  background-color: #ffeaa7;
}
.content-scroll {
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.content-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  min-width: 80px;
  flex-shrink: 0;
}

.detail-value {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  flex: 1;
  margin-left: 16px;
}

.chart-section {
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  text-align: center;
}
.start-icon {
  width: 28px;
  height: 28px;
  margin-left: 8px;
  cursor: pointer;
  user-select: none;
}

.spinning {
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.stock-simulation {
  width: 100%;
  height: 180px;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 20px;
  padding: 16px;
}
.simulation-title {
  display: flex;
  height: 30px;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}
.simulation-title img {
  width: 20px;
  height: auto;
}
.s-title {
  font-size: 16px;
  font-weight: 600;
}
.select-date-panel {
  display: flex;
  justify-content: space-between;
}
.select-date {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  margin-top: 20px;
}
.select-date input {
  width: 144px;
  height: 43px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: var(--font-main);
  background: #f8f9fa;
}
.date span {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-main);
}
.result-content {
  display: flex;
  margin-top: 16px;
  text-align: center;
  justify-content: center;
  font-size: 14px;
}

.action-section {
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-top: 20px;
}

.action-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.action-subtext {
  font-size: 12px;
  color: #666;
  margin-bottom: 16px;
}

.action-btn {
  background: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.result-value.red {
  color: red;
}
.result-value.blue {
  color: blue;
}
.result-value.gray {
  color: #6b7280;
}
</style>
