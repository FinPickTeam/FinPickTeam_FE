// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// layouts
import MainLayout from '../layouts/MainLayout.vue';
import FinanceLayout from '@/layouts/FinanceLayout.vue';
import ChallengeLayout from '../layouts/ChallengeLayout.vue';
import OpenBankingLayout from '../layouts/OpenBankingLayout.vue';

// auth
import Login from '../pages/auth/Login.vue';
import Signup from '../pages/auth/Signup.vue';
import SignupComplete from '../pages/auth/SignupComplete.vue';
import ProfileStep1 from '../pages/auth/ProfileStep1.vue';
import ProfileStep2 from '../pages/auth/ProfileStep2.vue';
import ProfileStep3 from '../pages/auth/ProfileStep3.vue';
import ProfileStep4 from '../pages/auth/ProfileStep4.vue';
import ProfileStep5 from '../pages/auth/ProfileStep5.vue';
import ProfileComplete from '../pages/auth/ProfileComplete.vue';

// mypage (공통 컴포넌트 재사용)
import ProfileStep6 from '../pages/mypage/financetest/ProfileStep6.vue';
import ProfileStep7 from '../pages/mypage/financetest/ProfileStep7.vue';
import ProfileStep8 from '../pages/mypage/financetest/ProfileStep8.vue';
import ProfileStep9 from '../pages/mypage/financetest/ProfileStep9.vue';
import ProfileStep10 from '../pages/mypage/financetest/ProfileStep10.vue';

// ARS
import ArsAuth from '../pages/ars/ArsAuth.vue';
import ArsVerification from '../pages/ars/ArsVerification.vue';
import ArsComplete from '../pages/ars/ArsComplete.vue';
import ArsFail from '../pages/ars/ArsFail.vue';

// finance pages
import FinanceHome from '../pages/finance/FinanceHome.vue';
import Deposit from '../pages/finance/Deposit.vue';
import Installment from '../pages/finance/Installment.vue';
import Fund from '../pages/finance/Fund.vue';
import Stock from '../pages/finance/Stock.vue';
import FavoriteProducts from '../pages/finance/FavoriteProducts.vue';

// finance components (test routes)
import ProductInputForm from '../components/finance/deposit/ProductInputForm_deposit.vue';
import ProductInputForm_installment from '../components/finance/installment/ProductInputForm_installment.vue';
import ProductCard from '../components/finance/deposit/ProductCard_deposit.vue';
import ProductCardList_deposit from '../components/finance/deposit/ProductCardList_deposit.vue';
import ProductCard_stock from '../components/finance/stock/ProductCard_stock.vue';
import ProductCardList_stock from '../components/finance/stock/ProductCardList_stock.vue';
import ProductCard_fund from '../components/finance/fund/ProductCard_fund.vue';
import ProductCardList_fund from '../components/finance/fund/ProductCardList_fund.vue';
import ProductCard_installment from '../components/finance/installment/ProductCard_installment.vue';

// home/misc
import Home from '../pages/home/Home.vue';
import Notification from '../pages/home/Notification.vue';
import Quiz from '../pages/home/Quiz.vue';
import Dictionary from '../pages/home/Dictionary.vue';
import Mypage from '../pages/mypage/Mypage.vue';
import Withdraw from '../pages/mypage/Withdraw.vue';
import WithdrawSuccess from '../pages/mypage/WithdrawSuccess.vue';
import Profile from '../pages/mypage/Profile.vue';
import MyHistory from '../pages/mypage/MyHistory.vue';
import MyCertificates from '../pages/mypage/MyCertificate/MyCertificates.vue';
import CertificateDetail from '../pages/mypage/MyCertificate/CertificateDetail.vue';
import CertificatePasswordChange from '../pages/mypage/MyCertificate/CertificatePasswordChange.vue';
import CertificatePasswordChangeNew from '../pages/mypage/MyCertificate/CertificatePassword-Change-New.vue';
import CertificatePasswordChangeConfirm from '../pages/mypage/MyCertificate/CertificatePassword-Change-Confirm.vue';
import CustomerSupport from '../pages/mypage/CustomerSupport.vue';
import AvatarShop from '../pages/mypage/avatar/AvatarShop.vue';

