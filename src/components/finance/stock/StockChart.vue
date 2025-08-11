<template>
  <div class="stock-chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  chartData: {
    // 문자열 JSON 또는 객체 둘 다 허용
    type: [String, Object],
    default: () => ({}),
  },
  isUp: { type: Boolean, default: false },
  isDown: { type: Boolean, default: false },
});

const chartCanvas = ref(null);
let chart = null;

// 안전 파서: undefined/null/문자열/객체/구형 배열 모두 처리
const parseChartData = (input) => {
  if (input == null || input === '') return [];
  let data = input;

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error('차트 데이터 파싱 오류:', e);
      return [];
    }
  }

  // { "YYYY-MM-DD": price, ... }
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return Object.entries(data)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, price]) => ({ date, price: Number(price) }));
  }

  // [{ dt, cur_prc }, ...] 하위 호환
  if (Array.isArray(data)) {
    return data
      .map((it) => ({ date: it.dt, price: Number(it.cur_prc) }))
      .reverse();
  }

  return [];
};

const createChart = () => {
  if (!chartCanvas.value) return;

  const rows = parseChartData(props.chartData);
  if (rows.length === 0) return;

  const labels = rows.map((r) => r.date);
  const prices = rows.map((r) => r.price);

  // 기준가 대비 누적 수익률(%)로 변환해서 0을 기준으로 표시
  const base = prices[0];
  const cumPct = prices.map((p) => (p / base - 1) * 100);

  // 색상: 기준가보다 높으면 빨강, 낮으면 파랑
  const series = cumPct;

  if (chart) chart.destroy();
  chart = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '누적 수익률',
          data: series,
          borderColor: (ctx) => {
            const i = ctx.p1DataIndex;
            // 현재 포인트가 기준가보다 높으면 빨간색, 낮으면 파란색
            return series[i] >= 0 ? '#e12343' : '#3b63c4';
          },
          backgroundColor: (ctx) => {
            const i = ctx.p1DataIndex;
            return series[i] >= 0
              ? 'rgba(225, 35, 67, 0.05)' // 빨간 투명 배경
              : 'rgba(59, 99, 196, 0.05)'; // 파란 투명 배경
          },
          segment: {
            borderColor: (ctx) => {
              const i = ctx.p1DataIndex;
              return series[i] >= 0 ? '#e12343' : '#3b63c4';
            },
            backgroundColor: (ctx) => {
              const i = ctx.p1DataIndex;
              return series[i] >= 0
                ? 'rgba(225, 35, 67, 0.05)'
                : 'rgba(59, 99, 196, 0.05)';
            },
          },
          fill: 'origin',
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 1.5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (ctx) => {
              const y = ctx.parsed.y;
              const price = Math.round(base * (1 + y / 100));
              const sign = y >= 0 ? '+' : '';
              return `가격: ${price.toLocaleString()}원 (누적 ${sign}${y.toFixed(
                2
              )}%)`;
            },
            labelColor: function (context) {
              const value = context.raw;
              // 기준가보다 높으면 빨간색, 낮으면 파란색
              return {
                borderColor: value >= 0 ? '#e12343' : '#3b63c4',
                backgroundColor:
                  value >= 0
                    ? 'rgba(225, 35, 67, 0.05)'
                    : 'rgba(59, 99, 196, 0.05)',
              };
            },
          },
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
        },
      },
      scales: {
        x: { display: false, grid: { display: false } },
        y: { display: false, grid: { display: false } },
      },
      interaction: { mode: 'index', intersect: false },
      elements: { point: { radius: 0 } },
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

const updateChart = async () => {
  await nextTick();
  createChart();
};

onMounted(updateChart);
onBeforeUnmount(() => {
  if (chart) chart.destroy();
});
watch(() => props.chartData, updateChart, { deep: true });
</script>

<style scoped>
.stock-chart-container {
  width: 100%;
  max-height: 160px; /* 필요하면 조절 */
  position: relative;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
