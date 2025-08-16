<script setup>
import { RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <div class="app-container">
    <RouterView v-slot="{ Component }">
      <!-- 전역 단일 전환 -->
      <transition name="page-slide-fade" mode="out-in">
        <component :is="Component" :key="$route.fullPath" />
      </transition>
    </RouterView>

    <!-- 전역 고정 네비바 -->
    <Navbar />
  </div>
</template>

<style>
/* 부드러운 전환 */
.page-slide-fade-enter-active, .page-slide-fade-leave-active {
  transition: opacity .22s ease, transform .22s ease;
  will-change: opacity, transform;
}
.page-slide-fade-enter-from, .page-slide-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
