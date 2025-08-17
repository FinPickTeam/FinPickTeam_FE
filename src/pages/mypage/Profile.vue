<template>
  <div class="profile-container">
    <div class="profile-header-bar">
      <button class="back-btn" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="profile-header-title">회원정보 관리</span>
    </div>
    <!-- User Information Form -->
    <div class="profile-form">
      <div class="form-group row-group">
        <label>닉네임</label>
        <div class="row-flex">
          <input
            type="text"
            v-model="userInfo.nickname"
            placeholder="닉네임 입력"
          />
          <button class="action-btn" @click="showNicknameModal = true">
            닉네임 변경
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>이메일</label>
        <input type="email" v-model="userInfo.email" readonly />
      </div>
      <div class="form-group row-group">
        <label>비밀번호</label>
        <div class="row-flex">
          <input
            type="password"
            v-model="userInfo.password"
            placeholder="비밀번호"
          />
          <button class="action-btn" @click="showPasswordModal = true">
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
    <!-- 비밀번호 변경 모달 -->
    <div
      v-if="showPasswordModal"
      class="modal-overlay"
      @click="showPasswordModal = false"
    >
      <div class="modal-content" @click.stop>
        <h3>비밀번호 변경</h3>
        <div class="form-group">
          <label>현재 비밀번호</label>
          <input
            type="password"
            v-model="passwordForm.current"
            placeholder="현재 비밀번호를 입력하세요"
          />
        </div>
        <div class="form-group">
          <label>새 비밀번호</label>
          <input
            type="password"
            v-model="passwordForm.new"
            placeholder="새 비밀번호를 입력하세요"
          />
          <div
            v-if="passwordForm.new"
            :class="[
              'password-check-msg',
              passwordValid === true
                ? 'success'
                : passwordValid === false
                ? 'fail'
                : '',
            ]"
          >
            <template v-if="passwordValid === false">
              8자 이상, 영문과 숫자, 특수문자를 포함해야 합니다
            </template>
            <template v-else-if="passwordValid === true">
              적합한 비밀번호입니다
            </template>
          </div>
        </div>
        <div class="form-group">
          <label>새 비밀번호 확인</label>
          <input
            type="password"
            v-model="passwordForm.confirm"
            placeholder="새 비밀번호를 다시 입력하세요"
          />
        </div>
        <div class="btn-group">
          <button
            class="save-btn"
            @click="changePassword"
            :disabled="isChangingPassword"
          >
            {{ isChangingPassword ? "변경 중..." : "변경" }}
          </button>
          <button
            class="cancel-btn"
            @click="showPasswordModal = false"
            :disabled="isChangingPassword"
          >
            취소
          </button>
        </div>
      </div>
    </div>
    <!-- 닉네임 변경 모달 -->
    <div
      v-if="showNicknameModal"
      class="modal-overlay"
      @click="showNicknameModal = false"
    >
      <div class="modal-content" @click.stop>
        <h3>닉네임 변경</h3>
        <div class="form-group">
          <label>새 닉네임</label>
          <input
            type="text"
            v-model="nicknameForm.new"
            placeholder="새 닉네임 입력"
          />
        </div>
        <div class="btn-group">
          <button class="save-btn" @click="checkNicknameModal">중복확인</button>
          <button class="cancel-btn" @click="showNicknameModal = false">
            취소
          </button>
        </div>
        <div
          v-if="nicknameCheckResult"
          :class="[
            'nickname-check-msg',
            {
              success: nicknameCheckResult === '사용 가능한 닉네임입니다.',
              fail: nicknameCheckResult !== '사용 가능한 닉네임입니다.',
            },
          ]"
        >
          {{ nicknameCheckResult }}
        </div>
        <div
          v-if="nicknameCheckResult === '사용 가능한 닉네임입니다.'"
          class="btn-group"
        >
          <button class="save-btn" @click="changeNickname">변경</button>
        </div>
      </div>
    </div>
    <!-- 성공 모달 -->
    <div
      v-if="showSuccessModal"
      class="modal-overlay"
      @click="showSuccessModal = false"
    >
      <div class="modal-content success-modal" @click.stop>
        <div class="success-icon">✓</div>
        <h3>완료</h3>
        <p>{{ successMessage }}</p>
        <div class="btn-group">
          <button class="save-btn" @click="showSuccessModal = false">
            확인
          </button>
        </div>
      </div>
    </div>
    <Navbar />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { changePassword as changePasswordApi } from "@/api/mypage/profile";
import Navbar from "../../components/Navbar.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faAngleLeft);

const router = useRouter();
const authStore = useAuthStore();

const userInfo = ref({
  nickname: authStore.user?.nickname || "닉네임 없음",
  email: authStore.user?.email || "이메일 없음",
  password: "",
});

const showPasswordModal = ref(false);

const passwordForm = ref({
  current: "",
  new: "",
  confirm: "",
});

const showNicknameModal = ref(false);
const nicknameForm = ref({ new: "" });
const nicknameCheckResult = ref("");
const isChangingPassword = ref(false);
const showSuccessModal = ref(false);
const successMessage = ref("");

const goBack = () => {
  router.go(-1);
};

const checkNickname = () => {
  // 닉네임 중복확인 로직 (추후 서버 연동)
  alert("사용 가능한 닉네임입니다.");
};

