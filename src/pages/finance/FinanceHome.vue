<template>
  <div class="button-grid">
    <button class="grid-btn">
      <i class="fa-solid fa-piggy-bank"></i><span>예금</span>
    </button>
    <button class="grid-btn">
      <i class="fa-solid fa-coins"></i><span>적금</span>
    </button>
    <button class="grid-btn">
      <i class="fa-solid fa-hand-holding-dollar"></i>
      <span>펀드</span>
    </button>
    <button class="grid-btn">
      <i class="fa-solid fa-money-bill-trend-up"></i>
      <span>주식</span>
    </button>
  </div>
</template>

<script setup>
// HeaderBar, BottomNavBar import 제거
</script>

<style scoped>
.button-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
  align-items: center;
}
.button-group button {
  width: 300px;
}

.button-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 24px 24px;
  justify-items: center;
  align-items: center;
  margin: 40px 0;
}

.grid-btn {
  width: 120px;
  height: 120px;
  background: #fff;
  border-radius: 16px;
  border: none;
  box-shadow: 0 2px 8px #0001;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #222;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.grid-btn i {
  font-size: 38px;
  margin-bottom: 10px;
  color: #222;
}

.grid-btn span {
  font-size: 15px;
  font-weight: 500;
  margin-top: 2px;
}
</style>
