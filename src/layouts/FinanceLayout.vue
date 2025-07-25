<template>
  <div class="main-layout">
    <FinanceHeader />
    <main class="main-content">
      <router-view />
    </main>
    <Navbar />
  </div>
</template>

<script setup>
import FinanceHeader from '@/components/finance/FinanceHeader.vue';
import Navbar from '@/components/Navbar.vue';
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: var(--color-bg-light);
}
.main-content {
  flex: 1 0 auto;
  padding-bottom: 80px; /* 하단 네비게이션 영역 확보 */
}
</style>
