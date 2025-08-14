<template>
  <div class="product-card-list">
    <ProductCard_stock
      v-for="(p, idx) in normalizedProducts"
      :key="p.stockCode || p.id || idx"
      :product="p"
      @click="onToggle(normId(p))"
      @favorite-removed="$emit('favorite-removed', p)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ProductCard_stock from './ProductCard_stock.vue';

const props = defineProps({
  products: { type: Array, default: () => [] },
  selectedIds: { type: Array, default: () => [] },
  max: { type: Number, default: 2 },
  disabledIds: { type: Array, default: () => [] },
});
const emit = defineEmits(['toggle', 'favorite-removed']);

const disabledIdsSet = computed(() => new Set(props.disabledIds.map(String)));
const isFull = computed(() => props.selectedIds.length >= props.max);

// ProductCard_stock에서 요구하는 데이터 구조로 변환
function mapToProductCard(p) {
  return {
    stockCode: p.stockCode ?? p.id ?? p.code ?? '',
    stockName: p.stockName ?? p.name ?? '',
    stockSummary: p.stockSummary ?? p.summary ?? '',
    stockPrice: p.stockPrice ?? p.price ?? '',
    stockChangeRate: p.stockChangeRate ?? p.rate ?? '',
    stockPredictedPrice: p.stockPredictedPrice ?? p.predictedPrice ?? '',
    stockReturnsData: p.stockReturnsData ?? p.returnsData ?? [],
    // 기타 필요한 속성 추가
    ...p,
  };
}

const normalizedProducts = computed(() => props.products.map(mapToProductCard));

function normId(p) {
  const idRaw = String(p.id ?? p.stockCode ?? p.code ?? '');
  return idRaw.padStart(6, '0');
}

function onToggle(id) {
  if (disabledIdsSet.value.has(id)) return;
  if (isFull.value && !props.selectedIds.includes(id)) return;
  emit('toggle', id);
}
</script>

<style scoped>
.product-card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
</style>
