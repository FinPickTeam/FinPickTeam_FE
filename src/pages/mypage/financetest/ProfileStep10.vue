<template>
  <div class="profile-step-container">
    <!-- 상단 네비게이션 -->
    <ProfileStepHeader />
    <!-- 진행 바 -->
    <div class="progress-bar">
      <div
        v-for="step in totalSteps"
        :key="step"
        :class="['progress', { active: step === 10 }]"
      ></div>
    </div>
    <!-- 질문 -->
    <div class="question-section">
      <div class="question-title">[문항 10] 총 자산 규모(순자산)</div>
      <!-- <div class="question-desc">총 자산 규모(순자산)</div> -->
      <div class="options">
        <div
            v-for="(option, idx) in options"
            :key="idx"
            :class="['option', { selected: profileStore.answers.question10 === option }]"
            @click="profileStore.answers.question10 = option"
        >
          {{ option }}
        </div>
      </div>
    </div>
    <!-- 완료 버튼 -->
    <button class="next-btn" :disabled="profileStore.answers.question10 === null || isLoading" @click="goNext">
      {{ isLoading ? '처리 중...' : '완료' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useProfileStore} from "@/stores/profile.js";
import ProfileStepHeader from '@/components/auth/ProfileStepHeader.vue';
import {submitFullProfile} from "@/api/index.js";

const profileStore=useProfileStore();
const router = useRouter();
const route = useRoute();
const options = [
  '1억원 미만',
  '1억원 이상 ~ 5억원 미만',
  '5억원 이상 ~ 10억원 미만',
  '10억원 이상~ 20억원 미만',
  '20억원 이상',
];
const isLoading = ref(false);

// 동적 progress-bar 설정 (투자성향 재검사는 항상 10단계)
const totalSteps = ref(10);

const goNext = () => {
  if (profileStore.answers.question10 === null) return;
  submitResults();
};

const submitResults = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    // API 호출 (submitFullProfile 사용)
    const response = await submitFullProfile(profileStore.answers);

    // 서버 응답에서 결과 타입과 설명을 추출
    const type = response.data.propensityType;
    const explain = response.data.propensityTypeExplain;

    // Pinia에 최종 결과 저장
    profileStore.setProfileResult(type, explain);

    // 모든 작업이 성공적으로 끝난 후, 여기서 페이지를 이동합니다.
    const from = route.query.from || 'mypage';
    await router.push(`/profile-complete?from=${from}`);

  } catch (error) {
    console.error('결과 전송 실패:', error);
    alert('오류가 발생했습니다.');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.profile-step-container {
  min-height: 100vh;
  background: #fff;
  padding: 0 20px 32px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.progress-bar {
  display: flex;
  gap: 8px;
  margin: 0 0 32px 0;
  padding: 0 8px;
}
.progress {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: #e5e7eb;
  transition: background 0.2s;
}
.progress.active {
  background: #6c4cf1;
}
.question-section {
  margin-top: 24px;
  margin-bottom: 40px;
}
.question-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 14px;
  color: #222;
}
.question-desc {
  font-size: 18px;
  font-weight: bold;
  color: #222;
  margin-bottom: 8px;
}
.question-subtitle {
  font-size: 16px;
  color: #222;
  margin-bottom: 24px;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.option {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 20px;
  text-align: left;
  font-size: 16px;
  color: #222;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.option.selected {
  border-color: #8e74e3;
  background: #f3f0fa;
  color: #6c4cf1;
  font-weight: 600;
}
.next-btn {
  width: 100%;
  background: #8e74e3;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 0;
  font-size: 18px;
  font-weight: bold;
  margin-top: 48px;
  cursor: pointer;
  transition: background 0.2s;
}
.next-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
.next-btn:hover {
  background: #6c4cf1;
}
@media (max-width: 480px) {
  .profile-step-container {
    padding: 0 8px 16px 8px;
  }
  .next-btn {
    margin-top: 32px;
  }
}
</style>
