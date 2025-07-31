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
import ProductCardDeposit from '@/components/finance/deposit/ProductCard_deposit.vue';

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.product-card-list {
  display: flex;
  flex-direction: column;
  gap: 0px;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>
