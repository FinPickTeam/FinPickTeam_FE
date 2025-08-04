import { ref } from 'vue';

// 금융 용어 사전 로드 및 관리 Composable
export function useFinancialTerms() {
  const financialTerms = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // 금융 용어 사전 로드
  const loadFinancialTerms = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      console.log('금융 용어 사전 로드 시작');
      const response = await fetch(
        '/src/pages/home/financial_dictionary_parsed.json'
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      financialTerms.value = await response.json();
      console.log(
        '금융 용어 사전 로드 완료:',
        financialTerms.value.length,
        '개 용어'
      );
    } catch (err) {
      console.error('금융 용어 사전 로드 실패:', err);
      error.value = err.message;
      financialTerms.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    financialTerms,
    isLoading,
    error,
    loadFinancialTerms,
  };
}
