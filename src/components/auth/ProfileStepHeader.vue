<template>
  <div class="nav-bar">
    <span class="back-btn" @click="goBack">
      <i class="fa-solid fa-angle-left"></i>
    </span>
    <span class="title">투자 성향 분석</span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.nav-bar {
  display: flex;
  align-items: center;
  height: 80px;
  position: relative;
  margin-bottom: 8px;
}

.back-btn {
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #222;
}

.title {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #222;
}
</style>
