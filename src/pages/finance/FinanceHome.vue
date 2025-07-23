<template>
  <main class="main-content">
    <h1>재테크 홈</h1>
    <div class="button-group">
      <button @click="$router.push('/finance/deposit')">예금</button>
      <button @click="$router.push('/finance/installment')">적금</button>
      <button @click="$router.push('/finance/fund')">펀드</button>
      <button @click="$router.push('/finance/stock')">주식</button>
    </div>
  </main>
</template>

<script setup>
// HeaderBar, BottomNavBar import 제거
</script>

<style scoped>
.button-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
  align-items: center;
}
.button-group button {
  width: 300px;
}
</style>
