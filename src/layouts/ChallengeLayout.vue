<template>
  <div class="main-layout">
    <ChallengeHeader :title="headerTitle" />
    <main class="main-content">
      <router-view />
    </main>
    <Navbar />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ChallengeHeader from '@/components/challenge/ChallengeHeader.vue';
import Navbar from '@/components/Navbar.vue';

const route = useRoute();

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
