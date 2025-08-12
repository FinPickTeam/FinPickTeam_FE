<!-- src/views/openbanking/AccountList.vue -->
<template>
  <div class="page">
    <BaseHeader>
      <template #title>내 계좌</template>
      <template #right>
        <button class="header-icon-btn" @click="toggleMode">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </button>
      </template>
    </BaseHeader>

    <AssetSummaryCard
      title="총 자산"
      :amount="totalAssets"
      :subtitle="`${accounts.length || 0}개 계좌`"
    />

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>계좌 정보를 불러오는 중...</p>
    </div>

    <template v-else>
      <template v-for="(sec, index) in sections" :key="sec.key || index">
        <section v-if="sec.items && sec.items.length" class="group">
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
      </template>
    </template>

    <ConfirmModal
      :open="showModal"
      title="계좌 삭제"
      @close="closeConfirm"
      @confirm="confirmDelete"
    >
      {{ selected.length }}개의 계좌를 삭제하시겠습니까?
    </ConfirmModal>

    <DeleteModeFooter
      :is-delete-mode="isDeleteMode"
      :selected-count="selected.length"
      item-type="계좌"
      @delete="openConfirm"
    />

    <Navbar />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
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
import {
  getAccountsWithTotal,
  deleteAccount,
} from '@/api/openbanking/accountsApi';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

// FontAwesome 아이콘 등록
library.add(faTrash);

const router = useRouter();
const auth = useAuthStore();
const accounts = ref([]);
const loading = ref(false);
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

const totalAssets = computed(() => {
  if (!accounts.value || accounts.value.length === 0) {
    return 0;
  }
  return accounts.value.reduce((t, a) => t + (a.balance || 0), 0);
});
const sections = computed(() => {
  if (!accounts.value || accounts.value.length === 0) {
    console.log('계좌 데이터가 없음');
    return [];
  }

  const depositAccounts =
    accounts.value.filter((a) => a.type === '입출금') || [];
  const savingsAccounts = accounts.value.filter((a) => a.type === '저축') || [];
  const investAccounts = accounts.value.filter((a) => a.type === '투자') || [];

  console.log('필터링된 계좌:', {
    deposit: depositAccounts,
    savings: savingsAccounts,
    invest: investAccounts,
  });

  const sections = [];

  if (depositAccounts.length > 0) {
    sections.push({
      key: 'deposit',
      title: '입출금 계좌',
      items: depositAccounts,
    });
  }

  if (savingsAccounts.length > 0) {
    sections.push({
      key: 'savings',
      title: '저축 계좌',
      items: savingsAccounts,
    });
  }

  if (investAccounts.length > 0) {
    sections.push({
      key: 'invest',
      title: '투자 계좌',
      items: investAccounts,
    });
  }

  console.log('생성된 sections:', sections);
  return sections;
});

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
  try {
    loading.value = true;
    const res = await getAccountsWithTotal();
    console.log('계좌 데이터:', res.data);

    if (res.data.status === 200) {
      // API 응답 구조: data.accounts 형태
      const apiData = res.data.data;
      const apiAccounts = apiData?.accounts || [];
      console.log('계좌 배열:', apiAccounts);

      // API 응답 구조에 맞게 데이터 변환
      accounts.value = apiAccounts.map((account) => ({
        id: account.id,
        bank: account.productName?.split(' ')[0] || '은행',
        type: account.accountType === 'DEPOSIT' ? '입출금' : '저축',
        name: account.productName || '계좌',
        balance: account.balance || 0,
        accountNumber: account.accountNumber || '****',
      }));

      console.log('변환된 계좌 데이터:', accounts.value);
    } else {
      console.error('계좌 데이터 로드 실패:', res.data.message);
    }
  } catch (error) {
    console.error('계좌 API 호출 에러:', error);
    // 에러 시 더미 데이터로 폴백
    accounts.value = [
      {
        id: 1,
        bank: 'KB국민은행',
        type: '입출금',
        name: "KB IT's Your Life 6기 통장",
        balance: 5023400,
        accountNumber: '3020-****-3748',
      },
    ];
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.page {
  height: calc(100dvh - 160px); /* 헤더(80px) + 네비게이션(80px) 높이만큼 빼기 */
  background: #f7f8fa;
  padding: 16px;
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
