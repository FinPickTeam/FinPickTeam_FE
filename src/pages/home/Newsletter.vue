<template>
  <div class="newsletter-modal-backdrop" @click.self="$emit('close')">
    <div class="newsletter-modal">
      <div class="newsletter-header">
        <span class="keyword-title">
          오늘의 금융 KEY WORD : <span class="keyword">{{ keyword }}</span>
        </span>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      <div class="newsletter-list">
        <template v-for="(article, idx) in articles" :key="idx">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import news from "./news.json";

const keyword = ref(news.keywords[0]);
const articles = ref(news.articles.filter((a) => a.keyword === keyword.value));
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
</style>
