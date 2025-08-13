<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ChallengeParticipationLimitModal from './ChallengeParticipationLimitModal.vue';
import { useChallengeStore } from '@/stores/challenge';

const props = defineProps({
  title: { type: String, default: '' }
});

const router = useRouter();
const showParticipationLimitModal = ref(false);
const challengeStore = useChallengeStore();

const personalChallengeCount = computed(() => challengeStore.counts.PERSONAL);
const groupChallengeCount    = computed(() => challengeStore.counts.GROUP);

// 전역 가드: 둘 다 3개 이상이면 진입 차단
const isAllFull = computed(() => challengeStore.isAllFull);

const handleCreateClick = () => {
  if (isAllFull.value) {
    showParticipationLimitModal.value = true; // 두 타입 모두 불가일 때만 모달
  } else {
    router.push('/challenge/create'); // 생성 페이지로 진입 → 거기서 '선택 타입' 기준으로 제한
  }
};

const goBack = () => {
  const current = router.currentRoute.value.name;
  if (current === 'ChallengeCreate' || current === 'ChallengeRanking') router.push('/challenge');
  else if (current === 'ChallengeHome') router.push('/');
  else {
    const prev = router.currentRoute.value.state?.previousPage;
    prev ? router.push(prev) : router.back();
  }
};
const closeParticipationLimitModal = () => { showParticipationLimitModal.value = false; };
const goToRanking = () => router.push('/challenge/ranking');
</script>

<template>
  <header class="challenge-header">
    <div class="header-left">
      <button class="icon-btn" @click="goBack"><i class="fas fa-chevron-left"></i></button>
      <h1 v-if="title" class="header-title">{{ title }}</h1>
    </div>

    <div class="header-icons">
      <button class="icon-btn" @click="handleCreateClick"><i class="fas fa-pen-to-square"></i></button>
      <button class="icon-btn" @click="goToRanking"><i class="fas fa-landmark"></i></button>
    </div>

    <ChallengeParticipationLimitModal
        :is-visible="showParticipationLimitModal"
        :personal-count="personalChallengeCount"
        :group-count="groupChallengeCount"
        @close="closeParticipationLimitModal"
    />
  </header>
</template>


<style scoped>
.challenge-header {
  width: 100%;
  max-width: 390px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    to right,
    var(--color-main-light-2),
    var(--color-main-dark)
  );
  padding: 0 16px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  padding: 6px;
}

.header-title {
  color: white;
  font-size: 18px;
  font-weight: bold;
  font-family: var(--font-main);
  margin: 0;
}

.header-icons {
  display: flex;
  gap: 12px;
}
</style>
