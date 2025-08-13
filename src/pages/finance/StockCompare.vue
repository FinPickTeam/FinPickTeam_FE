<template>
  <!-- 로딩 상태 -->
  <div v-show="isLoading" class="loading-section">
    <div class="loading-spinner"></div>
    <p class="loading-text">주식 데이터 불러오는 중...</p>
  </div>

  <!-- 본문 -->
  <div v-show="!isLoading" class="container">
    <div class="wrap">
      <div class="stock-name"></div>
      <div class="stock-chart-wrap">
        <div class="title-content">
          <div class="title-text">가격 차트</div>
          <div class="return-content">3개월</div>
        </div>
        <div class="chart-content"><canvas ref="chartCanvas"></canvas></div>
      </div>
      <div class="financial-wrap">
        <div class="title-content">
          <div class="title-text">핵심 지표 비교</div>
        </div>
        <div class="metric-main">
          <div class="metric-header-row metric-content">
            <div class="metric-stock-name metric-label">지표</div>
            <div
              class="metric-stock-name"
              v-for="(name, idx) in [
                stockData1.stockName,
                stockData2.stockName,
                compareCount > 2 ? stockData3.stockName : undefined,
              ].filter(Boolean)"
              :key="'name' + idx"
            >
              {{ name }}
            </div>
          </div>
          <MetricRow
            label="현재가"
            :values="
              [
                Number(stockData1.stockPrice).toLocaleString(),
                Number(stockData2.stockPrice).toLocaleString(),
                compareCount > 2
                  ? Number(stockData3.stockPrice).toLocaleString()
                  : undefined,
              ].filter(Boolean)
            "
          />
          <MetricRow
            label="등락률"
            :values="
              [
                stockData1.stockChangeRate,
                stockData2.stockChangeRate,
                compareCount > 2 ? stockData3.stockChangeRate : undefined,
              ].filter(Boolean)
            "
            :colorize="true"
            suffix="%"
          />

          <MetricRow
            label="시가총액"
            unit="억 원"
            :values="
              [
                Number(stockData1.stockMarketCap).toLocaleString(),
                Number(stockData2.stockMarketCap).toLocaleString(),
                compareCount > 2
                  ? Number(stockData3.stockMarketCap).toLocaleString()
                  : undefined,
              ].filter(Boolean)
            "
          />
          <MetricRow
            label="PER"
            :values="
              [
                stockData1.stockPer,
                stockData2.stockPer,
                compareCount > 2 ? stockData3.stockPer : undefined,
              ].filter(Boolean)
            "
          />
          <div class="metric-content" style="border: none">
            <div class="metric-stock-name metric-label">배당률</div>
          </div>
        </div>
      </div>
      <div class="financial-wrap">
        <div class="title-content">
          <div class="title-text">재무 건전성</div>
        </div>
        <div class="metric-main">
          <div class="metric-header-row metric-content">
            <div class="metric-stock-name metric-label">지표</div>
            <div
              class="metric-stock-name"
              v-for="(name, idx) in [
                stockData1.stockName,
                stockData2.stockName,
                compareCount > 2 ? stockData3.stockName : undefined,
              ].filter(Boolean)"
              :key="'name' + idx"
            >
              {{ name }}
            </div>
          </div>
          <MetricRow
            label="ROE"
            :values="
              [
                Number(stockData1.stockPrice).toLocaleString(),
                Number(stockData2.stockPrice).toLocaleString(),
                compareCount > 2
                  ? Number(stockData3.stockPrice).toLocaleString()
                  : undefined,
              ].filter(Boolean)
            "
          />
          <MetricRow
            label="ROA"
            :values="
              [
                Number(stockData1.stockPrice).toLocaleString(),
                Number(stockData2.stockPrice).toLocaleString(),
                compareCount > 2
                  ? Number(stockData3.stockPrice).toLocaleString()
                  : undefined,
              ].filter(Boolean)
            "
          />
          <MetricRow
            label="부채비율"
            :values="
              [
                stockData1.stockChangeRate,
                stockData2.stockChangeRate,
                compareCount > 2 ? stockData3.stockChangeRate : undefined,
              ].filter(Boolean)
            "
            :colorize="true"
            suffix="%"
          />

          <MetricRow
            label="유동비율"
            :values="
              [
                Number(stockData1.stockMarketCap).toLocaleString(),
                Number(stockData2.stockMarketCap).toLocaleString(),
                compareCount > 2
                  ? Number(stockData3.stockMarketCap).toLocaleString()
                  : undefined,
              ].filter(Boolean)
            "
          />
        </div>
      </div>
      <div class="financial-wrap">
        <div class="title-text">성과 분석</div>
        <div class="best-content">
          <div class="main-text-content">
            <div class="main-text">최고 수익률</div>
            <div class="stock-name" style="color: #10b981">
              {{ stockData1.stockName }}
            </div>
          </div>
          <div class="sub-text">오늘 가장 높은 수익을 기록한 주식</div>
        </div>
        <div class="best-content">
          <div class="main-text-content">
            <div class="main-text">최고 시가총액</div>
            <div class="stock-name" style="color: #10b981">
              {{ stockData1.stockName }}
            </div>
          </div>
          <div class="sub-text">가장 큰 시가총액을 보유한 주식</div>
        </div>
        <div class="best-content">
          <div class="main-text-content">
            <div class="main-text">최고 배당률</div>
            <div class="stock-name" style="color: #10b981">
              {{ stockData1.stockName }}
            </div>
          </div>
          <div class="sub-text">가장 높은 배당률을 제공하는 주식</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getStockDetail } from '@/api';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import MetricRow from '@/components/finance/stock/MetricRow.vue';

