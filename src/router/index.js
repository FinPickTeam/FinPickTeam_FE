// ProfileStep5 파일이 존재하지 않으므로 임포트 제거
// import ProfileStep5 from '../pages/mypage/financetest/ProfileStep10.vue';
import ProfileStep6 from '../pages/mypage/financetest/ProfileStep6.vue';
import ProfileStep10 from '../pages/mypage/financetest/ProfileStep10.vue';
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
import ProfileStep5 from '../pages/auth/ProfileStep5.vue';
import ProfileComplete from '../pages/auth/ProfileComplete.vue';

// mypage
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
import StockCompare from '@/pages/finance/StockCompare.vue';

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
import AccountLinkSelect from '../pages/openbanking/openAuth/AccountLinkSelect.vue';
import AccountAgreement from '../pages/openbanking/openAuth/AccountAgreement.vue';

// 핀픽 인증서 관련 컴포넌트들
import CreateCertificate from '../pages/openbanking/openAuth/CertificateCreate.vue';
import SetCertificatePassword from '../pages/openbanking/openAuth/CertificateSetPassword.vue';
import ConfirmCertificatePassword from '../pages/openbanking/openAuth/CrrtificateConfirmPass.vue';
import CertificateComplete from '../pages/openbanking/openAuth/CertificateComplete.vue';

import AccountList from '../pages/openbanking/myaccount/AccountList.vue';
import AccountDetail from '../pages/openbanking/myaccount/AccountDetail.vue';
import CardList from '../pages/openbanking/myaccount/CardList.vue';
import ChallengeHome from '../pages/challenge/ChallengeHome.vue';
import ChallengeJoinedList from '../pages/challenge/ChallengeJoinedList.vue';
import ChallengeRecruitingList from '../pages/challenge/ChallengeRecruitingList.vue';
import ChallengeCreate from '../pages/challenge/ChallengeCreate.vue';
import ChallengeRanking from '../pages/challenge/ChallengeRanking.vue';
import ChallengeCommonDetail from '../pages/challenge/ChallengeCommonDetail.vue';
import ChallengeGroupDetail from '../pages/challenge/ChallengeGroupDetail.vue';
import ChallengePersonalDetail from '../pages/challenge/ChallengePersonalDetail.vue';
import OpenbankingDailyReport from '../pages/openbanking/Report/OpenbankingDailyReport.vue';
import OpenbankingMonthlyReport from '../pages/openbanking/Report/OpenbankingMonthlyReport.vue';
import DailyReportSelect from '../pages/openbanking/Report/DailyReportSelect.vue';
import DailyReportDetail from '../pages/openbanking/Report/DailyReportDetail.vue';

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
      path: '/auth/signup-complete',
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
      path: '/profile-step-5',
      name: 'ProfileStep5',
      component: ProfileStep5,
    },
    {
      path: '/profile-complete',
      name: 'ProfileComplete',
      component: ProfileComplete,
    },

    // 마이페이지용 ProfileStep1~5 (공통 컴포넌트 사용)
    {
      path: '/mypage/financetest/profile-step-1',
      name: 'MypageProfileStep1',
      component: ProfileStep1,
    },
    {
      path: '/mypage/financetest/profile-step-2',
      name: 'MypageProfileStep2',
      component: ProfileStep2,
    },
    {
      path: '/mypage/financetest/profile-step-3',
      name: 'MypageProfileStep3',
      component: ProfileStep3,
    },
    {
      path: '/mypage/financetest/profile-step-4',
      name: 'MypageProfileStep4',
      component: ProfileStep4,
    },
    {
      path: '/mypage/financetest/profile-step-5',
      name: 'MypageProfileStep5',
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
      path: '/mypage/financetest/profile-step-10',
      name: 'ProfileStep10',
      component: ProfileStep10,
    },
    {
      path: '/certificate-password-change',
      name: 'certificate-password-change',
      component: CertificatePasswordChange,
    },
    {
      path: '/certificate-password-change-new',
      name: 'certificate-password-change-new',
      component: CertificatePasswordChangeNew,
    },
    {
      path: '/certificate-password-change-confirm',
      name: 'certificate-password-change-confirm',
      component: CertificatePasswordChangeConfirm,
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
    {
      path: '/withdraw',
      name: 'withdraw',
      component: Withdraw,
    },
    {
      path: '/withdraw-success',
      name: 'withdraw-success',
      component: WithdrawSuccess,
    },
    // 핀픽 인증서 (상단/하단 레이아웃 없음)
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
          component: OpenbankingDailyReport,
        },
        {
          path: 'openbanking/monthly-report',
          name: 'OpenbankingMonthlyReport',
          component: OpenbankingMonthlyReport,
        },
        {
          path: 'openbanking/daily-report-select',
          name: 'DailyReportSelect',
          component: DailyReportSelect,
        },
        {
          path: 'openbanking/daily-report-detail/:id',
          name: 'DailyReportDetail',
          component: DailyReportDetail,
        },

        {
          path: 'openbanking/ars-agreement',
          name: 'ObArsAgreement',
          component: () =>
            import('../pages/openbanking/openAuth/ObArsAgreement.vue'),
        },
        {
          path: 'openbanking/agreement',
          name: 'OpenBankingAgreement',
          component: () =>
            import('../pages/openbanking/openAuth/ObAgreement.vue'),
        },
        {
          path: 'openbanking/account-link-select',
          name: 'AccountLinkSelect',
          component: AccountLinkSelect,
        },
        {
          path: 'openbanking/account-agreement',
          name: 'AccountAgreement',
          component: AccountAgreement,
        },

        {
          path: 'openbanking/account-list',
          name: 'AccountList',
          component: AccountList,
        },
        {
          path: 'openbanking/account-detail/:accountId',
          name: 'AccountDetail',
          component: AccountDetail,
        },
        {
          path: 'openbanking/card-list',
          name: 'CardList',
          component: CardList,
        },
        {
          path: 'openbanking/card-detail/:cardId',
          name: 'CardDetail',
          component: () =>
            import('../pages/openbanking/myaccount/CardDetail.vue'),
        },

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
        {
          path: 'stock/compare/:id',
          name: 'StockCompare',
          component: StockCompare,
        },
        // ... 추가 재테크 탭들
      ],
    },
    {
      path: '/challenge',
      component: ChallengeLayout,
      children: [
        { path: '', name: 'ChallengeHome', component: ChallengeHome },
        {
          path: 'joined-list',
          name: 'ChallengeJoinedList',
          component: ChallengeJoinedList,
        },
        {
          path: 'recruiting-list',
          name: 'ChallengeRecruitingList',
          component: ChallengeRecruitingList,
        },
        {
          path: 'create',
          name: 'ChallengeCreate',
          component: ChallengeCreate,
        },
        {
          path: 'ranking',
          name: 'ChallengeRanking',
          component: ChallengeRanking,
        },
        {
          path: 'common-detail/:id',
          name: 'ChallengeCommonDetail',
          component: ChallengeCommonDetail,
        },
        {
          path: 'group-detail/:id',
          name: 'ChallengeGroupDetail',
          component: ChallengeGroupDetail,
        },
        {
          path: 'personal-detail/:id',
          name: 'ChallengePersonalDetail',
          component: ChallengePersonalDetail,
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

  // 보호 라우트면 인증 체크
  if (!publicPages.has(to.name)) {
    // 이미 인증된 상태라면 bootstrap 호출하지 않음
    if (!auth.isAuthenticated) {
      await auth.bootstrap();
      if (!auth.isAuthenticated) {
        return { name: 'Login', query: { redirect: to.fullPath } };
      }
    }
  }
});

export default router;
