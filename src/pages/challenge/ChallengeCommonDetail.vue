<template>
  <div class="challenge-common-detail">
    <ChallengeHeader title="공통 챌린지" />

    <div class="content">
      <!-- 챌린지 기본 정보 -->
      <div class="challenge-info">
        <h1 class="challenge-title">{{ challenge.title }}</h1>
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

      <!-- 챌린지 일정 -->
      <div class="schedule-section">
        <h2 class="section-title">
          <i class="fas fa-calendar"></i>
          챌린지 일정
        </h2>
        <div class="schedule-info">
          <div class="schedule-item">
            <span class="schedule-label">시작일</span>
            <span class="schedule-date">{{
              formatDate(challenge.startDate)
            }}</span>
          </div>
          <div class="schedule-item">
            <span class="schedule-label">종료일</span>
            <span class="schedule-date">{{
              formatDate(challenge.endDate)
            }}</span>
          </div>
        </div>
      </div>

      <!-- 챌린지 규칙 -->
      <div class="rules-section">
        <h2 class="section-title">
          <i class="fas fa-list-check"></i>
          챌린지 규칙
        </h2>
        <div class="rules-list">
          <div class="rule-item">
            <i class="fas fa-check"></i>
            <span>매일 1만원씩 저축하기</span>
          </div>
          <div class="rule-item">
            <i class="fas fa-check"></i>
            <span>30일 동안 총 30만원 모으기</span>
          </div>
          <div class="rule-item">
            <i class="fas fa-check"></i>
            <span>매일 저축 인증 사진 업로드</span>
          </div>
          <div class="rule-item">
            <i class="fas fa-check"></i>
            <span>성공 시 보상 지급</span>
          </div>
        </div>
      </div>

      <!-- 참여자 목록 -->
      <div class="participants-section">
        <h2 class="section-title">
          <i class="fas fa-users"></i>
          참여자 목록
        </h2>
        <div class="participants-list">
          <div
            v-for="participant in participants"
            :key="participant.id"
            class="participant-item"
          >
            <div class="participant-avatar">
              <img :src="participant.avatar" :alt="participant.name" />
            </div>
            <div class="participant-info">
              <span class="participant-name">{{ participant.name }}</span>
              <span class="participant-progress"
                >{{ participant.progress }}% 완료</span
              >
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ChallengeHeader from '@/components/challenge/ChallengeHeader.vue';

const route = useRoute();
const router = useRouter();

// 챌린지 데이터 (실제로는 API에서 가져올 데이터)
const challenge = ref({
  id: 1,
  title: '매일 저축하기',
  description: '매일 1만원씩 저축하여 30일 동안 30만원 모으기',
  progress: 0,
  remainingDays: 30,
  participants: 1250,
  maxParticipants: 2000,
  startDate: '2024-01-15',
  endDate: '2024-02-15',
});

// 참여자 목록 (더미 데이터)
const participants = ref([
  {
    id: 1,
    name: '김철수',
    avatar: '/avatar1.jpg',
    progress: 85,
  },
  {
    id: 2,
    name: '이영희',
    avatar: '/avatar2.jpg',
    progress: 92,
  },
  {
    id: 3,
    name: '박민수',
    avatar: '/avatar3.jpg',
    progress: 78,
  },
  {
    id: 4,
    name: '최지영',
    avatar: '/avatar4.jpg',
    progress: 95,
  },
]);

const isParticipating = ref(false);

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

  // 사용자의 참여 여부 확인
  checkParticipationStatus();
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
}

.challenge-info {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.challenge-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px 0;
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

.schedule-section,
.rules-section,
.participants-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  font-size: 16px;
  color: #666;
}

.schedule-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.schedule-label {
  font-size: 14px;
  color: #666;
}

.schedule-date {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.rule-item i {
  color: var(--color-main);
  font-size: 14px;
}

.rule-item span {
  font-size: 14px;
  color: #333;
}

.participants-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.participant-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.participant-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.participant-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.participant-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.participant-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.participant-progress {
  font-size: 12px;
  color: #666;
}

.join-section {
  padding: 20px 0;
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
