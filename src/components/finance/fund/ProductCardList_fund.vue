<template>
  <div class="fund-list">
    <ProductCard v-for="(item, index) in fundList" :key="index" :fund="item" />
  </div>
</template>

<script setup>
import fund_all from './fund_all.json';
import ProductCard from './ProductCard_fund.vue';

const fundList = fund_all.data;
</script>

<style scoped>
.fund-list {
  padding: 16px;
}
</style>
