<template>
  <div class="newsletter-modal-backdrop" @click.self="$emit('close')">
    <div class="newsletter-modal">
      <div class="newsletter-header">
        <span class="keyword-title">
          오늘의 금융 KEY WORD : <span class="keyword">{{ keyword }}</span>
        </span>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>뉴스레터를 불러오는 중...</p>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <div class="error-actions">
          <button
            v-if="!authStore.isAuthenticated"
            @click="goToLogin"
            class="login-btn"
          >
            로그인하기
          </button>
          <button v-else @click="fetchNewsletters" class="retry-btn">
            다시 시도
          </button>
        </div>
      </div>

      <!-- 뉴스레터 목록 -->
      <div v-else class="newsletter-list">
        <template v-for="(article, idx) in articles" :key="article.id || idx">
          <a
            :href="article.url"
            target="_blank"
            class="article-link newsletter-article"
          >
            <div class="article-title">{{ article.title }}</div>
            <div class="article-content">
              {{
                article.content.length > 80
                  ? article.content.slice(0, 80) + "..."
                  : article.content
              }}
            </div>
          </a>
          <hr v-if="idx < articles.length - 1" class="article-divider" />
        </template>

        <!-- 뉴스레터가 없을 때 -->
        <div v-if="articles.length === 0" class="no-newsletter">
          <p>현재 뉴스레터가 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getNewsletters } from "@/api/newsletterApi";
import { useAuthStore } from "@/stores/auth";

// 인증 스토어
const authStore = useAuthStore();

// 상태 관리
const loading = ref(true);
const error = ref(null);
const newsletters = ref([]);

// 키워드별로 그룹화된 기사 목록
const keyword = ref("");
const articles = computed(() => {
  if (!keyword.value || !newsletters.value.length) return [];
  return newsletters.value.filter(
    (article) => article.keyword === keyword.value
  );
});

// 뉴스레터 데이터 가져오기
const fetchNewsletters = async () => {
  try {
    loading.value = true;
    error.value = null;

    // 인증 상태 확인
    if (!authStore.isAuthenticated) {
      error.value = "뉴스레터를 보려면 로그인이 필요합니다.";
      loading.value = false;
      return;
    }

    console.log("뉴스레터 데이터 가져오기 시작");
    const response = await getNewsletters();
    console.log("받아온 뉴스레터 데이터:", response);

    newsletters.value = response.newsletters || response || [];

    // 첫 번째 키워드를 기본값으로 설정
    if (newsletters.value.length > 0) {
      const keywords = [
        ...new Set(newsletters.value.map((item) => item.keyword)),
      ];
      keyword.value = keywords[0];
      console.log("설정된 키워드:", keyword.value);
      console.log("필터링된 기사 수:", articles.value.length);
    } else {
      console.log("뉴스레터 데이터가 없습니다");
    }
  } catch (err) {
    console.error("뉴스레터 조회 에러:", err);

    // 에러 메시지 개선
    let errorMessage = "뉴스레터를 불러오는데 실패했습니다.";

    if (err.response?.status === 401) {
      errorMessage =
        "로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.";
    } else if (err.response?.status === 404) {
      errorMessage =
        "뉴스레터 API를 찾을 수 없습니다. 백엔드 서버를 확인해주세요.";
    } else if (err.response?.status === 500) {
      errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    } else if (err.code === "ECONNREFUSED") {
      errorMessage =
        "백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.";
    } else if (err.message) {
      errorMessage = `연결 오류: ${err.message}`;
    }

    error.value = errorMessage;
  } finally {
    loading.value = false;
  }
};

// 컴포넌트 마운트 시 데이터 가져오기
onMounted(() => {
  fetchNewsletters();
});

// 로그인 페이지로 이동
const goToLogin = () => {
  window.location.href = "/login";
};
</script>

<style scoped>
.newsletter-modal-backdrop {
  position: fixed;
  z-index: 2000;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
}
.newsletter-modal {
  background: #fff;
  border-radius: 12px;
  padding: 18px 16px 16px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  width: 100%;
  font-family: "Noto Sans KR", sans-serif;
}
.newsletter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.keyword-title {
  color: #7c4dff;
  font-size: 15px;
  font-weight: 500;
}
.keyword {
  color: #4318d1;
  font-weight: 700;
}
.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #222;
  cursor: pointer;
  font-weight: bold;
}

/* 로딩 스타일 */
.loading-container {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7c4dff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 에러 스타일 */
.error-container {
  text-align: center;
  padding: 40px 20px;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 16px;
}

.error-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.login-btn {
  background: #7c4dff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.login-btn:hover {
  background: #6a3fd8;
}

.retry-btn {
  background: #7c4dff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:hover {
  background: #6a3fd8;
}

/* 뉴스레터 목록 */
.newsletter-list {
  margin-top: 8px;
  max-height: 320px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.newsletter-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
.newsletter-article {
  margin-bottom: 18px;
  text-decoration: none;
  color: inherit;
  display: block;
}
.article-title {
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 4px;
}
.article-content {
  font-size: 14px;
  color: #222;
  line-height: 1.5;
}
.article-link:hover .article-title {
  text-decoration: underline;
  color: #4318d1;
}
.article-link:hover .article-content {
  color: #7c4dff;
}
.article-divider {
  border: none;
  border-top: 1.5px solid #ececec;
  margin: 14px 0 14px 0;
}

/* 뉴스레터가 없을 때 */
.no-newsletter {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}
</style>
