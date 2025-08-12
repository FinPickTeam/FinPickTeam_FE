<!-- src/views/openbanking/CardList.vue -->
<template>
  <div class="page">
    <BaseHeader>
      <template #title>내 카드</template>
      <template #right>
        <button class="icon" @click="toggleMode">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </button>
      </template>
    </BaseHeader>

    <section class="summary">
      <div class="label">이번달 카드 사용 내역</div>
      <div class="amount">
        {{ cardTotalAmount.toLocaleString() }}<span>원</span>
      </div>
    </section>

    <section class="group">
      <ListItemCard
        v-for="c in cards"
        :key="c.id"
        :logo="cardLogo(c.bank)"
        :bank="c.bank"
        :badge="c.type"
        badgeClass="bg-card"
        :amount="c.amount"
        :isNegative="c.amount < 0"
        :name="c.name"
        sub="***-***-****"
        :selected="selected.includes(c)"
        @click="onClick(c)"
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

    <div v-if="isDeleteMode" class="fixed-delete">
      <button class="del" :disabled="!selected.length" @click="openConfirm">
        {{ selected.length }}개 카드 삭제
      </button>
    </div>

    <Navbar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BaseHeader from '@/components/openbanking/BaseHeader.vue';
import ListItemCard from '@/components/openbanking/ListItemCard.vue';
import ConfirmModal from '@/components/openbanking/ConfirmModal.vue';
import Navbar from '@/components/Navbar.vue';
import { useSelectDelete } from '@/components/openbanking/useSelectDelete.js';
import { useLogos } from '@/components/openbanking/useLogos.js';
import transactionData from '../Transaction_dummy.json';
import { useRouter } from 'vue-router';

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

const onClick = (c) => {
  if (isDeleteMode.value) return toggleSelect(c);
  router.push({
    name: 'CardDetail',
    params: { cardId: `${c.bank}-${c.type}`, cardData: JSON.stringify(c) },
  });
};

const confirmDelete = () => {
  cards.value = cards.value.filter((c) => !selected.value.includes(c));
  closeConfirm();
  isDeleteMode.value = false;
  selected.value = [];
};

const cardTotalAmount = computed(() => {
  // 당월 카드 출금 합계 (현 코드 유지)
  const now = new Date(),
    y = now.getFullYear(),
    m = now.getMonth();
  return (transactionData?.transactions || [])
    .filter((t) => {
      const d = new Date(t.date);
      const isCard = /체크카드|신용카드|card/i.test(t.account);
      const isThisMonth = d.getFullYear() === y && d.getMonth() === m;
      if (!isCard || !isThisMonth) return false;
      const key = `${t.bank}-${t.account}`;
      return cards.value.some(
        (c) => `${c.bank}-${c.name.replace(c.bank + ' ', '')}` === key
      );
    })
    .reduce((s, t) => s + (t.type === '출금' ? t.amount : 0), 0);
});

onMounted(() => {
  // 기존 로직 간단 이식
  const map = new Map();
  const now = new Date(),
    y = now.getFullYear(),
    m = now.getMonth();
  for (const t of transactionData?.transactions || []) {
    if (!/체크카드|신용카드/.test(t.account)) continue;
    const d = new Date(t.date);
    if (d.getFullYear() !== y || d.getMonth() !== m) continue;
    const key = `${t.bank}-${t.account}`;
    if (!map.has(key))
      map.set(key, {
        id: key,
        name: `${t.bank} ${t.account}`,
        bank: t.bank,
        type: t.account.includes('체크') ? '체크카드' : '신용카드',
        amount: 0,
      });
    if (t.type === '출금') map.get(key).amount += t.amount;
  }
  cards.value = [...map.values()];
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 56px 0 120px;
}
.summary {
  padding-bottom: 120px;
  padding-top: 56px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  height: 100vh;
}

.card-list-container::-webkit-scrollbar {
  display: none;
}

.account-header {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f7f8fa;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 390px;
  z-index: 100;
  padding: 0 16px;
  box-sizing: border-box;
}

.account-back {
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 4px 8px 4px 0;
  border-radius: 8px;
  transition: background 0.15s;
}

.account-back:hover {
  background: #f3f3f3;
}

.account-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}

.account-header-right {
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.account-trash-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #4318d1;
  cursor: pointer;
  padding: 4px 4px;
  border-radius: 8px;
  transition: background 0.15s;
}

.account-trash-btn:hover {
  background: #f3f3f3;
  color: #dc2626;
}

/* 카드 사용 내역 총량 스타일 */
.card-total-section {
  background: #fff;
  margin: 16px;
  padding: 24px 20px;
  border-radius: 18px;
}
.label {
  color: #888;
}
.amount {
  font-size: 2rem;
  font-weight: 700;
  color: #4318d1;
}
.amount span {
  font-size: 1.1rem;
  color: #888;
  margin-left: 4px;
}
.group {
  margin: 0 16px 16px;
}
.bg-card {

.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-item {
  background: #fff;
  border-radius: 18px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.15s;
  border: 2px solid transparent;
}

.card-item-selected {
  border-color: #dc2626;
  background: #fef2f2;
}

.card-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-bank-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-bank-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ececec;
}

.card-bank-name {
  font-size: 1rem;
  font-weight: 600;
  color: #222;
}

.card-type-badge {
  background: #ece9fd;
  color: #4318d1;
} /* 배지 배경만: ListItemCard의 badge에 적용됨 */
.fixed-delete {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 390px;
  width: 100%;
  padding: 0 16px;
}
.del {
  width: 100%;
  background: #dc2626;
  color: #fff;
  border: 0;
  border-radius: 12px;
  padding: 16px;
  font-weight: 600;
}
</style>
