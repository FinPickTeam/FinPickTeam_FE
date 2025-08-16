<template>
  <div class="financial-term-system">
    <!-- 하이라이팅된 텍스트 -->
    <span v-html="highlightedText" @click="handleClick"></span>

    <!-- 모달 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedTerm }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-definition">{{ selectedDefinition }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

// Props 정의
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  financialTerms: {
    type: Array,
    default: () => [],
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
});

// 내부 상태
const showModal = ref(false);
const selectedTerm = ref('');
const selectedDefinition = ref('');

// 안전한 HTML 이스케이프 함수
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// 용어 하이라이팅 함수
const highlightTerms = (text) => {
  if (!props.isEnabled || !text) return text;

  // 이미 하이라이팅된 텍스트인지 확인
  if (text.includes('highlighted-term')) {
    return text;
  }

  let highlightedText = escapeHtml(text);

  // 용어를 길이 순으로 정렬 (긴 용어부터 매칭)
  const sortedTerms = [...props.financialTerms].sort(
    (a, b) => b.term.length - a.term.length
  );

  sortedTerms.forEach((term) => {
    const escapedTerm = escapeHtml(term.term);
    // HTML 태그 내부를 제외하고 매칭하는 정규식
    const regex = new RegExp(`(?<!<[^>]*?)(${escapedTerm})(?![^<]*?>)`, 'g');

    highlightedText = highlightedText.replace(regex, (match) => {
      return `<span class="highlighted-term" data-term="${escapeHtml(
        term.term
      )}" data-definition="${escapeHtml(term.definition)}">${match}</span>`;
    });
  });

  return highlightedText;
};

// 하이라이팅된 텍스트 계산
const highlightedText = computed(() => {
  if (!props.text) return '';
  return highlightTerms(props.text);
});

// 클릭 이벤트 핸들러
const handleClick = (event) => {
  if (event.target.classList.contains('highlighted-term')) {
    const term = event.target.dataset.term;
    const definition = event.target.dataset.definition;
    selectedTerm.value = term;
    selectedDefinition.value = definition;
    showModal.value = true;
  }
};

// 모달 닫기 함수
const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
.financial-term-system {
  display: contents;
}

/* 하이라이팅 스타일 */
:deep(.highlighted-term) {
  background-color: #fff3cd;
  color: #856404;
  padding: 2px 4px;
  border-radius: 3px;
  cursor: pointer;
  text-decoration: underline;
  transition: background-color 0.2s ease;
}

:deep(.highlighted-term:hover) {
  background-color: #ffeaa7;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 0;
  max-width: 90%;
  width: 400px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 10px 20px;
  border-bottom: 1px solid #eee;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: var(--font-weight-bold);
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.modal-close:hover {
  background-color: #f5f5f5;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.modal-definition {
  margin: 0;
  line-height: 1.6;
  color: #555;
  font-size: 14px;
  font-weight: var(--font-weight-regular);
}
</style>
