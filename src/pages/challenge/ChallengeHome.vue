<template>
  <div class="challenge-home">
    <div class="header-section">
      <!-- 사용자 인사말 -->
      <div class="greeting-section">
        <div class="greeting">
          안녕하세요, <span class="username">사용자님!</span>
        </div>
      </div>

      <ChallengeStatsSwiper />
    </div>

    <!-- 참여중인 소그룹 섹션 -->
    <div class="participating-section">
      <div class="section-header">
        <i class="fas fa-calendar section-icon"></i>
        <RouterLink to="/challenge/joined-list" class="section-title-link">
          <h3 class="section-title">참여중인 챌린지</h3>
        </RouterLink>
      </div>
      <div class="challenges-scroll">
        <ParticipatingChallengeCard
          v-for="challenge in participatingChallenges"
          :key="challenge.id"
          :challenge="challenge"
          @cardClick="handleCardClick"
        />
      </div>
    </div>

    <!-- HOT 챌린지 섹션 -->
    <div class="hot-challenges-section">
      <div class="section-header">
        <i class="fas fa-search section-icon"></i>
        <RouterLink to="/challenge/recruiting-list" class="section-title-link">
          <h3 class="section-title">현재 HOT 한 챌린지</h3>
        </RouterLink>
      </div>
      <div class="challenges-scroll">
        <HotChallengeCard
          v-for="challenge in hotChallenges"
          :key="challenge.id"
          :challenge="challenge"
          @participate="handleParticipate"
          @click="handleCardClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import HotChallengeCard from '@/components/challenge/HotChallengeCard.vue';
import ParticipatingChallengeCard from '@/components/challenge/ParticipatingChallengeCard.vue';
import challengeListData from './challenge_list.json';
import ChallengeStatsSwiper from '@/components/challenge/ChallengeStatsSwiper.vue';

// 통계 데이터
const totalChallenges = ref(10); // 전체 참여 수
const successCount = ref(8); // 성공 수
const achievementRate = ref(80.0); // 성공률

// 챌린지 리스트 데이터
const challengeList = ref(challengeListData.data);

// 참여중인 챌린지 필터링
const participatingChallenges = computed(() => {
  return challengeList.value.filter((challenge) => challenge.participating);
});

// HOT 챌린지 필터링 (참여하지 않은 챌린지들)
const hotChallenges = computed(() => {
  return challengeList.value.filter((challenge) => !challenge.participating);
});

const router = useRouter();

const handleParticipate = (challenge) => {
  console.log('참여하기 클릭:', challenge);
  // 챌린지 상세 페이지로 이동
  router.push({
    name: 'ChallengeCommonDetail',
    params: { id: challenge.id },
    state: {
      previousPage: '/challenge',
    },
  });
};

const handleCardClick = (data) => {
  // data가 객체인 경우 (ChallengeCard에서 온 경우)
  const challenge = data.challenge || data;

  // 챌린지 타입에 따른 상세 페이지로 이동
  if (challenge.type === 'COMMON') {
    router.push({
      name: 'ChallengeCommonDetail',
      params: { id: challenge.id },
      state: {
        previousPage: '/challenge',
      },
    });
  } else if (challenge.type === 'GROUP') {
    router.push({
      name: 'ChallengeGroupDetail',
      params: { id: challenge.id },
      state: {
        previousPage: '/challenge',
      },
    });
  } else if (challenge.type === 'PERSONAL') {
    router.push({
      name: 'ChallengePersonalDetail',
      params: { id: challenge.id },
      state: {
        previousPage: '/challenge',
      },
    });
  }
};
</script>

<style scoped>
.challenge-home {
  padding: 0;
  background: var(--color-bg-light);
  min-height: 100vh;
}

/* 헤더 섹션 */
.header-section {
  width: 100%;
  max-width: 390px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    to right,
    var(--color-main-light-2),
    var(--color-main-dark)
  );
  border-radius: 0;
  padding: 16px 16px 0px 16px;
  margin-bottom: 12px;
  margin-top: -22px;
  margin-left: auto;
  margin-right: auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  gap: 16px;
}

.header-icon {
  font-size: 18px;
  color: #333;
  cursor: pointer;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

/* 인사말 섹션 */
.greeting-section {
  margin-bottom: 2px;
}

.greeting {
  color: #fff;
  font-size: var(--font-size-title-sub);
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 35px;
}

.username {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-title-main);
}

/* 통계 섹션 */
.stats-section {
  background: transparent;
  border-radius: 16px;
  margin-bottom: 24px;
}

.stats-container {
  display: flex;
  background: #fff;
  border-radius: 18px;
  padding: 30px 30px;
  width: 90%;
  max-width: 320px;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
}

.stat-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 10px;
}

.stat-number {
  font-family: 'JalnanGothic', var(--font-main);
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 1px;
  color: #222;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e0e0e0;
}

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
}

.dot.active {
  background: #6b46c1;
}

/* 섹션 공통 스타일 */
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-icon {
  font-size: 16px;
  color: #6b46c1;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.section-title-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.section-title-link:hover {
  opacity: 0.8;
}

/* 참여중인 소그룹 */
.participating-section {
  margin-bottom: 24px;
  padding: 0 16px;
}

/* HOT 챌린지 */
.hot-challenges-section {
  margin-bottom: 24px;
  padding: 0 16px;
}

.challenges-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

/* 스크롤바 스타일링 */
.challenges-scroll::-webkit-scrollbar {
  height: 4px;
}

.challenges-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.challenges-scroll::-webkit-scrollbar-thumb {
  background: #6b46c1;
  border-radius: 2px;
}

.challenges-scroll::-webkit-scrollbar-thumb:hover {
  background: #5a3d9e;
}
</style>
