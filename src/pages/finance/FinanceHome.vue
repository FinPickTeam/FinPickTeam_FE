<template>
  <div class="finance-container">
    <div class="button-grid">
      <button class="grid-btn" @click="goDeposit">
        <img
          src="@/assets/icons/piggy-bank-solid-full.png"
          alt="예금"
          class="grid-icon"
        />
        <span>예금</span>
      </button>
      <button class="grid-btn" @click="goInstallment">
        <img
          src="@/assets/icons/coins-solid-full.png"
          alt="적금"
          class="grid-icon"
        />
        <span>적금</span>
      </button>
      <button class="grid-btn" @click="goFund">
        <img
          src="@/assets/icons/hand-holding-dollar-solid-full.png"
          alt="펀드"
          class="grid-icon"
        />
        <span>펀드</span>
      </button>
      <button class="grid-btn" @click="goStock">
        <img
          src="@/assets/icons/money-bill-trend-up-solid-full.png"
          alt="주식"
          class="grid-icon"
        />
        <span>주식</span>
      </button>
    </div>
    <div class="guide-text" @click="showGuideModal">
      <i class="fa-solid fa-circle-info"></i>
      <span class="guide-text-underline">이용 가이드</span>
    </div>

    <!-- 이용 가이드 풀스크린 모달 -->
    <FinanceGuideFullscreenModal
      v-model="isGuideModalVisible"
      :images="guideImages"
      @finish="closeGuideModal"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { issueUserStockToken } from '@/api';
import FinanceGuideFullscreenModal from '@/components/finance/FinanceGuideFullscreenModal.vue';

const router = useRouter();
const isGuideModalVisible = ref(false);

// 가이드 이미지 배열 (실제 이미지 경로로 수정 필요)
const guideImages = ref([
  '/src/assets/guide/step1.png',
  '/src/assets/guide/step2.png',
  '/src/assets/guide/step3.png',
  '/src/assets/guide/step4.png',
]);

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

function showGuideModal() {
  isGuideModalVisible.value = true;
}

function closeGuideModal() {
  isGuideModalVisible.value = false;
}
</script>

<style scoped>
.finance-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

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

.grid-icon {
  width: 80px;
  height: auto;
  margin-bottom: 10px;
  object-fit: contain;
}

.grid-btn span {
  font-size: var(--font-size-body-large);
  font-weight: var(--font-weight-medium);
  margin-top: 2px;
  color: var(--color-main);
}

.guide-text {
  text-align: center;
  font-size: 14px;
  color: #888;
  margin-top: 16px;
  font-family: var(--font-main);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: color 0.2s;
}

.guide-text:hover {
  color: var(--color-main);
}

.guide-text i {
  font-size: 14px;
  color: #888;
}

.guide-text-underline {
  text-decoration: underline;
}
</style>
