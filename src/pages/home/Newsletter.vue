<template>
  <teleport to="body">
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
          <!-- 디버깅용: 첫 번째 기사만 콘솔에 출력 -->
          <div v-if="idx === 0" style="display: none">
            {{ console.log("첫 번째 기사 데이터:", article) }}
            {{ console.log("첫 번째 기사 키들:", Object.keys(article)) }}
          </div>
          <a
            :href="article.link || '#'"
            target="_blank"
            class="article-link newsletter-article"
          >
            <div class="article-title">{{ article.title }}</div>
            <div class="article-content">
              {{
                (article.summary || article.description || "").length > 80
                  ? (article.summary || article.description || "").slice(
                      0,
                      80
                    ) + "..."
                  : article.summary || article.description || ""
              }}
            </div>
            <div class="article-date">
              {{ formatDate(article.publishedAt) }}
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
  </teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getNewsList } from "@/api/home";
import { useAuthStore } from "@/stores/auth";

// 인증 스토어
const authStore = useAuthStore();

// 상태 관리
const loading = ref(true);
const error = ref(null);
const keyword = ref("금융"); // 기본 키워드
const articles = ref([]);
const newsContent = ref(""); // 본문 뉴스 내용

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return "날짜 없음";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "날짜 없음";
    }
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("날짜 포맷팅 에러:", error, "dateString:", dateString);
    return "날짜 없음";
  }
};

// 뉴스레터 데이터 가져오기
const fetchNewsletters = async () => {
  try {
    loading.value = true;
    error.value = null;

    // 인증 상태 확인
    console.log("인증 상태 확인:", {
      isAuthenticated: authStore.isAuthenticated,
      hasAccessToken: !!authStore.accessToken,
      user: authStore.user,
    });

    if (!authStore.isAuthenticated) {
      error.value = "뉴스레터를 보려면 로그인이 필요합니다.";
      loading.value = false;
      return;
    }

    console.log("뉴스레터 데이터 가져오기 시작");

    // 뉴스 목록 가져오기
    console.log("뉴스 목록 API 호출");
    try {
      const newsResponse = await getNewsList();
      console.log("받아온 뉴스 데이터:", newsResponse);

      // 다양한 응답 구조 처리
      let newsData;
      console.log("전체 응답 구조:", newsResponse);
      console.log("응답 상태:", newsResponse.status);
      console.log("응답 데이터 타입:", typeof newsResponse.data);
      console.log("응답 데이터:", newsResponse.data);

      // 응답 구조 분석
      if (newsResponse.data && Array.isArray(newsResponse.data)) {
        newsData = newsResponse.data;
        console.log("배열 형태의 데이터 발견");
      } else if (
        newsResponse.data &&
        newsResponse.data.data &&
        Array.isArray(newsResponse.data.data)
      ) {
        newsData = newsResponse.data.data;
        console.log("data.data 배열 형태의 데이터 발견");
      } else if (
        newsResponse.data &&
        newsResponse.data.items &&
        Array.isArray(newsResponse.data.items)
      ) {
        newsData = newsResponse.data.items;
        console.log("data.items 배열 형태의 데이터 발견");
      } else if (
        newsResponse.data &&
        newsResponse.data.list &&
        Array.isArray(newsResponse.data.list)
      ) {
        newsData = newsResponse.data.list;
        console.log("data.list 배열 형태의 데이터 발견");
      } else if (newsResponse.data && typeof newsResponse.data === "object") {
        // 객체인 경우 키들을 확인
        const keys = Object.keys(newsResponse.data);
        console.log("객체의 키들:", keys);
        // 첫 번째 키가 배열인지 확인
        if (keys.length > 0 && Array.isArray(newsResponse.data[keys[0]])) {
          newsData = newsResponse.data[keys[0]];
          console.log(`${keys[0]} 키의 배열 데이터 발견`);
        }
      }

      if (newsData && Array.isArray(newsData) && newsData.length > 0) {
        // 뉴스 데이터에 날짜 필드가 없으면 현재 시간으로 추가
        const processedNewsData = newsData.map((article) => ({
          ...article,
          publishedAt:
            article.publishedAt ||
            article.pubDate ||
            article.date ||
            article.createdAt ||
            article.updatedAt ||
            article.pubDate ||
            new Date().toISOString(),
          title:
            article.title || article.headline || article.name || "제목 없음",
          summary:
            article.summary ||
            article.description ||
            article.content ||
            article.body ||
            "내용 없음",
          link: article.link || article.url || article.href || "#",
        }));

        articles.value = processedNewsData;
        console.log("설정된 키워드:", keyword.value);
        console.log("받아온 뉴스 수:", articles.value.length);
        console.log("첫 번째 뉴스 데이터 구조:", articles.value[0]);
        console.log(
          "첫 번째 뉴스의 모든 키:",
          articles.value[0] ? Object.keys(articles.value[0]) : "데이터 없음"
        );
        console.log("처리된 뉴스 데이터 샘플:", articles.value.slice(0, 2));
      } else {
        articles.value = [];
        console.log("뉴스 데이터가 없습니다. newsData:", newsData);
      }
    } catch (newsError) {
      console.error("뉴스 목록 API 호출 실패:", newsError);
      // 샘플 데이터로 대체
      articles.value = [
        {
          title: "금융 시장 동향 분석",
          summary: "최근 금융 시장의 주요 동향과 투자 전략에 대해 알아보세요.",
          link: "#",
          publishedAt: new Date().toISOString(),
        },
        {
          title: "개인 투자자들을 위한 가이드",
          summary:
            "초보 투자자들이 알아야 할 기본적인 투자 원칙과 팁을 소개합니다.",
          link: "#",
          publishedAt: new Date().toISOString(),
        },
        {
          title: "디지털 금융의 미래",
          summary:
            "블록체인과 암호화폐가 가져올 금융 산업의 변화에 대해 살펴봅니다.",
          link: "#",
          publishedAt: new Date().toISOString(),
        },
      ];
      console.log("뉴스 API 실패로 샘플 데이터 사용");
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
  margin-bottom: 4px;
}

.article-date {
  font-size: 12px;
  color: #666;
  font-style: italic;
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

/* 본문 뉴스 내용 스타일 */
.news-content-section {
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.news-content-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.news-content-text {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  white-space: pre-wrap; /* 줄바꿈 포함 */
  word-break: break-word; /* 단어 단위로 줄바꿈 */
}

.content-divider {
  border: none;
  border-top: 1px solid #ececec;
  margin: 16px 0;
}
</style>
