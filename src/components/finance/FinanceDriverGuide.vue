<template>
  <div v-if="isVisible" class="driver-guide-overlay">
    <!-- Driver.js가 자동으로 생성하는 요소들이 여기에 렌더링됩니다 -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['finish']);

let driverInstance = null;

// 가이드 단계 정의
const steps = [
  {
    element: '.button-grid',
    popover: {
      title: '재테크 서비스',
      description: '다양한 투자 상품을 한눈에 확인하고 비교해보세요!',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '.grid-btn:nth-child(1)',
    popover: {
      title: '예금',
      description:
        '안전하고 안정적인 예금 상품을 비교해보세요. 금리, 만기, 입금 조건을 한눈에 확인할 수 있습니다.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '.grid-btn:nth-child(2)',
    popover: {
      title: '적금',
      description:
        '월 적립 금액별로 최적의 적금 상품을 찾아보세요. 만기 시 받을 수 있는 금액도 미리 계산해볼 수 있습니다.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '.grid-btn:nth-child(3)',
    popover: {
      title: '펀드',
      description:
        '펀드 종류별 위험도와 수익률을 분석하고, 투자 성향에 맞는 펀드를 추천받아보세요.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '.grid-btn:nth-child(4)',
    popover: {
      title: '주식',
      description:
        '주요 종목별 실시간 정보와 기업 재무제표를 확인하고, 맞춤 포트폴리오를 제안받아보세요.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '.guide-buttons',
    popover: {
      title: '가이드 옵션',
      description:
        '단계별 가이드로 각 기능을 하나씩 살펴보거나, 이용 가이드에서 전체적인 사용법을 확인할 수 있습니다.',
      side: 'top',
      align: 'center',
    },
  },
];

// Driver.js 설정
const driverConfig = {
  animate: true,
  opacity: 0.75,
  padding: 10,
  allowClose: true,
  overlayClickNext: false,
  doneBtnText: '완료',
  closeBtnText: '닫기',
  nextBtnText: '다음',
  prevBtnText: '이전',
  showButtons: ['previous', 'next', 'close'],
  steps: steps,
  onComplete: () => {
    emit('finish');
  },
  onCloseClick: () => {
    emit('finish');
  },
};

// 가이드 시작
function startGuide() {
  if (driverInstance) {
    driverInstance.destroy();
  }

  driverInstance = driver(driverConfig);
  driverInstance.drive();
}

// 가이드 중지
function stopGuide() {
  if (driverInstance) {
    driverInstance.destroy();
    driverInstance = null;
  }
}

// props.isVisible 변경 감지
watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue) {
      // DOM이 업데이트된 후 가이드 시작
      setTimeout(() => {
        startGuide();
      }, 100);
    } else {
      stopGuide();
    }
  }
);

// 컴포넌트 언마운트 시 정리
onBeforeUnmount(() => {
  stopGuide();
});
</script>

<style scoped>
.driver-guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  pointer-events: none;
}

/* Driver.js 커스텀 스타일 */
:deep(.driver-popover) {
  background: linear-gradient(
    135deg,
    var(--color-main, #6b46c1),
    var(--color-main-dark, #553c9a)
  );
  color: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: none;
  max-width: 320px;
}

:deep(.driver-popover-title) {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: white;
}

:deep(.driver-popover-description) {
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 16px;
}

:deep(.driver-popover-footer) {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

:deep(.driver-popover-btn) {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

:deep(.driver-popover-btn.driver-prev-btn) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:deep(.driver-popover-btn.driver-prev-btn:hover) {
  background: rgba(255, 255, 255, 0.3);
}

:deep(.driver-popover-btn.driver-next-btn) {
  background: white;
  color: var(--color-main, #6b46c1);
}

:deep(.driver-popover-btn.driver-next-btn:hover) {
  background: rgba(255, 255, 255, 0.9);
}

:deep(.driver-popover-btn.driver-close-btn) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.driver-popover-btn.driver-close-btn:hover) {
  background: rgba(255, 255, 255, 0.2);
}

:deep(.driver-stage) {
  background: rgba(0, 0, 0, 0.75);
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  :deep(.driver-popover) {
    max-width: 280px;
    margin: 0 16px;
  }

  :deep(.driver-popover-title) {
    font-size: 16px;
  }

  :deep(.driver-popover-description) {
    font-size: 13px;
  }

  :deep(.driver-popover-btn) {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>
