<template>
  <div class="stock-chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  chartData: {
    type: String,
    default: '[]',
  },
});

const chartCanvas = ref(null);
let chart = null;

// 차트 데이터 파싱
const parseChartData = (chartDataString) => {
  try {
    const data = JSON.parse(chartDataString);
    return data
      .map((item) => ({
        date: item.dt,
        price: parseFloat(item.cur_prc),
      }))
      .reverse(); // 최신 데이터가 뒤에 오도록 역순으로 정렬
  } catch (error) {
    console.error('차트 데이터 파싱 오류:', error);
    return [];
  }
};

// 차트 생성
const createChart = () => {
  if (!chartCanvas.value) return;

  const ctx = chartCanvas.value.getContext('2d');
  const parsedData = parseChartData(props.chartData);

  if (parsedData.length === 0) return;

  const labels = parsedData.map((item) => item.date);
  const prices = parsedData.map((item) => item.price);

  // 가격 변화에 따른 색상 결정
  const isUp = prices[prices.length - 1] > prices[0];
  const lineColor = isUp ? '#e11d48' : '#dc2626';
  const fillColor = isUp ? 'rgba(225, 29, 72, 0.1)' : 'rgba(220, 38, 38, 0.1)';

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '주가',
          data: prices,
          borderColor: lineColor,
          backgroundColor: fillColor,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: lineColor,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: lineColor,
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              return `가격: ${context.parsed.y.toLocaleString()}원`;
            },
          },
        },
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false,
          },
        },
        y: {
          display: false,
          grid: {
            display: false,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      elements: {
        point: {
          radius: 0,
        },
      },
    },
  });
};

// 차트 업데이트
const updateChart = () => {
  if (chart) {
    chart.destroy();
  }
  createChart();
};

// 컴포넌트 마운트 시 차트 생성
onMounted(() => {
  createChart();
});

// props 변경 시 차트 업데이트
watch(
  () => props.chartData,
  () => {
    updateChart();
  },
  { deep: true }
);
</script>

<style scoped>
.stock-chart-container {
  width: 80px;
  height: 60px;
  position: relative;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
