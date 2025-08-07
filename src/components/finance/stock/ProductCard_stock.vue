<template>
  <div class="stock-card">
    <div class="stock-chart">
      <StockChart
        :chartData="product.stockReturnsData"
        :isUp="isUp"
        :isDown="isDown"
      />
    </div>
    <div class="stock-info">
      <div class="stock-header">
        <span class="stock-name">{{ product.stockName }}</span>
        <span class="stock-summary">{{ product.stockSummary }}</span>
        <span
          class="heart"
          :class="{ active: isFavorite }"
          @click="toggleFavorite"
          >♥</span
        >
      </div>
      <div class="stock-main">
        <span class="stock-price" :class="{ up: isUp, down: isDown }">{{
          displayPrice
        }}</span>
      </div>
      <div class="stock-footer">
        <span class="stock-change" :class="{ up: isUp, down: isDown }">
          <span class="stock-change-label">전일대비</span>
          <span class="stock-change-gap">{{ displayChange }}</span>
          <span class="stock-rate">{{ displayRate }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFavoriteStore } from '@/stores/favorite.js';
import StockChart from './StockChart.vue';

const props = defineProps({ product: Object });
const favoriteStore = useFavoriteStore();
const isFavorite = computed(() => favoriteStore.isFavorite(props.product));

function toggleFavorite() {
  if (isFavorite.value) {
    favoriteStore.removeFavorite(props.product);
  } else {
    favoriteStore.addFavorite(props.product);
  }
}

// 가격, 등락률 등 표시 포맷
const displayPrice = computed(() => {
  const price = props.product.stockPrice;
  // 숫자인 경우 그대로 사용, 문자열인 경우 숫자로 변환
  const numericPrice =
    typeof price === 'string' ? Number(price.replace(/[+-]/, '')) : price;
  return numericPrice.toLocaleString();
});

const isUp = computed(() => {
  const rate = String(props.product.stockChangeRate);
  return (
    rate.startsWith('+') || (!rate.startsWith('-') && parseFloat(rate) > 0)
  );
});

const isDown = computed(() => {
  const rate = String(props.product.stockChangeRate);
  return (
    rate.startsWith('-') || (!rate.startsWith('+') && parseFloat(rate) < 0)
  );
});

const displayChange = computed(() => {
  const predictedPrice = props.product.stockPredictedPrice;
  const isPositive = predictedPrice.startsWith('+');
  const numericValue = predictedPrice.replace(/[+-]/, '');
  return (isPositive ? '▲' : '▼') + ' ' + numericValue;
});

const displayRate = computed(() => {
  const rate = String(props.product.stockChangeRate);
  if (rate.startsWith('+') || rate.startsWith('-')) {
    return rate + '%';
  } else {
    return '+' + rate + '%';
  }
});
</script>

<style scoped>
.stock-card {
  display: flex;
  align-items: center;
  background: var(--color-bg);
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 #0002;
  padding: 10px 18px;
  width: 350px;
  font-family: var(--font-main);
  margin-bottom: 10px;
  position: relative;
}
.stock-chart {
  width: 80px;
  height: 60px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stock-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.stock-header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.stock-name {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-title-sub);
  color: var(--color-text);
}
.stock-summary {
  color: #aaa;
  font-size: var(--font-size-body);
}
.heart {
  margin-left: auto;
  color: var(--color-bg-accent);
  font-size: 26px;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
}
.heart.active {
  color: #e11d48;
}
.stock-main {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.stock-price {
  font-size: var(--font-size-title-main);
  font-weight: bold;
  color: #e11d48;
}
.stock-price.up {
  color: var(--color-accent);
}
.stock-price.down {
  color: var(--color-accent-2);
}
.stock-footer {
  font-size: var(--font-size-body-large);
  color: var(--color-text-light);
  margin-top: 2px;
}
.stock-change.up {
  color: var(--color-accent);
  font-weight: var(--font-weight-bold);
}
.stock-change.down {
  color: var(--color-accent-2);
  font-weight: var(--font-weight-bold);
}
.stock-change-label {
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}
.stock-rate {
  margin-left: 6px;
}
.stock-change-gap {
  margin-left: 6px;
}
</style>
