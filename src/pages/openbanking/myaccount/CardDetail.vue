<template>
  <div class="card-detail-container">
    <BaseHeader>
      <template #title>{{ cardInfo.name || '카드 상세' }}</template>
      <template #right>
        <button
          class="icon-btn"
          @click="showFilter = true"
          aria-label="필터 열기"
        >
          <font-awesome-icon :icon="['fas', 'sliders']" />
        </button>
      </template>
    </BaseHeader>

    <!-- 카드 정보 섹션은 기존 코드 유지 -->

    <div class="card-transaction-section">
      <div class="card-transaction-header">
        <div class="card-transaction-title">
          카드 사용 내역 ({{ getPeriodLabel() }})
        </div>
        <div class="transaction-count">{{ filtered.length }}건</div>
      </div>

      <TransactionList
        :items="filtered"
        :getters="{
          title: (t) => t.description ?? t.merchant ?? '거래',
          type: (t) => t.type,
          date: (t) => t.date,
          amount: (t) => t.amount,
        }"
      />
    </div>

    <BasePeriodFilterModal
      v-model="showFilter"
      v-model:period="period"
      v-model:start="start"
      v-model:end="end"
    />
    <Navbar />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import BaseHeader from '@/components/openbanking/BaseHeader.vue';
import BasePeriodFilterModal from '@/components/openbanking/BasePeriodFilterModal.vue';
import TransactionList from '@/components/openbanking/TransactionList.vue';
import Navbar from '@/components/Navbar.vue';
import { usePeriodFilter } from '@/components/openbanking/usePeriodFilter';

// FontAwesome 아이콘 (슬라이더 버튼용)
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
library.add(faSliders);

import data from '../Transaction_dummy.json';

const route = useRoute();
/**
 * 라우트에서 카드 식별 정보 가져오기
 * 예: /card-detail/:cardId? -> "은행-체크카드" 형식
 */
const cardId = route.params.cardId;

const cardInfo = ref({ name: '', bank: '', type: '' });

const period = ref('all');
const start = ref('');
const end = ref('');
const showFilter = ref(false);

const { filterByRange, getPeriodLabel } = usePeriodFilter(period, start, end);

// ✅ 카드에 맞는 거래 선별 (프로젝트 데이터 키에 맞춰 조정)
const cardTransactions = computed(() => {
  const txs = data?.transactions ?? [];
  if (!cardId) return txs;
  // 예시: 트랜잭션에 bank/account(카드명)이 있을 때 "은행-계정명"으로 매칭
  return txs.filter((t) => `${t.bank}-${t.account}` === String(cardId));
});

const filtered = computed(() => filterByRange(cardTransactions.value));
</script>