// openbanking
import OpenBankingHome from '../pages/openbanking/OpenBankingHome.vue';
import AccountLinkSelect from '../pages/openbanking/openAuth/AccountLinkSelect.vue';
import AccountAgreement from '../pages/openbanking/openAuth/AccountAgreement.vue';
import CreateCertificate from '../pages/openbanking/openAuth/CertificateCreate.vue';
import SetCertificatePassword from '../pages/openbanking/openAuth/CertificateSetPassword.vue';
import ConfirmCertificatePassword from '../pages/openbanking/openAuth/CertificateConfirmPass.vue'; // ✅ 오탈자 수정
import CertificateComplete from '../pages/openbanking/openAuth/CertificateComplete.vue';

import AccountList from '../pages/openbanking/myaccount/AccountList.vue';
import AccountDetail from '../pages/openbanking/myaccount/AccountDetail.vue';
import CardList from '../pages/openbanking/myaccount/CardList.vue';
import CardDetail from '../pages/openbanking/myaccount/CardDetail.vue';

// 보고서/캘린더
import OpenbankingMonthlyReport from '../pages/openbanking/Report/OpenbankingMonthlyReport.vue';
import OpenbankingCalendar from '../pages/openbanking/Report/OpenbankingCalendar.vue';
import CalendarSelect from '../pages/openbanking/Report/CalendarSelect.vue';
import CalendarDetail from '../pages/openbanking/Report/CalendarDetail.vue';

