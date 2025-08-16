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
      <div class="guide-section">
        <div class="hashtag-container">
          <div class="hashtag-btn" @click="showMultiRouteGuide">
            <span>#예금투어</span>
          </div>
          <div class="hashtag-btn" @click="showInstallmentTour">
            <span>#적금투어</span>
          </div>
          <div class="hashtag-btn" @click="showFundTour">
            <span>#펀드투어</span>
          </div>
          <div class="hashtag-btn" @click="showStockTour">
            <span>#주식투어</span>
          </div>
        </div>
      </div>

      <div class="guide-section">
        <div class="other-guide-buttons">
          <div class="guide-btn primary" @click="showDriverGuide">
            <i class="fa-solid fa-play"></i>
            <span>단계별 가이드</span>
          </div>
          <div class="guide-btn secondary" @click="showGuideModal">
            <i class="fa-solid fa-circle-info"></i>
            <span>이용 가이드</span>
          </div>
        </div>
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
const { startInstallmentTour, startFundTour, startStockTour } =
  useFinanceRouteTours();

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

function showStockTour() {
  startStockTour({
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
  gap: 24px;
  margin-top: 24px;
  width: 100%;
  max-width: 400px;
}

.guide-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guide-section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-main, #6b46c1);
  margin: 0;
  text-align: center;
  position: relative;
}

.guide-section-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--color-main, #6b46c1),
    rgba(107, 70, 193, 0.3)
  );
  border-radius: 1px;
}

/* 해시태그 스타일 */
.hashtag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.hashtag-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(107, 70, 193, 0.08);
  border: 1px solid rgba(107, 70, 193, 0.15);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-main, #6b46c1);
  position: relative;
  overflow: hidden;
}

.hashtag-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(107, 70, 193, 0.1),
    transparent
  );
  transition: left 0.5s ease;
}

.hashtag-btn:hover::before {
  left: 100%;
}

.hashtag-btn:hover {
  background: rgba(107, 70, 193, 0.15);
  border-color: var(--color-main, #6b46c1);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(107, 70, 193, 0.2);
}

.hashtag-btn:active {
  transform: translateY(0);
}

.hashtag-btn i {
  font-size: 12px;
  color: var(--color-main, #6b46c1);
  transition: transform 0.3s ease;
}

.hashtag-btn:hover i {
  transform: scale(1.1);
}

.hashtag-btn span {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 기타 가이드 버튼 스타일 */
.other-guide-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.guide-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  border: none;
  position: relative;
  overflow: hidden;
}

.guide-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.guide-btn:hover::before {
  left: 100%;
}

.guide-btn.primary {
  background: linear-gradient(
    135deg,
    var(--color-main, #6b46c1),
    rgba(107, 70, 193, 0.8)
  );
  color: white;
  box-shadow: 0 2px 8px rgba(107, 70, 193, 0.3);
}

.guide-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 70, 193, 0.4);
}

.guide-btn.secondary {
  background: rgba(107, 70, 193, 0.05);
  color: var(--color-main, #6b46c1);
  border: 1px solid rgba(107, 70, 193, 0.2);
}

.guide-btn.secondary:hover {
  background: rgba(107, 70, 193, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(107, 70, 193, 0.15);
}

.guide-btn i {
  font-size: 14px;
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

  .guide-buttons {
    max-width: 100%;
    gap: 20px;
  }

  .hashtag-container {
    gap: 6px;
  }

  .hashtag-btn {
    padding: 6px 12px;
    font-size: 11px;
  }

  .hashtag-btn i {
    font-size: 10px;
  }

  .guide-btn {
    padding: 10px 12px;
    font-size: 13px;
  }
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
  .grid-btn,
  .grid-icon,
  .hashtag-btn,
  .guide-btn {
    transition: none;
  }

  .grid-btn:hover,
  .hashtag-btn:hover,
  .guide-btn:hover {
    transform: none;
  }

  .grid-btn:hover .grid-icon,
  .hashtag-btn:hover i {
    transform: none;
  }

  .guide-btn::before,
  .hashtag-btn::before {
    display: none;
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
