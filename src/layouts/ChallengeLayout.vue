<template>
  <div class="main-layout">
    <ChallengeHeader :title="headerTitle" :participating-challenges="participatingChallenges" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ChallengeHeader from '@/components/challenge/ChallengeHeader.vue';
import Navbar from '@/components/Navbar.vue';
import { getChallengeList } from '@/api/challenge/challenge.js';

const route = useRoute();
const participatingChallenges = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchParticipatingChallenges = async () => {
  loading.value = true;
  error.value = null;
  try {
    const list = await getChallengeList({ participating: true });
    participatingChallenges.value = Array.isArray(list) ? list : [];
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || '참여중 목록 조회 실패';
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

onMounted(fetchParticipatingChallenges);
</script>

<style scoped>
.main-layout {
  min-height: 100vh; display: flex; flex-direction: column; align-items: stretch;
  background: var(--color-bg-light); padding-top: 80px; padding-bottom: 80px;
}
.main-content { flex: 1 0 auto; }
</style>
