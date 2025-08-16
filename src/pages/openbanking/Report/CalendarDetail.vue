<template>
  <div class="transaction-detail-container">
    <!-- 거래 요약 섹션 -->
    <div class="transaction-summary">
      <div class="merchant-info">
        <div class="merchant-icon">
          <img :src="logoSrc" :alt="transaction.category + ' 로고'" />
        </div>
        <div class="merchant-details">
          <div class="merchant-name">{{ transaction.merchantName }}</div>
          <div class="transaction-date">{{ dateText }} {{ timeText }}</div>
        </div>
      </div>
      <div class="transaction-amount">
        {{ amountSign }}{{ Number(transaction.amount || 0).toLocaleString() }}원
      </div>
    </div>

    <!-- 거래 상세 정보 -->
    <div class="transaction-details">
      <div class="detail-item">
        <span class="detail-label">결제수단</span>
        <span class="detail-value">{{ paymentMethod }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">카테고리</span>
        <div class="category-with-button">
          <span class="detail-value">{{ transaction.category }}</span>
          <button class="category-edit-btn" @click="goToCategorySelect">
            ▶
          </button>
        </div>
      </div>
      <div class="detail-item">
        <span class="detail-label">사용자메모</span>
        <div class="memo-with-button">
          <span class="detail-value memo" @click="openMemoModal">{{
            transaction.memo
          }}</span>
          <button class="memo-edit-btn" @click="openMemoModal">▶</button>
        </div>
      </div>
    </div>

    <!-- 소비 피드백 섹션 -->
    <div class="consumption-feedback">
      <div class="feedback-header">
        <span class="feedback-title">소비 피드백</span>
        <div class="sparkle-icons">
          <font-awesome-icon :icon="['fas', 'star']" />
          <font-awesome-icon :icon="['fas', 'star']" />
        </div>
      </div>
      <div class="feedback-content">
        <p>{{ transaction.analysis || '분석 데이터가 아직 없어요.' }}</p>
      </div>
    </div>

    <!-- 메모 수정 모달 -->
    <div v-if="showMemoModal" class="modal-overlay" @click="closeMemoModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>메모 수정</h3>
          <button class="modal-close-btn" @click="closeMemoModal">✕</button>
        </div>
        <div class="modal-body">
          <textarea
            v-model="memoText"
            class="memo-textarea"
            placeholder="메모를 입력하세요..."
            rows="4"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeMemoModal">
            취소
          </button>
          <button class="modal-btn save-btn" @click="saveMemo">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  getLedgerDetail,
  patchLedgerMemo,
} from '@/api/openbanking/ledgerApi.js';
import { categoryToLogo } from '@/components/openbanking/categoryLogo.js';

const router = useRouter();
const route = useRoute();

// 모달
const showMemoModal = ref(false);
const memoText = ref('');

// 거래 데이터 (백엔드 스펙에 맞춘 키)
const transaction = ref({
  id: null,
  type: '', // INCOME | EXPENSE
  amount: 0,
  date: '', // ISO
  merchantName: '',
  place: '',
  sourceType: '', // ACCOUNT | CARD
  sourceName: '',
  category: '', // 라벨 문자열
  memo: '',
  analysis: '',
});

// 표시용 파생값
const amountSign = computed(() =>
  transaction.value.type === 'INCOME' ? '+' : '-'
);
const dateObj = computed(() =>
  transaction.value.date ? new Date(transaction.value.date) : null
);
const dateText = computed(() =>
  dateObj.value ? dateObj.value.toISOString().slice(0, 10) : ''
);
const timeText = computed(() =>
  dateObj.value ? dateObj.value.toTimeString().slice(0, 5) : ''
);
const paymentMethod = computed(() => {
  const t = transaction.value.sourceType || '';
  const n = transaction.value.sourceName || '';
  return [t, n].filter(Boolean).join(' · ');
});
const logoSrc = computed(() => categoryToLogo(transaction.value.category));

// 라우팅
const goBack = () => router.back();
const goToDictionary = () => router.push('/dictionary');
const goToCategorySelect = () => {
  const id = route.params.id;
  router.push(`/openbanking/daily-report-select?transactionId=${id}`);
};

// 메모
const openMemoModal = () => {
  memoText.value = transaction.value.memo || '';
  showMemoModal.value = true;
};
const closeMemoModal = () => {
  showMemoModal.value = false;
  memoText.value = '';
};
const saveMemo = async () => {
  const id = route.params.id;
  try {
    await patchLedgerMemo(id, memoText.value); // body: {memo}, 200/204
    transaction.value.memo = memoText.value;
  } catch (e) {
    console.error('메모 저장 실패:', e);
  } finally {
    closeMemoModal();
  }
};