const route = useRoute();

const isLoading = ref(true);
const chartCanvas = ref(null);

// 비교 주식
const mainStockId = route.params.id;
const compareIds = route.query.with?.split(',');

// 주식 데이터
const stockData1 = ref({});
const stockData2 = ref({});
const stockData3 = ref({});

const stock1ChartData = ref([]);
const stock2ChartData = ref([]);
const stock3ChartData = ref([]);

//비교 갯수 확인
const compareCount = computed(
  () => (Array.isArray(compareIds) ? compareIds.length : 0) + 1
);

// 데이터 로드
async function loadAll() {
  isLoading.value = true;
  try {
    const [s1, s2, s3] = await Promise.all([
      fetchStock(mainStockId),
      fetchStock(compareIds[0]),
      compareCount.value > 2
        ? fetchStock(compareIds[1])
        : Promise.resolve(null),
    ]);
    stockData1.value = s1;
    stockData2.value = s2;
    stockData3.value = s3;

    stock1ChartData.value = parseChartData(s1?.stockChartData);
    stock2ChartData.value = parseChartData(s2?.stockChartData);
    stock3ChartData.value = parseChartData(s3?.stockChartData);

    creatChart();
  } finally {
    isLoading.value = false;
  }
}

const getCumulativeReturn = (arr) => {
  if (!arr || arr.length === 0) return [];
  const start = arr[0].price;
  return arr.map((item) => (item.price / start - 1) * 100);
};

