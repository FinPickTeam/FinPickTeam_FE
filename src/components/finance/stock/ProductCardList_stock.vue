<template>
  <div class="product-card-list">
    <ProductCard_stock
      v-for="(product, index) in products"
      :key="product.stockCode || index"
      :product="product"
    />
  </div>
</template>

<script setup>
import ProductCard_stock from './ProductCard_stock.vue';

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
});
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
