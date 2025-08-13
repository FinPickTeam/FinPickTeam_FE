<template>
  <teleport to="body">
    <div class="newsletter-modal-backdrop" @click.self="emit('close')">
      <div class="newsletter-modal">
        <!-- 헤더 섹션 -->
        <div class="newsletter-header">
          <div class="header-content">
            <div class="header-text">
              <div class="header-title">
                오늘의 금융 KEYWORD :
                <span class="keyword-highlight">{{ keyword }}</span>
              </div>
            </div>
          </div>
          <button class="close-btn" @click="emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">뉴스레터를 불러오는 중...</div>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="error-container">
          <div class="error-icon">
            <i class="fa-solid fa-exclamation-triangle"></i>
          </div>
          <div class="error-message">{{ error }}</div>
          <div class="error-actions">
            <button
              v-if="!authStore.isAuthenticated"
              @click="goToLogin"
              class="action-btn primary"
            >
              <i class="fa-solid fa-sign-in-alt"></i>
              로그인하기
            </button>
            <button v-else @click="fetchNewsletters" class="action-btn primary">
              <i class="fa-solid fa-redo"></i>
              다시 시도
            </button>
          </div>
        </div>

        <!-- 뉴스레터 목록 -->
        <div v-else class="newsletter-content">
          <div class="newsletter-list">
            <template
              v-for="(article, idx) in articles"
              :key="article.id || idx"
            >
              <article
                class="newsletter-article"
                @click="openArticle(article.link)"
              >
                <div class="article-main">
                  <div class="article-title">{{ article.title }}</div>
                  <div class="article-content">
                    {{
                      (article.summary || article.description || '').length >
                      100
                        ? (article.summary || article.description || '').slice(
                            0,
                            100
                          ) + '...'
                        : article.summary || article.description || ''
                    }}
                  </div>
                  <div class="article-meta">
                    <div class="article-date">
                      <i class="fa-solid fa-calendar-alt"></i>
                      {{ formatDate(article.publishedAt) }}
                    </div>
                    <div class="article-source">
                      <i class="fa-solid fa-external-link-alt"></i>
                      원문 보기
                    </div>
                  </div>
                </div>
              </article>
              <hr v-if="idx < articles.length - 1" class="article-divider" />
            </template>

            <!-- 뉴스레터가 없을 때 -->
            <div v-if="articles.length === 0" class="no-newsletter">
              <div class="no-newsletter-icon">
                <i class="fa-solid fa-newspaper"></i>
              </div>
              <div class="no-newsletter-text">
                <div class="no-newsletter-title">뉴스가 없습니다</div>
                <div class="no-newsletter-desc">
                  현재 표시할 뉴스가 없습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getNewsList } from '@/api/home';
import { useAuthStore } from '@/stores/auth';

// 컴포넌트 이벤트 정의
const emit = defineEmits(['close']);

// 인증 스토어
const authStore = useAuthStore();

// 상태 관리
const loading = ref(true);
const error = ref(null);
const keyword = ref('금융'); // 기본 키워드

const articles = ref([]);
const newsContent = ref(''); // 본문 뉴스 내용

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '날짜 없음';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '날짜 없음';
    }
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('날짜 포맷팅 에러:', error, 'dateString:', dateString);
    return '날짜 없음';
  }
};

