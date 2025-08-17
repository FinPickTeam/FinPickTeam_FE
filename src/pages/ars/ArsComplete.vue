<template>
  <div class="ars_complete_bg">
    <!-- 상단 헤더 -->
    <div class="ars-complete-header">
      <button class="ars-complete-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="ars-complete-title center-title">ARS 인증</span>
    </div>

    <div class="ars_complete_outer_box">
      <div class="ars_complete_wrapper">
        <div class="ars_complete_card">
          <div class="success_icon">
            <div class="checkmark">✓</div>
          </div>

          <div class="success_message">
            <div class="primary_message">ARS 인증이 완료되었습니다</div>
            <div class="secondary_message">
              본인인증이 성공적으로 처리되었습니다
            </div>
          </div>

          <div class="auth_details_box">
            <div class="auth_time_label">인증 완료 시간</div>
            <div class="auth_timestamp">{{ currentTime }}</div>
            <div class="auth_confirmation">
              인증이 정상적으로 완료되었습니다
            </div>
          </div>

          <ul class="info_list">
            <li>인증 정보는 안전하게 암호화되어 저장됩니다</li>
            <li>본 인증은 금융거래 목적으로만 사용됩니다</li>
            <li>추가 문의사항은 고객센터로 연락해주세요</li>
          </ul>

          <button class="next_step_btn" @click="goToNextStep">
            다음 단계로 진행
          </button>
        </div>

        <div class="support_section">
          <div class="support_question">문제가 있으신가요?</div>
          <a href="#" class="support_link" @click="goToCustomerSupport"
            >고객센터 문의</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { isPin } from "@/api/authApi.js";

library.add(faAngleLeft);

const router = useRouter();
const currentTime = ref("");

function goBack() {
  router.back();
}

function formatCurrentTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  currentTime.value = `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}

async function goToNextStep() {
  try {
    // isPin API를 호출하여 간편비밀번호 존재 여부를 확인합니다.
    const pinStatus = await isPin();

    // 간편비밀번호가 이미 있다면, 계좌 선택 화면으로 바로 이동
    if (pinStatus.data === true) {

      console.log("isPin API 응답: true. 계좌 선택으로 바로 이동합니다.");
      router.push("/ars/link-banking");
    } else {  // 간편비밀번호가 없다면, 간편 비밀번호 생성 페이지로 이동합니다.
      console.log("isPin API 응답: false. 생성 단계로 이동합니다.");
      router.push("/openbanking/create-certificate");
    }
  } catch (error) {
    // isPin API 호출 실패 시, 안전하게 생성 단계로 보냅니다.
    console.error("isPin API 호출 실패:", error);
    router.push("/openbanking/create-certificate");
  }
}

function goToCustomerSupport() {
  router.push("/customer-support");
}

onMounted(() => {
  formatCurrentTime();
});
</script>

<style scoped>
.ars_complete_bg {
  width: 100%;
  max-width: 390px;
  height: 100vh;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
}

/* 상단 헤더 */
.ars-complete-header {
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

.ars-complete-back {
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

.ars-complete-back:hover {
  background: #f3f3f3;
}

.ars-complete-title {
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

.ars_complete_outer_box {
  width: 100%;
  max-width: 390px;
  height: 100vh;
  background: #f3f4f6;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 8px;
  box-sizing: border-box;
  padding-top: 56px;
  overflow: hidden;
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

.main_title {
  font-size: 24px;
  font-weight: 700;
  color: #222;
  margin-bottom: 32px;
}

.ars_complete_wrapper {
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

.ars_complete_card {
  width: 100%;
  max-width: 100%;

  padding: 40px 0px 24px 0px;
  margin-bottom: 24px;
  text-align: center;
}

.success_icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28px auto;
  box-shadow: 0 4px 20px rgba(33, 150, 243, 0.3);
  animation: pulse 0.6s ease;
}

.checkmark {
  color: #fff;
  font-size: 45px;
  font-weight: bold;
}

.success_message {
  margin-bottom: 28px;
}

.primary_message {
  font-size: 22px;
  font-weight: 700;
  color: #222;
  margin-bottom: 10px;
}

.secondary_message {
  font-size: 14px;
  color: #666;
}

.auth_details_box {
  border: 1px solid var(--color-main-dark);
  border-radius: 8px;
  padding: 28px;
  margin-bottom: 32px;
  background: #faf7ff;
}

.auth_time_label {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.auth_timestamp {
  font-size: 24px;
  font-weight: 700;
  color: #4318d1;
  margin-bottom: 12px;
}

.auth_confirmation {
  font-size: 14px;
  color: #666;
}

.info_list {
  text-align: left;
  font-size: 16px;
  color: #444;
  margin-bottom: 40px;
  padding-left: 28px;
  line-height: 1.6;
}

.info_list li {
  margin-bottom: 8px;
}

.next_step_btn {
  width: 100%;
  background: var(--color-main-dark);
  color: #fff;
  font-size: 19px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  padding: 20px 0;
  cursor: pointer;
  transition: background 0.2s;
}

.next_step_btn:hover {
  background: #6c4cf1;
}

.support_section {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.support_question {
  font-size: 14px;
  color: #666;
}

.support_link {
  color: var(--color-main-dark);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.support_link:hover {
  text-decoration: underline;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
