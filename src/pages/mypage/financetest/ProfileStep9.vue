<template>
  <div class="profile-step-container">
    <!-- 상단 네비게이션 -->
    <ProfileStepHeader />
    <!-- 진행 바 -->
    <div class="progress-bar">
      <div
        v-for="step in totalSteps"
        :key="step"
        :class="['progress', { active: step === 9 }]"
      ></div>
    </div>
    <!-- 질문 -->
    <div class="question-section">
      <div class="question-title">[문항 9] 기대수익률 및 손실감내도</div>
      <!-- <div class="question-desc">기대수익률 및 손실감내도</div> -->
      <div class="options">
        <div
            v-for="(option, idx) in options"
            :key="idx"
            :class="['option', { selected: profileStore.answers.question9 === option }]"
            @click="profileStore.answers.question9= option"
        >
          {{ option }}
        </div>
      </div>
    </div>
    <!-- 다음 버튼 -->
    <button class="next-btn" :disabled="profileStore.answers.question9 === null" @click="goNext">
      다음
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useProfileStore} from "@/stores/profile.js";
import ProfileStepHeader from '@/components/auth/ProfileStepHeader.vue';

const profileStore=useProfileStore();
const router = useRouter();
const route = useRoute();
const options = [
  '제한된 손실을 감수하며 시중금리 수준의 수익을 기대',
  '원금의 일부 손실을 감수하며 시중금리보다 다소 높은 수준의 수익을 기대',
  '원금 손실을 감수하며 시장성과 비슷한 수준의 수익을 기대',
  '초과 손실까지 감수하며 적극적인 투자를 통하여 시중수익률(예: 주가지수)을 초과하는 높은 수익 추구',
];

// 동적 progress-bar 설정 (투자성향 재검사는 항상 10단계)
const totalSteps = ref(10);

const goNext = () => {
  if (profileStore.answers.question9 === null) return;
  const from = route.query.from || 'mypage';
  router.push(`/mypage/financetest/profile-step-10?from=${from}`);
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
