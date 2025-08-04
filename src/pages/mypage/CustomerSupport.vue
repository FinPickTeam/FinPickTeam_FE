<template>
  <div class="customer-support-container">
    <!-- 헤더 영역 -->
    <div class="dictionary-header-bar">
      <button class="back-btn" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="dictionary-header-title">고객센터</span>
    </div>

    <!-- FAQ 섹션 -->
    <div class="faq-section">
      <h2 class="section-title">자주 묻는 질문</h2>

      <div class="faq-list">
        <div
          v-for="(faq, index) in faqList"
          :key="index"
          class="faq-item"
          @click="toggleFaq(index)"
        >
          <div class="faq-question">
            <span>{{ faq.question }}</span>
            <font-awesome-icon
              :icon="['fas', 'angle-down']"
              class="faq-icon"
              :class="{ rotated: faq.isOpen }"
            />
          </div>
          <div class="faq-answer" :class="{ open: faq.isOpen }">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 문의하기 섹션 -->
    <div class="contact-section">
      <h2 class="section-title">1:1 문의하기</h2>
      <div class="contact-info">
        <div class="contact-item">
          <div class="contact-icon">
            <font-awesome-icon :icon="['fas', 'envelope']" />
          </div>
          <div class="contact-details">
            <span class="contact-label">이메일</span>
            <span class="contact-value">support@finpick.com</span>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-icon">
            <font-awesome-icon :icon="['fas', 'phone']" />
          </div>
          <div class="contact-details">
            <span class="contact-label">전화번호</span>
            <span class="contact-value">1588-1234</span>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-icon">
            <font-awesome-icon :icon="['fas', 'clock']" />
          </div>
          <div class="contact-details">
            <span class="contact-label">운영시간</span>
            <span class="contact-value">평일 09:00 - 18:00</span>
          </div>
        </div>
      </div>

      <button class="contact-button" @click="showKakaoModal">
        <font-awesome-icon :icon="['fas', 'comment']" />
        <span>카카오톡 문의하기</span>
      </button>
    </div>
  </div>

  <!-- 카카오톡 문의 모달 -->
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">핀픽 카카오 오픈채팅 문의하기</h3>
        <button class="modal-close" @click="closeModal">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
      <div class="modal-body">
        <img
          src="./mypageimg/PinfikcKakaotalk.png"
          alt="핀픽 카카오톡"
          class="kakao-image"
        />
        <p class="modal-description">
          카카오톡 오픈채팅을 통해 빠르고 편리하게 문의하실 수 있습니다.
        </p>
        <button class="kakao-link-button" @click="openKakaoChat">
          카카오톡 오픈채팅 참여하기
        </button>
      </div>
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
  faAngleDown,
  faEnvelope,
  faPhone,
  faClock,
  faTimes,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faAngleLeft,
  faAngleDown,
  faEnvelope,
  faPhone,
  faClock,
  faTimes,
  faComment
);

const router = useRouter();
const showModal = ref(false);

// FAQ 데이터
const faqList = ref([
  {
    question: "핀픽 인증서는 어떻게 생성하나요?",
    answer:
      "마이페이지 > 핀픽 인증서 관리에서 인증서 정보를 클릭하시면 인증서 생성 과정을 진행할 수 있습니다.",
    isOpen: false,
  },
  {
    question: "투자성향 검사는 언제 다시 할 수 있나요?",
    answer:
      "마이페이지에서 '투자성향 재검사' 버튼을 클릭하시면 언제든지 다시 검사할 수 있습니다.",
    isOpen: false,
  },
  {
    question: "포인트는 어떻게 적립되나요?",
    answer:
      "금융 퀴즈를 풀거나 다양한 활동을 통해 포인트를 적립할 수 있습니다.",
    isOpen: false,
  },
  {
    question: "아바타 아이템은 어떻게 구매하나요?",
    answer:
      "마이페이지 > 아바타샵에서 포인트를 사용하여 다양한 아이템을 구매할 수 있습니다.",
    isOpen: false,
  },
  {
    question: "회원탈퇴는 어떻게 하나요?",
    answer:
      "마이페이지 하단의 '회원탈퇴' 버튼을 클릭하시면 탈퇴 절차를 진행할 수 있습니다.",
    isOpen: false,
  },
]);

function goBack() {
  router.back();
}

function toggleFaq(index) {
  faqList.value[index].isOpen = !faqList.value[index].isOpen;
}

function showKakaoModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function openKakaoChat() {
  // 카카오톡 오픈채팅 링크로 이동 (실제 링크로 변경 필요)
  window.open("https://open.kakao.com/o/your-channel-link", "_blank");
}
</script>

<style scoped>
.customer-support-container {
  max-width: 390px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
  padding: 120px 20px 80px 20px;
  box-sizing: border-box;
}

.customer-support-container::-webkit-scrollbar {
  display: none;
}

/* 헤더 스타일 */
.dictionary-header-bar {
  margin-top: 32px;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0;
  margin-bottom: 30px;
  z-index: 1100;
}

.dictionary-header-title {
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

/* 섹션 제목 */
.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 20px 0;
}

/* FAQ 섹션 */
.faq-section {
  margin-bottom: 40px;
}

.faq-list {
  width: 100%;
}

.faq-item {
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.faq-item:hover {
  background-color: #f9f9f9;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.faq-icon {
  font-size: 16px;
  color: #666;
  transition: transform 0.3s ease;
}

.faq-icon.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  background-color: #f8f8f8;
}

.faq-answer.open {
  max-height: 200px;
}

.faq-answer p {
  margin: 0;
  padding: 20px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 문의하기 섹션 */
.contact-section {
  margin-bottom: 40px;
}

.contact-info {
  margin-bottom: 30px;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-icon {
  width: 40px;
  height: 40px;
  background-color: var(--color-main-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  font-size: 16px;
}

.contact-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.contact-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.contact-value {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.contact-button {
  width: 100%;
  padding: 16px;
  background-color: var(--color-main);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s ease;
}

.contact-button:hover {
  background-color: var(--color-main-dark);
}

.contact-button:active {
  transform: scale(0.98);
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 350px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.modal-close:hover {
  background-color: #f0f0f0;
}

.modal-body {
  padding: 20px;
  text-align: center;
}

.kakao-image {
  width: 100%;
  max-width: 200px;
  height: auto;
  margin-bottom: 20px;
  border-radius: 8px;
}

.modal-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}

.kakao-link-button {
  width: 100%;
  padding: 16px;
  background-color: #fee500;
  color: #3c1e1e;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.kakao-link-button:hover {
  background-color: #fdd835;
}

.kakao-link-button:active {
  transform: scale(0.98);
}

@media (max-width: 540px) {
  .customer-support-container {
    max-width: 100vw;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style>
