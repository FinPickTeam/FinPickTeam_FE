<template>
  <div class="dictionary-scroll-container">
    <div class="dictionary-container">
      <div class="dictionary-header-bar">
        <button class="back-btn" @click="goBack">
          <font-awesome-icon :icon="['fas', 'angle-left']" />
        </button>
        <span class="dictionary-header-title">금융 용어 사전</span>
      </div>
      <!-- 검색 영역 -->
      <div class="search-section">
        <div class="search-box">
          <input
            v-model="searchTerm"
            @input="filterTerms"
            @keyup.enter="onEnterSearch"
            @focus="toggleHistory"
            @blur="onBlurInput"
            type="text"
            placeholder="용어를 검색해보세요..."
            class="search-input"
          />
          <!-- 검색 버튼 제거 -->
        </div>
        <div
          v-if="showHistory && searchHistory.length"
          class="search-history-box"
        >
          <div
            v-for="(item, idx) in searchHistory"
            :key="idx"
            class="search-history-item"
          >
            <span @mousedown.prevent="selectHistory(item)">{{ item }}</span>
            <button
              class="delete-history-btn"
              @mousedown.prevent="deleteHistory(idx)"
            >
              ×
            </button>
          </div>
        </div>
        <div class="search-stats">
          총 {{ totalTerms }}개 용어 중 {{ filteredTerms.length }}개 검색됨
        </div>
      </div>

      <!-- 필터 옵션 -->
      <div class="filter-section">
        <div class="filter-options">
          <button
            @click="setFilter('all')"
            :class="['filter-btn', { active: currentFilter === 'all' }]"
          >
            전체
          </button>
          <button
            @click="setFilter('ㄱ')"
            :class="['filter-btn', { active: currentFilter === 'ㄱ' }]"
          >
            ㄱ
          </button>
          <button
            @click="setFilter('ㄴ')"
            :class="['filter-btn', { active: currentFilter === 'ㄴ' }]"
          >
            ㄴ
          </button>
          <button
            @click="setFilter('ㄷ')"
            :class="['filter-btn', { active: currentFilter === 'ㄷ' }]"
          >
            ㄷ
          </button>
          <button
            @click="setFilter('ㄹ')"
            :class="['filter-btn', { active: currentFilter === 'ㄹ' }]"
          >
            ㄹ
          </button>
          <button
            @click="setFilter('ㅁ')"
            :class="['filter-btn', { active: currentFilter === 'ㅁ' }]"
          >
            ㅁ
          </button>
          <button
            @click="setFilter('ㅂ')"
            :class="['filter-btn', { active: currentFilter === 'ㅂ' }]"
          >
            ㅂ
          </button>
          <button
            @click="setFilter('ㅅ')"
            :class="['filter-btn', { active: currentFilter === 'ㅅ' }]"
          >
            ㅅ
          </button>
          <button
            @click="setFilter('ㅇ')"
            :class="['filter-btn', { active: currentFilter === 'ㅇ' }]"
          >
            ㅇ
          </button>
          <button
            @click="setFilter('ㅈ')"
            :class="['filter-btn', { active: currentFilter === 'ㅈ' }]"
          >
            ㅈ
          </button>
          <button
            @click="setFilter('ㅊ')"
            :class="['filter-btn', { active: currentFilter === 'ㅊ' }]"
          >
            ㅊ
          </button>
          <button
            @click="setFilter('ㅋ')"
            :class="['filter-btn', { active: currentFilter === 'ㅋ' }]"
          >
            ㅋ
          </button>
          <button
            @click="setFilter('ㅌ')"
            :class="['filter-btn', { active: currentFilter === 'ㅌ' }]"
          >
            ㅌ
          </button>
          <button
            @click="setFilter('ㅍ')"
            :class="['filter-btn', { active: currentFilter === 'ㅍ' }]"
          >
            ㅍ
          </button>
          <button
            @click="setFilter('ㅎ')"
            :class="['filter-btn', { active: currentFilter === 'ㅎ' }]"
          >
            ㅎ
          </button>
        </div>
      </div>

      <!-- 용어 목록 -->
      <div class="terms-section">
        <div class="terms-grid">
          <div
            v-for="term in paginatedTerms"
            :key="term.term"
            @click="selectTerm(term)"
            class="term-card"
            :class="{ selected: selectedTerm?.term === term.term }"
          >
            <h3 class="term-title">{{ term.term }}</h3>
            <p class="term-preview">{{ getPreview(term.definition) }}</p>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div class="pagination">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="page-btn"
          >
            이전
          </button>
          <span class="page-info"> {{ currentPage }} / {{ totalPages }} </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            다음
          </button>
        </div>
      </div>

      <!-- 용어 상세 정보 모달 -->
      <div v-if="selectedTerm" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ selectedTerm.term }}</h2>
            <button @click="closeModal" class="close-btn">×</button>
          </div>
          <div class="modal-body">
            <div class="term-definition">
              {{ selectedTerm.definition }}
            </div>
            <div v-if="selectedTerm.relatedTerms" class="related-terms">
              <h4>연관 검색어:</h4>
              <div class="related-tags">
                <span
                  v-for="relatedTerm in selectedTerm.relatedTerms"
                  :key="relatedTerm"
                  @click="searchRelatedTerm(relatedTerm)"
                  class="related-tag"
                >
                  {{ relatedTerm }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import dictionaryData from "./financial_dictionary_parsed.json";
// import Headerbar from "../../components/Headerbar.vue"; // 제거
import Navbar from "../../components/Navbar.vue";
import { useRouter } from "vue-router"; // ✅ 추가
const router = useRouter(); // ✅ 추가
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faAngleLeft);

