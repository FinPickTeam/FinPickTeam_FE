<template>
  <nav class="bottom-nav">
    <RouterLink to="/challenge" class="nav-item">
      <i class="fas fa-bolt"></i>
      <span>챌린지</span>
    </RouterLink>
    <RouterLink to="/assets" class="nav-item">
      <i class="fas fa-wallet"></i>
      <span>내 자산</span>
    </RouterLink>
    <RouterLink to="/home" class="nav-item">
      <i class="fas fa-home"></i>
      <span>홈</span>
    </RouterLink>
    <RouterLink to="/finance" class="nav-item">
      <i class="fas fa-chart-line"></i>
      <span>재테크</span>
    </RouterLink>
    <RouterLink to="/mypage" class="nav-item">
      <i class="fas fa-user"></i>
      <span>마이페이지</span>
    </RouterLink>
  </nav>
</template>

<script setup>
// 특별한 로직 없음
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  box-shadow: 0 -2px 12px 0 #0001;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0 20px 0;
  z-index: 100;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #a78bfa;
  font-size: 12px;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-item i {
  font-size: 22px;
  margin-bottom: 2px;
}
.nav-item.router-link-exact-active,
.nav-item.router-link-active {
  color: #4318d1;
}
</style>
