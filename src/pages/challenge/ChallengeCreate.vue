<template>
  <div class="challenge-create">
    <div class="create-header">
      <h1>챌린지 생성</h1>
      <p>새로운 챌린지를 만들어보세요!</p>
    </div>

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
        <label for="max-participants">최대 참가자 수</label>
        <input
          type="number"
          id="max-participants"
          v-model="maxParticipants"
          min="1"
          max="100"
        />
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
const maxParticipants = ref(5);
const category = ref('health');

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
    maxParticipants: maxParticipants.value,
    category: category.value,
  });

  // 성공 메시지 후 이전 페이지로 이동
  alert('챌린지가 성공적으로 생성되었습니다!');
  router.back();
};
</script>

<style scoped>
.challenge-create {
  padding: 80px 16px 20px 16px;
  background: var(--color-bg-light);
  min-height: 100vh;
}

.create-header {
  text-align: center;
  margin-bottom: 32px;
}

.create-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.create-header p {
  color: #666;
  font-size: 14px;
}

.create-form {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
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
}

.date-inputs input {
  flex: 1;
}

.date-inputs span {
  color: #666;
  font-weight: 500;
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
}

.category-option:hover {
  border-color: var(--color-main);
  background: #f8f9fa;
}

.category-option input[type='radio'] {
  width: auto;
  margin: 0;
}

.category-option input[type='radio']:checked + span {
  color: var(--color-main);
  font-weight: 600;
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
