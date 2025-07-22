<template>
  <nav class="bottom-nav">
    <RouterLink to="/challenge" class="nav-item">
      <i class="fa-solid fa-trophy"></i>
      <span>챌린지</span>
    </RouterLink>
    <RouterLink to="/openbanking" class="nav-item">
      <i class="fas fa-wallet"></i>
      <span>내 자산</span>
    </RouterLink>
    <RouterLink to="/" class="nav-item">
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
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  max-width: 540px;
  width: 100%;
  background: #fff; /* 디자인 유지 위해 직접 지정 */
  box-shadow: 0 -2px 12px 0 #0001;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0 20px 0;
  z-index: 100;
}

/* 모바일에서는 전체 너비 사용 */
@media (max-width: 540px) {
  .bottom-nav {
    left: 0;
    right: 0;
    transform: none;
    max-width: 100%;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #8e74e3;
  font-size: 12px;
  text-decoration: none; /* 디자인 유지 위해 직접 지정 */
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
