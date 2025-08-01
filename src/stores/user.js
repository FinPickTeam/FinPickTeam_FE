import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  // 사용자 이름 (ARS 인증에서 입력)
  const userName = ref('');
  
  // 사용자 이름 설정
  function setUserName(name) {
    userName.value = name;
    // localStorage에 저장
    localStorage.setItem('userName', name);
  }
  
  // 사용자 이름 가져오기
  function getUserName() {
    return userName.value;
  }
  
  // localStorage에서 사용자 이름 로드
  function loadUserName() {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      userName.value = savedName;
    }
  }
  
  // 초기 로드
  loadUserName();
  
  return {
    userName,
    setUserName,
    getUserName,
    loadUserName
  };
}); 