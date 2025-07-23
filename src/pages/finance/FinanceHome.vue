<template>
  <div class="mypage-container">
    <HeaderBar />

    <main class="main-content">
      <h1>재테크 홈</h1>
      <div class="button-group">
        <button>예산 관리</button>
        <button>투자 내역</button>
        <button>목표 설정</button>
        <button>리포트 보기</button>
      </div>
    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
import HeaderBar from '@/components/Headerbar.vue';
import BottomNavBar from '@/components/Navbar.vue';
</script>

<style scoped>
.button-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
  align-items: center; /* 버튼을 수평 중앙 정렬 */
}
.button-group button {
  width: 300px;
}
</style>
