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
      showProgress: true,
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

    // 상품 카드 설명
    await runSteps([
      {
        element: '.product-card:first-child',
        popover: {
          title: '💳 상품 카드 디자인',
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
    }
  };

  // === 개별 투어: 적금 ===
  const startInstallmentTour = async (
    opts = { includeDetail: false, detailId: null }
  ) => {
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

    await goAndWait(router, { name: 'Installment' }, [
      SELECTORS.list.firstCard,
    ]);
    await runSteps([
      {
        element: SELECTORS.list.sort,
        popover: {
          title: '정렬/필터',
          description: '최대 금리, 기간, 자유/정기 적립식 등으로 골라요.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: SELECTORS.list.favHeart,
        popover: {
          title: '찜하기',
          description: '마음에 드는 적금을 저장해 두세요.',
          side: 'left',
          align: 'center',
        },
      },
    ]);

    if (opts.includeDetail && (opts.detailId ?? null) !== null) {
      await goAndWait(
        router,
        { name: 'InstallmentDetail', params: { id: String(opts.detailId) } },
        [SELECTORS.detail.favorite]
      );
      await runSteps([
        {
          element: SELECTORS.detail.favorite,
          popover: {
            title: '상세에서 찜/해제',
            description: '상세 화면에서도 바로 찜 상태를 바꿀 수 있어요.',
            side: 'left',
            align: 'center',
          },
        },
        {
          element: SELECTORS.detail.dictBtn,
          popover: {
            title: '용어사전',
            description: '가산금리/우대조건 등 용어를 바로 확인!',
            side: 'bottom',
            align: 'center',
          },
        },
      ]);
    }
  };

  // === 개별 투어: 펀드 ===
  const startFundTour = async (
    opts = { includeDetail: false, detailId: null }
  ) => {
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

    await goAndWait(router, { name: 'Fund' }, [SELECTORS.list.firstCard]);
    await runSteps([
      {
        element: SELECTORS.list.sort,
        popover: {
          title: '정렬/필터',
          description: '수익률/보수/설정액 등 기준으로 정렬해요.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: SELECTORS.list.favHeart,
        popover: {
          title: '관심 펀드',
          description: '나중에 비교하기 쉽도록 저장해요.',
          side: 'left',
          align: 'center',
        },
      },
    ]);

    if (opts.includeDetail && (opts.detailId ?? null) !== null) {
      await goAndWait(
        router,
        { name: 'FundDetail', params: { id: String(opts.detailId) } },
        [SELECTORS.detail.termToggle]
      );
      await runSteps([
        {
          element: SELECTORS.detail.termToggle,
          popover: {
            title: '용어 하이라이트',
            description: '총보수, 벤치마크 등 핵심 용어를 빠르게 이해!',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: SELECTORS.detail.dictBtn,
          popover: {
            title: '용어사전',
            description: '낯선 용어는 바로 검색해서 확인해요.',
            side: 'bottom',
            align: 'center',
          },
        },
      ]);
    }
  };

  // === 개별 투어: 주식 ===
  const startStockTour = async (
    opts = { includeDetail: false, detailId: null }
  ) => {
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

    await goAndWait(router, { name: 'Stock' }, [SELECTORS.list.firstCard]);
    await runSteps([
      {
        element: SELECTORS.list.sort,
        popover: {
          title: '정렬/필터',
          description: '등락률/시총 등 기준으로 살펴봐요.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: SELECTORS.list.favHeart,
        popover: {
          title: '관심 종목',
          description: '찜해 두면 비교/알림이 더 쉬워져요.',
          side: 'left',
          align: 'center',
        },
      },
    ]);

    if (opts.includeDetail && (opts.detailId ?? null) !== null) {
      await goAndWait(
        router,
        { name: 'StockDetail', params: { id: String(opts.detailId) } },
        [SELECTORS.detail.favorite]
      );
      await runSteps([
        {
          element: SELECTORS.detail.favorite,
          popover: {
            title: '상세에서 찜/해제',
            description: '종목 상세에서도 바로 관리할 수 있어요.',
            side: 'left',
            align: 'center',
          },
        },
        {
          element: SELECTORS.detail.dictBtn,
          popover: {
            title: '용어사전',
            description: 'PER, ROE 등 핵심 지표를 바로 확인!',
            side: 'bottom',
            align: 'center',
          },
        },
      ]);
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
