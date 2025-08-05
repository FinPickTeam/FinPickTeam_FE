<template>
  <div class="challenge-personal-detail">
    <div class="content">
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
            <span class="stat-value">{{ challenge.progress }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">목표 금액</span>
            <span class="stat-value">{{ challenge.targetAmount }}원</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">남은 기간</span>
            <span class="stat-value">D-{{ challenge.remainingDays }}</span>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-label">저축 진행률</span>
            <span class="progress-percentage">{{ challenge.progress }}%</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{
                width: challenge.progress + '%',
              }"
            ></div>
          </div>
        </div>

        <!-- 개인 챌린지 특별 정보 -->
        <div class="personal-info">
          <div class="savings-info">
            <span class="savings-label">현재 저축액</span>
            <span class="savings-amount">{{ challenge.currentAmount }}원</span>
          </div>
          <div class="daily-goal">
            <span class="goal-label">일일 목표</span>
            <span class="goal-amount">{{ challenge.dailyGoal }}원</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 챌린지 데이터 (실제로는 API에서 가져올 데이터)
const challenge = ref({
  id: 1,
  title: '매일 5천원 저축하기',
  description: '매일 5천원씩 저축하여 30일 동안 15만원 모으기',
  progress: 65,
  remainingDays: 12,
  targetAmount: 150000,
  currentAmount: 97500,
  dailyGoal: 5000,
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});

onMounted(() => {
  // URL 파라미터에서 챌린지 ID 가져오기
  const challengeId = route.params.id;

  // 라우터 state에서 전달받은 챌린지 데이터 확인
  if (route.state && route.state.challenge) {
    challenge.value = route.state.challenge;
  }

  // 실제로는 API 호출로 챌린지 데이터 가져오기
  console.log('챌린지 ID:', challengeId);
  console.log('챌린지 데이터:', challenge.value);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<style scoped>
.challenge-personal-detail {
  min-height: 100vh;
  background-color: #f8f9fa;
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
