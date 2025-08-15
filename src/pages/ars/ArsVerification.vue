<template>
  <div class="ars_bg">
    <!-- 상단 헤더 -->
    <div class="ars-verification-header">
      <button class="ars-verification-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="ars-verification-title center-title">ARS 인증</span>
    </div>
    <div class="ars_verification_wrapper">
      <div class="ars_card">
        <div class="ars_info">
          <div class="ars_call_msg">ARS 전화가 발신되었습니다</div>
          <div class="ars_desc">
            전화를 받으신 후 아래 인증번호를 입력해 주세요
          </div>
          <div class="ars_code_box">
            <div class="ars_label">인증번호</div>
            <div class="ars_code">3847</div>
            <div class="ars_code_desc">위 4자리 숫자를 전화에서 입력하세요</div>
          </div>
          <div class="ars_waiting">
            <span class="waiting_icon">📞</span>
            <span class="waiting_label">통화 대기 중</span>
            <span class="waiting_timer">{{ timerDisplay }}</span>
          </div>
          <ul class="ars_guide_list">
            <li>전화를 받으신 후 안내에 따라 인증번호를 입력하세요</li>
            <li>인증번호 입력 후 통화가 자동으로 종료됩니다</li>
            <li>3분 이내에 인증을 완료해주세요</li>
          </ul>
        </div>
        <button class="ars_next_btn" @click="goToComplete">
          다음 단계로 진행
        </button>
        <div class="ars_warning_box">
          <div class="warning_title">
            <span class="warning_icon">⚠️</span>
            <span>주의사항</span>
          </div>
          <ul class="warning_list">
            <li>전화번호가 정확한지 다시 한번 확인해주세요</li>
            <li>인증번호가 맞지 않을 경우 시 다시 시도해주세요</li>
            <li>인증번호는 정확히 입력해야 합니다</li>
          </ul>
        </div>
        <div class="ars_help_group">
          <div class="ars_help">전화가 오지 않나요?</div>
          <a href="#" class="ars_help_link" @click="goToCustomerSupport"
            >고객센터 문의</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

library.add(faAngleLeft);

const router = useRouter();
const timerDisplay = ref('3:00');
let timerInterval = null;
let totalSeconds = 180; // 3분 = 180초

function goToComplete() {
  router.push('/ars/complete');
}

function goToCustomerSupport() {
  router.push('/customer-support');
}

function goBack() {
  router.back();
}

function updateTimer() {
  if (totalSeconds <= 0) {
    // 시간이 다 되면 ARS fail 페이지로 이동
    clearInterval(timerInterval);
    router.push('/ars/fail');
    return;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timerDisplay.value = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  totalSeconds--;
}

onMounted(() => {
  // 1초마다 타이머 업데이트
  timerInterval = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  // 컴포넌트가 언마운트될 때 타이머 정리
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

<style scoped>
.ars_bg {
  width: 100%;
  max-width: 390px;
  height: 100vh;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  padding-top: 56px;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
/* 상단 헤더 */
.ars-verification-header {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  padding: 0 16px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 390px;
  z-index: 100;
}

.ars-verification-back {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 4px 8px 4px 0;
  border-radius: 8px;
  transition: background 0.15s;
}

.ars-verification-back:hover {
  background: #f3f3f3;
}

.ars-verification-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.center-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.ars_outer_box {
  width: 100%;
  max-width: 390px;
  min-height: 100vh;
  background: #fff;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  box-sizing: border-box;
}
.ars_header {
  width: 100%;
  padding-top: 48px;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.login-logo {
  text-align: center;
  margin-bottom: 40px;
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
.subtitle {
  font-size: 16px;
  color: #888;
  margin-top: 4px;
  margin-bottom: 24px;
}
.ars_verification_wrapper {
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  padding-top: 0;
  padding-bottom: 24px;
  overflow: hidden;
  box-sizing: border-box;
}
.ars_card,
.ars_next_btn,
.ars_warning_box {
  width: 100%;
  max-width: 100%;
  margin: 0 auto 18px auto;
  box-sizing: border-box;
}
.ars_card {
  /* background: #fff;
  border: 1.5px solid #e5e6ea;
  border-radius: 12px;
  box-shadow: none; */
  padding: 36px 24px 24px 24px;
  margin-bottom: 24px;
}
.ars_info {
  text-align: center;
}
.ars_call_msg {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #222;
}
.ars_desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 20px;
}
.ars_code_box {
  border: 2px solid var(--color-main-dark);
  border-radius: 10px;
  padding: 18px 0 10px 0;
  margin-bottom: 18px;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
}
.ars_label {
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}
.ars_code {
  font-size: 38px;
  font-weight: bold;
  color: var(--color-main-dark);
  letter-spacing: 16px;
  margin-bottom: 8px;
}
.ars_code_desc {
  font-size: 12px;
  color: #888;
}
.ars_waiting {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin: 16px 0 8px 0;
  font-size: 14px;
}
.waiting_icon {
  font-size: 16px;
  color: #222;
  margin-right: 2px;
}
.waiting_label {
  color: var(--color-main-dark);
  font-weight: 600;
}
.waiting_timer {
  color: #222;
  font-weight: 600;
}
.ars_guide_list {
  text-align: left;
  font-size: 12.5px;
  color: #444;
  margin-bottom: 0;
  padding-left: 18px;
  line-height: 1.7;
}
.ars_next_btn {
  background: var(--color-main-dark);
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  padding: 0;
  height: 58px;
  cursor: pointer;
  transition: background 0.2s;
  letter-spacing: 0.5px;
  display: block;
}
.ars_next_btn:hover {
  background: var(--color-main);
}
.ars_warning_box {
  background: #fffbe7;
  border-radius: 8px;
  padding: 12px 14px;
  text-align: center;
  border: 1px solid #ffe082;
  margin-bottom: 0;
}
.warning_title {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 6px;
  color: #444;
  font-size: 14px;
  font-weight: 600;
}
.warning_icon {
  margin-right: 6px;
  font-size: 16px;
}
.warning_list {
  text-align: left;
  padding-left: 12px;
  margin: 0 auto;
  display: block;
  font-size: 12px;
}
.warning_list li {
  display: list-item;
  text-align: left;
  color: #666666;
  list-style-position: outside;
}
.ars_help_group {
  width: 100%;
  max-width: 100%;
  margin: 12px auto 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.ars_help {
  font-size: 13px;
  color: #888;
}
.ars_help_link {
  color: var(--color-main-dark);
  margin-left: 4px;
  text-decoration: underline;
  font-weight: 600;
  font-size: 13px;
}
</style>
