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
  isUp: {
    type: Boolean,
    default: false,
  },
  isDown: {
    type: Boolean,
    default: false,
  },
});

const chartCanvas = ref(null);
let chart = null;

// 차트 데이터 파싱
const parseChartData = (chartDataString) => {
  try {
    const data = JSON.parse(chartDataString);

    // 새로운 데이터 형식: {"2025-07-03":4950,"2025-07-04":4825,...}
    if (typeof data === 'object' && !Array.isArray(data)) {
      // 객체를 배열로 변환하고 날짜순으로 정렬
      const sortedEntries = Object.entries(data).sort(([dateA], [dateB]) => {
        return new Date(dateA) - new Date(dateB);
      });

      return sortedEntries.map(([date, price]) => ({
        date: date,
        price: parseFloat(price),
      }));
    }

    // 기존 배열 형식도 지원 (하위 호환성)
    if (Array.isArray(data)) {
      return data
        .map((item) => ({
          date: item.dt,
          price: parseFloat(item.cur_prc),
        }))
        .reverse();
    }

    return [];
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

  // 상승/하락에 따른 색상 결정 (주식 카드와 동일한 색상)
  const lineColor = props.isUp
    ? '#e12343' // 상승: 빨간색
    : props.isDown
    ? '#3b63c4' // 하락: 파란색
    : '#e11d48'; // 기본: 기존 색상
  const fillColor = props.isUp
    ? 'rgba(225, 35, 67, 0.1)' // 상승: 빨간 투명 배경
    : props.isDown
    ? 'rgba(59, 99, 196, 0.1)' // 하락: 파란 투명 배경
    : 'rgba(225, 29, 72, 0.1)'; // 기본: 기존 투명 배경

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
          borderColor: lineColor, // 차트 선과 동일한 색상
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
  () => [props.chartData, props.isUp, props.isDown],
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