// 뉴스레터 데이터 가져오기
const fetchNewsletters = async () => {
  try {
    loading.value = true;
    error.value = null;

    // 인증 상태 확인
    console.log('인증 상태 확인:', {
      isAuthenticated: authStore.isAuthenticated,
      hasAccessToken: !!authStore.accessToken,
      user: authStore.user,
    });

    if (!authStore.isAuthenticated) {
      error.value = '뉴스레터를 보려면 로그인이 필요합니다.';
      loading.value = false;
      return;
    }

    console.log('뉴스레터 데이터 가져오기 시작');

    // 뉴스 목록 가져오기
    console.log('뉴스 목록 API 호출');
    try {
      const newsResponse = await getNewsList();
      console.log('받아온 뉴스 데이터:', newsResponse);

      // 다양한 응답 구조 처리
      let newsData;
      console.log('전체 응답 구조:', newsResponse);
      console.log('응답 상태:', newsResponse.status);
      console.log('응답 데이터 타입:', typeof newsResponse.data);
      console.log('응답 데이터:', newsResponse.data);

      // 응답 구조 분석
      if (newsResponse.data && Array.isArray(newsResponse.data)) {
        newsData = newsResponse.data;
        console.log('배열 형태의 데이터 발견');
      } else if (
        newsResponse.data &&
        newsResponse.data.data &&
        Array.isArray(newsResponse.data.data)
      ) {
        newsData = newsResponse.data.data;
        console.log('data.data 배열 형태의 데이터 발견');
      } else if (
        newsResponse.data &&
        newsResponse.data.items &&
        Array.isArray(newsResponse.data.items)
      ) {
        newsData = newsResponse.data.items;
        console.log('data.items 배열 형태의 데이터 발견');
      } else if (
        newsResponse.data &&
        newsResponse.data.list &&
        Array.isArray(newsResponse.data.list)
      ) {
        newsData = newsResponse.data.list;
        console.log('data.list 배열 형태의 데이터 발견');
      } else if (newsResponse.data && typeof newsResponse.data === 'object') {
        // 객체인 경우 키들을 확인
        const keys = Object.keys(newsResponse.data);
        console.log('객체의 키들:', keys);
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
            article.title || article.headline || article.name || '제목 없음',
          summary:
            article.summary ||
            article.description ||
            article.content ||
            article.body ||
            '내용 없음',
          link: article.link || article.url || article.href || '#',
        }));

        articles.value = processedNewsData;
        console.log('설정된 키워드:', keyword.value);
        console.log('받아온 뉴스 수:', articles.value.length);
        console.log('첫 번째 뉴스 데이터 구조:', articles.value[0]);
        console.log(
          '첫 번째 뉴스의 모든 키:',
          articles.value[0] ? Object.keys(articles.value[0]) : '데이터 없음'
        );
        console.log('처리된 뉴스 데이터 샘플:', articles.value.slice(0, 2));
      } else {
        articles.value = [];
        console.log('뉴스 데이터가 없습니다. newsData:', newsData);
      }
    } catch (newsError) {
      console.error('뉴스 목록 API 호출 실패:', newsError);
      // 샘플 데이터로 대체
      articles.value = [
        {
          title: '금융 시장 동향 분석',
          summary: '최근 금융 시장의 주요 동향과 투자 전략에 대해 알아보세요.',
          link: '#',
          publishedAt: new Date().toISOString(),
        },
        {
          title: '개인 투자자들을 위한 가이드',
          summary:
            '초보 투자자들이 알아야 할 기본적인 투자 원칙과 팁을 소개합니다.',
          link: '#',
          publishedAt: new Date().toISOString(),
        },
        {
          title: '디지털 금융의 미래',
          summary:
            '블록체인과 암호화폐가 가져올 금융 산업의 변화에 대해 살펴봅니다.',
          link: '#',
          publishedAt: new Date().toISOString(),
        },
      ];
      console.log('뉴스 API 실패로 샘플 데이터 사용');
    }
  } catch (err) {
    console.error('뉴스레터 조회 에러:', err);

    // 에러 메시지 개선
    let errorMessage = '뉴스레터를 불러오는데 실패했습니다.';

    if (err.response?.status === 401) {
      errorMessage =
        '로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.';
    } else if (err.response?.status === 404) {
      errorMessage =
        '뉴스레터 API를 찾을 수 없습니다. 백엔드 서버를 확인해주세요.';
    } else if (err.response?.status === 500) {
      errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    } else if (err.code === 'ECONNREFUSED') {
      errorMessage =
        '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
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
  window.location.href = '/login';
};

// 기사 링크 열기
const openArticle = (link) => {
  if (link && link !== '#') {
    window.open(link, '_blank');
  }
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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.newsletter-modal {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.05);
  max-width: 380px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: slideUp 0.4s ease-out;
  overflow: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 헤더 스타일 */
.newsletter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  color: #4318d1;
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.header-text {
  flex: 1;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #000;
  text-align: center;
}

.keyword-highlight {
  color: #4318d1;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(99, 102, 241, 0.2);
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 16px;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(67, 24, 209, 0.1);
  transform: scale(1.05);
}

/* 로딩 스타일 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #4318d1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 15px;
  color: #6b7280;
  font-weight: 500;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 20px;
  text-align: center;
}

.error-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #ef4444;
}

.error-message {
  font-size: 15px;
  color: #374151;
  line-height: 1.5;
  max-width: 300px;
}

.error-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #4318d1 0%, #6366f1 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(67, 24, 209, 0.3);
}

/* 콘텐츠 영역 */
.newsletter-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 뉴스레터 목록 */
.newsletter-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 28px 28px 28px;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

.newsletter-list::-webkit-scrollbar {
  width: 6px;
}

.newsletter-list::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.newsletter-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.newsletter-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.newsletter-article {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 0;
  transition: all 0.2s ease;
  border-radius: 12px;
  margin: 0 -12px;
  padding-left: 12px;
  padding-right: 12px;
  cursor: pointer;
}

.newsletter-article:hover {
  background: #f9fafb;
  transform: translateX(4px);
}

.article-main {
  flex: 1;
  min-width: 0;
}

.article-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-content {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #9ca3af;
}

.article-date,
.article-source {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0;
}

/* 뉴스레터가 없을 때 */
.no-newsletter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 16px;
}

.no-newsletter-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #9ca3af;
}

.no-newsletter-title {
  font-size: 18px;
  font-weight: 700;
  color: #374151;
}

.no-newsletter-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}
</style>
