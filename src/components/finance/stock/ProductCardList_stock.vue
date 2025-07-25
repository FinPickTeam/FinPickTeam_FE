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
import stockRecommendData from '@/components/finance/stock/stock_recommend.json';

const products = stockRecommendData.data;
</script>

<style scoped>
.product-card-list {
  display: flex;
  flex-direction: column;
  gap: 0px;
  align-items: center;
  justify-content: center;
}
</style>
