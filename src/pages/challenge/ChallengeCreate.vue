<template>
  <div class="challenge-create">
    <div class="create-form">
      <div class="form-group">
        <label for="challenge-title">챌린지 제목</label>
        <input
          type="text"
          id="challenge-title"
          v-model="challengeTitle"
          placeholder="챌린지 제목을 입력하세요"
        />
      </div>

      <div class="form-group">
        <label for="challenge-description">챌린지 설명</label>
        <textarea
          id="challenge-description"
          v-model="challengeDescription"
          placeholder="챌린지에 대한 설명을 입력하세요"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="challenge-period">챌린지 기간</label>
        <div class="date-inputs">
          <input type="date" id="start-date" v-model="startDate" />
          <span>~</span>
          <input type="date" id="end-date" v-model="endDate" />
        </div>
      </div>

      <div class="form-group">
        <label for="target-amount">목표 금액</label>
        <div class="amount-input-wrapper">
          <input
            type="number"
            id="target-amount"
            v-model="targetAmount"
            min="1000"
            step="1000"
            placeholder="목표 금액을 입력하세요"
          />
          <span class="amount-unit">원</span>
        </div>
      </div>

      <div class="form-group">
        <label>챌린지 유형</label>
        <div class="challenge-type-options">
          <label class="challenge-type-option">
            <input type="radio" v-model="challengeType" value="individual" />
            <span>개인 챌린지</span>
          </label>
          <label class="challenge-type-option">
            <input type="radio" v-model="challengeType" value="group" />
            <span>소그룹 챌린지</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>챌린지 카테고리</label>
        <div class="category-options">
          <label class="category-option">
            <input type="radio" v-model="category" value="health" />
            <span>건강</span>
          </label>
          <label class="category-option">
            <input type="radio" v-model="category" value="finance" />
            <span>재테크</span>
          </label>
          <label class="category-option">
            <input type="radio" v-model="category" value="study" />
            <span>학습</span>
          </label>
          <label class="category-option">
            <input type="radio" v-model="category" value="lifestyle" />
            <span>라이프스타일</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>방 설정</label>
        <div class="room-setting">
          <div class="room-type-options">
            <label class="room-type-option">
              <input type="radio" v-model="roomType" value="public" />
              <span>공개방</span>
            </label>
            <label class="room-type-option">
              <input type="radio" v-model="roomType" value="private" />
              <span>비공개방</span>
            </label>
          </div>
          <div v-if="roomType === 'private'" class="password-input">
            <input
              type="password"
              v-model="roomPassword"
              placeholder="비밀번호를 입력하세요"
              maxlength="20"
            />
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 폼 데이터
const challengeTitle = ref('');
const challengeDescription = ref('');
const startDate = ref('');
const endDate = ref('');
const targetAmount = ref(100000);
const challengeType = ref('individual');
const category = ref('health');
const roomType = ref('public');
const roomPassword = ref('');

const goBack = () => {
  router.back();
};

const createChallenge = () => {
  // 챌린지 생성 로직
  console.log('챌린지 생성:', {
    title: challengeTitle.value,
    description: challengeDescription.value,
    startDate: startDate.value,
    endDate: endDate.value,
    targetAmount: targetAmount.value,
    challengeType: challengeType.value,
    category: category.value,
    roomType: roomType.value,
    roomPassword: roomType.value === 'private' ? roomPassword.value : '',
  });

  // 성공 메시지 후 이전 페이지로 이동
  alert('챌린지가 성공적으로 생성되었습니다!');
  router.back();
};
</script>

<style scoped>
.challenge-create {
  padding: 0px 16px 20px 16px;
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
}

.amount-unit {
  position: absolute;
  right: 16px;
  color: #666;
  font-weight: 500;
  font-family: var(--font-main);
  pointer-events: none;
}

.challenge-type-options {
  display: flex;
  gap: 12px;
}

.challenge-type-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-main);
  flex: 1;
}

.challenge-type-option:hover {
  border-color: var(--color-main);
  background: #f8f9fa;
}

.challenge-type-option input[type='radio'] {
  display: none;
}

.challenge-type-option input[type='radio']:checked + span {
  color: var(--color-main);
  font-weight: 600;
}

.category-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.category-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-main);
}

.category-option:hover {
  border-color: var(--color-main);
  background: #f8f9fa;
}

.category-option input[type='radio'] {
  display: none;
}

.category-option input[type='radio']:checked + span {
  color: var(--color-main);
  font-weight: 600;
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
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-main);
  flex: 1;
}

.room-type-option:hover {
  border-color: var(--color-main);
  background: #f8f9fa;
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
