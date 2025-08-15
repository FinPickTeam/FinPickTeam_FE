<!-- src/views/openbanking/CardList.vue -->
<template>
  <div class="page">
    <AssetSummaryCard title="이번달 카드 사용 내역" :amount="cardTotalAmount" />

    <section class="group">
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>카드 정보를 불러오는 중...</p>
      </div>
      <ListItemCard
        v-else
        v-for="c in cards"
        :key="c.id"
        :logo="cardLogo(c.bank)"
        :bank="c.bank"
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
    </section>

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
import { ref, computed, onMounted } from 'vue';
import ListItemCard from '@/components/openbanking/ListItemCard.vue';
import ConfirmModal from '@/components/openbanking/ConfirmModal.vue';
import DeleteModeFooter from '@/components/openbanking/DeleteModeFooter.vue';
import AssetSummaryCard from '@/components/openbanking/AssetSummaryCard.vue';
import Navbar from '@/components/Navbar.vue';
import { useSelectDelete } from '@/components/openbanking/useSelectDelete.js';
import { useLogos } from '@/components/openbanking/useLogos.js';
import { useRouter } from 'vue-router';
import { getCardsWithTotal } from '@/api/openbanking/cardsApi';

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

onMounted(fetchCards);
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

.header-icon-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #4318d1;
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

.group {
  margin: 0 16px 16px;
  flex: 1;
  overflow-y: auto;
}

.card-item {
  margin-bottom: 12px;
}

.card-item:last-child {
  margin-bottom: 0;
}

.bg-card {
  background: #ece9fd;
  color: #4318d1;
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
  border-top: 4px solid #4318d1;
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
