<template>
  <div class="product-card-list">
    <ProductCardInstallment
      v-for="(product, index) in products"
      :key="index"
      :product="product"
    />
  </div>
</template>

<script setup>
import ProductCardInstallment from './ProductCard_installment.vue';

const props = defineProps({
  products: {
    type: Array,
    required: true,
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
  padding: 20px;
}
</style>
