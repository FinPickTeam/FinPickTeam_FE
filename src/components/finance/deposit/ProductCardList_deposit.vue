<template>
  <div class="product-card-list">
    <ProductCardDeposit
      v-for="(product, index) in products"
      :key="index"
      :product="product"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ProductCardDeposit from '@/components/finance/deposit/ProductCard_deposit.vue';
import depositData from '@/pages/finance/deposit_recomend.json';

const products = ref(depositData);
</script>

<style scoped>
.product-card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
