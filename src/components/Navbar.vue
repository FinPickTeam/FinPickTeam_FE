<template>
  <nav class="bottom-nav">
    <RouterLink
      to="/challenge"
      class="nav-item"
      :class="{ 'router-link-active': isActive('/challenge') }"
    >
      <i class="fa-solid fa-trophy"></i>
      <span>챌린지</span>
    </RouterLink>
    <RouterLink
      to="/openbanking"
      class="nav-item"
      :class="{ 'router-link-active': isActive('/openbanking') }"
    >
      <i class="fas fa-wallet"></i>
      <span>내 자산</span>
    </RouterLink>
    <RouterLink
      to="/"
      class="nav-item"
      active-class=""
      :class="{ 'home-active': isHomeActive }"
    >
      <i class="fas fa-home"></i>
      <span>홈</span>
    </RouterLink>
    <RouterLink
      to="/finance"
      class="nav-item"
      :class="{ 'router-link-active': isActive('/finance') }"
    >
      <i class="fas fa-chart-line"></i>
      <span>재테크</span>
    </RouterLink>
    <RouterLink
      to="/mypage"
      class="nav-item"
      :class="{ 'router-link-active': isActive('/mypage') }"
    >
      <i class="fas fa-user"></i>
      <span>내 페이지</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const isActive = (path) => {
  return route.path.startsWith(path);
};

const isHomeActive = computed(() => {
  // 정확히 홈 경로일 때만 true 반환
  return route.path === '/' || route.path === '';
});
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  max-width: 390px;
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
@media (max-width: 390px) {
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
  color: var(--color-main-light-2);
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
.nav-item.router-link-active,
.nav-item.home-active {
  color: #4318d1;
}
</style>
