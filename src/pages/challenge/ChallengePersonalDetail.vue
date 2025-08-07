<template>
  <div class="challenge-personal-detail">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">챌린지 정보를 불러오는 중...</p>
    </div>

    <!-- 챌린지 상세 정보 -->
    <div v-else-if="challenge" class="content">
      <!-- 챌린지 기본 정보 -->
      <div class="challenge-info">
        <div class="title-section">
          <h1 class="challenge-title">{{ challenge.title }}</h1>
          <div class="challenge-date">
            {{ formatDate(challenge.startDate) }} ~
            {{ formatDate(challenge.endDate) }}
          </div>
        </div>
        <p class="challenge-description">{{ challenge.description }}</p>

        <div class="challenge-stats">
          <div class="stat-item">
            <span class="stat-label">진행률</span>
            <span class="stat-value"
              >{{ Math.round(challenge.myProgress * 100) }}%</span
            >
          </div>
          <div class="stat-item">
            <span class="stat-label">목표 {{ challenge.goalType }}</span>
            <span class="stat-value"
              >{{ challenge.goalValue.toLocaleString() }}원</span
            >
          </div>
          <div class="stat-item">
            <span class="stat-label">남은 기간</span>
            <span class="stat-value">D-{{ getRemainingDays() }}</span>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-label">{{ challenge.goalType }} 진행률</span>
            <span class="progress-percentage"
              >{{ Math.round(challenge.myProgress * 100) }}%</span
            >
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{
                width: Math.round(challenge.myProgress * 100) + '%',
              }"
            ></div>
          </div>
        </div>

        <!-- 개인 챌린지 특별 정보 -->
        <div class="personal-info">
          <div class="savings-info">
            <span class="savings-label">현재 {{ challenge.goalType }}</span>
            <span class="savings-amount"
              >{{
                Math.round(
                  challenge.goalValue * challenge.myProgress
                ).toLocaleString()
              }}원</span
            >
          </div>
          <div class="daily-goal">
            <span class="goal-label">목표 {{ challenge.goalType }}</span>
            <span class="goal-amount"
              >{{ challenge.goalValue.toLocaleString() }}원</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div v-else class="error-container">
      <p class="error-text">챌린지 정보를 불러올 수 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import challengeDetailData from './challenge_personal_detail.json';

const route = useRoute();
const router = useRouter();

// 상태 관리
const loading = ref(true);
const challenge = ref(null);

onMounted(() => {
  // URL 파라미터에서 챌린지 ID 가져오기
  const challengeId = route.params.id;

  // 챌린지 데이터 fetch
  fetchChallenge(challengeId);
});

// 챌린지 데이터 fetch 함수
const fetchChallenge = async (challengeId) => {
  try {
    loading.value = true;

    // 라우터 state에서 전달된 데이터 확인
    const stateData = router.currentRoute.value.state?.challengeData;

    if (stateData) {
      // 라우터 state에서 전달된 데이터 사용
      challenge.value = {
        ...challengeDetailData.data,
        isParticipating:
          stateData.participating || stateData.isParticipating || false,
      };
    } else {
      // JSON 파일에서 데이터 가져오기 (실제로는 API에서 가져올 데이터)
      const data = challengeDetailData.data;
      challenge.value = data;
    }

    console.log('챌린지 ID:', challengeId);
    console.log('챌린지 데이터:', challenge.value);
    console.log('라우터 state:', router.currentRoute.value.state);
  } catch (error) {
    console.error('챌린지 데이터 로드 실패:', error);
    challenge.value = null;
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// 남은 일수 계산 함수
const getRemainingDays = () => {
  if (!challenge.value.endDate) return 0;
  const endDate = new Date(challenge.value.endDate);
  const today = new Date();
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};
</script>

<style scoped>
.challenge-personal-detail {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 로딩 스타일 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 20px 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--color-main);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
  color: #666;
  text-align: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 에러 스타일 */
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 20px 16px;
}

.error-text {
  font-size: 16px;
  color: #666;
  text-align: center;
}

.content {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px); /* 헤더 높이를 제외한 전체 높이 */
}

.challenge-info {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.title-section {
  margin-bottom: 12px;
}

.challenge-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.challenge-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 0;
}

.challenge-description {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.challenge-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.progress-section {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 14px;
  color: #666;
}

.progress-percentage {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    to right,
    var(--color-main),
    var(--color-main-light)
  );
  border-radius: 4px;
  transition: width 0.3s ease;
}

.personal-info {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.savings-info,
.daily-goal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.savings-info:last-child,
.daily-goal:last-child {
  margin-bottom: 0;
}

.savings-label,
.goal-label {
  font-size: 14px;
  color: #666;
}

.savings-amount,
.goal-amount {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
</style>
