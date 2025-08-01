<template>
  <div class="certificate-create-container">
    <!-- 상단 섹션 (흰색 배경) -->
    <div class="top-section">
      <div class="text-content">
        <h1 class="main-title">핀픽 인증서를 생성합니다.</h1>
        <p class="sub-title">비밀번호를 입력해주세요</p>
      </div>

      <!-- 비밀번호 입력 표시 -->
      <div class="password-dots">
        <div
          v-for="(dot, index) in 6"
          :key="index"
          class="password-dot"
          :class="{ filled: index < password.length }"
        ></div>
      </div>
    </div>

    <!-- 하단 섹션 (회색 배경) -->
    <div class="bottom-section">
      <!-- 숫자 키패드 -->
      <div class="keypad">
        <div class="keypad-row" v-for="row in keypadRows" :key="row.join('')">
          <button
            v-for="key in row"
            :key="key"
            class="keypad-button"
            @click="handleKeyPress(key)"
            :disabled="key === ''"
          >
            <span v-if="key !== 'delete' && key !== ''">{{ key }}</span>
            <font-awesome-icon
              v-else-if="key === 'delete'"
              :icon="['fas', 'backspace']"
              class="delete-icon"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";

library.add(faBackspace);

const router = useRouter();
const password = ref("");

// 키패드 레이아웃
const keypadRows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "delete"],
];

function handleKeyPress(key) {
  if (key === "delete") {
    // 삭제
    if (password.value.length > 0) {
      password.value = password.value.slice(0, -1);
    }
  } else if (key !== "" && password.value.length < 6) {
    // 숫자 입력
    password.value += key;

    // 6자리가 완성되면 다음 페이지로 이동
    if (password.value.length === 6) {
      setTimeout(() => {
        router.push("/certificate-create-verify");
      }, 300);
    }
  }
}
</script>

<style scoped>
.certificate-create-container {
  max-width: 390px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

/* 상단 섹션 (흰색 배경) */
.top-section {
  flex: 0 0 35%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
}

.text-content {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 20px;
  font-weight: bold;
  color: #000;
  margin: 0 0 8px 0;
}

.sub-title {
  font-size: 16px;
  color: #000;
  margin: 0;
}

/* 비밀번호 입력 표시 */
.password-dots {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.password-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #d3d3d3;
  transition: background-color 0.2s ease;
}

.password-dot.filled {
  background-color: var(--color-main);
}

/* 하단 섹션 (회색 배경) */
.bottom-section {
  flex: 0 0 65%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

/* 키패드 */
.keypad {
  width: 100%;
  max-width: 280px;
}

.keypad-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.keypad-row:last-child {
  margin-bottom: 0;
}

.keypad-button {
  width: 70px;
  height: 70px;
  border: none;
  border-radius: 50%;
  background-color: #fff;
  font-size: 24px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.keypad-button:hover {
  background-color: #f5f5f5;
}

.keypad-button:active {
  background-color: #e8e8e8;
  transform: scale(0.95);
}

.keypad-button:disabled {
  background-color: transparent;
  box-shadow: none;
  cursor: default;
}

.keypad-button:disabled:hover {
  background-color: transparent;
}

.delete-icon {
  font-size: 20px;
  color: #666;
}

@media (max-width: 540px) {
  .certificate-create-container {
    max-width: 100vw;
  }

  .keypad-button {
    width: 60px;
    height: 60px;
    font-size: 20px;
  }

  .password-dot {
    width: 14px;
    height: 14px;
  }
}
</style>