const terms = ref([]);
const filteredTerms = ref([]);
const searchTerm = ref("");
const currentFilter = ref("all");
const selectedTerm = ref(null);
const currentPage = ref(1);
const itemsPerPage = 10;

const showHistory = ref(false);
const searchHistory = ref([]);
const inputFocused = ref(false);

onMounted(() => {
  // 중복 용어 제거 및 정렬
  const uniqueTerms = [];
  const seen = new Set();
  for (const t of dictionaryData) {
    if (t.term && !seen.has(t.term)) {
      uniqueTerms.push(t);
      seen.add(t.term);
    }
  }
  terms.value = uniqueTerms.sort((a, b) => a.term.localeCompare(b.term, "ko"));
  filteredTerms.value = terms.value;
  // 검색 히스토리 불러오기
  const history = localStorage.getItem("dictionary_search_history");
  if (history) searchHistory.value = JSON.parse(history);
});

const saveHistory = (term) => {
  if (!term.trim()) return;
  // 중복 제거, 최근 검색이 앞으로
  searchHistory.value = [
    term,
    ...searchHistory.value.filter((t) => t !== term),
  ].slice(0, 10);
  localStorage.setItem(
    "dictionary_search_history",
    JSON.stringify(searchHistory.value)
  );
};

const onEnterSearch = () => {
  filterTerms();
  saveHistory(searchTerm.value);
  showHistory.value = false;
};

const selectHistory = (item) => {
  searchTerm.value = item;
  filterTerms();
  showHistory.value = false;
};

const deleteHistory = (idx) => {
  searchHistory.value.splice(idx, 1);
  localStorage.setItem(
    "dictionary_search_history",
    JSON.stringify(searchHistory.value)
  );
};

const filterTerms = () => {
  let filtered = terms.value;
  if (searchTerm.value.trim()) {
    filtered = filtered.filter(
      (term) =>
        term.term.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }
  if (currentFilter.value !== "all") {
    filtered = filtered.filter((term) => {
      const firstChar = term.term.charAt(0);
      return getChoseong(firstChar) === currentFilter.value;
    });
  }
  filteredTerms.value = filtered;
  currentPage.value = 1;
};

const getChoseong = (char) => {
  const choseong = {
    가: "ㄱ",
    나: "ㄴ",
    다: "ㄷ",
    라: "ㄹ",
    마: "ㅁ",
    바: "ㅂ",
    사: "ㅅ",
    아: "ㅇ",
    자: "ㅈ",
    차: "ㅊ",
    카: "ㅋ",
    타: "ㅌ",
    파: "ㅍ",
    하: "ㅎ",
  };
  const code = char.charCodeAt(0) - 44032;
  if (code < 0 || code > 11171) return char;
  const idx = Math.floor(code / 588);
  return Object.values(choseong)[idx] || char;
};

const setFilter = (filter) => {
  currentFilter.value = filter;
  filterTerms();
};

const selectTerm = (term) => {
  selectedTerm.value = term;
};
const closeModal = () => {
  selectedTerm.value = null;
};
const totalTerms = computed(() => terms.value.length);
const totalPages = computed(() =>
  Math.ceil(filteredTerms.value.length / itemsPerPage)
);
const paginatedTerms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTerms.value.slice(start, end);
});
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const getPreview = (def) => (def.length > 40 ? def.slice(0, 40) + "..." : def);

