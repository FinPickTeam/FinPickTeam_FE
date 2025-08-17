<script setup>
import { RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';
import Navbar from '@/components/Navbar.vue';

const route = useRoute();

// 네비바를 숨길 라우트 이름들
const hideNavbarRoutes = [
  'Login',
  'Signup',
  'SignupComplete',
  'ProfileStep1',
  'ProfileStep2',
  'ProfileStep3',
  'ProfileStep4',
  'ProfileStep5',
  'ProfileStep6',
  'ProfileStep7',
  'ProfileStep8',
  'ProfileStep9',
  'ProfileStep10',
  'ProfileComplete',
];

// 현재 라우트에서 네비바를 숨길지 결정
const shouldHideNavbar = computed(() => {
  return hideNavbarRoutes.includes(route.name);
});
</script>

<template>
  <div class="app-container">
    <RouterView v-slot="{ Component }">
      <!-- 전역 단일 전환 -->
      <transition name="page-slide-fade" mode="out-in">
        <component :is="Component" :key="$route.fullPath" />
      </transition>
    </RouterView>

    <!-- 전역 고정 네비바 (로그인/회원가입 페이지에서는 숨김) -->
    <Navbar v-if="!shouldHideNavbar" />
  </div>
</template>

<style>
/* 부드러운 전환 */
.page-slide-fade-enter-active,
.page-slide-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
  will-change: opacity, transform;
}
.page-slide-fade-enter-from,
.page-slide-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
