<template>
  <div class="certificate-complete-container">
    <!-- 상단 헤더 -->
    <div class="complete-header">
      <span class="complete-title center-title">간편 비밀번호 생성 완료</span>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="complete-content">
      <!-- 완료 아이콘 -->
      <div class="success-icon">
        <font-awesome-icon :icon="['fas', 'check-circle']" />
      </div>

      <!-- 제목 -->
      <h1 class="main-title">간편 비밀번호가 생성되었습니다</h1>

      <!-- 설명 -->
      <div class="description-section">
        <p class="description-text">
          안전한 금융 서비스 이용을 위한 간편 비밀번호가 성공적으로
          생성되었습니다.
        </p>
      </div>

      <!-- 인증서 정보 -->
      <div class="certificate-info">
        <h3 class="info-title">간편 비밀번호</h3>
        <div class="info-item">
          <span class="info-label">발급일</span>
          <span class="info-value">{{ currentDate }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">유효기간</span>
          <span class="info-value">{{ expiryDate }}</span>
        </div>
      </div>

      <!-- 주의사항 -->
      <div class="notice-section">
        <h3 class="notice-title">주의사항</h3>
        <ul class="notice-list">
          <li>비밀번호는 분실 시 복구가 불가능합니다.</li>
          <li>비밀번호를 타인에게 알려주지 마세요.</li>
          <li>비밀번호는 1년간 유효합니다.</li>
        </ul>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="complete-bottom">
      <button class="complete-openbanking-btn" @click="goToOpenBanking">
        오픈뱅킹 연동하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

library.add(faCheckCircle);

const router = useRouter();

const currentDate = ref("");
const expiryDate = ref("");

onMounted(() => {
  // 현재 날짜 설정
  const now = new Date();
  currentDate.value = now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // 만료일 설정 (1년 후)
  const expiry = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  expiryDate.value = expiry.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
});

const goToOpenBanking = () => {
  router.push("/ars/link-banking");
};
</script>

<style scoped>
.certificate-complete-container {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background: #f7f8fa;
  height: 100vh;
  font-family: "Noto Sans KR", sans-serif;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  padding-bottom: 120px;
}

.complete-header {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 0 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #ececec;
  position: sticky;
  top: 0;
  z-index: 100;
}

.complete-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
}

.center-title {
  text-align: center;
}

.complete-content {
  padding: 24px 20px;
}

.success-icon {
  text-align: center;
  margin-bottom: 24px;
  font-size: 80px;
  color: var(--color-main);
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  color: #222;
  margin: 0 0 12px 0;
  text-align: center;
}

.description-section {
  margin-bottom: 32px;
  text-align: center;
}

.description-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.certificate-info {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin: 0 0 16px 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #222;
  font-weight: 600;
}

.notice-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notice-title {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin: 0 0 16px 0;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-list li {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
  padding-left: 16px;
  position: relative;
}

.notice-list li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #999;
}

.notice-list li:last-child {
  margin-bottom: 0;
}

.complete-bottom {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 390px;
  background: #fff;
  padding: 20px;
  border-top: 1px solid #ececec;
  z-index: 100;
  box-sizing: border-box;
}

.complete-openbanking-btn {
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 12px;
  background: var(--color-main);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 350px;
  margin: 0 auto;
  display: block;
}

.complete-openbanking-btn:hover {
  background: var(--color-main-dark);
}
</style>
