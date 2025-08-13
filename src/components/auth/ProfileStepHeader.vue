<template>
  <div class="nav-bar">
    <span class="back-btn" @click="goBack">
      <i class="fa-solid fa-angle-left"></i>
    </span>
    <span class="title">투자 성향 분석</span>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const goBack = () => {
  // 현재 경로에서 단계 번호 추출
  const currentPath = router.currentRoute.value.path;
  const stepMatch = currentPath.match(/profile-step-(\d+)/);
  const from = route.query.from || ''; // fund, mypage, signup 구분용

  if (stepMatch) {
    const currentStep = parseInt(stepMatch[1]);
    const previousStep = currentStep - 1;

    if (previousStep < 1) {
      // 1단계 이전으로 가면 'from'에 따라 분기
      if (from === 'fund') {
        router.push('/finance/fund');
      } else if (from === 'mypage') {
        router.push('/mypage');
      } else {
        router.push('/'); // 기본 홈
      }
    } else {
      // 이전 단계로 이동 (from 유지)
      router.push(
        `/mypage/financetest/profile-step-${previousStep}?from=${from}`
      );
    }
  } else {
    // 경로 매칭이 안되면 'from'에 따라 이동
    if (from === 'fund') {
      router.push('/finance/fund');
    } else if (from === 'mypage') {
      router.push('/mypage');
    } else {
      router.push('/');
    }
  }
};
</script>

<style scoped>
.nav-bar {
  display: flex;
  align-items: center;
  height: 80px;
  position: relative;
  margin-bottom: 8px;
}

.back-btn {
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #222;
}

.title {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #222;
}
</style>
