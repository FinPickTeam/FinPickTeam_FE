<template>
  <div class="admin">
    <aside class="aside">
      <h2 class="brand">SCoula Admin</h2>
      <nav>
        <RouterLink :to="{ name: 'AdminHome' }">대시보드</RouterLink>
        <RouterLink :to="{ name: 'AdminCommonChallenge' }">공통 챌린지</RouterLink>
        <RouterLink :to="{ name: 'AdminTickets' }">고객센터 문의</RouterLink>
      </nav>
    </aside>
    <main class="main">
      <header class="header">
        <h1>{{ title }}</h1>
        <div class="spacer" />
        <RouterLink class="btn" :to="{ name: 'Home' }">사용자 화면으로</RouterLink>
      </header>
      <section class="content">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, RouterLink, RouterView } from 'vue-router';

const route = useRoute();
const title = computed(() => {
  switch (route.name) {
    case 'AdminHome': return '관리자 대시보드';
    case 'AdminCommonChallenge': return '공통 챌린지 관리';
    case 'AdminTickets': return '고객센터 문의';
    default: return '관리';
  }
});
</script>

<style scoped>
.admin { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
.aside { background:#111; color:#fff; padding:20px; }
.brand { margin:0 0 12px; font-size:18px; }
nav { display:flex; flex-direction:column; gap:8px; }
nav a { color:#ddd; text-decoration:none; padding:8px 10px; border-radius:8px; }
nav a.router-link-exact-active { background:#222; color:#fff; }
.main { display:flex; flex-direction:column; }
.header { display:flex; align-items:center; padding:16px 20px; border-bottom:1px solid #eee; }
.header h1 { font-size:18px; margin:0; }
.spacer { flex:1; }
.btn { background:#111; color:#fff; padding:8px 12px; border-radius:8px; text-decoration:none; }
.content { padding:20px; }
</style>
