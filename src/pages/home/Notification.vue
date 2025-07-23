<template>
  <div class="notification-page">
    <header class="notification-header">
      <i class="fa-solid fa-angle-left back-icon" @click="goBack"></i>
      <h1>알림</h1>
      <div class="header-divider"></div>
      <button class="mark-all-btn" @click="markAllAsRead">모두 읽음</button>
    </header>

    <template v-for="(group, index) in groupedNotifications" :key="index">
      <div class="group-title">{{ group.title }}</div>
      <div
        v-for="notification in group.items"
        :key="notification.id"
        class="notification-card"
        :class="{ unread: !notification.read }"
      >
        <div class="icon-box">
          <i :class="notification.icon"></i>
        </div>
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-desc">{{ notification.desc }}</div>
          <div class="notification-time">{{ notification.time }}</div>
        </div>
        <span v-if="!notification.read" class="unread-dot"></span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  router.back();
}

// 샘플 알림 데이터
const notifications = ref([
  // 오늘
  {
    id: 1,
    title: '투자 포트폴리오 업데이트',
    desc: '오늘 수익률이 +2.3% 상승했습니다.',
    time: '2시간 전',
    date: new Date(), // 오늘
    icon: 'fas fa-rocket',
    read: false,
  },
  {
    id: 2,
    title: '새로운 투자 기회',
    desc: '추천 종목에 대한 분석 리포트가 도착했습니다.',
    time: '4시간 전',
    date: new Date(), // 오늘
    icon: 'fas fa-lightbulb',
    read: false,
  },
  // 최근 7일
  {
    id: 3,
    title: '월간 투자 리포트',
    desc: '지난달 투자 성과 요약을 확인하세요.',
    time: '2일 전',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    icon: 'fas fa-file-alt',
    read: true,
  },
  {
    id: 4,
    title: '커뮤니티 댓글',
    desc: '챌린지 게시글에 새로운 댓글이 달렸습니다.',
    time: '3일 전',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    icon: 'fas fa-comments',
    read: true,
  },
  {
    id: 5,
    title: '시장 동향 알림',
    desc: '관심 종목의 가격이 5% 이상 변동했습니다.',
    time: '5일 전',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    icon: 'fas fa-chart-line',
    read: true,
  },
  // 최근 30일
  {
    id: 6,
    title: '계좌 입금 완료',
    desc: '계좌 거래에 500,000원이 입금되었습니다.',
    time: '1주 전',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    icon: 'fas fa-wallet',
    read: true,
  },
  {
    id: 7,
    title: '정기 투자 실행',
    desc: '설정하신 정기 투자가 실행되었습니다.',
    time: '2주 전',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    icon: 'fas fa-calendar-check',
    read: true,
  },
]);

// 알림 그룹화
const groupedNotifications = computed(() => {
  const today = [];
  const week = [];
  const month = [];
  const now = new Date();
  notifications.value.forEach((n) => {
    const diff = (now - new Date(n.date)) / (1000 * 60 * 60 * 24);
    if (diff < 1) today.push(n);
    else if (diff < 7) week.push(n);
    else if (diff < 30) month.push(n);
  });
  const groups = [];
  if (today.length) groups.push({ title: '오늘', items: today });
  if (week.length) groups.push({ title: '최근 7일', items: week });
  if (month.length) groups.push({ title: '최근 30일', items: month });
  return groups;
});

// 모두 읽음 처리
function markAllAsRead() {
  notifications.value.forEach((n) => (n.read = true));
}
</script>

<style scoped>
.notification-page {
  max-width: 540px;
  margin: 0 auto;
  background: #fff;
  min-height: 100vh;
  padding-bottom: 24px;
}
.notification-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px 20px 10px 10px;
  background: #fff;
  position: relative;
}
.notification-header h1 {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #222;
  position: relative;
}
.back-icon {
  position: absolute;
  left: 10px;
  top: 18px;
  font-size: 22px;
  color: #333;
  cursor: pointer;
  z-index: 2;
}
.header-divider {
  width: 100%;
  height: 1px;
  background: #f0f0f0;
  margin: 12px 0 0 0;
}
.mark-all-btn {
  align-self: flex-end;
  margin-top: 8px;
  background: none;
  border: none;
  color: #7c3aed;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}
.group-title {
  font-size: 15px;
  font-weight: 600;
  color: #888;
  margin: 0px 0 10px 20px;
}
.notification-card {
  display: flex;
  align-items: flex-start;
  border-radius: 16px;
  padding: 18px 18px 16px 18px;
  margin: 0 16px 14px 16px;
  position: relative;
  transition: background 0.2s, box-shadow 0.2s;
}

/* 읽지 않은 알림: 카드 스타일 */
.notification-card.unread {
  background: #ede9fe;
  box-shadow: 0 2px 8px #0001;
}

/* 읽은 알림: 심플 리스트 스타일 */
.notification-card:not(.unread) {
  background: #fff;
  box-shadow: none;
  border: none;
}

/* 아이콘 스타일 */
.icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 14px;
  margin-top: 2px;
  transition: background 0.2s, color 0.2s;
}

/* 읽지 않은 알림의 아이콘 */
.notification-card.unread .icon-box {
  background: #7c3aed;
  color: #fff;
}

/* 읽은 알림의 아이콘 */
.notification-card:not(.unread) .icon-box {
  background: #f3f3f3;
  color: #7c3aed;
}
.notification-content {
  flex: 1;
}
.notification-title {
  font-size: 15px;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
}
.notification-desc {
  font-size: 14px;
  color: #444;
  margin-bottom: 8px;
}
.notification-time {
  font-size: 12px;
  color: #aaa;
}
.unread-dot {
  width: 8px;
  height: 8px;
  background: #7c3aed;
  border-radius: 50%;
  position: absolute;
  top: 18px;
  right: 18px;
}
</style>
