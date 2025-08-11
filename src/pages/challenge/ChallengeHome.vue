<script setup>
import {ref, computed, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import HotChallengeCard from '@/components/challenge/HotChallengeCard.vue';
import ParticipatingChallengeCard from '@/components/challenge/ParticipatingChallengeCard.vue';
import ChallengeStatsSwiper from '@/components/challenge/ChallengeStatsSwiper.vue';
import {
  getChallengeSummary,
  getChallengeList,
} from '@/api/challenge/challenge.js';
import {getMonthlyPoints} from '@/api/coin/coin.js';

import {useUserStore} from '@/stores/user';
import {useAuthStore} from '@/stores/auth';

const router = useRouter();
const userStore = useUserStore();
const auth = useAuthStore();

// 로딩/에러 상태
const loading = ref({
  summary: false,
  participating: false,
  hot: false,
  points: false,
});
const error = ref({
  summary: null,
  participating: null,
  hot: null,
  points: null,
});

// 데이터
const summary = ref({
  totalChallenges: 0,
  successCount: 0,
  achievementRate: 0,
});
const participatingChallenges = ref([]);
const hotChallenges = ref([]);
const monthlyPoints = ref(null); // ★ 월별 누적 포인트

// 닉네임 우선 표시(백엔드 키 NickName/nickname 모두 대응), 없으면 userName → '사용자'
const displayName = computed(() => {
  const u = auth.user || {};
  return u.nickname || u.NickName || u.userName || '사용자';
});

// 이동 핸들러
const handleParticipate = (challenge) => {
  router.push({
    name: 'ChallengeCommonDetail',
    params: {id: challenge.id},
    state: {previousPage: '/challenge'},
  });
};

const goDetail = (challenge) => {
  if (challenge.type === 'COMMON') {
    router.push({
      name: 'ChallengeCommonDetail',
      params: {id: challenge.id},
      state: {previousPage: '/challenge'},
    });
  } else if (challenge.type === 'GROUP') {
    router.push({
      name: 'ChallengeGroupDetail',
      params: {id: challenge.id},
      state: {previousPage: '/challenge'},
    });
  } else if (challenge.type === 'PERSONAL') {
    router.push({
      name: 'ChallengePersonalDetail',
      params: {id: challenge.id},
      state: {previousPage: '/challenge'},
    });
  }
};

const handleCardClick = (payload) => {
  const challenge = payload.challenge || payload;
  goDetail(challenge);
};

// 초기 데이터 로드
const fetchSummary = async () => {
  loading.value.summary = true;
  error.value.summary = null;
  try {
    const data = await getChallengeSummary();
    summary.value = data || {
      totalChallenges: 0,
      successCount: 0,
      achievementRate: 0,
    };
  } catch (e) {
    error.value.summary =
        e?.response?.data?.message || e.message || '요약 조회 실패';
  } finally {
    loading.value.summary = false;
  }
};

const fetchParticipating = async () => {
  loading.value.participating = true;
  error.value.participating = null;
  try {
    const list = await getChallengeList({participating: true});
    participatingChallenges.value = Array.isArray(list) ? list : [];
  } catch (e) {
    error.value.participating =
        e?.response?.data?.message || e.message || '참여중 목록 조회 실패';
  } finally {
    loading.value.participating = false;
  }
};

const fetchHot = async () => {
  loading.value.hot = true;
  error.value.hot = null;
  try {
    const list = await getChallengeList({
      status: 'RECRUITING',
      participating: false,
    });
    hotChallenges.value = Array.isArray(list) ? list : [];
  } catch (e) {
    error.value.hot =
        e?.response?.data?.message || e.message || 'HOT 목록 조회 실패';
  } finally {
    loading.value.hot = false;
  }
};

const fetchMonthlyPoints = async () => {
  loading.value.points = true;
  error.value.points = null;
  try {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1; // 1~12
    const res = await getMonthlyPoints({year: y, month: m});
    // 백엔드 응답: { month, amount, updatedAt }
    monthlyPoints.value = (res?.amount ?? null); // 값 없으면 null → 슬라이드 숨김
  } catch (e) {
    error.value.points =
        e?.response?.data?.message || e.message || '포인트 조회 실패';
    monthlyPoints.value = null;
  } finally {
    loading.value.points = false;
  }
};

onMounted(async () => {
  await Promise.all([
    fetchSummary(),
    fetchParticipating(),
    fetchHot(),
    fetchMonthlyPoints(), // ★ 포인트도 병렬로 불러오기
  ]);
});
</script>

<template>
  <div class="challenge-home">
    <div class="header-section">
      <div class="greeting-section">
        <div class="greeting">
          안녕하세요, <span class="username">{{ displayName }}</span>님!
        </div>
      </div>

      <!-- 스와이퍼 -->
      <ChallengeStatsSwiper :summary="summary" :points="monthlyPoints"/>
      <div v-if="loading.summary" style="color: #fff; margin: 6px 20px 0">
        요약 로딩중…
      </div>
      <div v-else-if="error.summary" style="color: #fff; margin: 6px 20px 0">
        {{ error.summary }}
      </div>
      <div v-if="error.points" style="color: #fff; margin: 6px 20px 0">
        {{ error.points }}
      </div>
    </div>

    <!-- 참여중인 챌린지 -->
    <div class="participating-section">
      <div class="section-header">
        <i class="fas fa-calendar section-icon"></i>
        <RouterLink to="/challenge/joined-list" class="section-title-link">
          <h3 class="section-title">참여중인 챌린지</h3>
        </RouterLink>
      </div>

      <div v-if="loading.participating" class="challenges-scroll">로딩중…</div>
      <div v-else-if="error.participating" class="challenges-scroll">
        {{ error.participating }}
      </div>
      <div v-else class="challenges-scroll">
        <ParticipatingChallengeCard
            v-for="c in participatingChallenges"
            :key="c.id"
            :challenge="{
            id: c.id,
            title: c.title,
            type: c.type,
            categoryName: c.categoryName,
            startDate: c.startDate,
            endDate: c.endDate,
            participating: c.isParticipating,
            myProgressRate: c.myProgressRate ?? 0,
            participantsCount: c.participantsCount ?? 0,
            isResultCheck: c.isResultCheck ?? false,
          }"
            @cardClick="handleCardClick"
        />
        <div v-if="participatingChallenges.length === 0" class="empty-message">
          참여중인 챌린지가 없어요.
        </div>
      </div>
    </div>

    <!-- HOT 챌린지 -->
    <div class="hot-challenges-section">
      <div class="section-header">
        <i class="fas fa-search section-icon"></i>
        <RouterLink to="/challenge/recruiting-list" class="section-title-link">
          <h3 class="section-title">현재 HOT 한 챌린지</h3>
        </RouterLink>
      </div>

      <div v-if="loading.hot" class="challenges-scroll">로딩중…</div>
      <div v-else-if="error.hot" class="challenges-scroll">{{ error.hot }}</div>
      <div v-else class="challenges-scroll">
        <HotChallengeCard
            v-for="c in hotChallenges"
            :key="c.id"
            :challenge="{
            id: c.id,
            title: c.title,
            type: c.type,
            categoryId: null,
            categoryName: c.categoryName,
            startDate: c.startDate,
            endDate: c.endDate,
            participating: c.isParticipating,
            myProgressRate: c.myProgressRate ?? null,
            participantsCount: c.participantsCount ?? 0,
            isResultCheck: c.isResultCheck ?? false,
          }"
            @participate="handleParticipate"
            @click="handleCardClick"
        />
        <div v-if="hotChallenges.length === 0" class="empty-message">
          모집 중인 챌린지가 없어요.
        </div>
      </div>
    </div>
  </div>
</template>

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
  padding: 0px 16px 0px 16px;
  margin-bottom: 12px;

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
  margin-bottom: 12px;
  margin-left: 19px;
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
  min-height: 170px;
}

/* HOT 챌린지 */
.hot-challenges-section {
  margin-bottom: 24px;
  padding: 0 16px;
  min-height: 120px;
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

/* 빈 상태 메시지 스타일 */
.empty-message {
  color: #666;
  text-align: center;
  padding: 20px 0;
  font-size: 14px;
  width: 100%;
}
</style>
