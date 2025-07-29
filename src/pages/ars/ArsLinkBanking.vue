<template>
  <div class="ars_link_bg">
    <div class="ars_link_outer_box">
      <div class="ars_link_header">
        <div class="login-logo">
          <h1 class="logo">FinPick</h1>
          <p>금융 생활의 새로운 시작</p>
        </div>
      </div>

      <div class="ars_link_wrapper">
        <div class="ars_link_card">
          <div class="loading_icon">
            <div class="envelope_icon">📩</div>
          </div>

          <div class="loading_message">
            <div class="primary_message">마이데이터를 불러오고 있습니다</div>
            <div class="secondary_message">
              잠시만 기다려주세요. 데이터 수집 중입니다
            </div>
          </div>

          <div class="progress_container">
            <div class="progress_bar">
              <div
                class="progress_fill"
                :style="{ width: percent + '%' }"
              ></div>
            </div>
            <div class="progress_percent">{{ Math.round(percent) }}%</div>

            <div class="current_phase">
              <div class="phase_label">현재 진행 단계</div>
            </div>

            <ul class="progress_list">
              <li v-if="visibleSteps[0]" class="step_item completed">
                <div class="step_icon">✓</div>
                <span>데이터 통합</span>
              </li>
              <li v-if="visibleSteps[1]" class="step_item completed">
                <div class="step_icon">✓</div>
                <span>계좌 정보 수집</span>
              </li>
              <li v-if="visibleSteps[2]" class="step_item completed">
                <div class="step_icon">✓</div>
                <span>거래 내역 분석</span>
              </li>
              <li v-if="visibleSteps[3]" class="step_item completed">
                <div class="step_icon">✓</div>
                <span>신용 정보 조회</span>
              </li>
            </ul>
          </div>

          <ul class="info_list">
            <li>안전한 암호화 통신으로 데이터를 수집합니다</li>
            <li>수집된 정보는 금융서비스 제공 목적으로만 사용됩니다</li>
            <li>데이터 수집 과정에서 문제가 발생하면 자동으로 재시도됩니다</li>
          </ul>

          <button
            class="next_step_btn"
            :class="{ active: isButtonActive }"
            :disabled="!isButtonActive"
            @click="goToOpenBanking"
          >
            오픈 뱅킹 페이지로 이동
          </button>
        </div>

        <div class="support_section">
          <div class="support_question">문제가 있으신가요?</div>
          <a href="#" class="support_link">고객센터 문의</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const percent = ref(0);
const visibleSteps = ref([false, false, false, false]);
const isButtonActive = ref(false);

function goToOpenBanking() {
  router.push("/openbanking/myhome");
}

onMounted(() => {
  // 10초에 걸쳐 0%에서 100%까지 진행
  const progressInterval = setInterval(() => {
    if (percent.value < 100) {
      percent.value += 1;
    } else {
      clearInterval(progressInterval);
    }
  }, 100); // 0.1초마다 1%씩 증가 (10초 = 1000ms / 100 = 10ms, 하지만 100ms로 설정하여 10초)

  // 각 단계를 2.5초 간격으로 표시 (10초 / 4단계 = 2.5초)
  visibleSteps.value.forEach((_, index) => {
    setTimeout(() => {
      visibleSteps.value[index] = true;
    }, (index + 1) * 2500); // 2.5초, 5초, 7.5초, 10초에 각각 표시
  });

  // 10초 후에 버튼 활성화
  setTimeout(() => {
    isButtonActive.value = true;
  }, 10000);
});
</script>

<style scoped>
.ars_link_bg {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.ars_link_outer_box {
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

.ars_link_header {
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

.ars_link_wrapper {
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

.ars_link_card {
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

.loading_icon {
  margin-bottom: 24px;
}

.envelope_icon {
  font-size: 48px;
  background: #8e74e3;
  color: white;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  line-height: 80px;
  margin: 0 auto;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(142, 116, 227, 0.3);
}

.loading_message {
  margin-bottom: 24px;
}

.primary_message {
  font-size: 18px;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
}

.secondary_message {
  font-size: 14px;
  color: #666;
}

.progress_container {
  border: 1px solid #8e74e3;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  background: #faf7ff;
}

.progress_bar {
  width: 100%;
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress_fill {
  height: 100%;
  background: #8e74e3;
  transition: width 0.1s linear;
}

.progress_percent {
  font-size: 18px;
  font-weight: 700;
  color: #4318d1;
  margin-bottom: 8px;
}

.current_phase {
  margin-bottom: 16px;
}

.phase_label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.progress_list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  text-align: left;
}

.step_item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #444;
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
}

.step_item.completed {
  color: #4318d1;
  font-weight: 600;
}

.step_icon {
  width: 20px;
  height: 20px;
  background: #8e74e3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  background: #ccc;
  color: #666;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  padding: 16px 0;
  cursor: not-allowed;
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.next_step_btn.active {
  background: #8e74e3;
  color: #fff;
  cursor: pointer;
}

.next_step_btn.active:hover {
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
  .ars_link_outer_box {
    padding: 16px;
  }

  .ars_link_card {
    padding: 24px 16px 16px 16px;
  }

  .envelope_icon {
    width: 60px;
    height: 60px;
    line-height: 60px;
    font-size: 36px;
  }

  .primary_message {
    font-size: 16px;
  }

  .progress_percent {
    font-size: 16px;
  }
}
</style>
