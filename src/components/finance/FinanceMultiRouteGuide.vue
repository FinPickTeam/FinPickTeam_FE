<template>
  <div v-if="isVisible" class="multi-route-guide-overlay">
    <!-- 가이드 진행 상태 표시 -->
    <div class="guide-progress">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <div class="progress-text">{{ currentStep + 1 }} / {{ totalSteps }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useFinanceRouteTours } from '@/composables/useFinanceRouteTours';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['finish']);

const currentStep = ref(0);
const isRunning = ref(false);

const { startDepositTour } = useFinanceRouteTours();

const totalSteps = 9; // 예금 투어의 총 단계 수

const progressPercentage = computed(() => {
  return ((currentStep.value + 1) / totalSteps) * 100;
});

// 가이드 시작
async function startGuide() {
  if (isRunning.value) return;

  isRunning.value = true;
  currentStep.value = 0;

  try {
    // 예금 투어 시작 (상세 페이지 포함)
    await startDepositTour({
      includeDetail: true,
      detailId: '1', // 실제 상품 ID로 변경 필요
    });

    // 가이드 완료
    emit('finish');
  } catch (error) {
    console.error('Tour error:', error);
    emit('finish');
  } finally {
    isRunning.value = false;
  }
}

// 가이드 중지
function stopGuide() {
  isRunning.value = false;
}

// props.isVisible 감시
watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue) {
      setTimeout(() => {
        startGuide();
      }, 100);
    } else {
      stopGuide();
    }
  }
);

onMounted(() => {
  if (props.isVisible) {
    setTimeout(() => {
      startGuide();
    }, 100);
  }
});

onBeforeUnmount(() => {
  stopGuide();
});
</script>

<style scoped>
.multi-route-guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: none;
}

.guide-progress {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10000;
  pointer-events: auto;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-main, #6b46c1),
    var(--color-main-dark, #553c9a)
  );
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

/* Driver.js 커스텀 스타일 */
:deep(.driver-popover) {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: none;
  max-width: 350px;
}

:deep(.driver-popover-title) {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-main, #6b46c1);
  margin-bottom: 8px;
}

:deep(.driver-popover-description) {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 16px;
}

:deep(.driver-popover-footer) {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

:deep(.driver-popover-btn) {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

:deep(.driver-popover-btn.driver-prev-btn) {
  background: rgba(107, 70, 193, 0.1);
  color: var(--color-main, #6b46c1);
}

:deep(.driver-popover-btn.driver-prev-btn:hover) {
  background: rgba(107, 70, 193, 0.2);
}

:deep(.driver-popover-btn.driver-next-btn) {
  background: var(--color-main, #6b46c1);
  color: white;
}

:deep(.driver-popover-btn.driver-next-btn:hover) {
  background: var(--color-main-dark, #553c9a);
}

:deep(.driver-popover-btn.driver-close-btn) {
  background: #f1f5f9;
  color: #64748b;
}

:deep(.driver-popover-btn.driver-close-btn:hover) {
  background: #e2e8f0;
}

:deep(.driver-stage) {
  background: rgba(107, 70, 193, 0.1);
  border: 2px solid var(--color-main, #6b46c1);
  border-radius: 8px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .guide-progress {
    top: 10px;
    padding: 8px 16px;
    gap: 8px;
  }

  .progress-bar {
    width: 150px;
  }

  .progress-text {
    font-size: 12px;
  }

  :deep(.driver-popover) {
    max-width: 280px;
    margin: 10px;
  }

  :deep(.driver-popover-title) {
    font-size: 14px;
  }

  :deep(.driver-popover-description) {
    font-size: 13px;
  }
}
</style>
