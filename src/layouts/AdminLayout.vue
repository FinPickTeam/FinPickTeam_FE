<template>
  <div class="admin">
    <header class="appbar">
      <h1>관리자</h1>
    </header>

    <main class="content">
      <RouterView />
    </main>

    <nav class="tabbar">
      <RouterLink :to="{ name: 'AdminHome' }" class="tab" :class="{ active: is('AdminHome') }">
        <i class="fa-solid fa-gauge"></i>
        <span>대시보드</span>
      </RouterLink>
      <RouterLink :to="{ name: 'AdminCommonChallenge' }" class="tab" :class="{ active: is('AdminCommonChallenge') }">
        <i class="fa-solid fa-bullseye"></i>
        <span>공통 챌린지</span>
      </RouterLink>
      <RouterLink :to="{ name: 'AdminSupport' }" class="tab" :class="{ active: is('AdminSupport') }">
        <i class="fa-solid fa-comments"></i>
        <span>문의 답변</span>
      </RouterLink>
      <RouterLink :to="{ name: 'AdminFaq' }" class="tab" :class="{ active: is('AdminFaq') }">
        <i class="fa-solid fa-circle-question"></i>
        <span>Q&A 등록</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
const is = (name) => route.name === name;
</script>

<style scoped>
.admin { min-height: 100vh; display:flex; flex-direction:column; background: var(--color-bg-light, #f7f7fb); }
.appbar {
  position: sticky; top: 0; z-index: 10;
  height: 56px; display:flex; align-items:center; padding: 0 16px;
  background: linear-gradient(135deg, var(--color-main, #6b46c1), var(--color-main-dark, #4c2ea6));
  color:#fff; box-shadow:0 2px 8px rgba(0,0,0,.08);
}
.appbar h1 { font-size:18px; margin:0; }
.content { flex:1; padding: 12px 12px 72px; }
.tabbar{
  position: fixed; bottom: 0; left: 0; right:0;
  height: 60px; background:#fff; border-top:1px solid #eee;
  display:flex; justify-content:space-around; align-items:center;
}
.tab{ flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; color:#777; text-decoration:none; font-size:11px; padding-top:2px;}
.tab i{ font-size:18px; }
.tab.active { color: var(--color-main, #6b46c1); font-weight:600; }
</style>
