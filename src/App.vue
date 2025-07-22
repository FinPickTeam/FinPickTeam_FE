<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div class="app-container">
    <router-view />
    <Navbar />
  </div>
</template>

<style>
/* 전역 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.app-container {
  max-width: 540px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/* 모바일에서는 전체 너비 사용 */
@media (max-width: 540px) {
  .app-container {
    max-width: 100%;
    box-shadow: none;
  }
}
</style>
