import { nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

// === 유틸: 특정 셀렉터가 나타날 때까지 대기 ===
function waitForEl(selector, { timeout = 8000, interval = 100 } = {}) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        resolve(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(timer);
        console.warn(`[tour] timeout waiting: ${selector}`);
        reject(new Error('timeout'));
      }
    }, interval);
  });
}

// === 유틸: 보이는지 체크 ===
function isVisible(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  );
}

// === 유틸: 보이는 상태까지 대기 ===
async function waitForVisible(
  selector,
  { timeout = 4000, interval = 80 } = {}
) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = document.querySelector(selector);
    if (isVisible(el)) return el;
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`[tour] visible timeout: ${selector}`);
}

// === 유틸: 현재 라우트 이동 후 DOM 안정화 ===
async function goAndWait(router, to, mustSelectors = []) {
  await router.push(to);
  await nextTick();
  for (const sel of mustSelectors) {
    try {
      await waitForEl(sel);
    } catch {
      /* skip if not found */
    }
  }
}

// === 유틸: 스텝 실행(끝날 때까지 대기) ===
function runSteps(steps, opts = {}) {
  return new Promise((resolve) => {
    const d = driver({
      showProgress: false,
      overlayOpacity: 0.6,
      nextBtnText: '다음',
      prevBtnText: '이전',
      doneBtnText: '완료',
      allowClose: true,
      steps, // 여기서 바로 steps 주입
      onDestroyed: () => resolve(), // 투어 종료/닫힘 시 해제
      ...opts,
    });
    d.drive(); // ← start()가 아니라 drive()
  });
}

// === 셀렉터 맵: 화면별로 하이라이트할 기본 타겟들 ===
const SELECTORS = {
  // FinanceHome
  tab: {
    deposit: '.grid-btn:first-child',
    installment: '.grid-btn:nth-child(2)',
    fund: '.grid-btn:nth-child(3)',
    stock: '.grid-btn:nth-child(4)',
  },
  // 공통(목록 화면)
  list: {
    firstCard: '.product-card', // 카드 컨테이너
    favHeart: '.product-card .heart',
    sort: '#filter-rate, #sort-rate, [data-tour="sort"]', // 있는 것부터 매치
    search: '#search, #search-input, [data-tour="search"]',
  },
  // (선택) 상세 화면
  detail: {
    termToggle: '.toggle-section',
    dictBtn: '#btn-dictionary',
    favorite: '.detail-header .heart, .heart-icon',
  },
};

