<template>
  <div class="mypage-container">
    <HeaderBar />

    <main class="main-content">
      <h1>재테크 홈</h1>
      <div class="button-group">
        <router-link to="/finance/deposit"><button>예금</button></router-link>
        <router-link to="/finance/installment"
          ><button>적금</button></router-link
        >
        <router-link to="/finance/fund"><button>펀드</button></router-link>
        <router-link to="/finance/stock"><button>주식</button></router-link>
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
