<template>
  <div class="profile-step-container">
    <!-- 상단 네비게이션 -->
    <ProfileStepHeader />
    <!-- 진행 바 -->
    <div class="progress-bar">
      <div
        v-for="step in totalSteps"
        :key="step"
        :class="['progress', { active: step === 6 }]"
      ></div>
    </div>
    <!-- 질문 -->
    <div class="question-section">
      <div class="question-title">[문항 6] 연간 소득 현황</div>
      <!-- <div class="question-desc">연간 소득 현황</div> -->
      <div class="options">
        <div
          v-for="(option, idx) in options"
          :key="idx"
          :class="[
            'option',
            { selected: profileStore.answers.question6 === option },
          ]"
          @click="profileStore.answers.question6 = option"
        >
          {{ option }}
        </div>
      </div>
    </div>
    <!-- 완료 버튼 -->
    <button
      class="next-btn"
      :disabled="profileStore.answers.question6 === null"
      @click="goNext"
    >
      다음
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProfileStore } from '@/stores/profile.js';
import ProfileStepHeader from '@/components/auth/ProfileStepHeader.vue';

const profileStore = useProfileStore();
const router = useRouter();
const route = useRoute();
const options = [
  '2천만원 미만',
  '2천만원 이상 ~ 5천만원 미만',
  '5천만원 이상 ~ 7천만원 미만',
  '7천만원 이상 ~ 1억원 미만',
  '1억원 이상',
];

// 동적 progress-bar 설정
const totalSteps = ref(10); // 투자성향 검사는 항상 10단계

const goNext = () => {
  if (profileStore.answers.question6 === null) return;

  const from = route.query.from || 'mypage';
  router.push(`/profile-step-7?from=${from}`);
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
  border-color: var(--color-main-dark);
  background: #f3f0fa;
  color: #6c4cf1;
  font-weight: 600;
}
.next-btn {
  width: 100%;
  background: var(--color-main-dark);
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
