<template>
  <div class="challenge-create">
    <div class="create-form">
      <div class="form-group">
        <label for="challenge-title">챌린지 제목</label>
        <input
          type="text"
          id="challenge-title"
          v-model="title"
          placeholder="챌린지 제목을 입력하세요"
          :class="{ error: errors.title }"
        />
        <span v-if="errors.title" class="error-message">{{
          errors.title
        }}</span>
      </div>

      <div class="form-group">
        <label for="challenge-description">챌린지 설명</label>
        <textarea
          id="challenge-description"
          v-model="description"
          placeholder="챌린지에 대한 설명을 입력하세요"
          rows="4"
          :class="{ error: errors.description }"
        ></textarea>
        <span v-if="errors.description" class="error-message">{{
          errors.description
        }}</span>
      </div>

      <div class="form-group">
        <label for="challenge-period">챌린지 기간</label>
        <div class="date-inputs">
          <input
            type="date"
            id="start-date"
            v-model="startDate"
            :class="{ error: errors.startDate }"
          />
          <span>~</span>
          <input
            type="date"
            id="end-date"
            v-model="endDate"
            :class="{ error: errors.endDate }"
          />
        </div>
        <span v-if="errors.startDate || errors.endDate" class="error-message">
          {{ errors.startDate || errors.endDate }}
        </span>
      </div>

      <div class="form-group">
        <label for="target-amount">목표 금액</label>
        <div class="amount-input-wrapper">
          <input
            type="text"
            id="target-amount"
            :value="formatAmount(goalValue)"
            @input="handleAmountInput"
            placeholder="목표 금액을 입력하세요"
            :class="{ error: errors.goalValue }"
          />
          <span class="amount-unit">원</span>
        </div>
        <span v-if="errors.goalValue" class="error-message">{{
          errors.goalValue
        }}</span>
        <div class="amount-buttons">
          <button
            v-for="unit in [10000, 100000, 1000000]"
            :key="unit"
            type="button"
            class="btn custom-amount-btn"
            @click="addAmount(unit)"
          >
            +{{ unit.toLocaleString() }}
          </button>
        </div>
      </div>

      <!-- 챌린지 카테고리 드롭다운 부분 -->
      <div class="form-group">
        <label for="challenge-category">챌린지 카테고리</label>
        <select
          id="challenge-category"
          v-model="categoryId"
          class="category-select"
          :class="{ error: errors.categoryId }"
        >
          <option :value="1">전체 소비 줄이기</option>
          <option :value="2">식비 줄이기</option>
          <option :value="3">카페·간식 줄이기</option>
          <option :value="4">교통비 줄이기</option>
          <option :value="5">미용·쇼핑 줄이기</option>
        </select>
        <span v-if="errors.categoryId" class="error-message">{{
          errors.categoryId
        }}</span>
      </div>

      <div class="form-group">
        <label>챌린지 유형</label>
        <div class="challenge-type-options">
          <label
            class="challenge-type-option"
            :class="{ active: type === 'PERSONAL' }"
          >
            <input type="radio" v-model="type" value="PERSONAL" />
            <span>개인 챌린지</span>
          </label>
          <label
            class="challenge-type-option"
            :class="{ active: type === 'GROUP' }"
          >
            <input type="radio" v-model="type" value="GROUP" />
            <span>소그룹 챌린지</span>
          </label>
        </div>
        <span v-if="errors.type" class="error-message">{{ errors.type }}</span>
      </div>

      <div class="form-group" v-if="type === 'GROUP'">
        <label>방 설정</label>
        <div class="room-setting">
          <div class="room-type-options">
            <label class="room-type-option" :class="{ active: !usePassword }">
              <input type="radio" v-model="usePassword" :value="false" />
              <span>공개방</span>
            </label>
            <label class="room-type-option" :class="{ active: usePassword }">
              <input type="radio" v-model="usePassword" :value="true" />
              <span>비공개방</span>
            </label>
          </div>
          <div v-if="usePassword" class="password-input">
            <input
              type="password"
              v-model="roomPassword"
              placeholder="비밀번호를 입력하세요"
              maxlength="20"
              :class="{ error: errors.roomPassword }"
            />
            <span v-if="errors.roomPassword" class="error-message">{{
              errors.roomPassword
            }}</span>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-cancel" @click="goBack">취소</button>
        <button class="btn-create" @click="createChallenge">챌린지 생성</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 폼 데이터
