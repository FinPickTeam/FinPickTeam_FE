<template>
  <div class="signup-complete-container">
    <!-- 앱 브랜딩 -->
    <div class="app-logo">
      <h1 class="app-title">FinPick</h1>
      <p class="app-subtitle">금융 생활의 새로운 시작</p>
    </div>

    <!-- 중앙 섹션 -->
    <div class="center-section">
      <!-- 완료 이미지 -->
      <div class="complete-image">
        <img src="./authimg/CompleteCha.png" alt="가입 완료" />
      </div>

      <!-- 환영 메시지 -->
      <div class="welcome-message">
        <h2>
          <span class="highlight-name">{{ userName }}</span
          ><span class="small-text">님, 가입을 축하합니다.</span>
        </h2>

        <p class="small-text">
          금융 상품 추천을 위해서는 투자 성향 분석이 필요해요.
        </p>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="bottom-section">
      <button class="analysis-btn" @click="goToProfile">
        투자 성향 분석 하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 사용자 이름 (실제로는 props나 store에서 가져올 수 있음)
const userName = ref('금맹정음');

// 컴포넌트 마운트 시 사용자 이름 설정
onMounted(() => {
  // URL 파라미터나 쿼리에서 사용자 이름을 가져올 수 있음
  if (route.query.userName) {
    userName.value = route.query.userName;
  }
});

// 투자 성향 분석 페이지로 이동
const goToProfile = () => {
  router.push('/profile-step-1?from=signup');
};
</script>

<style scoped>
.signup-complete-container {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 40px 16px 24px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
}

.app-logo {
  text-align: center;
  margin-bottom: 40px;
}

.app-title {
  font-family: 'JalnanGothic', sans-serif !important;
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 1px;
  background: var(--color-main);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.app-subtitle {
  color: #888;
  font-size: 15px;
  text-align: center;
  font-weight: 400;
  margin-top: 4px;
  margin-bottom: 0;
  letter-spacing: 0;
}

.center-section {
  flex: 1;
  text-align: center;
  margin: 40px 0;
}

.complete-image {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px auto;
}

.complete-image img {
  width: 300px;
  height: auto;
  max-width: 100%;
}

.welcome-message {
  text-align: center;
  margin-bottom: 40px;
  line-height: 2;
}

.welcome-message h2 {
  color: #111827;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
}

.highlight-name {
  font-size: 20px;
  font-weight: 700;
  color: #4318d1;
}

.highlight-result {
  font-size: 20px;
  font-weight: 700;
  color: #8e74e3;
}

.small-text {
  font-size: 14px;
  font-weight: 400;
  color: #666;
}

.analysis-notice {
  margin-top: 24px;
}

.analysis-notice p {
  font-size: 14px;
  font-weight: 400;
  color: #666;
  margin: 4px 0;
  line-height: 1.5;
}

.bottom-section {
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
  padding-bottom: 24px;
}

.analysis-btn {
  width: 100%;
  background: linear-gradient(
    to right,
    var(--color-main-light-2),
    var(--color-main-dark)
  );
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.analysis-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.analysis-btn:active {
  transform: translateY(0);
}
</style>
