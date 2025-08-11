<template>
  <div class="main-layout">
    <ChallengeHeader
      :title="headerTitle"
      :participating-challenges="participatingChallenges"
    />
    <main class="main-content">
      <router-view />
    </main>
    <Navbar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ChallengeHeader from '@/components/challenge/ChallengeHeader.vue';
import Navbar from '@/components/Navbar.vue';
import { getChallengeList } from '@/api/challenge/challenge.js';

const route = useRoute();

// 참여중인 챌린지 데이터
const participatingChallenges = ref([]);
const loading = ref(false);
const error = ref(null);

// 참여중인 챌린지 데이터 가져오기
const fetchParticipatingChallenges = async () => {
  loading.value = true;
  error.value = null;
  try {
    const list = await getChallengeList({ participating: true });
    participatingChallenges.value = Array.isArray(list) ? list : [];

    // 테스트용: 챌린지 제한 모달 테스트를 위한 더미 데이터
    // 실제 테스트 시 아래 주석을 해제하고 위의 API 호출을 주석 처리하세요

    participatingChallenges.value = [
      // 개인 챌린지 3개
      {
        id: 1,
        title: '테스트 개인 챌린지 1',
        type: 'PERSONAL',
        participating: true,
      },
      {
        id: 2,
        title: '테스트 개인 챌린지 2',
        type: 'PERSONAL',
        participating: true,
      },
      {
        id: 3,
        title: '테스트 개인 챌린지 3',
        type: 'PERSONAL',
        participating: true,
      },
      // 소그룹 챌린지 3개
      {
        id: 4,
        title: '테스트 소그룹 챌린지 1',
        type: 'GROUP',
        participating: true,
      },
      {
        id: 5,
        title: '테스트 소그룹 챌린지 2',
        type: 'GROUP',
        participating: true,
      },
      {
        id: 6,
        title: '테스트 소그룹 챌린지 3',
        type: 'GROUP',
        participating: true,
      },
    ];
  } catch (e) {
    error.value =
      e?.response?.data?.message || e.message || '참여중 목록 조회 실패';
    participatingChallenges.value = [];
  } finally {
    loading.value = false;
  }
};

const headerTitle = computed(() => {
  if (!route.name) return '';
  if (route.name === 'ChallengeCreate') return '챌린지 생성';
  if (route.name === 'ChallengeRanking') return '챌린지 랭킹';
  if (route.name === 'ChallengeJoinedList') return '참여 중인 챌린지';
  if (route.name === 'ChallengeRecruitingList') return '모집 중인 챌린지';
  if (route.name === 'ChallengePersonalDetail') return '개인 챌린지 상세';
  if (route.name === 'ChallengeGroupDetail') return '그룹 챌린지 상세';
  if (route.name === 'ChallengeCommonDetail') return '공통 챌린지 상세';
  return '';
});

onMounted(() => {
  fetchParticipatingChallenges();
});
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: var(--color-bg-light);
  padding-top: 80px; /* 헤더 높이만큼 상단 패딩 */
  padding-bottom: 80px; /* 네비바 높이만큼 하단 패딩 */
}

.main-content {
  flex: 1 0 auto;
  /* padding-bottom 제거 - 이미 main-layout에서 처리 */
}
</style>