// 데이터 로드
const loadDetail = async () => {
  const id = route.params.id;
  if (!id) return;
  try {
    const res = await getLedgerDetail(id); // {status, message, data}
    const d = res?.data || {};
    transaction.value = {
      id: d.id ?? id,
      type: d.type || '',
      amount: Number(d.amount || 0),
      date: d.date || '',
      merchantName: d.merchantName || '',
      place: d.place || '',
      sourceType: d.sourceType || '',
      sourceName: d.sourceName || '',
      category: d.category || '기타',
      memo: d.memo || '',
      analysis: d.analysis || '',
    };
  } catch (e) {
    console.error('거래 상세 로드 실패:', e);
  }
};

onMounted(loadDetail);

// 카테고리 선택 후 복귀 시 반영
onActivated(() => {
  const id = route.params.id;
  const picked =
    localStorage.getItem(`transaction_${id}_category`) ||
    sessionStorage.getItem(`transaction_${id}_category`) ||
    sessionStorage.getItem(`selectedCategory_${id}`);
  if (picked && picked !== transaction.value.category) {
    transaction.value.category = picked;
  }
});
</script>

<style scoped>
.transaction-detail-container {
  width: 390px;
  margin: 0 auto;
  background: #fff;
  font-family: 'Noto Sans KR', sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 상단 헤더 */
.obcal-header {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #ececec;
}

.obcal-back {
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 4px 8px 4px 0;
  border-radius: 8px;
  transition: background 0.15s;
}

.obcal-back:hover {
  background: #f3f3f3;
}

.obcal-header-icons {
  display: flex;
  gap: 12px;
}

.obcal-icon-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: var(--color-main);
  cursor: pointer;
  padding: 4px 4px;
  border-radius: 8px;
  transition: background 0.15s;
}

.obcal-icon-btn:hover {
  background: #f3f3f3;
}

/* 거래 요약 섹션 */
.transaction-summary {
  padding: 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f3f4f6;
}

.merchant-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.merchant-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.merchant-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.merchant-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.merchant-name {
  font-size: 1rem;
  font-weight: 500;
  color: #222;
  line-height: 1.2;
}

.transaction-date {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.2;
}

.transaction-amount {
  font-size: 1.5rem;
  font-weight: 600;
  color: #8b5cf6;
  line-height: 1.2;
}

/* 거래 상세 정보 */
.transaction-details {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.detail-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 400;
  min-width: 80px;
}

.detail-value {
  font-size: 0.875rem;
  color: #222;
  font-weight: 500;
  text-align: right;
  flex: 1;
  line-height: 1.4;
}

.detail-value.memo {
  word-break: break-all;
  white-space: pre-wrap;
}

.category-with-button {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.category-edit-btn {
  background: none;
  border: none;
  color: #8b5cf6;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.15s;
  flex-shrink: 0;
}

.category-edit-btn:hover {
  background: #f3f3f3;
}

.memo-with-button {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.memo-edit-btn {
  background: none;
  border: none;
  color: #8b5cf6;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.15s;
  flex-shrink: 0;
}

.memo-edit-btn:hover {
  background: #f3f3f3;
}

.detail-value.memo {
  cursor: pointer;
  transition: color 0.15s;
}

.detail-value.memo:hover {
  color: #8b5cf6;
}

/* 소비 피드백 섹션 */
.consumption-feedback {
  margin: 20px 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.feedback-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #222;
}

.sparkle-icons {
  display: flex;
  gap: 4px;
  color: #8b5cf6;
  font-size: 12px;
}

.feedback-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feedback-content p {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
  margin: 0;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 350px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #222;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.15s;
}

.modal-close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 20px;
}

.memo-textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px;
  font-size: 0.875rem;
  font-family: 'Noto Sans KR', sans-serif;
  resize: vertical;
  min-height: 100px;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.memo-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.memo-textarea::placeholder {
  color: #9ca3af;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px 20px 20px;
  border-top: 1px solid #e5e7eb;
}

.modal-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.save-btn {
  background: #8b5cf6;
  color: #fff;
}

.save-btn:hover {
  background: #7c3aed;
}

/* 반응형 디자인 */
@media (max-width: 390px) {
  .transaction-detail-container {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
  }

  .modal-content {
    width: 95%;
    margin: 0 10px;
  }
}
</style>
