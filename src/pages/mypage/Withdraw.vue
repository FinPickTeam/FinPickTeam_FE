<template>
  <div class="withdraw-container">
    <!-- 기존 컨텐츠 영역 유지 -->
    <div class="withdraw-content">
      <div class="info-circle">
        <span class="info-icon">i</span>
      </div>
      <h2 class="withdraw-title">회원 탈퇴를 진행하시겠습니까?</h2>
      <p class="withdraw-desc">
        탈퇴 시 계정 정보와 모든 데이터가<br />
        영구적으로 삭제되며 복구가 불가능합니다.
      </p>
      <div class="delete-info-box">
        <div class="delete-info-title">
          <span class="delete-info-icon">❗</span> 삭제되는 정보
        </div>
        <ul class="delete-info-list">
          <li>개인정보 및 프로필</li>
          <li>자산 관리 데이터</li>
          <li>챌린지 참여 기록</li>
          <li>재테크 학습 진도</li>
        </ul>
      </div>
      <div class="withdraw-btn-group">
        <button class="btn cancel" @click="goBack">
          <font-awesome-icon :icon="['fas', 'angle-left']" />
          취소
        </button>
        <button
          class="btn withdraw"
          @click="handleWithdraw"
          :disabled="isWithdrawing"
        >
          {{ isWithdrawing ? "처리 중..." : "회원 탈퇴" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { withdrawUser } from "@/api/mypage/withdraw";

library.add(faAngleLeft);

const router = useRouter();
const authStore = useAuthStore();
const isWithdrawing = ref(false);

const handleWithdraw = async () => {
  if (isWithdrawing.value) return;

  try {
    isWithdrawing.value = true;

    // 회원탈퇴 API 호출
    const response = await withdrawUser();

    if (response && response.status === 0) {
      // 로컬스토리지에서 사용자 정보 삭제
      localStorage.removeItem("username");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      sessionStorage.clear();

      // Pinia 스토어 초기화
      authStore.$reset();

      // 성공 페이지로 이동
      router.push("/withdraw-success");
    } else {
      throw new Error("회원탈퇴 처리 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("회원탈퇴 실패:", error);
    alert("회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
  } finally {
    isWithdrawing.value = false;
  }
};

function goBack() {
  router.back();
}
</script>

<style scoped>
.withdraw-container {
  width: 100%;
  max-width: 540px;
  min-height: 100vh;
  margin: 0 auto;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-bottom: 80px;
}
.withdraw-content {
  width: 100%;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  padding: 0 16px;
  box-sizing: border-box;
}
.info-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed 0%, #5f3dc4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.12);
}
.info-icon {
  color: #fff;
  font-size: 44px;
  font-weight: bold;
  font-family: "Noto Sans KR", "Arial", sans-serif;
}
.withdraw-title {
  font-size: 22px;
  font-weight: bold;
  color: #222;
  margin: 0 0 16px 0;
  text-align: center;
}
.withdraw-desc {
  color: #888;
  font-size: 16px;
  margin-bottom: 28px;
  text-align: center;
  line-height: 1.6;
}
.delete-info-box {
  width: 100%;
  max-width: 420px;
  background: #fff6f6;
  border: 1.5px solid #ffbdbd;
  border-radius: 16px;
  padding: 18px 20px 12px 20px;
  margin-bottom: 32px;
  box-sizing: border-box;
}
.delete-info-title {
  color: #e53935;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.delete-info-icon {
  font-size: 18px;
}
.delete-info-list {
  color: #e53935;
  font-size: 15px;
  margin: 0;
  padding-left: 18px;
  line-height: 1.7;
}
.delete-info-list li {
  margin-bottom: 2px;
}
.withdraw-btn-group {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}
.btn {
  width: 100%;
  padding: 18px 0;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: background 0.18s;
}
.btn.cancel {
  background: #fff;
  color: #222;
  border: 1.5px solid #e0e0e0;
}
.btn.withdraw {
  background: #f44336;
  color: #fff;
  margin-bottom: 8px;
  box-shadow: 0 4px 16px rgba(244, 67, 54, 0.1);
}
.btn.cancel:hover {
  background: #f3f3f3;
}
.btn.withdraw:hover {
  background: #d32f2f;
}
.btn.withdraw:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.btn.withdraw:disabled:hover {
  background: #ccc;
}
</style>
