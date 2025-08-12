<!-- src/views/openbanking/CardList.vue -->
<template>
  <div class="page">
    <BaseHeader>
      <template #title>내 카드</template>
      <template #right>
        <button class="header-icon-btn" @click="toggleMode">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </button>
      </template>
    </BaseHeader>

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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import BaseHeader from '@/components/openbanking/BaseHeader.vue';
import ListItemCard from '@/components/openbanking/ListItemCard.vue';
import ConfirmModal from '@/components/openbanking/ConfirmModal.vue';
import DeleteModeFooter from '@/components/openbanking/DeleteModeFooter.vue';
import AssetSummaryCard from '@/components/openbanking/AssetSummaryCard.vue';
import Navbar from '@/components/Navbar.vue';
import { useSelectDelete } from '@/components/openbanking/useSelectDelete.js';
import { useLogos } from '@/components/openbanking/useLogos.js';
import { useRouter } from 'vue-router';
import { getCardsWithTotal } from '@/api/openbanking/cardsApi';

// FontAwesome 아이콘 등록
library.add(faTrash);

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
    const response = await getCardsWithTotal();
    console.log('카드 데이터:', response.data);

    if (response.data.status === 200) {
      // API 응답이 바로 배열로 오는 경우
      const apiCards = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      console.log('카드 배열:', apiCards);

      // API 응답 구조에 맞게 데이터 변환
      cards.value = apiCards.map((card) => ({
        id: card.id,
        bank: card.cardName?.split(' ')[0] || '카드',
        type: card.cardType === 'CREDIT' ? '신용' : '체크',
        name: card.cardName || '카드',
        amount: 250000, // API에서 제공하지 않는 경우 기본값
        cardNumber: card.cardMaskednum?.split('-').pop() || '****',
      }));

      // 총액 계산
      cardTotalAmount.value = cards.value.reduce(
        (sum, card) => sum + card.amount,
        0
      );
    } else {
      console.error('카드 데이터 로드 실패:', response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('카드 API 호출 에러:', error);
    // 에러 시 더미 데이터로 폴백
    cards.value = [
      {
        id: 1,
        bank: 'KB국민은행',
        type: '체크',
        name: "KB IT's Your Life 6기 체크",
        amount: 250000,
        cardNumber: '3456',
      },
      {
        id: 2,
        bank: 'KB국민은행',
        type: '신용',
        name: "KB IT's Your Life 6기 신용",
        amount: 250000,
        cardNumber: '3456',
      },
      {
        id: 3,
        bank: 'KB국민은행',
        type: '카드',
        name: "KB IT's Your Life 6기 카드",
        amount: 250000,
        cardNumber: '3456',
      },
    ];
    cardTotalAmount.value = 750000;
  } finally {
    loading.value = false;
  }
};

const onClick = (c) => {
  if (isDeleteMode.value) return toggleSelect(c);
  console.log('카드 클릭 데이터:', c);
  console.log('카드 ID:', c.id);
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

onMounted(() => {
  fetchCards();
});
</script>

<style scoped>
.page {
  height: calc(
    100dvh - 160px
  ); /* 헤더(80px) + 네비게이션(80px) 높이만큼 빼기 */
  background: #f7f8fa;
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
