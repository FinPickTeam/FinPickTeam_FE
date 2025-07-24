<template>
  <div class="notfound-container">
    <div class="notfound-content">
      <div class="logo">FinPick</div>
      <img src="./404.jpg" alt="404 Not Found" class="notfound-img" />
      <div class="notfound-title">404 Not Found</div>
      <div class="notfound-desc">요청하신 페이지를 찾을 수 없습니다.</div>
      <router-link to="/" class="home-btn">홈으로 돌아가기</router-link>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.notfound-container {
  width: 390px;
  height: 844px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  margin: 0 auto;
}
.notfound-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(67, 24, 209, 0.08);
}
.notfound-img {
  width: 180px;
  height: 180px;
  object-fit: contain;
  margin-bottom: 18px;
}
.logo {
  font-size: 40px;
  font-weight: 900;
  letter-spacing: 1px;
  background: linear-gradient(
    90deg,
    var(--color-main) 0%,
    var(--color-main-light) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-bottom: 18px;
}
.notfound-title {
  font-size: 2rem;
  font-weight: bold;
  color: #4318d1;
  margin-bottom: 10px;
}
.notfound-desc {
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 28px;
  text-align: center;
}
.home-btn {
  display: inline-block;
  background: var(--color-main);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s;
  margin-top: 10px;
}
.home-btn:hover {
  background: var(--color-main-dark);
}
</style>
