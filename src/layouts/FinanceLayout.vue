<template>
  <div class="main-layout">
    <FinanceHeader />
    <main class="main-content">
      <router-view />
    </main>
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
  padding-top: 80px;
  padding-bottom: 80px;
}

.main-content {
  flex: 1 0 auto;
}
</style>
