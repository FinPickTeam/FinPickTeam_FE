<template>
  <div class="wrap">
    <div class="login-logo">
      <h1 class="logo">FinPick</h1>
      <p>금융 생활의 새로운 시작</p>
    </div>
    <header>
      <div class="ars_message">ARS 인증 진행 중</div>
    </header>
    <div class="container">
      <div class="content">
        <!-- 휴대폰 번호 입력 -->
        <div class="form_group">
          <label for="phone" class="label_text">휴대폰 번호</label>
          <input
            type="tel"
            id="phone"
            v-model="phoneNumber"
            @input="filterNumbers"
            :class="{ error: showErrors && !phoneNumber }"
            placeholder="휴대폰 번호를 입력하세요"
          />
          <label class="small">• 본인 명의의 휴대폰 번호를 입력해주세요</label>
          <label v-if="showErrors && !phoneNumber" class="error-message"
            >휴대폰 번호를 입력해주세요.</label
          >
        </div>

        <!-- 통신사 선택 -->
        <div class="form_group">
          <label class="label_text">통신사</label>
          <div class="carrier_options">
            <button
              :class="{ selected: selectedCarrier === 'SKT' }"
              @click="selectCarrier('SKT')"
            >
              SKT
            </button>
            <button
              :class="{ selected: selectedCarrier === 'KT' }"
              @click="selectCarrier('KT')"
            >
              KT
            </button>
            <button
              :class="{ selected: selectedCarrier === 'LG U+' }"
              @click="selectCarrier('LG U+')"
            >
              LG U+
            </button>
          </div>
          <label v-if="showErrors && !selectedCarrier" class="error-message"
            >통신사를 선택해주세요.</label
          >
        </div>

        <!-- 이름 입력 -->
        <div class="form_group">
          <label for="name" class="label_text">이름</label>
          <input
            type="text"
            id="name"
            v-model="userName"
            :class="{ error: showErrors && !userName }"
            placeholder="이름을 입력하세요"
          />
          <label v-if="showErrors && !userName" class="error-message"
            >이름을 입력해주세요.</label
          >
        </div>

        <!-- 생년월일 입력 -->
        <div class="form_group">
          <label for="birthday" class="label_text">생년월일</label>
          <input
            type="text"
            id="birthday"
            v-model="birthDate"
            @input="formatBirthDate"
            :class="{ error: showErrors && !birthDate }"
            placeholder="YYYY.MM.DD"
          />
          <label class="small_2"
            >• 주민등록증상의 생년월일을 입력해주세요</label
          >
          <label v-if="showErrors && !birthDate" class="error-message"
            >생년월일을 입력해주세요.</label
          >
        </div>

        <!-- 인증 요청 버튼 -->
        <div class="form_group">
          <button
            class="confirm_button"
            :class="{ disabled: !isFormValid }"
            :disabled="!isFormValid"
            @click="validateAndSubmit"
          >
            ARS 인증 요청
          </button>
          <p class="helper_text">인증 요청 시 ARS 전화가 발신됩니다</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const phoneNumber = ref("");
const birthDate = ref("");
const selectedCarrier = ref("");
const userName = ref("");
const showErrors = ref(false);

// 모든 필수 필드가 입력되었는지 확인
const isFormValid = computed(() => {
  return (
    phoneNumber.value &&
    selectedCarrier.value &&
    userName.value &&
    birthDate.value
  );
});

function selectCarrier(carrier) {
  selectedCarrier.value = carrier;
}

function validateAndSubmit() {
  if (isFormValid.value) {
    // ArsVerification.vue로 라우팅
    router.push("/ars/verification");
  }
}

function filterNumbers(event) {
  // 숫자와 점(.)만 허용 (생년월일용)
  const value = event.target.value;
  const filtered = value.replace(/[^0-9.]/g, "");

  // 입력 필드에 따라 다른 처리
  if (event.target.id === "phone") {
    // 휴대폰 번호는 숫자만
    phoneNumber.value = value.replace(/[^0-9]/g, "");
  } else if (event.target.id === "birthday") {
    // 생년월일은 숫자와 점만
    birthDate.value = filtered;
  }
}