//챌린지
import ChallengeHome from '../pages/challenge/ChallengeHome.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 재테크 컴포넌트 테스트
    {
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

    // 로그인/회원가입/ARS (레이아웃 없이)
    { path: '/login', name: 'Login', component: Login },
    { path: '/signup', name: 'Signup', component: Signup },
    {
      path: '/auth/signup-complete',
      name: 'SignupComplete',
      component: SignupComplete,
    },
    { path: '/profile-step-1', name: 'ProfileStep1', component: ProfileStep1 },
    { path: '/profile-step-2', name: 'ProfileStep2', component: ProfileStep2 },
    { path: '/profile-step-3', name: 'ProfileStep3', component: ProfileStep3 },
    { path: '/profile-step-4', name: 'ProfileStep4', component: ProfileStep4 },
    { path: '/profile-step-5', name: 'ProfileStep5', component: ProfileStep5 },
    {
      path: '/profile-complete',
      name: 'ProfileComplete',
      component: ProfileComplete,
    },

    { path: '/ars-auth', name: 'ARSAuth', component: ArsAuth },
    {
      path: '/ars/verification',
      name: 'ArsVerification',
      component: ArsVerification,
    },
    { path: '/ars/complete', name: 'ArsComplete', component: ArsComplete },
    { path: '/ars/fail', name: 'ArsFail', component: ArsFail },

    // 오픈뱅킹 인증 (레이아웃 없이)
    {
      path: '/openbanking/ars-agreement',
      name: 'ObArsAgreement',
      component: () =>
        import('../pages/openbanking/openAuth/ObArsAgreement.vue'),
    },
    {
      path: '/openbanking/agreement',
      name: 'OpenBankingAgreement',
      component: () => import('../pages/openbanking/openAuth/ObAgreement.vue'),
    },
    {
      path: '/openbanking/account-link-select',
      name: 'AccountLinkSelect',
      component: AccountLinkSelect,
    },
    {
      path: '/openbanking/account-agreement',
      name: 'AccountAgreement',
      component: AccountAgreement,
    },

    // 인증서(레이아웃 없이)
    {
      path: '/openbanking/create-certificate',
      name: 'CreateCertificate',
      component: CreateCertificate,
    },
    {
      path: '/openbanking/set-certificate-password',
      name: 'SetCertificatePassword',
      component: SetCertificatePassword,
    },
    {
      path: '/openbanking/confirm-certificate-password',
      name: 'ConfirmCertificatePassword',
      component: ConfirmCertificatePassword,
    },
    {
      path: '/openbanking/certificate-complete',
      name: 'CertificateComplete',
      component: CertificateComplete,
    },

    // 메인 레이아웃
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', name: 'Home', component: Home },
        { path: 'dictionary', name: 'dictionary', component: Dictionary },
        { path: 'notification', name: 'Notification', component: Notification },
        { path: 'quiz', name: 'Quiz', component: Quiz },
        { path: 'finance', name: 'FinanceHome', component: FinanceHome },

        // 오픈뱅킹 (MainLayout 하위)
        {
          path: 'openbanking',
          name: 'OpenBankingHome',
          component: OpenBankingHome,
        },

        // 마이페이지
        { path: 'mypage', name: 'mypage', component: Mypage },
        { path: 'profile', name: 'profile', component: Profile },
        { path: 'my-history', name: 'my-history', component: MyHistory },
        {
          path: 'mycertificate',
          name: 'mycertificate',
          component: MyCertificates,
        },
        {
          path: 'certificate-detail',
          name: 'certificate-detail',
          component: CertificateDetail,
        },
        {
          path: 'customer-support',
          name: 'customer-support',
          component: CustomerSupport,
        },
        { path: 'avatar-shop', name: 'avatar-shop', component: AvatarShop },
      ],
    },

    // 파이낸스 레이아웃
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
        {
          path: 'stock/:id',
          name: 'StockDetail',
          component: () => import('../pages/finance/StockDetail.vue'),
        },
      ],
    },

    // 챌린지 레이아웃
    {
      path: '/challenge',
      component: ChallengeLayout,
      children: [
        { path: '', name: 'ChallengeHome', component: ChallengeHome },
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
        {
          path: 'common-detail/:id',
          name: 'ChallengeCommonDetail',
          component: () =>
            import('../pages/challenge/ChallengeCommonDetail.vue'),
        },
        {
          path: 'group-detail/:id',
          name: 'ChallengeGroupDetail',
          component: () =>
            import('../pages/challenge/ChallengeGroupDetail.vue'),
        },
        {
          path: 'personal-detail/:id',
          name: 'ChallengePersonalDetail',
          component: () =>
            import('../pages/challenge/ChallengePersonalDetail.vue'),
        },
      ],
    },

    // 오픈뱅킹 레이아웃
    {
      path: '/openbanking',
      component: OpenBankingLayout,
      children: [
        {
          path: 'myhome',
          name: 'OpenBankingMyHome',
          component: () => import('../pages/openbanking/OpenBankingMyHome.vue'),
        },
        {
          path: 'account-list',
          name: 'AccountList',
          component: AccountList,
        },
        {
          path: 'account-detail/:accountId',
          name: 'AccountDetail',
          component: AccountDetail,
          props: true,
        },
        {
          path: 'card-list',
          name: 'CardList',
          component: CardList,
        },
        {
          path: 'card-detail/:cardId',
          name: 'CardDetail',
          component: CardDetail,
          props: true,
        },
        {
          path: 'calendar',
          name: 'OpenbankingCalendar',
          component: OpenbankingCalendar,
        },
        {
          path: 'calendar/select',
          name: 'CalendarSelect',
          component: CalendarSelect,
        },
        {
          path: 'calendar/detail/:id',
          name: 'CalendarDetail',
          component: CalendarDetail,
          props: true,
        },
        {
          path: 'monthly-report',
          name: 'OpenbankingMonthlyReport',
          component: OpenbankingMonthlyReport,
        },
      ],
    },

    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../pages/home/404/404.vue'),
    },
  ],
});

import { useAuthStore } from '@/stores/auth';

router.beforeEach(async (to) => {
  const publicPages = new Set([
    'Login',
    'Signup',
    'SignupComplete',
    'ProfileStep1',
    'ProfileStep2',
    'ProfileStep3',
    'ProfileStep4',
    'ProfileStep5',
    'MypageProfileStep1',
    'MypageProfileStep2',
    'MypageProfileStep3',
    'MypageProfileStep4',
    'MypageProfileStep5',
    'ProfileStep6',
    'ProfileStep7',
    'ProfileStep8',
    'ProfileStep9',
    'ProfileStep10',
    'ARSAuth',
    'ArsVerification',
    'ArsComplete',
    'ArsFail',
  ]);

  const auth = useAuthStore();
  const isPublic = to.name && publicPages.has(String(to.name));
  if (!isPublic) {
    await auth.bootstrap();
    if (!auth.isAuthenticated) {
      return { name: 'Login', query: { redirect: to.fullPath } };
    }
  }
});

export default router;
