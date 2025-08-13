<template>
  <div class="stock-card" @click="goDetail()">
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

        <!-- 준비됐을 때만 활성 하트 -->
        <span
          v-if="ready"
          class="heart"
          :class="{ active: isFavorite }"
          @click.stop="toggleFavorite"
          aria-label="favorite"
          >♥</span
        >

        <!-- 준비 전: 비활성 표시 (클릭 막음) -->
        <span
          v-else
          class="heart"
          style="opacity: 0.35; cursor: not-allowed"
          @click.stop
          aria-label="favorite-disabled"
          >♥</span
        >
      </div>

      <div class="stock-main">
        <span class="stock-price" :class="{ up: isUp, down: isDown }">
          {{ displayPrice }}
        </span>
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
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoriteStore } from '@/stores/favorite.js';
import { getActivePinia } from 'pinia';
import StockChart from './StockChart.vue';

const props = defineProps({ product: Object });
const emit = defineEmits(['favorite-removed']);

const router = useRouter();
const favoriteStore = useFavoriteStore();

/** 숫자만 남기고 선행 0 제거: 'A005930'/'005930.KS'/5930 -> '5930' */
function normalizeStockCodeRaw(val) {
  if (val == null) return '';
  let s = String(val).trim();
  s = s.replace(/^A/i, '').replace(/\D/g, ''); // 숫자만
  s = s.replace(/^0+(?=\d)/, ''); // 선행 0 제거
  return s;
}

/** 스토어 초기화 여부 (STOCK Set 존재로 판정) */
const ready = computed(() => {
  const sets = favoriteStore.idSets;
  return !!(sets && sets.STOCK instanceof Set);
});

/** 즐겨찾기 여부: 정규화 후 Set에 '5930' 또는 '005930' 둘 다 확인 */
const isFavorite = computed(() => {
  if (!ready.value) return false; // ready가 false면 안 켜짐
  return favoriteStore.isFavorite(props.product);
});

/** 하트 토글: 정규화된 코드로 스토어에 넘겨 일관성 유지 */
async function toggleFavorite() {
  if (!ready.value) return;
  try {
    const normalized = normalizeStockCodeRaw(props.product.stockCode);
    const productForStore = normalized
      ? { ...props.product, stockCode: normalized }
      : props.product;

    if (isFavorite.value) {
      await favoriteStore.removeFavorite(productForStore);
      emit('favorite-removed', props.product); // 필요 시 부모에서 즉시 제거
    } else {
      await favoriteStore.addFavorite(productForStore);
    }
  } catch (e) {
    console.error('toggleFavorite failed:', e);
  }
}

/** 가격/등락률 포맷 */
const displayPrice = computed(() => {
  const price = props.product.stockPrice;
  const numericPrice =
    typeof price === 'string' ? Number(price.replace(/[+-]/, '')) : price;
  return Number(numericPrice || 0).toLocaleString();
});

const isUp = computed(() => {
  const rate = String(props.product.stockChangeRate ?? '');
  return (
    rate.startsWith('+') || (!rate.startsWith('-') && parseFloat(rate) > 0)
  );
});

const isDown = computed(() => {
  const rate = String(props.product.stockChangeRate ?? '');
  return (
    rate.startsWith('-') || (!rate.startsWith('+') && parseFloat(rate) < 0)
  );
});

const displayChange = computed(() => {
  const predictedPrice = String(props.product.stockPredictedPrice ?? '');
  const isPositive = predictedPrice.startsWith('+');
  const numericValue = predictedPrice.replace(/[+-]/g, '');
  return (isPositive ? '▲' : '▼') + ' ' + numericValue;
});

const displayRate = computed(() => {
  const rate = String(props.product.stockChangeRate ?? '');
  if (rate.startsWith('+') || rate.startsWith('-')) return rate + '%';
  if (rate === '' || isNaN(Number(rate))) return '';
  return '+' + rate + '%';
});

/** 상세 이동 (stockCode는 5930 규칙 그대로 사용) */
function goDetail() {
  const stockCode = props.product.stockCode;
  if (stockCode) router.push(`/finance/stock/${stockCode}`);
}
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
  height: 80px;
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
