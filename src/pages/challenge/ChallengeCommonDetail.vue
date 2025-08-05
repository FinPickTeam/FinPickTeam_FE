<template>
  <div class="challenge-common-detail">
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
            <span class="stat-label">참여자</span>
            <span class="stat-value">{{ challenge.participants }}명</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">최대 인원</span>
            <span class="stat-value">{{ challenge.maxParticipants }}명</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">남은 기간</span>
            <span class="stat-value">D-{{ challenge.remainingDays }}</span>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-label">참여 진행률</span>
            <span class="progress-percentage"
              >{{ challenge.participants }}/{{
                challenge.maxParticipants
              }}</span
            >
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{
                width:
                  (challenge.participants / challenge.maxParticipants) * 100 +
                  '%',
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 참여 버튼 -->
      <div class="join-section">
        <button v-if="!isParticipating" class="join-button" @click="handleJoin">
          챌린지 참여하기
        </button>
        <button v-else class="joined-button" disabled>참여 중</button>
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

const route = useRoute();
const router = useRouter();

// 상태 관리
const loading = ref(true);
const challenge = ref(null);
const isParticipating = ref(false);

// 챌린지 데이터 fetch 함수
const fetchChallenge = async (challengeId) => {
  try {
    loading.value = true;

    // 실제로는 API 호출
    // const response = await fetch(`/api/challenges/${challengeId}`);
    // const data = await response.json();

    // 임시 데이터 (실제로는 API에서 가져올 데이터)
    const data = {
      id: challengeId,
      title: '매일 저축하기',
      description: '매일 1만원씩 저축하여 30일 동안 30만원 모으기',
      progress: 0,
      remainingDays: 30,
      participants: 1250,
      maxParticipants: 2000,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
    };

    // 데이터 설정
    challenge.value = data;

    // 사용자의 참여 여부 확인
    checkParticipationStatus();
  } catch (error) {
    console.error('챌린지 데이터 로드 실패:', error);
    challenge.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // URL 파라미터에서 챌린지 ID 가져오기
  const challengeId = route.params.id;

  // 챌린지 데이터 fetch
  fetchChallenge(challengeId);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const checkParticipationStatus = () => {
  // 실제로는 API 호출로 사용자의 참여 여부 확인
  isParticipating.value = false;
};

const handleJoin = () => {
  // 챌린지 참여 로직
  if (challenge.value.participants >= challenge.value.maxParticipants) {
    alert('참여 인원이 마감되었습니다.');
    return;
  }

  // 실제로는 API 호출로 참여 처리
  isParticipating.value = true;
  challenge.value.participants += 1;

  alert('챌린지에 참여했습니다!');
};
</script>

<style scoped>
.challenge-common-detail {
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
  color: #666;
  font-size: 16px;
  margin: 0;
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
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 20px 16px;
}

.error-text {
  color: #666;
  font-size: 16px;
  margin: 0;
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

.join-section {
  padding: 20px 0;
  width: 100%;
  max-width: 500px;
}

.join-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(
    to right,
    var(--color-main),
    var(--color-main-light)
  );
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.join-button:hover {
  transform: translateY(-2px);
}

.joined-button {
  width: 100%;
  padding: 16px;
  background-color: #e0e0e0;
  color: #666;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: not-allowed;
}
</style>
