<template>
  <div class="button-grid">
    <button class="grid-btn" @click="goDeposit">
      <i class="fa-solid fa-piggy-bank"></i><span>예금</span>
    </button>
    <button class="grid-btn" @click="goInstallment">
      <i class="fa-solid fa-coins"></i><span>적금</span>
    </button>
    <button class="grid-btn" @click="goFund">
      <i class="fa-solid fa-hand-holding-dollar"></i>
      <span>펀드</span>
    </button>
    <button class="grid-btn" @click="goStock">
      <i class="fa-solid fa-money-bill-trend-up"></i>
      <span>주식</span>
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { issueUserStockToken } from '@/api';
const router = useRouter();

onMounted(async () => {
  await issueToken();
});

const issueToken = async () => {
  const userId = useAuthStore().getId;
  await issueUserStockToken(userId);
  console.log('토큰 발급 성공');
};

function goDeposit() {
  router.push({ name: 'Deposit' });
}
function goInstallment() {
  router.push({ name: 'Installment' });
}
function goFund() {
  router.push({ name: 'Fund' });
}
function goStock() {
  router.push({ name: 'Stock' });
}
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

.button-grid-center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
.button-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 24px;
  justify-items: stretch;
  align-items: stretch;
  width: 300px;
  height: 300px;
}

.grid-btn {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  background: var(--color-bg);
  border-radius: 16px;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.grid-btn i {
  font-size: 54px;
  margin-bottom: 10px;
  color: var(--color-main);
}

.grid-btn span {
  font-size: var(--font-size-body-large);
  font-weight: var(--font-weight-medium);
  margin-top: 2px;
  color: var(--color-main);
}
</style>
