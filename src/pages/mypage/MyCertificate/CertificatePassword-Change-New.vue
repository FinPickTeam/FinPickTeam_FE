<template>
  <div class="password-change-container">
    <!-- 헤더 영역 -->
    <div class="header-bar">
      <button class="back-btn" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="header-title">비밀번호 변경</span>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="main-content">
      <div class="step-indicator">
        <div class="step completed">1</div>
        <div class="step-line completed"></div>
        <div class="step active">2</div>
        <div class="step-line"></div>
        <div class="step">3</div>
      </div>

      <div class="content-area">
        <div class="title-text">
          <p>핀픽 인증서를 생성합니다.</p>
          <p>새 비밀번호를 입력해주세요</p>
        </div>

        <!-- 비밀번호 입력 필드 -->
        <div class="password-input-container">
          <div class="password-dots">
            <div
              v-for="(dot, index) in 6"
              :key="index"
              :class="[
                'password-dot',
                index < newPassword.length ? 'filled' : 'empty',
              ]"
            ></div>
          </div>
        </div>

        <!-- 숫자 키패드 -->
        <div class="keypad-container">
          <div class="keypad-grid">
            <button
              v-for="(number, index) in keypadNumbers.slice(0, 9)"
              :key="`keypad-${index}-${number}`"
              class="keypad-btn"
              @click="addNumber(number)"
            >
              {{ number }}
            </button>
            <button class="keypad-btn empty"></button>
            <button class="keypad-btn" @click="addNumber(keypadNumbers[9])">
              {{ keypadNumbers[9] }}
            </button>
            <button class="keypad-btn delete-btn" @click="deleteNumber">
              <font-awesome-icon :icon="['fas', 'delete-left']" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft, faDeleteLeft } from "@fortawesome/free-solid-svg-icons";

library.add(faAngleLeft, faDeleteLeft);

const router = useRouter();
const route = useRoute();
const newPassword = ref("");
const keypadNumbers = ref([]);

// 현재 비밀번호를 route params에서 가져오기
const currentPassword = ref("");

// 키패드 숫자를 랜덤하게 생성하는 함수
const generateRandomKeypad = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const shuffled = [...numbers].sort(() => Math.random() - 0.5);
  keypadNumbers.value = shuffled;
};

onMounted(() => {
  currentPassword.value = route.query.currentPassword || "";
  generateRandomKeypad();
});

const goBack = () => {
  router.back();
};

const addNumber = (number) => {
  if (newPassword.value.length < 6) {
    newPassword.value += number.toString();

    // 6자리가 입력되면 다음 페이지로 이동
    if (newPassword.value.length === 6) {
      setTimeout(() => {
        router.push({
          name: "certificate-password-change-confirm",
          query: {
            currentPassword: currentPassword.value,
            newPassword: newPassword.value,
          },
        });
      }, 300);
    }
  }
};

const deleteNumber = () => {
  if (newPassword.value.length > 0) {
    newPassword.value = newPassword.value.slice(0, -1);
  }
};
</script>

<style scoped>
.password-change-container {
  max-width: 390px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
  padding: 120px 20px 80px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 헤더 스타일 */
.header-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0;
  margin-bottom: 40px;
  z-index: 1100;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  font-size: 22px;
  color: #222;
  cursor: pointer;
  padding: 2px 8px 2px 2px;
  border-radius: 8px;
  transition: background 0.15s;
  position: relative;
  z-index: 1200;
}

.back-btn:hover {
  background: #f3f3f3;
}

/* 메인 콘텐츠 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

/* 단계 표시 */
.step-indicator {
  display: flex;
  align-items: center;
  margin-bottom: 60px;
}

.step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  background: #e0e0e0;
  color: #666;
}

.step.active {
  background: #4318d1;
  color: white;
}

.step.completed {
  background: #4caf50;
  color: white;
}

.step-line {
  width: 40px;
  height: 2px;
  background: #e0e0e0;
  margin: 0 8px;
}

.step-line.completed {
  background: #4caf50;
}

/* 콘텐츠 영역 */
.content-area {
  width: 100%;
  max-width: 320px;
  text-align: center;
}

.title-text {
  margin-bottom: 60px;
}

.title-text p {
  margin: 8px 0;
  font-size: 18px;
  color: #333;
  font-weight: 500;
}

.title-text p:first-child {
  font-size: 20px;
  font-weight: bold;
  color: #4318d1;
}

/* 비밀번호 입력 필드 */
.password-input-container {
  margin-bottom: 80px;
}

.password-dots {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.password-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.password-dot.empty {
  background: #e0e0e0;
  border: 2px solid #e0e0e0;
}

.password-dot.filled {
  background: #4318d1;
  border: 2px solid #4318d1;
}

/* 키패드 */
.keypad-container {
  width: 100%;
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 280px;
  margin: 0 auto;
}

.keypad-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.keypad-btn:hover {
  background: #e0e0e0;
  transform: scale(1.05);
}

.keypad-btn:active {
  transform: scale(0.95);
}

.keypad-btn.empty {
  background: transparent;
  cursor: default;
}

.keypad-btn.empty:hover {
  background: transparent;
  transform: none;
}

.delete-btn {
  font-size: 20px;
  color: #666;
}

@media (max-width: 540px) {
  .password-change-container {
    max-width: 100vw;
  }
}
</style>
