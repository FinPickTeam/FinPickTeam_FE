import ProfileStep5 from '../pages/mypage/financetest/ProfileStep5.vue';
import ProfileStep6 from '../pages/mypage/financetest/ProfileStep6.vue';
import ProfileStep7 from '../pages/mypage/financetest/ProfileStep7.vue';
import ProfileStep8 from '../pages/mypage/financetest/ProfileStep8.vue';
import ProfileStep9 from '../pages/mypage/financetest/ProfileStep9.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ArsAuth from '../pages/ars/ArsAuth.vue';
import ArsVerification from '../pages/ars/ArsVerification.vue';
import ArsComplete from '../pages/ars/ArsComplete.vue';
import ArsFail from '../pages/ars/ArsFail.vue';

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
import MyCertificates from '../pages/mypage/MyCertificates.vue';
import CertificateCreate from '../pages/mypage/CertificateCreate.vue';
import CertificateCreateVerify from '../pages/mypage/CertificateCreateVerify.vue';
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
import ProductInputForm_installment from '../components/finance/installment/ProductInputForm_installment.vue';
import ProductCard from '../components/finance/deposit/ProductCard_deposit.vue';
import ProductCardList_deposit from '../components/finance/deposit/ProductCardList_deposit.vue';
import ProductCard_stock from '../components/finance/stock/ProductCard_stock.vue';
import ProductCardList_stock from '../components/finance/stock/ProductCardList_stock.vue';
import ProductCard_fund from '../components/finance/fund/ProductCard_fund.vue';
import ProductCardList_fund from '../components/finance/fund/ProductCardList_fund.vue';
import ProductCard_installment from '../components/finance/installment/ProductCard_installment.vue';

import OpenBankingHome from '../pages/openbanking/OpenBankingHome.vue';

// 챌린지
import ChallengeHome from '../pages/challenge/ChallengeHome.vue';
import ChallengeHome2 from '../pages/challenge/ChallengeHome2.vue';

// 공통 레이아웃
import MainLayout from '../layouts/MainLayout.vue';
import ChallengeLayout from '../layouts/ChallengeLayout.vue';

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
    {
      path: '/finance/product-card-list-fund',
      name: 'ProductCardListFund',
      component: ProductCardList_fund,
    },
    {
      path: '/finance/product-card-fund',
      name: 'ProductCardFund',
      component: ProductCard_fund,
    },
    {
      path: '/finance/product-input-form-installment',
      name: 'ProductInputFormInstallment',
      component: ProductInputForm_installment,
    },

    {
      path: '/finance/product-card-installment',
      name: 'ProductCardInstallment',
      component: ProductCard_installment,
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
      path: '/auth/signupcomplete',
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
      path: '/mypage/financetest/profile-step-5',
      name: 'ProfileStep5',
      component: ProfileStep5,
    },
    {
      path: '/mypage/financetest/profile-step-6',
      name: 'ProfileStep6',
      component: ProfileStep6,
    },
    {
      path: '/mypage/financetest/profile-step-7',
      name: 'ProfileStep7',
      component: ProfileStep7,
    },
    {
      path: '/mypage/financetest/profile-step-8',
      name: 'ProfileStep8',
      component: ProfileStep8,
    },
    {
      path: '/mypage/financetest/profile-step-9',
      name: 'ProfileStep9',
      component: ProfileStep9,
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
      path: '/ars/complete',
      name: 'ArsComplete',
      component: ArsComplete,
    },
    {
      path: '/ars/fail',
      name: 'ArsFail',
      component: ArsFail,
    },
    {
      path: '/ars/link-banking',
      name: 'ArsLinkBanking',
      component: () => import('../pages/ars/ArsLinkBanking.vue'),
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
          path: 'openbanking/daily-report',
          name: 'OpenbankingDailyReport',
          component: () =>
            import('../pages/openbanking/OpenbankingDailyReport.vue'),
        },
        {
          path: 'openbanking/monthly-report',
          name: 'OpenbankingMonthlyReport',
          component: () =>
            import('../pages/openbanking/OpenbankingMonthlyReport.vue'),
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
        {
          path: 'mycertificate',
          name: 'mycertificate',
          component: MyCertificates,
        },
        {
          path: 'certificate-create',
          name: 'certificate-create',
          component: CertificateCreate,
        },
        {
          path: 'certificate-create-verify',
          name: 'certificate-create-verify',
          component: CertificateCreateVerify,
        },
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
        {
          path: 'installment/:id',
          name: 'InstallmentDetail',
          component: () => import('../pages/finance/InstallmentDetail.vue'),
        },
        {
          path: 'deposit/:id',
          name: 'DepositDetail',
          component: () => import('../pages/finance/DepositDetail.vue'),
        },
        {
          path: 'fund/:id',
          name: 'FundDetail',
          component: () => import('../pages/finance/FundDetail.vue'),
        },
        // ... 추가 재테크 탭들
      ],
    },
    {
      path: '/challenge2',
      component: ChallengeLayout,
      children: [
        { path: '', name: 'ChallengeHome2', component: ChallengeHome2 },
        {
          path: 'joined-list',
          name: 'ChallengeJoinedList',
          component: () => import('../pages/challenge/ChallengeJoinedList.vue'),
        },
        {
          path: 'recruiting-list',
          name: 'ChallengeRecruitingList',
          component: () =>
            import('../pages/challenge/ChallengeRecruitingList.vue'),
        },
        {
          path: 'create',
          name: 'ChallengeCreate',
          component: () => import('../pages/challenge/ChallengeCreate.vue'),
        },
        {
          path: 'ranking',
          name: 'ChallengeRanking',
          component: () => import('../pages/challenge/ChallengeRanking.vue'),
        },
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
