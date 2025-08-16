<template>
  <div class="fund-list">
    <ProductCard
      v-for="(item, index) in funds"
      :key="index"
      :fund="item"
      @favorite-removed="handleFavoriteRemoved"
    />
  </div>
</template>

<script setup>
import ProductCard from './ProductCard_fund.vue';

const props = defineProps({
  funds: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['favorite-removed']);

const handleFavoriteRemoved = (product) => {
  emit('favorite-removed', product);
};
</script>

<style scoped>
.fund-list {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 10px;
}
</style>
