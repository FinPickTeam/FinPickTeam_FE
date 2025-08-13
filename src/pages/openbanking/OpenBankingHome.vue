<template>
  <div class="openbankinghome-container">
    <div class="ob-header"></div>
    <div class="banner-wrap">
      <img :src="bannerImage" alt="배너" class="banner-img" />
    </div>
    <div class="ob-desc">
      정리된 자산 현황, 요약된 소비 리포트.<br />
      연동만 하면 준비 완료!
    </div>
    <button class="ob-btn" @click="goToAgreement">자산 연동하기</button>
    <button class="ob-btn my-assets-btn" @click="goToMyAssets">
      내 자산 보기
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch, faBell } from "@fortawesome/free-solid-svg-icons";
import bannerImage from "./img/Openbanking_Banner.png";
library.add(faSearch, faBell);

const router = useRouter();
function goToAgreement() {
  router.push("/openbanking/account-link-select");
}

function goToMyAssets() {
  router.push("/openbanking/myhome");
}
</script>

<style scoped>
.openbankinghome-container {
  width: 390px;
  height: 844px;
  max-width: 390px;
  margin: 0 auto;
  background: #fff;
  font-family: var(--font-main);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-top: 80px;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
.ob-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 18px 0 18px;
  background: #fff;
}
.logo {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 1px;
  color: var(--color-main);
}
.header-icons {
  display: flex;
  gap: 18px;
}
.header-icon {
  color: var(--color-main);
  font-size: 22px;
  cursor: pointer;
}
.banner-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 18px;
}
.banner-img {
  width: 100%;
  max-width: 390px;
  height: auto;
  box-shadow: 0 2px 16px rgba(67, 24, 209, 0.08);
}
.ob-desc {
  margin: 38px 0 24px 0;
  color: #222;
  font-size: 1.08rem;
  text-align: center;
  line-height: 1.6;
}
.ob-btn {
  background: var(--color-main);
  color: #fff;
  font-size: 1.08rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  padding: 16px 0;
  width: 80%;
  max-width: 320px;
  margin: 0 auto 0 auto;
  cursor: pointer;
  transition: background 0.2s;
}
.ob-btn:hover {
  background: var(--color-main-dark);
}

.my-assets-btn {
  background: #f8f9fa;
  color: var(--color-main);
  border: 2px solid var(--color-main);
  margin-top: 12px;
}

.my-assets-btn:hover {
  background: var(--color-main);
  color: #fff;
}
</style>
