<!-- src/views/openbanking/CardList.vue -->
<template>
  <div class="page">
    <section class="summary-card">
      <h2 class="summary-title">총 소비</h2>
      <div class="summary-right">
        <div
          class="hero-delta"
          :class="{ up: spendingDiff > 0, down: spendingDiff < 0 }"
        >
          <span class="delta-icon">
            {{ spendingDiff > 0 ? '▲' : spendingDiff < 0 ? '▼' : '–' }}
          </span>
          전월 대비 {{ Math.abs(spendingChangePercent).toFixed(1) }}%
        </div>
        <div class="summary-amount">
          {{ cardTotalAmount.toLocaleString() }}원
        </div>
      </div>
    </section>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>카드 정보를 불러오는 중...</p>
    </div>

    <div v-else class="list-wrap">
      <h3 class="group-title">카드</h3>
      <div class="card-list">
        <ListItemCard
          v-for="c in cards"
          :key="c.id"
          :logo="cardLogo(c.bank)"
          :badge="c.type"
          badgeClass="bg-card"
          :amount="c.amount"
          :isNegative="c.amount < 0"
          :name="c.name"
          :sub="`본인 ${c.cardNumber || '****'}`"
          :selected="selected.includes(c)"
          @click="onClick(c)"
          class="card-item"
        />
      </div>
    </div>

    <ConfirmModal
      :open="showModal"
      title="카드 삭제"
      @close="closeConfirm"
      @confirm="confirmDelete"
    >
      {{ selected.length }}개의 카드를 삭제하시겠습니까?
    </ConfirmModal>

    <DeleteModeFooter
      :is-delete-mode="isDeleteMode"
      :selected-count="selected.length"
      item-type="카드"
      @delete="openConfirm"
    />

    <Navbar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ListItemCard from '@/components/openbanking/ListItemCard.vue';
import ConfirmModal from '@/components/openbanking/ConfirmModal.vue';
import DeleteModeFooter from '@/components/openbanking/DeleteModeFooter.vue';
import Navbar from '@/components/Navbar.vue';
import { useSelectDelete } from '@/components/openbanking/useSelectDelete.js';
import { useLogos } from '@/components/openbanking/useLogos.js';
import { useRouter } from 'vue-router';
import { getCardsWithTotal } from '@/api/openbanking/cardsApi';
import { getAssetSummaryCompare } from '@/api/openbanking/assetSummaryApi.js';

const router = useRouter();
const { cardLogo } = useLogos();
const {
  isDeleteMode,
  selected,
  showModal,
  toggleMode,
  toggleSelect,
  openConfirm,
  closeConfirm,
} = useSelectDelete();

const cards = ref([]);
const cardTotalAmount = ref(0);
const loading = ref(false);
const spendingDiff = ref(0);
const spendingChangePercent = ref(0);

const fetchCards = async () => {
  try {
    loading.value = true;
    const r = await getCardsWithTotal(); // {status, message, data}
    const apiCards = Array.isArray(r?.data) ? r.data : [];

    // 매핑: spec -> { id, bankName, cardName, cardType, cardMaskednum, monthlySpent }
    cards.value = apiCards.map((c) => ({
      id: c.id,
      bank: c.bankName || c.cardName?.split(' ')[0] || '카드',
      type: c.cardType === 'CREDIT' ? '신용' : '체크',
      name: c.cardName || '카드',
      amount: Number(c.monthlySpent ?? 0),
      cardNumber: c.cardMaskednum?.split('-').pop() || '****',
    }));

    cardTotalAmount.value = cards.value.reduce(
      (sum, card) => sum + (card.amount || 0),
      0
    );

    // 전월 대비 소비 비교
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
    try {
      const cmp = await getAssetSummaryCompare({ month: ym });
      const d = cmp?.data || {};
      const cur = Number(d.currentSpending ?? cardTotalAmount.value);
      const prev = Number(d.prevSpending ?? 0);
      spendingDiff.value = Number(d.spendingDiff ?? cur - prev);
      spendingChangePercent.value = prev
        ? (spendingDiff.value / prev) * 100
        : 0;
    } catch {
      spendingDiff.value = 0;
      spendingChangePercent.value = 0;
    }
  } catch (error) {
    console.error('카드 API 호출 에러:', error);
    // 폴백
    cards.value = [
      {
        id: 1,
        bank: 'KB국민은행',
        type: '체크',
        name: "KB IT's Your Life 6기 체크",
        amount: 250000,
        cardNumber: '3456',
      },
    ];
    cardTotalAmount.value = cards.value.reduce((s, c) => s + c.amount, 0);
  } finally {
    loading.value = false;
  }
};

const onClick = (c) => {
  if (isDeleteMode.value) return toggleSelect(c);
  router.push({
    name: 'CardDetail',
    params: { cardId: c.id, cardData: JSON.stringify(c) },
  });
};

const confirmDelete = () => {
  cards.value = cards.value.filter((c) => !selected.value.includes(c));
  closeConfirm();
  isDeleteMode.value = false;
  selected.value = [];
};

const handleToggleDelete = () => toggleMode();

onMounted(async () => {
  window.addEventListener('toggle-delete-mode', handleToggleDelete);
  fetchCards();
});

onUnmounted(() => {
  window.removeEventListener('toggle-delete-mode', handleToggleDelete);
});
</script>

<style scoped>
.page {
  height: calc(
    100dvh - 160px
  ); /* 헤더(80px) + 네비게이션(80px) 높이만큼 빼기 */
  background: var(--color-bg-light);
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  min-height: 0;
}

/* ===== Summary card ===== */
.summary-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin: 0 16px 24px;
}
.summary-title {
  font-size: 1rem;
  font-weight: 600;
  color: #555;
}
.summary-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 4px;
}
.summary-amount {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-main);
  white-space: nowrap;
}
.hero-delta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: #666;
}
.hero-delta.up {
  color: #ef4444;
}
.hero-delta.down {
  color: #3b82f6;
}
.delta-icon {
  font-weight: 700;
}

.header-icon-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: var(--color-main);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.header-icon-btn:hover {
  background: #f3f3f3;
}

.list-wrap {
  background: #fff;
  padding: 20px 16px;
  margin: 0 -16px 16px; /* 좌우 꽉 + 하단 여백 */
}
.group-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  padding-left: 16px;
  color: #222;
}
.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bg-card {
  background: #ece9fd;
  color: var(--color-main);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--color-main);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
