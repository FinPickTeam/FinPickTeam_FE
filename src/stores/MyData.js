// stores/mydata.js
import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth';

export const useMyDataStore = defineStore('mydata', {
  state: () => ({
    linked: false,
    hideModal: false, // 모달 숨김 상태 추가
  }),

  actions: {
    setLinked(value) {
      this.linked = value;
      this.save();
    },
    toggle() {
      this.setLinked(!this.linked);
    },
    reset() {
      this.setLinked(false);
      this.save();
    },

    // 모달 숨김 설정
    setHideModal(value) {
      this.hideModal = value;
      this.save();
    },

    // 모달 다시 보기
    showModal() {
      this.setHideModal(false);
    },

    // ✅ 유저별 key 생성
    _key() {
      const auth = useAuthStore();
      const uid = auth.user?.id || auth.user?.email || 'anon';
      return `finpick:mydata:${uid}`;
    },

    // ✅ 저장
    save() {
      localStorage.setItem(
        this._key(),
        JSON.stringify({
          linked: this.linked,
          hideModal: this.hideModal,
        })
      );
    },

    // ✅ 불러오기 (로그인 직후 호출)
    load() {
      const raw = localStorage.getItem(this._key());
      if (raw) {
        try {
          const data = JSON.parse(raw);
          if (typeof data.linked === 'boolean') this.linked = data.linked;
          if (typeof data.hideModal === 'boolean')
            this.hideModal = data.hideModal;
        } catch {
          this.linked = false;
          this.hideModal = false;
        }
      } else {
        this.linked = false;
        this.hideModal = false;
      }
    },

    // ✅ 로그아웃 시 초기화
    clearForCurrentUser() {
      localStorage.removeItem(this._key());
      this.linked = false;
      this.hideModal = false;
    },
  },
});
