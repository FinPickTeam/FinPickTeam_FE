<template>
  <div class="ars_fail_bg">
    <!-- 상단 헤더 -->

    <div class="ars_fail_outer_box">
      <div class="ars_fail_header"></div>

      <div class="ars_fail_wrapper">
        <div class="ars_fail_card">
          <div class="ars_fail_info">
            <!-- 에러 아이콘 -->
            <div class="ars_fail_icon">⚠️</div>

            <!-- 메인 에러 메시지 -->
            <div class="ars_fail_main_msg">ARS 인증 시간이 초과되었습니다</div>
            <div class="ars_fail_sub_msg">
              제한 시간 내에 인증을 완료하지 못했습니다
            </div>

            <!-- 인증 실패 시간 박스 -->
            <div class="ars_fail_time_box">
              <div class="ars_fail_time_label">인증 실패 시간</div>
              <div class="ars_fail_time">{{ currentTime }}</div>
              <div class="ars_fail_time_desc">
                인증 시간이 초과되어 실패했습니다
              </div>
            </div>

            <!-- 문제 해결 가이드 -->
            <ul class="ars_fail_guide_list">
              <li>본인 명의의 휴대폰 번호인지 확인해주세요</li>
              <li>통신사 문제로 인증번호 수신이 지연될 수 있습니다</li>
              <li>문제가 지속되면 고객센터로 문의해주세요</li>
            </ul>

            <!-- 인증 실패 안내 박스 -->
            <div class="ars_fail_info_box">
              <div class="ars_fail_info_header">
                <span class="ars_fail_info_icon">ℹ️</span>
                <span class="ars_fail_info_title">인증 실패 안내</span>
              </div>
              <div class="ars_fail_info_content">
                인증번호 입력 시간이 초과되었습니다. 다시 시도해주세요.
              </div>
            </div>
          </div>
        </div>

        <!-- 재시도 버튼 -->
        <button class="ars_fail_retry_btn" @click="retryArs">
          ARS 인증 재시도
        </button>

        <!-- 도움말 링크 -->
        <div class="ars_fail_help_group">
          <div class="ars_fail_help">문제가 있으신가요?</div>
          <a href="#" class="ars_fail_help_link" @click="goToCustomerSupport"
            >고객센터 문의</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

library.add(faAngleLeft);

const router = useRouter();
const currentTime = ref("");

function retryArs() {
  router.push("/ars/verification");
}

function goToCustomerSupport() {
  router.push("/customer-support");
}

function goBack() {
  router.back();
}

function updateCurrentTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  currentTime.value = `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}

onMounted(() => {
  updateCurrentTime();
});
</script>

<style scoped>
.ars_fail_bg {
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
.ars-fail-header {
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

.ars-fail-back {
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

.ars-fail-back:hover {
  background: #f3f3f3;
}

.ars-fail-title {
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

.ars_fail_outer_box {
  width: 100%;
  max-width: 390px;
  height: 100vh;
  background: #f3f4f6;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  box-sizing: border-box;
  padding-top: 56px;
  overflow: hidden;
}

.ars_fail_header {
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

.ars_fail_wrapper {
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

.ars_fail_card {
  width: 100%;
  max-width: 100%;
  margin: 0 auto 24px auto;
  background: #fff;
  border: 1.5px solid #e5e6ea;
  border-radius: 12px;
  box-shadow: none;
  padding: 36px 24px 24px 24px;
  box-sizing: border-box;
}

.ars_fail_info {
  text-align: center;
}

.ars_fail_icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #e11d48;
}

.ars_fail_main_msg {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #222;
}

.ars_fail_sub_msg {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
}

.ars_fail_time_box {
  border: 1px solid #e11d48;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  background: #f3f4f6;
  width: 100%;
  box-sizing: border-box;
}

.ars_fail_time_label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  text-align: center;
}

.ars_fail_time {
  font-size: 20px;
  font-weight: 700;
  color: #e11d48;
  margin-bottom: 8px;
  text-align: center;
}

.ars_fail_time_desc {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.ars_fail_guide_list {
  text-align: left;
  font-size: 13px;
  color: #444;
  margin-bottom: 20px;
  padding-left: 18px;
  line-height: 1.6;
}

.ars_fail_guide_list li {
  margin-bottom: 6px;
}

.ars_fail_info_box {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 14px;
  text-align: left;
  margin-bottom: 0;
}

.ars_fail_info_header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.ars_fail_info_icon {
  font-size: 14px;
  margin-right: 6px;
  color: #e11d48;
}

.ars_fail_info_title {
  font-size: 13px;
  font-weight: 600;
  color: #222;
}

.ars_fail_info_content {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.ars_fail_retry_btn {
  width: 100%;
  background: #a084e8;
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
  margin-bottom: 16px;
}

.ars_fail_retry_btn:hover {
  background: #7c4dff;
}

.ars_fail_help_group {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.ars_fail_help {
  font-size: 13px;
  color: #888;
}

.ars_fail_help_link {
  color: #7c4dff;
  text-decoration: underline;
  font-weight: 600;
  font-size: 13px;
}

@media (max-width: 430px) {
  .ars_fail_outer_box {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
  }
}
</style>
