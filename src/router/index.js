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

import MyPageView from "../pages/mypage/MyPageView.vue";
import WithdrawView from "../pages/mypage/WithdrawView.vue";
import WithdrawSuccessView from "../pages/mypage/WithdrawSuccessView.vue";
import ProfileView from "../pages/mypage/ProfileView.vue";
import QuizHistoryView from "../pages/mypage/QuizHistoryView.vue";
import DictionaryView from "../pages/mypage/DictionaryView.vue";
import AvatarShopView from "../pages/mypage/AvatarShopView.vue";

import Home from "../pages/home/Home.vue";
import Notification from "../pages/home/Notification.vue";
import Quiz from "../pages/home/Quiz.vue";

import FinanceHome from "../pages/finance/FinanceHome.vue";
import OpenBankingHome from "../pages/openbanking/OpenBankingHome.vue";
import ChallengeHome from "../pages/challenge/ChallengeHome.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    {
      path: "/home",
      name: "Home",
      component: Home,
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
    {
      path: "/finance",
      name: "FinanceHome",
      component: FinanceHome,
    },
    {
      path: "/openbanking",
      name: "OpenBankingHome",
      component: OpenBankingHome,
    },
    {
      path: "/challenge",
      name: "ChallengeHome",
      component: ChallengeHome,
    },
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
    {
      path: "/mypage",
      name: "mypage",
      component: MyPageView,
    },
    {
      path: "/withdraw",
      name: "withdraw",
      component: WithdrawView,
    },
    {
      path: "/withdraw-success",
      name: "withdraw-success",
      component: WithdrawSuccessView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/quiz-history",
      name: "quiz-history",
      component: QuizHistoryView,
    },
    {
      path: "/dictionary",
      name: "dictionary",
      component: DictionaryView,
    },
    {
      path: "/avatar-shop",
      name: "AvatarShop",
      component: AvatarShopView,
    },
  ],
});

export default router;
