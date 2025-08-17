<template>
  <div class="profile-complete-container">
    <!-- 상단 로고 -->
    <div class="logo-section">
      <h1 class="logo-title">FinPick</h1>
      <p class="logo-subtitle">금융 생활의 새로운 시작</p>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="main-content">
      <!-- 투자성향 분석 결과 카드 -->
      <div class="result-main-card">
        <div class="investment-result">
          <h3 class="investment-type-title">{{ investmentType }}</h3>
        </div>
      </div>

      <!-- 투자 성향 상세 분석 -->
      <div class="detailed-analysis-section">
        <h4 class="detailed-analysis-title">투자 성향 상세 분석</h4>
        <div class="detailed-analysis-content">
          <div
            class="analysis-item"
            v-for="item in detailedAnalysis"
            :key="item.label"
          >
            <div class="progress-bar-container">
              <div class="analysis-label">{{ item.label }}</div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{
                    '--target-width': item.value + '%',
                    'animation-delay': $index * 0.1 + 's',
                  }"
                ></div>
              </div>
              <div class="progress-value">{{ item.value }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 투자 성향 요약 -->
      <div class="summary-section">
        <h4 class="summary-title">투자 성향 요약</h4>
        <div class="summary-content">
          <p>{{ investmentDescription }}</p>
        </div>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="action-section">
      <button class="start-btn" @click="goToHome">{{ buttonText }}</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProfileStore } from '@/stores/profile.js';

const router = useRouter();
const route = useRoute();
const profileStore = useProfileStore();

const investmentType = computed(
  () => profileStore.resultType || '분석 결과 없음'
);
const investmentDescription = computed(
  () => profileStore.resultExplain || '결과를 불러오는 데 실패했습니다.'
);

const buttonText = computed(() => {
  const from = route.query.from;
  if (from === 'fund') {
    return '펀드 시작하기';
  } else if (from === 'mypage') {
    return '투자성향 재설정 완료';
  } else {
    return '핀픽 시작하기'; // 기본값
  }
});

const investmentTypeData = {
  안정형: { riskTolerance: 17, experience: 14, period: 30, expectedReturn: 16 },
  안정추구형: {
    riskTolerance: 35,
    experience: 25,
    period: 45,
    expectedReturn: 30,
  },
  위험중립형: {
    riskTolerance: 55,
    experience: 50,
    period: 65,
    expectedReturn: 55,
  },
  적극투자형: {
    riskTolerance: 86,
    experience: 76,
    period: 90,
    expectedReturn: 80,
  },
  공격투자형: {
    riskTolerance: 95,
    experience: 90,
    period: 95,
    expectedReturn: 95,
  },
};

const detailedAnalysis = computed(() => {
  const type = investmentType.value; // Pinia에서 가져온 현재 성향 타입
  const data = investmentTypeData[type] || investmentTypeData['안정형'];
  return [
    { label: '위험 감수 능력', value: data.riskTolerance },
    { label: '투자 경험', value: data.experience },
    { label: '투자 기간', value: data.period },
    { label: '수익 기대치', value: data.expectedReturn },
  ];
});

// 홈으로 이동
const goToHome = () => {
  const from = route.query.from || 'signup';
  profileStore.resetAnswers();
  if (from === 'mypage') {
    router.push('/mypage');
  } else if (from === 'fund') {
    router.push('/finance/fund');
  } else {
    // 회원가입 완료 후 홈으로 이동할 때 가입축하 모달을 표시하기 위한 쿼리 파라미터 추가
    router.push('/?from=profile-complete');
  }
};
</script>

<style scoped>
.profile-complete-container {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 40px 16px 24px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
}

/* 상단 로고 섹션 */
.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-title {
  font-family: 'JalnanGothic', sans-serif !important;
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 1px;
  background: var(--color-main);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.logo-subtitle {
  color: #888;
  font-size: 15px;
  text-align: center;
  font-weight: 400;
  margin-top: 4px;
  margin-bottom: 0;
  letter-spacing: 0;
}

/* 메인 콘텐츠 */
.main-content {
  flex: 1;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

/* 메인 결과 카드 */
.result-main-card {
  background: linear-gradient(
    to right,
    var(--color-main-light-2),
    var(--color-main-dark)
  );
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.card-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  position: relative;
}

.card-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
}

.investment-result {
  text-align: left;
}

.investment-type-title {
  color: white;
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.investment-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin: 0;
  font-weight: 400;
  line-height: 1.4;
}

/* 상세 분석 섹션 */
.detailed-analysis-section {
  margin-bottom: 24px;
}

.detailed-analysis-title {
  color: #1e293b;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.detailed-analysis-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.analysis-item {
  margin-bottom: 16px;
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.analysis-item:nth-child(1) {
  animation-delay: 0.1s;
}
.analysis-item:nth-child(2) {
  animation-delay: 0.3s;
}
.analysis-item:nth-child(3) {
  animation-delay: 0.5s;
}
.analysis-item:nth-child(4) {
  animation-delay: 0.7s;
}

.analysis-item:last-child {
  margin-bottom: 0;
}

@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.analysis-label {
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  min-width: 80px;
  flex-shrink: 0;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  animation: barGlow 2s ease-in-out infinite;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  border-radius: 4px;
  pointer-events: none;
  animation: barShine 3s ease-in-out infinite;
}

@keyframes barGlow {
  0%,
  100% {
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1),
      0 0 8px rgba(107, 70, 193, 0.2);
  }
}

@keyframes barShine {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-main-light-2) 0%,
    var(--color-main) 50%,
    var(--color-main-dark) 100%
  );
  border-radius: 4px;
  width: 0%;
  animation: progressFill 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  transform-origin: left;
  position: relative;
  overflow: hidden;
}

.progress-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s ease-in-out infinite;
  animation-delay: 0.8s;
}

@keyframes progressFill {
  0% {
    width: 0%;
    opacity: 0;
    transform: scaleX(0.3) translateX(-10px);
  }
  15% {
    opacity: 1;
    transform: scaleX(1.1) translateX(0);
  }
  30% {
    transform: scaleX(0.95) translateX(0);
  }
  50% {
    transform: scaleX(1.02) translateX(0);
  }
  70% {
    transform: scaleX(0.98) translateX(0);
  }
  85% {
    transform: scaleX(1.01) translateX(0);
  }
  100% {
    width: var(--target-width);
    opacity: 1;
    transform: scaleX(1) translateX(0);
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.progress-value {
  color: #4318d1;
  font-size: 12px;
  font-weight: 600;
  min-width: 32px;
  text-align: right;
  animation: fadeInScale 0.8s ease-out forwards;
  opacity: 0;
  transform: scale(0.8);
  animation-delay: 1.5s;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 요약 섹션 */
.summary-section {
  margin-bottom: 40px;
}

.summary-title {
  color: #1e293b;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.summary-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-content p {
  color: #475569;
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
  text-align: left;
}

/* 액션 버튼 섹션 */
.action-section {
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
  padding-bottom: 300px;
}

.start-btn {
  width: 100%;
  background: linear-gradient(
    to right,
    var(--color-main-light-2),
    var(--color-main-dark)
  );
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.start-btn:active {
  transform: translateY(0);
}
</style>
