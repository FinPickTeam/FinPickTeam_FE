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
                  :style="{ width: item.value + '%' }"
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
import {  computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useProfileStore} from "@/stores/profile.js";

const router = useRouter();
const route = useRoute();
const profileStore = useProfileStore();
const investmentType = computed(() => profileStore.resultType || '분석 결과 없음');
const investmentDescription = computed(() => profileStore.resultExplain || '결과를 불러오는 데 실패했습니다.');

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
  안정추구형: { riskTolerance: 35, experience: 25, period: 45, expectedReturn: 30 },
  위험중립형: { riskTolerance: 55, experience: 50, period: 65, expectedReturn: 55 },
  적극투자형: { riskTolerance: 86, experience: 76, period: 90, expectedReturn: 80 },
  공격투자형: { riskTolerance: 95, experience: 90, period: 95, expectedReturn: 95 },
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
    router.push('/');
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
}

.analysis-item:last-child {
  margin-bottom: 0;
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
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    to right,
    var(--color-main-light-2),
    var(--color-main-dark)
  );
  border-radius: 4px;
  transition: width 0.8s ease-in-out;
}

.progress-value {
  color: #4318d1;
  font-size: 12px;
  font-weight: 600;
  min-width: 32px;
  text-align: right;
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
  padding-bottom: 24px;
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
  padding: 16px 0;
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
