<template>
  <div class="create-certificate-container">
    <!-- 상단 헤더 -->
    <div class="certificate-header">
      <button class="certificate-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="certificate-title center-title">핀픽 인증서 만들기</span>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="certificate-content">
      <!-- 설명 -->
      <div class="description-section">
        <p class="description-text">
          핀픽 인증서는 안전한 금융 거래를 위한 디지털 인증서입니다.
        </p>
        <p class="description-text">
          인증서를 만들면 다음과 같은 서비스를 이용할 수 있습니다:
        </p>
      </div>

      <!-- 기능 목록 -->
      <div class="features-list">
        <div class="feature-item">
          <div class="feature-icon">
            <font-awesome-icon :icon="['fas', 'shield-alt']" />
          </div>
          <div class="feature-content">
            <h3 class="feature-title">안전한 거래</h3>
            <p class="feature-description">
              암호화된 보안으로 안전한 금융 거래
            </p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <font-awesome-icon :icon="['fas', 'user-check']" />
          </div>
          <div class="feature-content">
            <h3 class="feature-title">본인 인증</h3>
            <p class="feature-description">신원 확인 및 본인 인증 서비스</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <font-awesome-icon :icon="['fas', 'file-contract']" />
          </div>
          <div class="feature-content">
            <h3 class="feature-title">전자 서명</h3>
            <p class="feature-description">전자 문서 서명 및 계약 체결</p>
          </div>
        </div>
      </div>

      <!-- 주의사항 -->
      <div class="notice-section">
        <h3 class="notice-title">주의사항</h3>
        <ul class="notice-list">
          <li>인증서 비밀번호는 안전한 곳에 보관해주세요</li>
          <li>인증서는 개인정보이므로 타인과 공유하지 마세요</li>
          <li>비밀번호 분실 시 재발급이 필요합니다</li>
        </ul>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="certificate-bottom">
      <button class="certificate-start-btn" @click="startCertificate">
        인증서 만들기 시작
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faCertificate,
  faShieldAlt,
  faUserCheck,
  faFileContract,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faAngleLeft,
  faCertificate,
  faShieldAlt,
  faUserCheck,
  faFileContract
);

const router = useRouter();

const goBack = () => {
  router.back();
};

const startCertificate = () => {
  // 2단계로 이동
  router.push("/openbanking/set-certificate-password");
};
</script>

<style scoped>
.create-certificate-container {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background: #f3f4f6;
  height: 100vh;
  font-family: "Noto Sans KR", sans-serif;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  padding-bottom: 120px;
}

.certificate-header {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  padding: 0 16px;
  box-sizing: border-box;
  border-bottom: none;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 390px;
  z-index: 100;
}

.certificate-back {
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

.certificate-back:hover {
  background: #f3f3f3;
}

.certificate-title {
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

.certificate-content {
  padding: 120px 20px 40px 20px;
  text-align: center;
}

.certificate-icon {
  margin-bottom: 24px;
}

.certificate-icon svg {
  font-size: 4rem;
  color: #4318d1;
}

.main-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
  margin: 0 0 24px 0;
}

.description-section {
  margin-bottom: 32px;
  text-align: left;
}

.description-text {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.features-list {
  margin-bottom: 32px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: #4318d1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.feature-icon svg {
  color: #fff;
  font-size: 1.2rem;
}

.feature-content {
  flex: 1;
  text-align: left;
}

.feature-title {
  font-size: 1rem;
  font-weight: 600;
  color: #222;
  margin: 0 0 4px 0;
}

.feature-description {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
  margin: 0;
}

.notice-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.notice-title {
  font-size: 1rem;
  font-weight: 600;
  color: #222;
  margin: 0 0 12px 0;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-list li {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
  padding-left: 16px;
  position: relative;
}

.notice-list li:before {
  content: "•";
  color: #4318d1;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.notice-list li:last-child {
  margin-bottom: 0;
}

.certificate-bottom {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 390px;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  z-index: 1000;
}

.certificate-start-btn {
  width: 100%;
  padding: 16px 0;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #4318d1;
  color: #fff;
}

.certificate-start-btn:hover {
  background: #3a16b8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 24, 209, 0.3);
}

.certificate-start-btn:active {
  transform: translateY(0);
}

@media (max-width: 430px) {
  .create-certificate-container {
    width: 100vw;
    max-width: 100vw;
  }
  .certificate-bottom {
    max-width: 100vw;
  }
}
</style>