export function useFinanceRouteTours() {
  const router = useRouter();

  // === 개별 투어: 예금 ===
  const startDepositTour = async (
    opts = { includeDetail: false, detailId: null }
  ) => {
    // 1) 재테크 홈
    await goAndWait(router, { name: 'FinanceHome' }, [SELECTORS.tab.deposit]);
    await runSteps([
      {
        element: SELECTORS.tab.deposit,
        popover: {
          title: '💰 예금 서비스',
          description:
            '예금 버튼을 클릭하면 다양한 예금 상품을 확인할 수 있어요!',
          side: 'bottom',
          align: 'center',
        },
      },
    ]);

    // 2) 예금 목록
    await goAndWait(router, { name: 'Deposit' }, [
      '.subtab-row',
      '.amount-period-card',
    ]);
    await runSteps([
      {
        element: '.subtab-row .subtab:first-child',
        popover: {
          title: '📊 추천 상품',
          description: '추천 탭에서는 사용자 맞춤 상품을 확인할 수 있어요!',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '.amount-period-card',
        popover: {
          title: '💡 투자 조건 설정',
          description: '투자 금액과 기간을 설정하면 맞춤 상품을 찾아드려요!',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '.prefer-row',
        popover: {
          title: '🎯 우대 조건 선택',
          description:
            '급여이체, 카드실적 등 우대 조건을 선택하면 더 높은 금리를 받을 수 있어요!',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '.search-btn',
        popover: {
          title: '🔍 AI 추천 시스템',
          description:
            '선택한 조건과 투자 성향을 종합 분석해서 최적의 상품을 추천해드려요!',
          side: 'top',
          align: 'center',
        },
      },
    ]);

    // 실제로 전체보기 탭 클릭
    const allViewTab = document.querySelector('.subtab-row .subtab:last-child');
    if (allViewTab) {
      allViewTab.click();
    }
    // 3) 전체보기 탭 클릭 후 전체보기 설명
    await runSteps([
      {
        element: '.subtab-row .subtab:last-child',
        popover: {
          title: '📋 전체보기 탭',
          description:
            '전체보기 탭을 클릭하면 모든 예금 상품을 확인할 수 있어요!',
          side: 'bottom',
          align: 'center',
        },
      },
    ]);

    // 탭 전환 후 전체보기 화면이 로드될 때까지 대기
    try {
      await waitForEl('.search-filter-row', { timeout: 5000 });
    } catch (error) {
      console.warn('전체보기 화면을 찾을 수 없습니다:', error);
    }

    // 전체보기 화면 설명
    await runSteps([
      {
        element: '.search-filter-row',
        popover: {
          title: '🔍 예금 검색창',
          description:
            '검색창과 필터 버튼을 통해 원하는 상품을 쉽게 찾을 수 있어요!',
          side: 'top',
          align: 'center',
        },
      },
    ]);

    // 상품 카드가 로드될 때까지 대기
    try {
      await waitForEl('.product-card:first-child', { timeout: 5000 });
    } catch (error) {
      console.warn('전체보기 탭의 상품 카드를 찾을 수 없습니다:', error);
    }

    // 상품 카드 설명
    await runSteps([
      {
        element: '.product-card:first-child',
        popover: {
          title: '💳 예금 상품 카드',
          description:
            '은행 로고, 상품명, 금리 정보가 한눈에 보기 쉽게 구성되어 있어요!',
          side: 'left',
          align: 'center',
        },
      },
    ]);

    // 3) (선택) 예금 상세
    if (opts.includeDetail && (opts.detailId ?? null) !== null) {
      await goAndWait(
        router,
        { name: 'DepositDetail', params: { id: String(opts.detailId) } },
        [SELECTORS.detail.termToggle]
      );
      await runSteps([
        {
          element: SELECTORS.detail.termToggle,
          popover: {
            title: '🔮 단어 마법사',
            description:
              '금융 용어에 마우스를 올리면 쉽게 이해할 수 있도록 설명해드려요!',
            side: 'bottom',
            align: 'center',
          },
        },
      ]);

      // 예금 상세 페이지 설명 완료 후 FinanceHome으로 돌아가기
      await goAndWait(router, { name: 'FinanceHome' }, [SELECTORS.tab.deposit]);
    }
  };

  // === 개별 투어: 적금 ===
  const startInstallmentTour = async (
    opts = { includeDetail: false, detailId: null }
  ) => {
    // 1) 재테크 홈
    await goAndWait(router, { name: 'FinanceHome' }, [
      SELECTORS.tab.installment,
    ]);
    await runSteps([
      {
        element: SELECTORS.tab.installment,
        popover: {
          title: '💰 적금 서비스',
          description:
            '적금 버튼을 클릭하면 다양한 적금 상품을 확인할 수 있어요!',
          side: 'bottom',
          align: 'center',
        },
      },
    ]);

    // 2) 적금 목록 (추천 탭)
    await goAndWait(router, { name: 'Installment' }, [
      '.subtab-row',
      '.period-amount-card',
    ]);
    await runSteps([
      {
        element: '.subtab-row .subtab:first-child',
        popover: {
          title: '📊 추천 적금',
          description:
            '추천 탭에서는 사용자 맞춤 적금 상품을 확인할 수 있어요!',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '.period-amount-card',
        popover: {
          title: '💡 투자 조건 설정',
          description: '투자 금액과 기간을 설정하면 맞춤 상품을 찾아드려요!',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '.prefer-row',
        popover: {
          title: '🎯 우대 조건 선택',
          description:
            '급여이체, 카드실적 등 우대 조건을 선택하면 더 높은 금리를 받을 수 있어요!',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '.search-btn',
        popover: {
          title: '🔍 AI 추천 시스템',
          description:
            '선택한 우대 조건과 사용자의 투자 성향을 종합 분석해 적금 상품을 추천합니다!',
          side: 'top',
          align: 'center',
        },
      },
    ]);

    // 실제로 전체보기 탭 클릭
    const allViewTab = document.querySelector('.subtab-row .subtab:last-child');
    if (allViewTab) {
      allViewTab.click();
    }

    // 3) 전체보기 탭 클릭 후 전체보기 설명
    await runSteps([
      {
        element: '.subtab-row .subtab:last-child',
        popover: {
          title: '📋 전체보기 탭',
          description:
            '전체보기 탭을 클릭하면 모든 적금 상품을 확인할 수 있어요!',
          side: 'bottom',
          align: 'center',
        },
      },
    ]);

    // 탭 전환 후 전체보기 화면이 로드될 때까지 대기
    try {
      await waitForEl('.search-filter-row', { timeout: 5000 });
    } catch (error) {
      console.warn('전체보기 화면을 찾을 수 없습니다:', error);
    }

    // 전체보기 화면 설명
    await runSteps([
      {
        element: '.search-filter-row',
        popover: {
          title: '🔍 전체보기 화면',
          description:
            '검색창과 필터 버튼을 통해 원하는 상품을 쉽게 찾을 수 있어요!',
          side: 'top',
          align: 'center',
        },
      },
    ]);

    // 상품 카드가 로드될 때까지 대기
    try {
      await waitForEl('.product-card:first-child', { timeout: 5000 });
    } catch (error) {
      console.warn('전체보기 탭의 상품 카드를 찾을 수 없습니다:', error);
    }

    // 5) 상품 카드 설명
    await runSteps([
      {
        element: '.product-card:first-child',
        popover: {
          title: '💳 적금 상품 카드',
          description:
            '은행 로고, 상품명, 금리 정보가 한눈에 보기 쉽게 구성되어 있어요!',
          side: 'left',
          align: 'center',
        },
      },
    ]);

    // 6) (선택) 적금 상세
    if (opts.includeDetail && (opts.detailId ?? null) !== null) {
      await goAndWait(
        router,
        { name: 'InstallmentDetail', params: { id: String(opts.detailId) } },
        [SELECTORS.detail.termToggle]
      );
      await runSteps([
        {
          element: SELECTORS.detail.termToggle,
          popover: {
            title: '🔮 단어 마법사',
            description:
              '금융 용어에 마우스를 올리면 쉽게 이해할 수 있도록 설명해드려요!',
            side: 'bottom',
            align: 'center',
          },
        },
      ]);

      // 적금 상세 페이지 설명 완료 후 FinanceHome으로 돌아가기
      await goAndWait(router, { name: 'FinanceHome' }, [
        SELECTORS.tab.installment,
      ]);
    }
  };

  // === 개별 투어: 펀드 ===
  const startFundTour = async (
    opts = { includeDetail: false, detailId: null }
  ) => {
    // 1) 재테크 홈
    await goAndWait(router, { name: 'FinanceHome' }, [SELECTORS.tab.fund]);
    await runSteps([
      {
        element: SELECTORS.tab.fund,
        popover: {
          title: '💰 펀드 서비스',
          description:
            '펀드 버튼을 클릭하면 다양한 펀드 상품을 확인할 수 있어요!',
          side: 'bottom',
          align: 'center',
        },
      },
    ]);

    // 2) 펀드 목록 (추천 탭)
    await goAndWait(router, { name: 'Fund' }, [
      '.subtab-row',
      '.btn-outline.with-icon',
    ]);
    await runSteps([
      {
        element: '.subtab-row .subtab:first-child',
        popover: {
          title: '📊 추천 펀드',
          description:
            '추천 탭에서는 사용자 맞춤 펀드 상품을 확인할 수 있어요!',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '.btn-outline.with-icon',
        popover: {
          title: '🔍 AI 펀드 추천',
          description:
            '시장 흐름과 상품 특성을 고려하여, 사용자의 투자 성향에 맞게 추천해줍니다!',
          side: 'top',
          align: 'center',
        },
      },
    ]);

    // 실제로 전체보기 탭 클릭
    const allViewTab = document.querySelector('.subtab-row .subtab:last-child');
    if (allViewTab) {
      allViewTab.click();
    }

    // 3) 전체보기 탭 클릭 후 전체보기 설명
    await runSteps([
      {
        element: '.subtab-row .subtab:last-child',
        popover: {
          title: '📋 전체보기 탭',
          description:
            '전체보기 탭을 클릭하면 모든 펀드 상품을 확인할 수 있어요!',
          side: 'bottom',
          align: 'center',
        },
      },
    ]);

    // 탭 전환 후 전체보기 화면이 로드될 때까지 대기
    try {
      await waitForEl('.search-filter-row', { timeout: 5000 });
    } catch (error) {
      console.warn('전체보기 화면을 찾을 수 없습니다:', error);
    }

    // 4) 전체보기 화면 검색/필터 설명
    await runSteps([
      {
        element: '.search-filter-row',
        popover: {
          title: '🔍 검색 + 필터 기능',
          description:
            '펀드명으로 검색하고, 펀드 유형과 위험도로 필터링할 수 있어요!',
          side: 'top',
          align: 'center',
        },
      },
    ]);

    // 상품 카드가 로드될 때까지 대기
    try {
      await waitForEl('.product-card:first-child', { timeout: 5000 });
    } catch (error) {
      console.warn('전체보기 탭의 상품 카드를 찾을 수 없습니다:', error);
    }

    // 5) 펀드 상품 카드 설명
    await runSteps([
      {
        element: '.product-card:first-child',
        popover: {
          title: '💳 펀드 상품 추천 카드',
          description:
            '펀드사, 상품명, 수익률, 위험도 정보가 한눈에 보기 쉽게 구성되어 있어요!',
          side: 'left',
          align: 'center',
        },
      },
    ]);

    // 6) (선택) 펀드 상세
    if (opts.includeDetail && (opts.detailId ?? null) !== null) {
      await goAndWait(
        router,
        { name: 'FundDetail', params: { id: String(opts.detailId) } },
        ['.chart-card', SELECTORS.detail.termToggle]
      );
      await runSteps([
        {
          element: '.chart-card',
          popover: {
            title: '📈 펀드 차트',
            description:
              '펀드의 수익률 변화를 시각적으로 확인할 수 있어요! 과거 성과를 통해 투자 판단에 도움을 받을 수 있습니다.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: SELECTORS.detail.termToggle,
          popover: {
            title: '🔮 단어 마법사',
            description:
              '금융 용어에 마우스를 올리면 쉽게 이해할 수 있도록 설명해드려요!',
            side: 'bottom',
            align: 'center',
          },
        },
      ]);

      // 펀드 상세 페이지 설명 완료 후 FinanceHome으로 돌아가기
      await goAndWait(router, { name: 'FinanceHome' }, [SELECTORS.tab.fund]);
    }
  };

  // === 개별 투어: 주식 ===
  const startStockTour = async (
    opts = { includeDetail: false, detailId: null }
  ) => {
    // 1) 재테크 홈
    await goAndWait(router, { name: 'FinanceHome' }, [SELECTORS.tab.stock]);
    await runSteps([
      {
        element: SELECTORS.tab.stock,
        popover: {
          title: '💰 주식 서비스',
          description:
            '주식 버튼을 클릭하면 다양한 주식 정보를 확인할 수 있어요!',
          side: 'bottom',
          align: 'center',
        },
      },
    ]);

    // 2) 주식 목록 (추천 탭)
    await goAndWait(router, { name: 'Stock' }, [
      '.subtab-row',
      '.btn-outline.with-icon',
    ]);
    await runSteps([
      {
        element: '.subtab-row .subtab:first-child',
        popover: {
          title: '📊 추천 주식',
          description:
            '추천 탭에서는 사용자 맞춤 주식 상품을 확인할 수 있어요!',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '.btn-outline.with-icon',
        popover: {
          title: '🔍 AI 주식 추천',
          description:
            '시장 흐름과 상품 특성을 고려하여, 사용자의 투자 성향에 맞게 추천해줍니다!',
          side: 'top',
          align: 'center',
        },
      },
    ]);

    // 실제로 전체보기 탭 클릭
    const allViewTab = document.querySelector('.subtab-row .subtab:last-child');
    if (allViewTab) {
      allViewTab.click();
    }

    // 3) 전체보기 탭 클릭 후 전체보기 설명
    await runSteps([
      {
        element: '.subtab-row .subtab:last-child',
        popover: {
          title: '📋 전체보기 탭',
          description:
            '전체보기 탭을 클릭하면 모든 주식 상품을 확인할 수 있어요!',
          side: 'bottom',
          align: 'center',
        },
      },
    ]);

    // 탭 전환 후 전체보기 화면이 로드될 때까지 대기
    try {
      await waitForEl('.search-filter-row', { timeout: 5000 });
    } catch (error) {
      console.warn('전체보기 화면을 찾을 수 없습니다:', error);
    }

    // 4) 전체보기 화면 검색/필터 설명
    await runSteps([
      {
        element: '.search-filter-row',
        popover: {
          title: '🔍 검색 + 필터 기능',
          description:
            '주식명으로 검색하고, 업종과 시가총액으로 필터링할 수 있어요!',
          side: 'top',
          align: 'center',
        },
      },
    ]);

    // 상품 카드가 로드될 때까지 대기
    try {
      await waitForEl('.product-card:first-child', { timeout: 5000 });
    } catch (error) {
      console.warn('전체보기 탭의 상품 카드를 찾을 수 없습니다:', error);
    }

    // 5) 주식 상품 카드 설명
    await runSteps([
      {
        element: '.product-card:first-child',
        popover: {
          title: '💳 주식 상품 추천 카드',
          description:
            '기업명, 종목코드, 현재가, 등락률 정보가 한눈에 보기 쉽게 구성되어 있어요!',
          side: 'left',
          align: 'center',
        },
      },
    ]);

    // 6) (선택) 주식 상세
    if (opts.includeDetail && (opts.detailId ?? null) !== null) {
      await goAndWait(
        router,
        { name: 'StockDetail', params: { id: String(opts.detailId) } },
        [SELECTORS.detail.termToggle]
      );
      await runSteps([
        {
          element: SELECTORS.detail.termToggle,
          popover: {
            title: '🔮 단어 마법사',
            description:
              '금융 용어에 마우스를 올리면 쉽게 이해할 수 있도록 설명해드려요!',
            side: 'bottom',
            align: 'center',
          },
        },
      ]);

      // 주식 상세 페이지 설명 완료 후 FinanceHome으로 돌아가기
      await goAndWait(router, { name: 'FinanceHome' }, [SELECTORS.tab.stock]);
    }
  };

  // === 일괄 실행(원하면 순차 재생) ===
  const startAllFinanceTours = async () => {
    await startDepositTour();
    await startInstallmentTour();
    await startFundTour();
    await startStockTour();
  };

  return {
    startDepositTour,
    startInstallmentTour,
    startFundTour,
    startStockTour,
    startAllFinanceTours,
  };
}
