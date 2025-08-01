<template>
  <div class="fund-chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  returnsData: {
    type: String,
    default: '{}',
  },
});

const chartCanvas = ref(null);
let chart = null;

const parseReturnsData = (returnsDataString) => {
  try {
    const data = JSON.parse(returnsDataString);
    return Object.entries(data)
      .map(([date, returnValue]) => ({
        date: date,
        return: parseFloat(returnValue),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('펀드 수익률 데이터 파싱 오류:', error);
    return [];
  }
};

const createChart = (data) => {
  if (chart) {
    chart.destroy();
  }
  if (!chartCanvas.value || data.length === 0) return;

  const labels = data.map((item) => item.date);
  const returns = data.map((item) => item.return);

  // 누적 수익률 계산
  const cumulativeReturns = returns.reduce((acc, curr, index) => {
    if (index === 0) return [curr];
    const prev = acc[index - 1];
    acc.push(prev + curr);
    return acc;
  }, []);

  // 각 데이터 포인트별 색상 결정
  const segmentColors = cumulativeReturns.map((value) =>
    value >= 0 ? '#e12343' : '#3b63c4'
  );

  chart = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '누적 수익률',
          data: cumulativeReturns,
          borderColor: (ctx) => {
            const i = ctx.p1DataIndex;
            return cumulativeReturns[i] >= 0 ? '#e12343' : '#3b63c4';
          },
          backgroundColor: (ctx) => {
            const i = ctx.p1DataIndex;
            return cumulativeReturns[i] >= 0
              ? 'rgba(225, 35, 67, 0.05)' // 빨간 투명 배경
              : 'rgba(59, 99, 196, 0.05)'; // 파란 투명 배경
          },
          fill: 'origin',
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 1.5,
          segment: {
            borderColor: (ctx) => {
              const i = ctx.p1DataIndex;
              return cumulativeReturns[i] >= 0 ? '#e12343' : '#3b63c4';
            },
            backgroundColor: (ctx) => {
              const i = ctx.p1DataIndex;
              return cumulativeReturns[i] >= 0
                ? 'rgba(225, 35, 67, 0.05)'
                : 'rgba(59, 99, 196, 0.05)';
            },
          },
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
          callbacks: {
            label: function (context) {
              return `누적 수익률: ${context.raw.toFixed(2)}%`;
            },
            labelColor: function (context) {
              const value = context.raw;
              return {
                borderColor: value >= 0 ? '#e12343' : '#3b63c4',
                backgroundColor:
                  value >= 0
                    ? 'rgba(225, 35, 67, 0.05)'
                    : 'rgba(59, 99, 196, 0.05)',
              };
            },
          },
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
    },
  });
};

onMounted(() => {
  const parsedData = parseReturnsData(props.returnsData);
  createChart(parsedData);
});

watch(
  () => props.returnsData,
  (newVal) => {
    const parsedData = parseReturnsData(newVal);
    createChart(parsedData);
  }
);
</script>

<style scoped>
.fund-chart-container {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

canvas {
  max-width: 100%;
  max-height: 100%;
}
</style>