const title = ref(''); // 챌린지 제목
const description = ref(''); // 챌린지 설명
const startDate = ref(''); // 챌린지 시작일
const endDate = ref(''); // 챌린지 종료일
const goalValue = ref(100000); // 목표 금액
const type = ref('PERSONAL'); // 챌린지 유형
const categoryId = ref(1); // 카테고리 ID   (1: 전체 소비 줄이기, 2: 식비 줄이기, 3: 카페·간식 줄이기, 4: 교통비 줄이기, 5: 미용·쇼핑 줄이기)
const usePassword = ref(false); // 비밀번호 사용 여부
const roomPassword = ref(''); // 비밀번호

// 에러 메시지 관리
const errors = reactive({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  goalValue: '',
  categoryId: '',
  type: '',
  roomPassword: '',
});

const goBack = () => {
  router.back();
};

const addAmount = (amount) => {
  goalValue.value += amount;
  // 금액 변경 시 에러 메시지 초기화
  if (errors.goalValue) {
    errors.goalValue = '';
  }
};

const formatAmount = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const handleAmountInput = (event) => {
  // 콤마 제거 후 숫자만 추출
  const numericValue = event.target.value.replace(/,/g, '');
  goalValue.value = parseInt(numericValue) || 0;
  // 금액 입력 시 에러 메시지 초기화
  if (errors.goalValue) {
    errors.goalValue = '';
  }
};

const validateForm = () => {
  // 에러 메시지 초기화
  Object.keys(errors).forEach((key) => {
    errors[key] = '';
  });

  let isValid = true;

  // 제목 검증
  if (!title.value.trim()) {
    errors.title = '챌린지 제목을 입력해주세요.';
    isValid = false;
  } else if (title.value.trim().length < 2) {
    errors.title = '챌린지 제목은 2자 이상 입력해주세요.';
    isValid = false;
  }

  // 설명 검증
  if (!description.value.trim()) {
    errors.description = '챌린지 설명을 입력해주세요.';
    isValid = false;
  } else if (description.value.trim().length < 10) {
    errors.description = '챌린지 설명은 10자 이상 입력해주세요.';
    isValid = false;
  }

  // 시작일 검증
  if (!startDate.value) {
    errors.startDate = '시작일을 선택해주세요.';
    isValid = false;
  }

  // 종료일 검증
  if (!endDate.value) {
    errors.endDate = '종료일을 선택해주세요.';
    isValid = false;
  } else if (
    startDate.value &&
    endDate.value &&
    startDate.value >= endDate.value
  ) {
    errors.endDate = '종료일은 시작일보다 늦어야 합니다.';
    isValid = false;
  }

  // 목표 금액 검증
  if (goalValue.value <= 0) {
    errors.goalValue = '목표 금액을 입력해주세요.';
    isValid = false;
  } else if (goalValue.value < 10000) {
    errors.goalValue = '목표 금액은 10,000원 이상 입력해주세요.';
    isValid = false;
  }

  // 비밀번호 검증 (그룹 챌린지이고 비밀번호 사용 시)
  if (type.value === 'GROUP' && usePassword.value) {
    if (!roomPassword.value.trim()) {
      errors.roomPassword = '비밀번호를 입력해주세요.';
      isValid = false;
    } else if (roomPassword.value.length < 4) {
      errors.roomPassword = '비밀번호는 4자 이상 입력해주세요.';
      isValid = false;
    }
  }

  return isValid;
};

