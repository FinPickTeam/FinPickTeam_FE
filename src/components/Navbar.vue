<template>
  <nav
    class="fixed bottom-0 left-0 right-0 bg-white shadow-md py-2 px-4 flex justify-around text-purple-600"
  >
    <RouterLink to="/challenge"
      ><i class="fas fa-bolt"></i><br />챌린지</RouterLink
    >
    <RouterLink to="/assets"
      ><i class="fas fa-wallet"></i><br />내 자산</RouterLink
    >
    <RouterLink to="/home"><i class="fas fa-home"></i><br />홈</RouterLink>
    <RouterLink to="/finance"
      ><i class="fas fa-chart-line"></i><br />재테크</RouterLink
    >
    <RouterLink to="/mypage"
      ><i class="fas fa-user"></i><br />마이페이지</RouterLink
    >
  </nav>
</template>

<script setup>
// vue-router 사용 시 RouterLink
</script>

<style scoped>
nav a {
  text-align: center;
  font-size: 12px;
}
</style>