function formatBirthDate(event) {
  // 숫자만 입력받기
  let value = event.target.value.replace(/[^0-9]/g, "");

  // 8자리로 제한
  if (value.length > 8) {
    value = value.slice(0, 8);
  }

  // YYYY.MM.DD 형식으로 포맷팅
  let formatted = "";
  if (value.length >= 1) {
    formatted = value.slice(0, 4);
  }
  if (value.length >= 5) {
    formatted += "." + value.slice(4, 6);
  }
  if (value.length >= 7) {
    formatted += "." + value.slice(6, 8);
  }

  birthDate.value = formatted;
}
</script>
<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}
html,
body {
  width: 100%;
  height: 100%;
  background: #fff;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
.wrap {
  width: 100%;
  min-height: 100vh;
  background: #fff;
  margin: 0;
  padding: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.login-logo {
  text-align: center;
  margin-bottom: 40px;
  padding-top: 40px;
}
.login-logo h1 {
  margin-bottom: 8px;
  font-size: 36px;
  font-weight: 900;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #4318d1 0%, #8e74e3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.login-logo p {
  color: #888;
  font-size: 15px;
  text-align: center;
  font-weight: 400;
  margin-top: 4px;
  margin-bottom: 0;
  letter-spacing: 0;
}
.title {
  margin-top: clamp(2rem, 8vh, 4rem);
  margin-bottom: clamp(0.5rem, 2vh, 1.5rem);
  font-size: clamp(1.5rem, 6vw, 2.5rem);
  font-weight: 900;
  background: linear-gradient(to right, #4318d1 0%, #8e74e3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
.ars_message {
  color: #666666;
  margin-bottom: clamp(1rem, 4vh, 2.5rem);
  font-size: clamp(0.9rem, 3vw, 1.1rem);
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: min(540px, 90vw);
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 2rem);
}
.form_group {
  width: 100%;
  max-width: 100%;
  margin-bottom: clamp(1rem, 3vh, 1.5rem);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
input {
  width: 100%;
  height: clamp(44px, 6vh, 52px);
  border: 1px solid #e5e5e5;
  border-radius: clamp(8px, 1.5vw, 12px);
  padding: 0 clamp(0.8rem, 2vw, 1.2rem);
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  background: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}
.error {
  border-color: #e53e3e !important;
}
.carrier_options {
  display: flex;
  gap: clamp(0.3rem, 1vw, 0.8rem);
  width: 100%;
}
.carrier_options button {
  flex: 1;
  height: clamp(44px, 6vh, 52px);
  border: 1px solid #e5e5e5;
  border-radius: clamp(8px, 1.5vw, 12px);
  background: #fff;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}
.carrier_options button.selected {
  background: #8e74e3;
  color: #fff;
  border-color: #8e74e3;
}
.confirm_button {
  width: 100%;
  height: clamp(52px, 7vh, 64px);
  border: none;
  border-radius: clamp(8px, 1.5vw, 12px);
  background: #8e74e3;
  color: #fff;
  font-size: clamp(1rem, 2.8vw, 1.3rem);
  font-weight: 700;
  margin-top: clamp(0.8rem, 2vh, 1.2rem);
  margin-bottom: clamp(0.8rem, 2vh, 1.2rem);
  cursor: pointer;
  transition: all 0.2s ease;
}
.confirm_button.disabled {
  background: #ccc;
  color: #666;
  cursor: not-allowed;
}
.confirm_button:not(.disabled):hover {
  background: #6c4cf1;
}
.helper_text {
  color: #666;
  font-size: clamp(0.85rem, 2.2vw, 1rem);
  margin-bottom: clamp(1rem, 3vh, 1.5rem);
}
.label_text {
  text-align: left;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  color: #333333;
  margin-bottom: clamp(0.3rem, 1vh, 0.6rem);
  margin-top: clamp(0.3rem, 1vh, 0.6rem);
}
.small,
.small_2 {
  text-align: left;
  font-size: clamp(0.75rem, 2vw, 0.9rem);
  color: #666666;
  margin-top: clamp(0.1rem, 0.5vh, 0.3rem);
}
.error-message {
  color: #e53e3e;
  font-size: clamp(0.75rem, 2vw, 0.85rem);
  margin-top: clamp(0.2rem, 0.5vh, 0.4rem);
  text-align: left;
}
/* 태블릿 이상에서 최대 너비 제한 */
@media (min-width: 768px) {
  .content {
    max-width: 540px;
    padding: 0 2rem;
  }
}

/* 매우 큰 화면에서 중앙 정렬 */
@media (min-width: 1200px) {
  .wrap {
    max-width: 540px;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
}
</style>
