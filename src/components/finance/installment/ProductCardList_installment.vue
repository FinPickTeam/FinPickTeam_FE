<template>
  <div class="product-card-list">
    <ProductCardInstallment
      v-for="(product, index) in products"
      :key="index"
      :product="product"
      @favorite-removed="handleFavoriteRemoved"
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

const emit = defineEmits(['favorite-removed']);

const handleFavoriteRemoved = (product) => {
  emit('favorite-removed', product);
};
</script>

<style scoped>
.product-card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}
</style>
