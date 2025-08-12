<template>
  <div class="challenge-create">
    <div class="create-form">
      <!-- 챌린지 카테고리 드롭다운 부분 -->
      <div class="form-group">
        <label for="challenge-category">챌린지 카테고리</label>
        <select
            id="challenge-category"
            v-model="categoryId"
            class="category-select"
        >
          <option :value="1">전체 소비 줄이기</option>
          <option :value="2">식비 줄이기</option>
          <option :value="3">카페·간식 줄이기</option>
          <option :value="4">교통비 줄이기</option>
          <option :value="5">미용·쇼핑 줄이기</option>
        </select>
      </div>
      <div class="form-group">
        <label for="challenge-title">챌린지 제목</label>
        <input
            type="text"
            id="challenge-title"
            v-model="title"
            placeholder="챌린지 제목을 입력하세요"
        />
      </div>

      <div class="form-group">
        <label for="challenge-description">챌린지 설명</label>
        <textarea
            id="challenge-description"
            v-model="description"
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
              type="text"
              id="target-amount"
              :value="formatAmount(goalValue)"
              @input="handleAmountInput"
              placeholder="목표 금액을 입력하세요"
          />
          <span class="amount-unit">원</span>
        </div>
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

      <div class="form-group">
        <label>챌린지 유형</label>
        <div class="challenge-type-options">
          <label class="challenge-type-option" :class="{ active: type === 'PERSONAL' }">
            <input type="radio" v-model="type" value="PERSONAL" />
            <span>개인 챌린지</span>
          </label>
          <label class="challenge-type-option" :class="{ active: type === 'GROUP' }">
            <input type="radio" v-model="type" value="GROUP" />
            <span>소그룹 챌린지</span>
          </label>
        </div>

        <!-- 타입 풀일 때 즉시 안내 -->
        <p v-if="isSelectedTypeFull" style="margin-top:8px;color:#d32f2f;font-weight:600;">
          {{ warningTextForType }}
        </p>

        <!-- 그룹 선택 시 필요한 포인트 안내 -->
        <p v-if="type === 'GROUP'" style="margin-top:8px;color:#555;">
          생성 필요 포인트: {{ requiredPoints.toLocaleString() }}P / 보유: {{ userPoints.toLocaleString() }}P
          <span v-if="userPoints < requiredPoints" style="color:#d32f2f;font-weight:600;">
            ({{ lackAmount.toLocaleString() }}P 부족)
          </span>
        </p>
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
            />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-cancel" @click="routerBack">취소</button>
        <button class="btn-create" @click="createChallenge">챌린지 생성</button>
      </div>
    </div>

    <!-- 성공 모달 -->
    <ChallengeCreateSuccessModal
        :isVisible="showSuccessModal"
        @close="closeSuccessModal"
    />

    <!-- 포인트 부족 모달 -->
    <ChallengeInsufficientPointsModal
        :isVisible="showInsufficientPointsModal"
        :currentPoints="userPoints"
        :requiredPoints="requiredPoints"
        @close="closeInsufficientPointsModal"
        @charge="handleChargePoints"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useChallengeStore } from '@/stores/challenge';
import ChallengeCreateSuccessModal from '@/components/challenge/ChallengeCreateSuccessModal.vue';
import ChallengeInsufficientPointsModal from '@/components/challenge/ChallengeInsufficientPointsModal.vue';

const router = useRouter();
const auth = useAuthStore();
const challengeStore = useChallengeStore();

// 폼 데이터
const title = ref('');
const description = ref('');
const startDate = ref('');
const endDate = ref('');
const goalValue = ref(100000);
const type = ref('PERSONAL');
const categoryId = ref(1);
const usePassword = ref(false);
const roomPassword = ref('');
const loading = ref(false);

// 모달 상태
const showSuccessModal = ref(false);
const showInsufficientPointsModal = ref(false);

// 포인트/제한 관련 (Pinia)
const userPoints = computed(() => challengeStore.points.userPoints);
const requiredPoints = computed(() => challengeStore.points.required[type.value] ?? 0);
const isSelectedTypeFull = computed(() => challengeStore.isTypeFull(type.value));
const canCreateSelectedType = computed(() => challengeStore.canCreateByType(type.value));
const lackAmount = computed(() => challengeStore.lackPointsAmountForType(type.value));

