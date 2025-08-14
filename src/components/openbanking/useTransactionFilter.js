// useTransactionFilter.js (교체본)
import { computed, ref, watch, onMounted } from 'vue';
import { getLedger } from '@/api/openbanking/ledgerApi.js';

export function useTransactionFilter() {
  // 기준 날짜
  const selectedDate = ref(new Date());
  const currentYear = ref(selectedDate.value.getFullYear());
  const currentMonth = ref(selectedDate.value.getMonth() + 1);

  // 저장소
  const selectedDateTransactions = ref([]); // 해당 월 전체 원본
  const currentMonthConsumption = ref(0);
  const prevMonthConsumption = ref(0);

  // 유틸
  const ymd = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // 지출 합계 계산
  const sumExpense = (list) => {
    return (list || [])
      .filter((t) => t.type === 'EXPENSE')
      .reduce((a, b) => a + Number(b.amount || 0), 0);
  };

  // API 호출
  const fetchLedger = async (params) => {
    try {
      const response = await getLedger(params);
      const list = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      return list;
    } catch (error) {
      console.error('거래내역 조회 실패:', error);
      return [];
    }
  };

  // 선택된 월 기준으로 현재월 + 전월 데이터 로드
  const loadMonth = async (year, month) => {
    currentYear.value = year;
    currentMonth.value = month;

    // 1) 현재월 거래/합계
    const from = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).getDate();
    const to = `${year}-${String(month).padStart(2, '0')}-${endDate}`;

    const cur = await fetchLedger({ from, to });
    selectedDateTransactions.value = cur;
    currentMonthConsumption.value = sumExpense(cur);

    // 2) 전월 거래/합계
    const prev = new Date(year, month - 1, 1);
    const py = prev.getFullYear();
    const pm = prev.getMonth() + 1;
    const pFrom = `${py}-${String(pm).padStart(2, '0')}-01`;
    const pEnd = new Date(py, pm, 0).getDate();
    const pTo = `${py}-${String(pm).padStart(2, '0')}-${pEnd}`;

    const prv = await fetchLedger({ from: pFrom, to: pTo });
    prevMonthConsumption.value = sumExpense(prv);
  };

  // 월별 차이 텍스트
  const monthlyDiffText = computed(() => {
    const diff = currentMonthConsumption.value - prevMonthConsumption.value;
    if (diff === 0) return '같이';
    return `${Math.abs(diff).toLocaleString()}원 ${diff > 0 ? '더' : '덜'}`;
  });

  // 액션
  const selectDate = (date) => {
    selectedDate.value = new Date(date);
  };

  const changeMonth = (y, m) => {
    loadMonth(y, m);
  };

  // 초기 로드
  onMounted(() => {
    loadMonth(currentYear.value, currentMonth.value);
  });

  return {
    selectedDate,
    currentYear,
    currentMonth,
    selectedDateTransactions,
    currentMonthConsumption,
    prevMonthConsumption,
    monthlyDiffText,
    selectDate,
    changeMonth,
  };
}
