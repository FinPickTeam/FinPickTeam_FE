<template>
  <div class="ars_complete_bg">
    <div class="ars_complete_outer_box">
      <div class="ars_complete_header">
        <div class="login-logo">
          <h1 class="logo">FinPick</h1>
          <p>금융 생활의 새로운 시작</p>
        </div>
        <div class="main_title">ARS 인증 완료</div>
      </div>

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

const router = useRouter();
const currentTime = ref("");

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

function goToNextStep() {
  // CertificateCreate 페이지로 이동
  router.push("/openbanking/create-certificate");
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
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.ars_complete_outer_box {
  width: 100%;
  max-width: 540px;
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

.ars_complete_header {
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

.main_title {
  font-size: 24px;
  font-weight: 700;
  color: #222;
  margin-bottom: 32px;
}

.ars_complete_wrapper {
  width: 100%;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 0;
  padding-bottom: 24px;
  box-sizing: border-box;
}

.ars_complete_card {
  width: 100%;
  max-width: 100%;
  background: #fff;
  border: 1.5px solid #e5e6ea;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 36px 24px 24px 24px;
  margin-bottom: 24px;
  text-align: center;
}

.success_icon {
  width: 80px;
  height: 80px;
  background: #8e74e3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
}

.checkmark {
  color: #fff;
  font-size: 40px;
  font-weight: bold;
}

.success_message {
  margin-bottom: 24px;
}

.primary_message {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
}

.secondary_message {
  font-size: 14px;
  color: #666;
}

.auth_details_box {
  border: 1px solid #8e74e3;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  background: #faf7ff;
}

.auth_time_label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.auth_timestamp {
  font-size: 18px;
  font-weight: 700;
  color: #4318d1;
  margin-bottom: 8px;
}

.auth_confirmation {
  font-size: 12px;
  color: #666;
}

.info_list {
  text-align: left;
  font-size: 13px;
  color: #444;
  margin-bottom: 32px;
  padding-left: 20px;
  line-height: 1.6;
}

.info_list li {
  margin-bottom: 8px;
}

.next_step_btn {
  width: 100%;
  background: #8e74e3;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  padding: 16px 0;
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
  color: #8e74e3;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.support_link:hover {
  text-decoration: underline;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .ars_complete_outer_box {
    padding: 16px;
  }

  .ars_complete_card {
    padding: 24px 16px 16px 16px;
  }

  .success_icon {
    width: 60px;
    height: 60px;
  }

  .checkmark {
    font-size: 30px;
  }

  .primary_message {
    font-size: 18px;
  }

  .auth_timestamp {
    font-size: 16px;
  }
}
</style>
