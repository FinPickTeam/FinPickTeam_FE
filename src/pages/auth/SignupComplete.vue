<template>
  <div class="signup-complete-container">
    <!-- 앱 브랜딩 -->
    <div class="logo">
      <h1>FinPick</h1>
      <p>금융 생활의 새로운 시작</p>
    </div>

    <!-- 중앙 섹션 -->
    <div class="center-section">
      <!-- 완료 이미지 -->
      <div class="complete-image">
        <img src="./authimg/CompleteCha.png" alt="가입 완료" />
      </div>

      <!-- 환영 메시지 -->
      <div class="welcome-message">
        <h2>{{ userName }}님, 가입을 축하합니다.</h2>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="bottom-section">
      <button class="analysis-btn" @click="goToProfile">
        투자 성향 분석하러 가기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 사용자 이름 (실제로는 props나 store에서 가져올 수 있음)
const userName = ref("금맹정");

// 컴포넌트 마운트 시 사용자 이름 설정
onMounted(() => {
  // URL 파라미터나 쿼리에서 사용자 이름을 가져올 수 있음
  if (route.query.userName) {
    userName.value = route.query.userName;
  }
});

// 투자 성향 분석 페이지로 이동
const goToProfile = () => {
  router.push("/profile-step-1?from=signup");
};
</script>

<style scoped>
.signup-complete-container {
  min-height: 100vh;
  background-color: #fff;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.logo {
  text-align: center;
  margin-top: 40px;
}

.logo h1 {
  color: #4318d1;
  font-size: 48px;
  font-weight: 900;
  margin-bottom: 8px;
}

.logo p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.center-section {
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
  width: 200px;
  height: auto;
  max-width: 100%;
}

.welcome-message {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-message h2 {
  color: #111827;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
}

.bottom-section {
  max-width: 400px;
  margin: 0 auto;
}

.analysis-btn {
  width: 100%;
  background: #8e74e3;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 0;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.analysis-btn:hover {
  background: #6c4cf1;
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .signup-complete-container {
    padding: 16px;
  }

  .logo h1 {
    font-size: 40px;
  }

  .complete-image img {
    width: 160px;
  }

  .welcome-message h2 {
    font-size: 18px;
  }
}
</style>
