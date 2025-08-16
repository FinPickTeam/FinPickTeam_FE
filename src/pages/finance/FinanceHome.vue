<template>
  <div class="finance-container">
    <div class="button-grid">
      <button class="grid-btn" @click="goDeposit">
        <img
          src="@/assets/icons/piggy-bank-solid-full.png"
          alt="예금"
          class="grid-icon"
        />
        <span class="btn-text">예금</span>
      </button>
      <button class="grid-btn" @click="goInstallment">
        <img
          src="@/assets/icons/coins-solid-full.png"
          alt="적금"
          class="grid-icon"
        />
        <span class="btn-text">적금</span>
      </button>
      <button class="grid-btn" @click="goFund">
        <img
          src="@/assets/icons/hand-holding-dollar-solid-full.png"
          alt="펀드"
          class="grid-icon"
        />
        <span class="btn-text">펀드</span>
      </button>
      <button class="grid-btn" @click="goStock">
        <img
          src="@/assets/icons/money-bill-trend-up-solid-full.png"
          alt="주식"
          class="grid-icon"
        />
        <span class="btn-text">주식</span>
      </button>
    </div>

    <div class="guide-buttons">
      <div class="guide-text" @click="showDriverGuide">
        <i class="fa-solid fa-play"></i>
        <span class="guide-text-underline">단계별 가이드</span>
      </div>
      <div class="guide-text" @click="showMultiRouteGuide">
        <i class="fa-solid fa-route"></i>
        <span class="guide-text-underline">예금 투어</span>
      </div>
      <div class="guide-text" @click="showInstallmentTour">
        <i class="fa-solid fa-coins"></i>
        <span class="guide-text-underline">적금 투어</span>
      </div>
      <div class="guide-text" @click="showFundTour">
        <i class="fa-solid fa-chart-line"></i>
        <span class="guide-text-underline">펀드 투어</span>
      </div>
      <div class="guide-text" @click="showGuideModal">
        <i class="fa-solid fa-circle-info"></i>
        <span class="guide-text-underline">이용 가이드</span>
      </div>
    </div>

    <!-- Driver.js 단계별 가이드 -->
    <FinanceDriverGuide
      :is-visible="isDriverGuideVisible"
      @finish="closeDriverGuide"
    />

    <!-- 멀티 라우트 실제 기능 체험 가이드 -->
    <FinanceMultiRouteGuide
      :is-visible="isMultiRouteGuideVisible"
      @finish="closeMultiRouteGuide"
    />

    <!-- 이용 가이드 풀스크린 모달 -->
    <FinanceGuideFullscreenModal
      v-model="isGuideModalVisible"
      :images="guideImages"
      @finish="closeGuideModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import FinanceGuideFullscreenModal from '@/components/finance/FinanceGuideFullscreenModal.vue';
import FinanceDriverGuide from '@/components/finance/FinanceDriverGuide.vue';
import FinanceMultiRouteGuide from '@/components/finance/FinanceMultiRouteGuide.vue';
import { useFinanceRouteTours } from '@/composables/useFinanceRouteTours';

const router = useRouter();
const isGuideModalVisible = ref(false);
const isDriverGuideVisible = ref(false);
const isMultiRouteGuideVisible = ref(false);

// 투어 기능
const { startInstallmentTour, startFundTour } = useFinanceRouteTours();

// 가이드 이미지 배열 (실제 이미지 경로로 수정 필요)
const guideImages = ref([
  '/src/assets/guide/step1.png',
  '/src/assets/guide/step2.png',
  '/src/assets/guide/step3.png',
  '/src/assets/guide/step4.png',
]);

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

function showDriverGuide() {
  isDriverGuideVisible.value = true;
}

function closeDriverGuide() {
  isDriverGuideVisible.value = false;
}

function showMultiRouteGuide() {
  isMultiRouteGuideVisible.value = true;
}

function closeMultiRouteGuide() {
  isMultiRouteGuideVisible.value = false;
}

function showInstallmentTour() {
  startInstallmentTour({
    includeDetail: true,
    detailId: '1', // 실제 상품 ID로 변경 필요
  });
}

function showFundTour() {
  startFundTour({
    includeDetail: true,
    detailId: '1', // 실제 상품 ID로 변경 필요
  });
}

// 첫 방문 시 자동으로 단계별 가이드 시작 (선택사항)
onMounted(() => {
  const hasSeenGuide = localStorage.getItem('finance-guide-seen');
  if (!hasSeenGuide) {
    setTimeout(() => {
      showDriverGuide();
      localStorage.setItem('finance-guide-seen', 'true');
    }, 1000);
  }
});
</script>

<style scoped>
.finance-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px - 68px); /* 헤더와 네비바 높이를 제외한 전체 높이 */
  padding: 20px;
  background: var(--color-bg-light, #f8f9fa);
  box-sizing: border-box;
  position: absolute;
  top: 80px; /* 헤더 높이만큼 아래로 이동 */
  left: 0;
  right: 0;
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
  margin-bottom: 32px;
}

.grid-btn {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  background: var(--color-bg, #fff);
  border-radius: 16px;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.grid-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(107, 70, 193, 0.05) 0%,
    rgba(107, 70, 193, 0.02) 100%
  );
  opacity: 0;
  transition: opacity 0.2s ease;
}

.grid-icon {
  width: 80px;
  height: auto;
  margin-bottom: 10px;
  object-fit: contain;
  transition: transform 0.2s ease;
  position: relative;
  z-index: 1;
}

.btn-text {
  font-size: var(--font-size-body-large, 16px);
  font-weight: var(--font-weight-medium, 500);
  margin-top: 2px;
  color: var(--color-main, #6b46c1);
  position: relative;
  z-index: 1;
}

/* 호버 효과 */
.grid-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.grid-btn:hover::before {
  opacity: 1;
}

.grid-btn:hover .grid-icon {
  transform: scale(1.05);
}

/* 포커스 상태 (접근성) */
.grid-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.3);
}

/* 활성 상태 */
.grid-btn:active {
  transform: translateY(0);
  transition: transform 0.1s ease;
}

.guide-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.guide-text {
  text-align: center;
  font-size: 14px;
  color: #888;
  font-family: var(--font-main, sans-serif);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px 12px;
  border-radius: 8px;
}

.guide-text:hover {
  color: var(--color-main, #6b46c1);
  background: rgba(107, 70, 193, 0.05);
}

.guide-text:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(107, 70, 193, 0.3);
}

.guide-text i {
  font-size: 14px;
  color: inherit;
}

.guide-text-underline {
  text-decoration: underline;
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .finance-container {
    padding: 16px;
  }

  .button-grid {
    width: 280px;
    height: 280px;
    gap: 20px;
  }

  .grid-icon {
    width: 70px;
  }

  .btn-text {
    font-size: 15px;
  }
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
  .grid-btn,
  .grid-icon,
  .guide-text {
    transition: none;
  }

  .grid-btn:hover {
    transform: none;
  }

  .grid-btn:hover .grid-icon {
    transform: none;
  }
}

/* 고대비 모드 지원 */
@media (prefers-contrast: high) {
  .grid-btn {
    border: 2px solid #333;
  }

  .guide-text {
    border: 1px solid #333;
  }
}
</style>