function checkNicknameModal() {
  // 닉네임 중복확인 로직 (실제 서버 연동 시 비동기 처리)
  if (!nicknameForm.value.new.trim()) {
    nicknameCheckResult.value = "닉네임을 입력하세요.";
    return;
  }

  // 현재 닉네임과 동일한 경우
  if (nicknameForm.value.new === userInfo.value.nickname) {
    nicknameCheckResult.value = "현재 사용 중인 닉네임입니다.";
    return;
  }

  // 임시 중복확인 로직 (실제로는 API 호출)
  if (nicknameForm.value.new === "이미사용중") {
    nicknameCheckResult.value = "이미 사용 중인 닉네임입니다.";
  } else {
    nicknameCheckResult.value = "사용 가능한 닉네임입니다.";
  }
}
function changeNickname() {
  // 실제 API 호출을 통해 닉네임 변경
  // 여기서는 임시로 로컬 상태만 업데이트
  userInfo.value.nickname = nicknameForm.value.new;

  // 스토어의 사용자 정보도 업데이트 (실제로는 API 응답 후 업데이트)
  if (authStore.user) {
    authStore.user.nickname = nicknameForm.value.new;
  }

  showNicknameModal.value = false;
  nicknameCheckResult.value = "";
  nicknameForm.value.new = "";

  // 성공 모달 표시
  successMessage.value = "닉네임이 성공적으로 변경되었습니다.";
  showSuccessModal.value = true;
}

const changePassword = async () => {
  try {
    // 입력값 검증
    if (!passwordForm.value.current.trim()) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (!passwordForm.value.new.trim()) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }

    if (passwordForm.value.new !== passwordForm.value.confirm) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!passwordValid.value) {
      alert("비밀번호 형식이 올바르지 않습니다.");
      return;
    }

    isChangingPassword.value = true;

    // API 호출
    const passwordData = {
      currentPassword: passwordForm.value.current,
      newPassword: passwordForm.value.new,
    };

    await changePasswordApi(passwordData);

    // 성공 시 처리
    showPasswordModal.value = false;
    passwordForm.value = { current: "", new: "", confirm: "" };

    // 성공 모달 표시
    successMessage.value = "비밀번호가 성공적으로 변경되었습니다.";
    showSuccessModal.value = true;
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);

    // 에러 메시지 처리
    if (error.response?.status === 400) {
      alert("현재 비밀번호가 올바르지 않습니다.");
    } else if (error.response?.status === 409) {
      alert("새 비밀번호가 현재 비밀번호와 동일합니다.");
    } else {
      alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
    }
  } finally {
    isChangingPassword.value = false;
  }
};

// 비밀번호 유효성 검사
const passwordValid = computed(() => {
  const value = passwordForm.value.new;
  if (!value) return null;
  // 8자 이상, 영문, 숫자, 특수문자 포함
  const lengthCheck = value.length >= 8;
  const engCheck = /[a-zA-Z]/.test(value);
  const numCheck = /[0-9]/.test(value);
  const specialCheck = /[^a-zA-Z0-9]/.test(value);
  return lengthCheck && engCheck && numCheck && specialCheck;
});
</script>

<style scoped>
.profile-container {
  padding-top: 56px;
}
.profile-form {
  padding: 20px;
  max-width: 390px;
  margin: 0 auto;
}
.form-group {
  margin-bottom: 28px;
}
.form-group label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--color-text);
}
.row-group .row-flex {
  display: flex;
  gap: 10px;
}
.row-flex input {
  flex: 1;
}
input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid var(--color-border-dark);
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
  font-family: var(--font-main);
}
input:focus {
  border-color: var(--color-main-dark);
}
.action-btn {
  background: var(--color-main-light);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  height: 44px;
  transition: background 0.2s;
}
.action-btn:hover {
  background: var(--color-main-dark);
}
/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background: var(--color-bg);
  border-radius: 15px;
  max-width: 400px;
  width: 90%;
  padding: 30px 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
}
.modal-content h3 {
  margin-top: 0;
  font-size: 20px;
  color: #222;
  margin-bottom: 20px;
}
.btn-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
}
.save-btn {
  background: var(--color-main-light);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.save-btn:hover {
  background: var(--color-main-dark);
}
.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.cancel-btn {
  background: var(--color-bg-light);
  color: var(--color-text);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.cancel-btn:disabled {
  background: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}
.nickname-check-msg {
  margin-top: 12px;
  font-size: 15px;
  text-align: center;
}
.nickname-check-msg.success {
  color: #4caf50;
}
.nickname-check-msg.fail {
  color: var(--color-accent);
}
.password-check-msg {
  margin-top: 8px;
  font-size: 14px;
  text-align: left;
}
.password-check-msg.success {
  color: #4caf50;
}
.password-check-msg.fail {
  color: var(--color-accent);
}

/* 성공 모달 스타일 */
.success-modal {
  text-align: center;
}

.success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #4caf50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 0 auto 20px;
}

.success-modal h3 {
  color: #4caf50;
  margin-bottom: 10px;
}

.success-modal p {
  color: var(--color-text);
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 1.5;
}
@media (max-width: 600px) {
  .profile-form {
    padding: 10px;
  }
  .modal-content {
    padding: 20px 10px;
  }
}
.profile-header-bar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 390px;
  height: 56px;
  padding: 0 12px;
  z-index: 1100;
  background: #fff;
  border-bottom: 1px solid #e5e6ea;
}
.profile-header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-text);
}
.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px; /* 터치 타겟 크게 */
  margin-left: -6px;
  background: none;
  border: none;
  color: #222;
  font-size: 22px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.back-btn:hover {
  background: transparent;
} /* 호버 제거 */
.back-btn:active {
  transform: scale(0.98);
} /* 눌렀을 때만 반응 */
</style>
