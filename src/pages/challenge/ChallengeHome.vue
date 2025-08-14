<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import HotChallengeCard from '@/components/challenge/HotChallengeCard.vue';
import ParticipatingChallengeCard from '@/components/challenge/ParticipatingChallengeCard.vue';
import ChallengeStatsSwiper from '@/components/challenge/ChallengeStatsSwiper.vue';
import {
  getChallengeSummary,
  getChallengeList,
} from '@/api/challenge/challenge.js';
import { getMonthlyPoints } from '@/api/coin/coin.js';

import { useAuthStore } from '@/stores/auth';
import { useChallengeStore } from '@/stores/challenge';

const router = useRouter();
const auth = useAuthStore();
const challengeStore = useChallengeStore();

const loading = ref({
  summary: false,
  participating: false,
  hot: false,
  points: false,
  common: false, // ✅ 충돌 해결: 공통 로딩 상태 추가
});
const error = ref({
  summary: null,
  participating: null,
  hot: null,
  points: null,
  common: null, // ✅ 충돌 해결: 공통 에러 상태 추가
});

const summary = ref({
  totalChallenges: 0,
  successCount: 0,
  achievementRate: 0,
});
const participatingChallenges = ref([]);
const hotChallenges = ref([]);
const monthlyPoints = ref(null); // StatsSwiper용(월누적)
const commonHighlight = ref(null); // ✅ 스와이프 3번 슬라이드용 공통 챌린지

const displayName = computed(() => {
  const u = auth.user || {};
  return u.nickname || u.NickName || u.userName || '사용자';
});

const handleParticipate = (challenge) => {
  goDetail(challenge);
};

const goDetail = (challenge) => {
  if (challenge.type === 'COMMON') {
    router.push({
      name: 'ChallengeCommonDetail',
      params: { id: challenge.id },
      state: { previousPage: '/challenge' },
    });
  } else if (challenge.type === 'GROUP') {
    router.push({
      name: 'ChallengeGroupDetail',
      params: { id: challenge.id },
      state: { previousPage: '/challenge' },
    });
  } else if (challenge.type === 'PERSONAL') {
    router.push({
      name: 'ChallengePersonalDetail',
      params: { id: challenge.id },
      state: { previousPage: '/challenge' },
    });
  }
};

const handleCardClick = (payload) => {
  const challenge = payload.challenge || payload;
  goDetail(challenge);
};

const fetchSummary = async () => {
  loading.value.summary = true;
  error.value.summary = null;
  try {
    const data = await getChallengeSummary();
    summary.value = data || summary.value;
  } catch (e) {
    error.value.summary =
      e?.response?.data?.message || e.message || '요약 조회 실패';
  } finally {
    loading.value.summary = false;
  }
};

const sortParticipating = (list) => {
  const toKey = (c) => {
    const unconfirmed = c?.status === 'COMPLETED' && !c?.isResultCheck;
    const end = c?.endDate
      ? new Date(c.endDate).getTime()
      : Number.MAX_SAFE_INTEGER;
    // 정렬 우선순위: 1) 미확인 먼저 (-1), 2) 종료일 빠른 순
    return [unconfirmed ? -1 : 0, end];
  };
  return [...list].sort((a, b) => {
    const [ua, ea] = toKey(a);
    const [ub, eb] = toKey(b);
    if (ua !== ub) return ua - ub;
    return ea - eb;
  });
};

const fetchParticipating = async () => {
  loading.value.participating = true;
  error.value.participating = null;
  try {
    const list = await getChallengeList({ participating: true });
    const safe = Array.isArray(list) ? list : [];
    // ✅ “완료+미확인”을 맨 앞으로 정렬
    participatingChallenges.value = sortParticipating(safe);
    // 진행중 개수 갱신
    challengeStore.updateCountsFromList(participatingChallenges.value);
  } catch (e) {
    error.value.participating =
      e?.response?.data?.message || e.message || '참여중 목록 조회 실패';
    participatingChallenges.value = [];
    challengeStore.resetCounts();
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
    const m = now.getMonth() + 1;
    const res = await getMonthlyPoints({ year: y, month: m });
    monthlyPoints.value = res?.amount ?? null; // ← 월누적 카드용
  } catch (e) {
    error.value.points =
      e?.response?.data?.message || e.message || '포인트 조회 실패';
    monthlyPoints.value = null;
  } finally {
    loading.value.points = false;
  }
};