const warningTextForType = computed(() => {
  if (!isSelectedTypeFull.value) return '';
  if (type.value === 'GROUP') return '소그룹 챌린지는 최대 3개까지 참여할 수 있어요.';
  if (type.value === 'PERSONAL') return '개인 챌린지는 최대 3개까지 참여할 수 있어요.';
  return '';
});

// ✅ 직진입 대비: 정책 포인트 세팅 + 코인 스냅샷 보장
onMounted(async () => {
  challengeStore.setRequiredPoints({ GROUP: 100, PERSONAL: 0, COMMON: 0 });
  if (!challengeStore.points.updatedAt) {
    await challengeStore.fetchCoinStatus();
  }
});

const routerBack = () => router.back();
const addAmount = (amount) => (goalValue.value += amount);
const formatAmount = (v) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const handleAmountInput = (e) => {
  const numericValue = e.target.value.replace(/,/g, '');
  goalValue.value = parseInt(numericValue) || 0;
};

const validateClient = () => {
  if (!title.value.trim()) return '제목을 입력해주세요.';
  if (!description.value.trim()) return '설명을 입력해주세요.';
  if (!startDate.value || !endDate.value) return '기간을 선택해주세요.';
  if (new Date(startDate.value) > new Date(endDate.value)) return '시작일이 종료일보다 이후일 수 없어요.';
  const diffDays = Math.floor((new Date(endDate.value) - new Date(startDate.value)) / 86400000) + 1;
  if (diffDays < 3) return '기간은 최소 3일 이상이어야 해요.';
  if (diffDays > 30) return '기간은 최대 30일까지 가능해요.';
  const startDiff = Math.floor((new Date(startDate.value) - new Date()) / 86400000);
  if (startDiff > 7) return '시작일은 7일 이내여야 해요.';
  if (goalValue.value < 1000) return '목표금액은 1,000원 이상이어야 해요.';
  if (goalValue.value > 10000000) return '목표금액은 10,000,000원 이하여야 해요.';
  if (type.value === 'GROUP' && usePassword.value && !/^\d{4}$/.test(roomPassword.value))
    return '비밀번호는 숫자 4자리여야 해요.';
  return null;
};

const createChallenge = async () => {
  // 0) 선택 타입 제한
  if (!canCreateSelectedType.value) {
    alert(warningTextForType.value || '해당 유형은 현재 생성할 수 없습니다.');
    return;
  }

  // 1) 폼 유효성
  const err = validateClient();
  if (err) return alert(err);

  // 2) 포인트 확인
  if (requiredPoints.value > 0 && userPoints.value < requiredPoints.value) {
    showInsufficientPointsModal.value = true;
    return;
  }

  // 3) 페이로드
  const payload = {
    title: title.value,
    description: description.value,
    startDate: startDate.value,
    endDate: endDate.value,
    goalValue: goalValue.value,
    type: type.value,
    categoryId: Number(categoryId.value),
    usePassword: usePassword.value,
    password: usePassword.value ? Number(roomPassword.value) : null,
  };

  try {
    loading.value = true;
    const token = auth.accessToken;
    await axios.post('/api/challenge/create', payload, { headers: { Authorization: `Bearer ${token}` } });
    showSuccessModal.value = true;
  } catch (e) {
    const msg = e?.response?.data?.message || e?.message || '챌린지 생성 중 오류가 발생했어요.';
    alert(msg);
  } finally {
    loading.value = false;
  }
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  router.back();
};
const closeInsufficientPointsModal = () => (showInsufficientPointsModal.value = false);
const handleChargePoints = () => {
  console.log('포인트 충전 페이지로 이동');
  closeInsufficientPointsModal();
  // router.push('/points/charge');
};
</script>

<style scoped>
.challenge-create {
  padding: 10px 16px 20px 16px;
  background: var(--color-bg-light);
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 10px;
  padding-bottom: 160px;
  box-sizing: border-box;
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

.form-group input, .form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: var(--font-main);
  background: #f8f9fa;
}

.form-group input:focus, .form-group textarea:focus {
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

.btn-cancel, .btn-create {
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
  background: linear-gradient(135deg, var(--color-main) 0%, var(--color-main-dark) 100%);
  color: white;
}

.btn-cancel:hover, .btn-create:hover {
  transform: translateY(-1px);
}
</style>
