<template>
  <div class="main-layout">
    <!-- dictionary, notification 경로에서는 헤더 숨김 -->
    <HeaderBar v-if="shouldHideHeader" />
    <main class="main-content">
      <router-view />
    </main>
    <Navbar />
  </div>
</template>

<script setup>
import HeaderBar from "@/components/Headerbar.vue";
import Navbar from "@/components/Navbar.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
// HeaderBar를 숨길 라우트 이름 목록
// (이 배열에 포함된 name의 페이지에서는 HeaderBar가 표시되지 않음)
const hideHeaderNames = [
  "dictionary",
  "Notification",

  "profile",
  "quiz-history",
  "withdraw",
  "avatar-shop",
];
const shouldHideHeader = computed(() => {
  return !hideHeaderNames.includes(route.name);
});
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.main-content {
  flex: 1 0 auto;
  padding-bottom: 80px; /* 하단 네비게이션 영역 확보 */
}
</style>
