import { createRouter, createWebHistory } from 'vue-router';
import ArsAuth from '../pages/ars/ArsAuth.vue';
import ArsVerification from '../pages/ars/ArsVerification.vue';

// auth
import Login from '../pages/auth/Login.vue';
import Signup from '../pages/auth/Signup.vue';
import SignupComplete from '../pages/auth/SignupComplete.vue';
import ProfileStep1 from '../pages/auth/ProfileStep1.vue';
import ProfileStep2 from '../pages/auth/ProfileStep2.vue';
import ProfileStep3 from '../pages/auth/ProfileStep3.vue';
import ProfileStep4 from '../pages/auth/ProfileStep4.vue';

// mypage
import Mypage from '../pages/mypage/Mypage.vue';
import Withdraw from '../pages/mypage/Withdraw.vue';
import WithdrawSuccess from '../pages/mypage/WithdrawSuccess.vue';
import Profile from '../pages/mypage/Profile.vue';
import QuizHistory from '../pages/mypage/QuizHistory.vue';
import Dictionary from '../pages/home/Dictionary.vue';
import AvatarShop from '../pages/mypage/avatar/AvatarShop.vue';

// home
import Home from '../pages/home/Home.vue';
import Notification from '../pages/home/Notification.vue';
import Quiz from '../pages/home/Quiz.vue';

// finance
import FinanceLayout from '@/layouts/FinanceLayout.vue';
import FinanceHome from '../pages/finance/FinanceHome.vue';
import Deposit from '../pages/finance/Deposit.vue';
import Installment from '../pages/finance/Installment.vue';
import Fund from '../pages/finance/Fund.vue';
import Stock from '../pages/finance/Stock.vue';
import FavoriteProducts from '../pages/finance/FavoriteProducts.vue';

// 재테크 컴포넌트
import ProductInputForm from '../components/finance/deposit/ProductInputForm_deposit.vue';
import ProductCard from '../components/finance/deposit/ProductCard_deposit.vue';
import ProductCardList_deposit from '../components/finance/deposit/ProductCardList_deposit.vue';
import ProductCard_stock from '../components/finance/stock/ProductCard_stock.vue';
import ProductCardList_stock from '../components/finance/stock/ProductCardList_stock.vue';

import OpenBankingHome from '../pages/openbanking/OpenBankingHome.vue';
import ChallengeHome from '../pages/challenge/ChallengeHome.vue';

// 공통 레이아웃
import MainLayout from '../layouts/MainLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 재테크 컴포넌트 테스트
      path: '/finance/product-input-form',
      name: 'ProductInputForm',
      component: ProductInputForm,
    },
    {
      path: '/finance/product-card',
      name: 'ProductCard',
      component: ProductCard,
    },
    {
      path: '/finance/product-card-list-deposit',
      name: 'ProductCardList',
      component: ProductCardList_deposit,
    },
    {
      path: '/finance/product-card-list-stock',
      name: 'ProductCardListStock',
      component: ProductCardList_stock,
    },
    {
      path: '/finance/product-card-stock',
      name: 'ProductCardStock',
      component: ProductCard_stock,
    },

    // 로그인, 회원가입, ARS 등은 레이아웃 없이 단독 페이지로 유지
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
    },
    {
      path: '/signup-complete',
      name: 'SignupComplete',
      component: SignupComplete,
    },
    {
      path: '/profile-step-1',
      name: 'ProfileStep1',
      component: ProfileStep1,
    },
    {
      path: '/profile-step-2',
      name: 'ProfileStep2',
      component: ProfileStep2,
    },
    {
      path: '/profile-step-3',
      name: 'ProfileStep3',
      component: ProfileStep3,
    },
    {
      path: '/profile-step-4',
      name: 'ProfileStep4',
      component: ProfileStep4,
    },
    {
      path: '/ars-auth',
      name: 'ARSAuth',
      component: ArsAuth,
    },
    {
      path: '/ars/verification',
      name: 'ArsVerification',
      component: ArsVerification,
    },
    {
      path: '/finance/favorite-products',
      name: 'FavoriteProducts',
      component: FavoriteProducts,
    },

    // 공통 레이아웃 적용 구간
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', name: 'Home', component: Home },
        { path: 'dictionary', name: 'dictionary', component: Dictionary },
        { path: 'notification', name: 'Notification', component: Notification },
        { path: 'quiz', name: 'Quiz', component: Quiz },
        // 재테크
        { path: 'finance', name: 'FinanceHome', component: FinanceHome },
        { path: 'finance/deposit', name: 'Deposit', component: Deposit },
        {
          path: 'finance/installment',
          name: 'Installment',
          component: Installment,
        },
        { path: 'finance/fund', name: 'Fund', component: Fund },
        { path: 'finance/stock', name: 'Stock', component: Stock },
        // 내 자산
        {
          path: 'openbanking',
          name: 'OpenBankingHome',
          component: OpenBankingHome,
        },
        {
          path: 'openbanking/myhome',
          name: 'OpenBankingMyHome',
          component: () => import('../pages/openbanking/OpenBankingMyHome.vue'),
        },
        {
          path: 'openbanking/diaryhome',
          name: 'DiaryHome',
          component: () => import('../pages/openbanking/DiaryHome.vue'),
        },
        {
          path: 'openbanking/diary',
          name: 'Diary',
          component: () => import('../pages/openbanking/Diary.vue'),
        },
        {
          path: 'openbanking/agreement',
          name: 'OpenBankingAgreement',
          component: () => import('../pages/openbanking/ObAgreement.vue'),
        },
        {
          path: 'openbanking/ars-agreement',
          name: 'ObArsAgreement',
          component: () => import('../pages/openbanking/ObArsAgreement.vue'),
        },
        // 챌린지
        { path: 'challenge', name: 'ChallengeHome', component: ChallengeHome },
        // 마이페이지
        { path: 'mypage', name: 'mypage', component: Mypage },
        { path: 'withdraw', name: 'withdraw', component: Withdraw },
        {
          path: 'withdraw-success',
          name: 'withdraw-success',
          component: WithdrawSuccess,
        },
        { path: 'profile', name: 'profile', component: Profile },
        { path: 'quiz-history', name: 'quiz-history', component: QuizHistory },
        { path: 'avatar-shop', name: 'avatar-shop', component: AvatarShop },
      ],
    },
    {
      path: '/finance',
      component: FinanceLayout,
      children: [
        { path: 'deposit', name: 'Deposit', component: Deposit },
        { path: 'fund', name: 'Fund', component: Fund },
        { path: 'stock', name: 'Stock', component: Stock },
        { path: 'installment', name: 'Installment', component: Installment },
        // ... 추가 재테크 탭들
      ],
    },
    // 404 Not Found catch-all
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../pages/home/404/404.vue'),
    },
  ],
});

export default router;
