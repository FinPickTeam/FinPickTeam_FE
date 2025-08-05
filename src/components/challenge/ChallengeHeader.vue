<template>
  <header class="challenge-header">
    <div class="header-left">
      <button class="icon-btn" @click="goBack">
        <i class="fas fa-chevron-left"></i>
      </button>
      <h1 v-if="title" class="header-title">{{ title }}</h1>
    </div>

    <div class="header-icons">
      <button class="icon-btn" @click="goToCreate">
        <i class="fas fa-pen-to-square"></i>
      </button>
      <button class="icon-btn" @click="goToRanking">
        <i class="fas fa-landmark"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});

const router = useRouter();

const goBack = () => {
  // 현재 라우트에 따라 다른 동작 수행
  const currentRoute = router.currentRoute.value.name;

  if (
    currentRoute === 'ChallengeCreate' ||
    currentRoute === 'ChallengeRanking'
  ) {
    // 챌린지 생성 페이지나 랭킹 페이지에서는 ChallengeHome으로 이동
    router.push('/challenge');
  } else if (currentRoute === 'ChallengeHome') {
    // 챌린지 홈 페이지에서는 메인 홈페이지로 이동
    router.push('/');
  } else if (
    currentRoute === 'ChallengePersonalDetail' ||
    currentRoute === 'ChallengeGroupDetail' ||
    currentRoute === 'ChallengeCommonDetail'
  ) {
    // 챌린지 상세 페이지에서는 joined-list로 이동
    router.push('/challenge/joined-list');
  } else {
    // 다른 페이지에서는 이전 페이지로 이동
    router.back();
  }
};
const goToCreate = () => router.push('/challenge/create'); // 원하는 경로로 수정
const goToRanking = () => router.push('/challenge/ranking'); // 원하는 경로로 수정
</script>

<style scoped>
.challenge-header {
  width: 100%;
  max-width: 390px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to right, #c8c4f8, var(--color-main-dark));
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
  font-size: 22px;
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
