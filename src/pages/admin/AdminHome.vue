<template>
  <div class="grid">
    <div class="card">
      <h3>공통 챌린지 빠른 생성</h3>
      <p>이번 달 공통 챌린지를 빠르게 개설하세요.</p>
      <RouterLink class="btn" :to="{ name: 'AdminCommonChallenge' }">바로가기</RouterLink>
    </div>
    <div class="card">
      <h3>고객센터 문의</h3>
      <p>사용자 문의를 확인하고 답변을 등록하세요.</p>
      <RouterLink class="btn" :to="{ name: 'AdminTickets' }">바로가기</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap:16px; }
.card { background:#fff; border:1px solid #eee; border-radius:12px; padding:16px; }
h3 { margin:0 0 8px; font-size:16px; }
.btn { display:inline-block; margin-top:10px; background:#111; color:#fff; padding:8px 12px; border-radius:8px; text-decoration:none; }
</style>
