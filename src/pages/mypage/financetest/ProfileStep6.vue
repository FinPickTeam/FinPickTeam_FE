<template>
  <div class="profile-step-container">
    <!-- 상단 네비게이션 -->
    <div class="nav-bar">
      <span class="back-btn" @click="goBack">
        <i class="fa-solid fa-angle-left"></i>
      </span>
      <span class="title">투자 성향 분석</span>
    </div>
    <!-- 진행 바 -->
    <div class="progress-bar">
      <div class="progress active"></div>
      <div class="progress"></div>
      <div class="progress"></div>
      <div class="progress"></div>
    </div>
    <!-- 질문 -->
    <div class="question-section">
      <div class="question-title">문항 1</div>
      <div class="question-desc">투자 경험이 어느 정도 되시나요?</div>
      <div class="options">
        <div
          v-for="(option, idx) in options"
          :key="idx"
          :class="['option', { selected: selected === idx }]"
          @click="selected = idx"
        >
          {{ option }}
        </div>
      </div>
    </div>
    <!-- 다음 버튼 -->
    <button class="next-btn" :disabled="selected === null" @click="goNext">
      다음
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const options = ["전혀 없음", "1년 미만", "1-3년", "3-5년", "5년 이상"];
const selected = ref(null);

const goBack = () => {
  router.back();
};
const goNext = () => {
  if (selected.value !== null) {
    router.push("/mypage/financetest/profile-step-7");
  }
};
</script>

<style scoped>
.profile-step-container {
  min-height: 100vh;
  background: #fff;
  padding: 0 20px 32px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.nav-bar {
  display: flex;
  align-items: center;
  height: 56px;
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
  margin-bottom: 8px;
  color: #222;
}
.question-desc {
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
  padding: 16px 0;
  text-align: center;
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
  background-color: #8e74e3;
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