// ✅ 공통 챌린지 하이라이트 (참여 여부와 무관하게 1개 노출: RECRUITING → 내가 참여중 → IN_PROGRESS → 아무 공통)
const fetchCommonHighlight = async () => {
  loading.value.common = true;
  error.value.common = null;

  const pick = (item) =>
    item && {
      id: item.id,
      title: item.title,
      status: item.status,
      startDate: item.startDate,
      endDate: item.endDate,
      participantsCount: item.participantsCount ?? 0,
    };

  try {
    // 1) 모집중 공통
    let list = await getChallengeList({ type: 'COMMON', status: 'RECRUITING' });
    if (Array.isArray(list) && list.length > 0) {
      commonHighlight.value = pick(list[0]);
      return;
    }

    // 2) 내가 참여 중인 공통
    const joined = await getChallengeList({ participating: true });
    const myCommon = (Array.isArray(joined) ? joined : []).find(
      (c) => (c?.type || '').toUpperCase() === 'COMMON'
    );
    if (myCommon) {
      commonHighlight.value = pick(myCommon);
      return;
    }

    // 3) 진행중 공통
    list = await getChallengeList({ type: 'COMMON', status: 'IN_PROGRESS' });
    if (Array.isArray(list) && list.length > 0) {
      commonHighlight.value = pick(list[0]);
      return;
    }

    // 4) 어떤 공통이든 1개
    list = await getChallengeList({ type: 'COMMON' });
    commonHighlight.value =
      Array.isArray(list) && list.length > 0 ? pick(list[0]) : null;
  } catch (e) {
    error.value.common =
      e?.response?.data?.message || e.message || '공통 챌린지 조회 실패';
    commonHighlight.value = null;
  } finally {
    loading.value.common = false;
  }
};

const openCommonFromSwiper = () => {
  if (commonHighlight.value?.id) {
    router.push({
      name: 'ChallengeCommonDetail',
      params: { id: commonHighlight.value.id },
      state: { previousPage: '/challenge' },
    });
  }
};

onMounted(async () => {
  await Promise.all([
    fetchSummary(),
    fetchParticipating(),
    fetchHot(),
    fetchMonthlyPoints(),
    fetchCommonHighlight(), // ✅ 항상 배너에 공통 1개
    challengeStore.fetchCoinStatus(), // Pinia 스냅샷 적재
  ]);
});

// 참여중 목록 바뀌면 개수 재계산
watch(participatingChallenges, (list) => {
  challengeStore.updateCountsFromList(list || []);
});
</script>

<template>
  <div class="challenge-home">
    <div class="header-section">
      <div class="greeting-section">
        <div class="greeting">
          안녕하세요, <span class="username">{{ displayName }}</span
          >님!
        </div>
      </div>

      <!-- ✅ 공통 챌린지 추가 슬라이드가 포함됨 -->
      <ChallengeStatsSwiper
        :summary="summary"
        :points="monthlyPoints"
        :common="commonHighlight"
        @open-common="openCommonFromSwiper"
      />
      <div v-if="loading.summary" style="color: #fff; margin: 6px 20px 0">
        요약 로딩중…
      </div>
      <div v-else-if="error.summary" style="color: #fff; margin: 6px 20px 0">
        {{ error.summary }}
      </div>
      <div v-if="error.points" style="color: #fff; margin: 6px 20px 0">
        {{ error.points }}
      </div>
      <div v-if="error.common" style="color: #fff; margin: 6px 20px 0">
        {{ error.common }}
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
            isSuccess: c.isSuccess ?? null,
            status: c.status, // ✅ HEAD 유지
            usePassword: c.usePassword ?? false,
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
            usePassword: c.usePassword ?? false,
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
  height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
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

/* 빈 상태 메시지 */
.empty-message {
  color: #666;
  text-align: center;
  padding: 20px 0;
  font-size: 14px;
  width: 100%;
}
</style>
