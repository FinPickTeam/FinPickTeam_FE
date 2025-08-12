<template>
  <div class="nav-bar">
    <span class="back-btn" @click="goBack">
      <i class="fa-solid fa-angle-left"></i>
    </span>
    <span class="title">투자 성향 분석</span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  // 현재 경로에서 단계 번호 추출
  const currentPath = router.currentRoute.value.path;
  const stepMatch = currentPath.match(/profile-step-(\d+)/);

  if (stepMatch) {
    const currentStep = parseInt(stepMatch[1]);
    const previousStep = currentStep - 1;

    // ProfileStep1에서 뒤로가기하면 펀드 페이지로 이동
    if (previousStep < 1) {
      router.push('/finance/fund');
    } else {
      // 이전 단계로 이동
      router.push(`/mypage/financetest/profile-step-${previousStep}`);
    }
  } else {
    // 경로 매칭이 안되면 기본적으로 펀드 페이지로 이동
    router.push('/finance/fund');
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
