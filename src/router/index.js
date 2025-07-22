import { createRouter, createWebHistory } from "vue-router";
import ArsAuth from "../pages/ars/ArsAuth.vue";
import ArsVerification from "../pages/ars/ArsVerification.vue";

import Login from "../pages/auth/Login.vue";
import Signup from "../pages/auth/Signup.vue";
import SignupComplete from "../pages/auth/SignupComplete.vue";
import ProfileStep1 from "../pages/auth/ProfileStep1.vue";
import ProfileStep2 from "../pages/auth/ProfileStep2.vue";
import ProfileStep3 from "../pages/auth/ProfileStep3.vue";
import ProfileStep4 from "../pages/auth/ProfileStep4.vue";

import Mypage from "../pages/mypage/MyPage.vue";
import Withdraw from "../pages/mypage/Withdraw.vue";
import WithdrawSuccess from "../pages/mypage/WithdrawSuccess.vue";
import Profile from "../pages/mypage/Profile.vue";
import QuizHistory from "../pages/mypage/QuizHistory.vue";
import Dictionary from "../pages/home/Dictionary.vue";
import AvatarShop from "../pages/mypage/avatar/AvatarShop.vue";

import Home from "../pages/home/Home.vue";
import Notification from "../pages/home/Notification.vue";
import Quiz from "../pages/home/Quiz.vue";

import FinanceHome from "../pages/finance/FinanceHome.vue";
import OpenBankingHome from "../pages/openbanking/OpenBankingHome.vue";
import ChallengeHome from "../pages/challenge/ChallengeHome.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 로그인, 회원가입
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup,
    },
    {
      path: "/signup-complete",
      name: "SignupComplete",
      component: SignupComplete,
    },
    {
      path: "/profile-step-1",
      name: "ProfileStep1",
      component: ProfileStep1,
    },
    {
      path: "/profile-step-2",
      name: "ProfileStep2",
      component: ProfileStep2,
    },
    {
      path: "/profile-step-3",
      name: "ProfileStep3",
      component: ProfileStep3,
    },
    {
      path: "/profile-step-4",
      name: "ProfileStep4",
      component: ProfileStep4,
    },

    // 홈
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/dictionary",
      name: "dictionary",
      component: Dictionary,
    },
    {
      path: "/notification",
      name: "Notification",
      component: Notification,
    },
    {
      path: "/quiz",
      name: "Quiz",
      component: Quiz,
    },

    // 재테크
    {
      path: "/finance",
      name: "FinanceHome",
      component: FinanceHome,
    },

    // 내 자산
    {
      path: "/openbanking",
      name: "OpenBankingHome",
      component: OpenBankingHome,
    },

    // 챌린지
    {
      path: "/challenge",
      name: "ChallengeHome",
      component: ChallengeHome,
    },

    // ARS
    {
      path: "/ars-auth",
      name: "ARSAuth",
      component: ArsAuth,
    },
    {
      path: "/ars/verification",
      name: "ArsVerification",
      component: ArsVerification,
    },

    // 마이페이지
    {
      path: "/mypage",
      name: "mypage",
      component: Mypage,
    },
    {
      path: "/withdraw",
      name: "withdraw",
      component: Withdraw,
    },
    {
      path: "/withdraw-success",
      name: "withdraw-success",
      component: WithdrawSuccess,
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
    },
    {
      path: "/quiz-history",
      name: "quiz-history",
      component: QuizHistory,
    },
    {
      path: "/avatar-shop",
      name: "avatar-shop",
      component: AvatarShop,
    },
  ],
});

export default router;