const createChallenge = () => {
  if (!validateForm()) {
    return; // 유효성 검사 실패 시 함수 종료
  }

  // 챌린지 생성 로직
  const challengeData = {
    title: title.value,
    description: description.value,
    startDate: startDate.value,
    endDate: endDate.value,
    goalValue: goalValue.value,
    type: type.value,
    categoryId: categoryId.value,
    usePassword: usePassword.value,
    roomPassword: usePassword.value ? roomPassword.value : '',
  };
  console.log('챌린지 생성 요청:', challengeData);

  // 성공 메시지 후 이전 페이지로 이동
  alert('챌린지가 성공적으로 생성되었습니다!');
  router.back();
};
</script>

<style scoped>
.challenge-create {
  padding: 10px 16px 20px 16px;
  background: var(--color-bg-light);
  min-height: 100vh;
}

.create-form {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
  font-family: var(--font-main);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: var(--font-main);
  background: #f8f9fa;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-main);
  background: white;
}

.form-group input.error,
.form-group textarea.error,
.category-select.error {
  border-color: #ff4757;
  background: #fff5f5;
}

.error-message {
  display: block;
  color: #ff4757;
  font-size: 12px;
  margin-top: 4px;
  font-family: var(--font-main);
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.date-inputs input {
  flex: 1;
  min-width: 0;
}

.date-inputs span {
  color: #666;
  font-weight: 500;
  font-family: var(--font-main);
}

.amount-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.amount-input-wrapper input {
  flex: 1;
  padding-right: 40px;
  font-size: 18px;
  font-weight: 500;
}

.amount-unit {
  position: absolute;
  right: 16px;
  color: #666;
  font-weight: 500;
  font-family: var(--font-main);
  pointer-events: none;
}

.amount-buttons {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.custom-amount-btn {
  flex: 1;
  min-width: 80px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f8f9fa;
  color: #333;
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.2s;
}

.custom-amount-btn:active {
  border-color: var(--color-main);
  background: var(--color-main);
  color: white;
}

.challenge-type-options {
  display: flex;
  gap: 12px;
}

.challenge-type-option {
  flex: 1 1 0;
  border: 1.5px solid var(--color-bg-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  border-radius: 12px;
  padding: 10px 0;
  cursor: pointer;
  transition: border 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-main);
  text-align: center;
}

.challenge-type-option.active {
  border: 1.5px solid var(--color-main);
  color: var(--color-main);
}

.challenge-type-option input[type='radio'] {
  display: none;
}

.challenge-type-option input[type='radio']:checked + span {
  color: var(--color-main);
  font-weight: 600;
}

.category-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: var(--font-main);
  background: #f8f9fa;
  cursor: pointer;
}

.category-select:focus {
  outline: none;
  border-color: var(--color-main);
  background: white;
}

.room-setting {
  display: flex;
  flex-direction: column;
}

.room-type-options {
  display: flex;
  gap: 12px;
}

.room-type-option {
  flex: 1 1 0;
  border: 1.5px solid var(--color-bg-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  border-radius: 12px;
  padding: 10px 0;
  cursor: pointer;
  transition: border 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-main);
  text-align: center;
}

.room-type-option.active {
  border: 1.5px solid var(--color-main);
  color: var(--color-main);
}

.room-type-option input[type='radio'] {
  display: none;
}

.room-type-option input[type='radio']:checked + span {
  color: var(--color-main);
  font-weight: 600;
}

.password-input {
  margin-top: 8px;
}

.password-input input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: var(--font-main);
  background: #f8f9fa;
}

.password-input input:focus {
  outline: none;
  border-color: var(--color-main);
  background: white;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.btn-cancel,
.btn-create {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-main);
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-cancel {
  background: #f1f3f4;
  color: #666;
}

.btn-create {
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  color: white;
}

.btn-cancel:hover,
.btn-create:hover {
  transform: translateY(-1px);
}
</style>
