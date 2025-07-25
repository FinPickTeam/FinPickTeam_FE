<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { faAngleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { DatePicker } from "v-calendar"; // ✅ 전역 실패 시 로컬 등록

const router = useRouter();
const selectedDate = ref(new Date());

function goBack() {
  router.back();
}
function goDictionary() {
  router.push("/dictionary");
}
</script>

<template>
  <div class="diary-header-bar">
    <button class="back-btn" @click="goBack">
      <FontAwesomeIcon :icon="faAngleLeft" />
    </button>
    <div class="header-spacer"></div>
    <button class="dict-btn" @click="goDictionary">
      <FontAwesomeIcon :icon="faSearch" />
    </button>
  </div>
  <div class="calendar-center-wrap">
    <DatePicker v-model="selectedDate" is-expanded color="indigo" locale="ko" />
  </div>
</template>

<style scoped>
.diary-header-bar {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px 0 8px;
  background: #fff;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 100;
  border-radius: 16px 16px 0 0;
}
.back-btn,
.dict-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  font-size: 26px;
  color: #4318d1;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
}
.header-spacer {
  flex: 1;
}
::v-deep(.calendar-center-wrap) {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #f7f8fa;
}
/* ✅ 달력 컨테이너를 가운데 정렬 */
::v-deep(.vc-container) {
  width: 360px;
  height: 300px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 16px;
  box-sizing: border-box;
  border: none;
}
/* ✅ 상단 버튼(헤더) 바깥의 보라색 배경/테두리 제거 */
::v-deep(.vc-header) {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}
/* ✅ 상단 월/연도(타이틀)와 좌우 버튼의 보라색 배경 제거 */
::v-deep(.vc-title) {
  background: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  color: #222;
  font-size: 20px;
  font-weight: bold;
  padding: 0 8px;
}
::v-deep(.vc-arrows),
::v-deep(.vc-arrow) {
  background: none !important;
  box-shadow: none !important;
  border: none !important;
  color: #888;
}

::v-deep(.vc-weekday) {
  font-size: 16px;
  font-weight: 600;
  color: #666;
}

::v-deep(.vc-day-content) {
  font-size: 18px;
  font-weight: 500;
  color: #000;
}

::v-deep(.vc-day.vc-highlight),
::v-deep(.vc-day.vc-selected) {
  background-color: #4318d1;
  color: #fff !important;
}
::v-deep(.vc-day.vc-selected .vc-day-content),
::v-deep(.vc-day.vc-highlight .vc-day-content) {
  color: #fff !important;
}
</style>