const toggleHistory = () => {
  if (showHistory.value) {
    showHistory.value = false;
  } else {
    showHistory.value = true;
  }
};

const onBlurInput = (e) => {
  // 드롭다운 내 버튼 클릭 시 blur 방지
  setTimeout(() => {
    showHistory.value = false;
  }, 100);
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>

<style scoped>
.dictionary-scroll-container {
  max-height: 100vh;
  overflow-y: auto;
  padding-bottom: 80px;
}
.dictionary-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Noto Sans KR", sans-serif;
}

.dictionary-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
}

.dictionary-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.dictionary-header p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.search-section {
  margin-bottom: 30px;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  position: relative;
  width: 100%;
  max-width: 390px;
  margin: 0 auto 10px auto;
}

.search-input {
  flex: 1;
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #667eea;
}

/* .search-button {
  padding: 15px 25px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background: #5a6fd8;
} */

.search-stats {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.filter-section {
  margin-bottom: 30px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.filter-btn {
  padding: 10px 20px;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.terms-section {
  margin-bottom: 30px;
}

.terms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.term-card {
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.term-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.term-card.selected {
  border-color: #667eea;
  background: #f8f9ff;
}

.term-title {
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
}

.term-preview {
  margin: 0;
  color: #666;
  line-height: 1.5;
  font-size: 0.9rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  min-height: 48px;
  margin-top: 16px;
}
.page-btn {
  padding: 10px 20px;
  border: 2px solid #4318d1;
  background: #fff;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #4318d1;
  cursor: pointer;
  transition: all 0.3s ease;
}
.page-btn:hover:not(:disabled) {
  background: #4318d1;
  color: #fff;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-info {
  font-weight: 700;
  color: #222;
  font-size: 18px;
  min-width: 60px;
  text-align: center;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 540px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 2px solid #e1e5e9;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background: #f0f0f0;
}

.modal-body {
  padding: 30px;
}

.term-definition {
  line-height: 1.8;
  color: #333;
  font-size: 1rem;
  margin-bottom: 20px;
}

.related-terms h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
}

.related-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.related-tag {
  padding: 8px 15px;
  background: #f0f4ff;
  color: #667eea;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.related-tag:hover {
  background: #667eea;
  color: white;
}

.search-history-box {
  position: absolute;
  width: 92%;
  background: #fff;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}
.search-history-item {
  padding: 10px 18px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.search-history-item:hover {
  background: #f0f4ff;
}

.delete-history-btn {
  background: none;
  border: none;
  color: #bbb;
  font-size: 18px;
  margin-left: 8px;
  cursor: pointer;
  padding: 0 4px;
  transition: color 0.2s;
}
.delete-history-btn:hover {
  color: #e11d48;
}

.dictionary-header-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0;
  margin-bottom: 18px;
  z-index: 1100;
}
.dictionary-header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}
.back-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  font-size: 22px;
  color: #222;
  cursor: pointer;
  padding: 2px 8px 2px 2px;
  border-radius: 8px;
  transition: background 0.15s;
  position: relative;
  z-index: 1200;
}
.back-btn:hover {
  background: #f3f3f3;
}

.prev-btn,
.next-btn {
  display: inline-block;
  font-size: 20px;
  font-weight: 700;
  color: #4318d1;
  background: #fff;
  border: 2px solid #4318d1;
  border-radius: 8px;
  padding: 10px 24px;
  margin: 16px 8px 0 8px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.prev-btn:hover,
.next-btn:hover {
  background: #4318d1;
  color: #fff;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .dictionary-container {
    padding: 15px;
  }

  .dictionary-header h1 {
    font-size: 2rem;
  }

  .search-box {
    flex-direction: column;
  }

  .terms-grid {
    grid-template-columns: 1fr;
  }

  .filter-options {
    gap: 5px;
  }

  .filter-btn {
    padding: 8px 15px;
    font-size: 0.8rem;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .modal-header {
    padding: 15px 20px;
  }

  .modal-body {
    padding: 20px;
  }
}
</style>
