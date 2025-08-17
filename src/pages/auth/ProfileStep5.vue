<template>
  <div class="profile-step-container">
    <!-- 상단 네비게이션 -->
    <ProfileStepHeader />
    <!-- 진행 바 -->
    <div class="progress-bar">
      <div
        v-for="step in totalSteps"
        :key="step"
        :class="['progress', { active: step === 5 }]"
      ></div>
    </div>
    <!-- 질문 -->
    <div class="question-section">
      <div class="question-title">[문항 5] 예상 투자 금액</div>
      <!-- <div class="question-desc">투자경험</div> -->
      <div class="options">
        <div
          v-for="(option, idx) in options"
          :key="idx"
          :class="[
            'option',
            { selected: profileStore.answers.question5 === option },
          ]"
          @click="profileStore.answers.question5 = option"
        >
          {{ option }}
        </div>
      </div>
    </div>
    <!-- 완료 버튼 -->
    <button
      class="next-btn"
      :disabled="profileStore.answers.question5 === null || isLoading"
      @click="goNext"
    >
      {{ isLoading ? '처리 중...' : '완료' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProfileStore } from '@/stores/profile.js';
import { submitSignupProfile } from '@/api/index.js';
import ProfileStepHeader from '@/components/auth/ProfileStepHeader.vue';

const router = useRouter();
const route = useRoute();
const profileStore = useProfileStore();

const isLoading = ref(false);

const options = [
  '5만 원 미만',
  '5만 원 이상 ~ 10만 원 미만',
  '10만 원 이상 ~ 20만 원 미만',
  '20만 원 이상 ~ 50만 원 미만',
  '50만 원 이상 ~ 100만 원 미만',
  '100만 원 이상 ~ 200만 원 미만',
  '100만 원 이상',
];

// 동적 progress-bar 설정 (computed로 변경)
const totalSteps = computed(() => {
  const from = route.query.from;
  if (from === 'mypage' || from === 'fund') {
    return 10; // 투자성향 재검사는 10단계
  } else {
    return 5; // 회원가입은 5단계
  }
});

// goNext 함수가 상황 판단 및 로직 분기 역할을 합니다.
const goNext = () => {
  // Pinia에 5번 문항 답변이 저장되었는지 확인
  if (profileStore.answers.question5 === null) return;

  const from = route.query.from || 'signup';

  if (from === 'mypage') {
    // 마이페이지에서 왔으면 6단계로 이동
    router.push(`/profile-step-6?from=${from}`);
  } else if (from === 'fund') {
    // 펀드에서 왔으면 6단계로 이동
    router.push(`/profile-step-6?from=${from}`);
  } else {
    // 그 외, 즉 'signup' 시나리오일 경우, 페이지 이동이 아니라 '결과 제출' 함수를 호출합니다.
    submitResults();
  }
};

const submitResults = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    // 1~5번 답변만 추출하여 payload 생성
    const { question1, question2, question3, question4, question5 } =
      profileStore.answers;
    const payload = { question1, question2, question3, question4, question5 };

    // API 호출
    const response = await submitSignupProfile(payload);

    // 서버 응답에서 결과 타입과 설명을 추출
    const type = response.data.propensityType;
    const explain = response.data.propensityTypeExplain;

    // Pinia에 최종 결과 저장
    profileStore.setProfileResult(type, explain);

    const from = route.query.from || 'signup';
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
  background: linear-gradient(135deg, #f8f7ff 0%, #ffffff 100%);
  padding: 0 8px 32px 8px;
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
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background: linear-gradient(
    90deg,
    var(--color-main) 0%,
    var(--color-main-light) 100%
  );
  transition: width 0.3s ease;
}

.progress.active {
  background: linear-gradient(
    90deg,
    var(--color-main) 0%,
    var(--color-main-light) 100%
  );
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.2);
}

.progress.active::after {
  width: 100%;
}

.question-section {
  margin-top: 24px;
  margin-bottom: 40px;
  padding: 0 8px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.question-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 14px;
  color: #222;
}

.question-desc {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.question-subtitle {
  font-size: 16px;
  color: var(--color-text-light);
  margin-bottom: 24px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.option:hover {
  border-color: var(--color-main-light);
}

.option.selected {
  border-color: var(--color-main-dark);
  background: #f3f0fa;
  color: #6c4cf1;
}

.next-btn {
  width: calc(100% - 16px);
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 18px 0;
  font-size: 18px;
  font-weight: 700;
  margin: 48px 8px 0 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(67, 24, 209, 0.3);
}

.next-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.next-btn:hover::before {
  left: 100%;
}

.next-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 24, 209, 0.4);
}

.next-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(67, 24, 209, 0.3);
}

.next-btn:disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 480px) {
  .profile-step-container {
    padding: 0 8px 16px 8px;
  }

  .question-title {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .option {
    padding: 16px 20px;
    font-size: 15px;
  }

  .next-btn {
    margin-top: 32px;
    padding: 16px 0;
    font-size: 16px;
  }
}

/* 스크롤바 스타일링 */
.profile-step-container::-webkit-scrollbar {
  width: 6px;
}

.profile-step-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.profile-step-container::-webkit-scrollbar-thumb {
  background: var(--color-main-light);
  border-radius: 3px;
}

.profile-step-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-main);
}
</style>