let chart = null;
const creatChart = () => {
  if (!chartCanvas.value) return;

  const labels = stock1ChartData.value.map((item) => item.date);
  const datasets = [
    {
      label: stockData1.value.stockName || '종목1',
      data: getCumulativeReturn(stock1ChartData.value),
      borderColor: 'red',
      fill: false,
    },
    {
      label: stockData2.value.stockName || '종목2',
      data: getCumulativeReturn(stock2ChartData.value),
      borderColor: 'blue',
      fill: false,
    },
  ];
  if (stock3ChartData.value && stock3ChartData.value.length > 0) {
    datasets.push({
      label: stockData3.value.stockName || '종목3',
      data: getCumulativeReturn(stock3ChartData.value),
      borderColor: 'green',
      fill: false,
    });
  }
  if (chart) chart.destroy();
  // 원색 계열, 시인성 좋은 컬러
  const vividColors = [
    'rgba(255, 99, 132, 0.9)',
    'rgba(54, 162, 235, 0.9)',
    'rgba(75, 192, 122, 0.9)',
  ];
  chart = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels,
      datasets: datasets.map((ds, idx) => ({
        ...ds,
        borderColor: vividColors[idx % vividColors.length],
        backgroundColor: vividColors[idx % vividColors.length],
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
      })),
    },
    options: {
      responsive: true,
      animation: {
        duration: 1200,
        easing: 'easeInOutExpo',
      },
      layout: {},
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 16,
            boxHeight: 8,
            font: {
              size: 13,
              family: 'Pretendard, Arial, sans-serif',
              weight: 'bold',
            },
            color: '#555',
            padding: 12,
            usePointStyle: true,
          },
        },
        title: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          titleColor: '#333',
          bodyColor: '#333',
          borderColor: '#eee',
          borderWidth: 1,
          cornerRadius: 8,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          min: -10,
          ticks: {
            callback: function (value) {
              return value;
            },
            color: '#aaa',
            font: { size: 12 },
            stepSize: 10,
            beginAtZero: true,
          },
          title: { display: false },
          grid: {
            borderDash: [4, 4],
            color: 'rgba(200,200,200,1)',
          },
        },
      },
    },
  });
};

onMounted(async () => {
  loadAll();
  creatChart();
});

// 주식 데이터 가져오기
async function fetchStock(code) {
  const res = await getStockDetail(code);
  const d = res?.data?.data ?? res?.data ?? res;
  return { stockName: d?.stockName ?? '', ...d };
}

// 데이터를 차트 데이터로 변환
const parseChartData = (data) => {
  if (!data) return [];

  const parsed = typeof data === 'string' ? JSON.parse(data) : data;

  return Object.entries(parsed)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, price]) => ({ date, price: Number(price) }));
};
</script>
<style scoped>
* {
  font-family: var(--font-main);
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
.spinning {
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.container {
  width: 100%;
  height: calc(100vh - 160px);
  overflow-y: auto;
  max-height: calc(100vh - 140px);
}
.wrap {
  margin: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stock-chart-wrap {
  width: 100%;
  height: auto;
  border-radius: 12px;
  padding: 12px;
  background-color: white;
}
.title-content {
  display: flex;
  height: 25px;
  margin-bottom: 12px;
  align-items: center;
  justify-content: space-between;
}
.title-text {
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-bold);
}
.return-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 25px;
  color: white;
  border-radius: 6px;
  background-color: var(--color-main);
  font-size: var(--font-size-caption);
}
.canvas {
  width: 100%;
  height: 100%;
}
.financial-wrap {
  width: 100%;
  height: auto;
  margin-top: 16px;
  border-radius: 12px;
  padding: 12px 12px 0 12px;
  background-color: white;
}
.metric-main {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.metric-content {
  display: flex;
  width: 100%;
  height: 50px;
  border-bottom: 2px solid #f3f4f6;
  justify-content: space-between;
  align-items: center;
}
.metric--title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-regular);
  color: #666666;
}
.metric-stock-name {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: var(--font-size-body);
}
.metric-content > .metric-stock-name.metric-label {
  justify-content: flex-start;
  color: #666666;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-regular);
  width: 100px;
  min-width: 60px;
  max-width: 100px;
}
.best-content-wrap {
  width: 100%;
  height: auto;
  margin-top: 16px;
  border-radius: 12px;
  padding: 12px;
  background-color: white;
}
.best-content {
  width: 100%;
  height: 75px;
  margin-top: 12px;
  padding: 16px;
  border-bottom: 2px solid #f3f4f6;
}
.best-content:last-child {
  border-bottom: none;
}
.main-text-content {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
}
.sub-text {
  margin-top: 10px;
  font-size: var(--font-size-caption);
  color: #666666;
}
</style>
