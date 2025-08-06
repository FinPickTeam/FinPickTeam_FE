<template>
  <div class="challenge-group-detail">
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
            <span class="stat-value">{{ challenge.participantsCount }}명</span>
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
            <span class="progress-label">달성률</span>
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

        <!-- 참여자 목록 섹션 -->
        <div
          class="members-section"
          v-if="challenge.members && challenge.members.length > 0"
        >
          <h3 class="members-title">참여자 목록</h3>
          <div class="members-list">
            <div
              v-for="member in challenge.members"
              :key="member.userId"
              class="member-item"
            >
              <div class="member-info">
                <span class="member-nickname">{{ member.nickname }}</span>
                <span class="member-progress"
                  >{{ Math.round(member.progress * 100) }}%</span
                >
              </div>
              <div class="member-progress-bar">
                <div
                  class="member-progress-fill"
                  :style="{ width: Math.round(member.progress * 100) + '%' }"
                ></div>
              </div>
            </div>
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
import challengeGroupDetailData from './challenge_group_detail.json';

const route = useRoute();
const router = useRouter();

// 상태 관리
const loading = ref(true);
const challenge = ref(null);
const isParticipating = ref(false);

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

    // 실제로는 API 호출
    // const response = await fetch(`/api/challenges/${challengeId}`);
    // const data = await response.json();

    // JSON 파일에서 데이터 가져오기 (실제로는 API에서 가져올 데이터)
    const data = challengeGroupDetailData.data;
    challenge.value = data;

    console.log('챌린지 ID:', challengeId);
    console.log('챌린지 데이터:', challenge.value);

    // 사용자의 참여 여부 확인
    checkParticipationStatus();
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

const checkParticipationStatus = () => {
  // 실제로는 API 호출로 사용자의 참여 여부 확인
  isParticipating.value = challenge.value.isParticipating;
};

const handleJoin = () => {
  // 챌린지 참여 로직
  if (challenge.value.participantsCount >= 6) {
    alert('참여 인원이 마감되었습니다.');
    return;
  }

  // 실제로는 API 호출로 참여 처리
  isParticipating.value = true;
  challenge.value.participantsCount += 1;

  alert('챌린지에 참여했습니다!');
};

// 남은 일수 계산 함수
const getRemainingDays = () => {
  const today = new Date();
  const endDate = new Date(challenge.value.endDate);
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};
</script>

<style scoped>
.challenge-group-detail {
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

.group-info {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.creator-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.creator-label {
  font-size: 14px;
  color: #666;
}

.creator-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
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

/* 참여자 목록 스타일 */
.members-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.members-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-item {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.member-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.member-nickname {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.member-progress {
  font-size: 12px;
  color: #666;
}

.member-progress-bar {
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.member-progress-fill {
  height: 100%;
  background: linear-gradient(
    to right,
    var(--color-main),
    var(--color-main-light)
  );
  border-radius: 3px;
  transition: width 0.3s ease;
}
</style>
