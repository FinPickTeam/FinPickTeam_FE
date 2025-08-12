<!-- src/views/openbanking/AccountList.vue -->
<template>
  <div class="page">
    <BaseHeader>
      <template #title>내 계좌</template>
      <template #right>
        <button class="icon" @click="toggleMode">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </button>
      </template>
    </BaseHeader>

    <section class="summary">
      <div class="label">총 자산</div>
      <div class="amount" :class="{ negative: totalAssets < 0 }">
        {{ totalAssets.toLocaleString() }}<span>원</span>
      </div>
      <div class="sub">{{ accounts.length }}개 계좌</div>
    </section>

    <section
      v-for="sec in sections"
      :key="sec.key"
      class="group"
      v-if="sec.items.length"
    >
      <h4 class="group-title">{{ sec.title }}</h4>
      <ListItemCard
        v-for="a in sec.items"
        :key="a.id"
        :logo="bankLogo(a.bank)"
        :bank="a.bank"
        :badge="a.type"
        :badgeClass="badgeClass(a.type)"
        :amount="a.balance"
        :isNegative="a.balance < 0"
        :name="a.name"
        :sub="a.accountNumber"
        :selected="selected.includes(a)"
        :disabled="a.type === '투자' && !isDeleteMode"
        @click="onClick(a)"
      />
    </section>

    <ConfirmModal
      :open="showModal"
      title="계좌 삭제"
      @close="closeConfirm"
      @confirm="confirmDelete"
    >
      {{ selected.length }}개의 계좌를 삭제하시겠습니까?
    </ConfirmModal>

    <div v-if="isDeleteMode" class="fixed-delete">
      <button class="del" :disabled="!selected.length" @click="openConfirm">
        선택된 계좌 삭제 ({{ selected.length }}개)
      </button>
    </div>

    <Navbar />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import BaseHeader from '@/components/openbanking/BaseHeader.vue';
import ListItemCard from '@/components/openbanking/ListItemCard.vue';
import ConfirmModal from '@/components/openbanking/ConfirmModal.vue';
import Navbar from '@/components/Navbar.vue';
import { useSelectDelete } from '@/components/openbanking/useSelectDelete.js';
import { useLogos } from '@/components/openbanking/useLogos.js';
import { getAccountsWithTotal } from '@/api/openbanking/accountsApi';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuthStore();
const accounts = ref([]);
const { bankLogo } = useLogos();
const {
  isDeleteMode,
  selected,
  showModal,
  toggleMode,
  toggleSelect,
  openConfirm,
  closeConfirm,
} = useSelectDelete();

const totalAssets = computed(() =>
  accounts.value.reduce((t, a) => t + a.balance, 0)
);
const sections = computed(() => [
  {
    key: 'deposit',
    title: '입출금 계좌',
    items: accounts.value.filter((a) => a.type === '입출금'),
  },
  {
    key: 'savings',
    title: '저축 계좌',
    items: accounts.value.filter((a) => a.type === '저축'),
  },
  {
    key: 'invest',
    title: '투자 계좌',
    items: accounts.value.filter((a) => a.type === '투자'),
  },
]);

const badgeClass = (t) =>
  t === '입출금' ? 'bg-deposit' : t === '저축' ? 'bg-savings' : 'bg-invest';

const onClick = (a) => {
  if (isDeleteMode.value) return toggleSelect(a);
  if (a.type !== '투자') router.push(`/openbanking/account-detail/${a.id}`);
};

const confirmDelete = async () => {
  for (const a of selected.value) await deleteAccount(a.id);
  accounts.value = accounts.value.filter((a) => !selected.value.includes(a));
  closeConfirm();
  isDeleteMode.value = false;
  selected.value = [];
};

onMounted(async () => {
  const res = await getAccountsWithTotal();
  accounts.value = res.data; // res 구조에 맞게 수정
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 56px 0 100px;
}
.summary {
  background: #fff;
  margin: 16px;
  padding: 24px 20px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}
.label {
  color: #888;
}
.amount {
  font-size: 2rem;
  font-weight: 700;
  color: #4318d1;
}
.amount.negative {
  color: #e11d48;
}
.amount span {
  font-size: 1.1rem;
  color: #888;
  margin-left: 4px;
}
.sub {
  color: #666;
  margin-top: 6px;
}
.group {
  margin: 0 16px 24px;
}
.group-title {
  font-weight: 600;
  margin: 16px 0;
}
.bg-deposit {
  background: #4318d1;
}
.bg-savings {
  background: #059669;
}
.bg-invest {
  background: #dc2626;
}
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
