// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// layouts
import MainLayout from "../layouts/MainLayout.vue";
import FinanceLayout from "@/layouts/FinanceLayout.vue";
import ChallengeLayout from "../layouts/ChallengeLayout.vue";
import OpenBankingLayout from "../layouts/OpenBankingLayout.vue";

// auth
import Login from "../pages/auth/Login.vue";
import Signup from "../pages/auth/Signup.vue";
import SignupComplete from "../pages/auth/SignupComplete.vue";
import ProfileStep1 from "../pages/auth/ProfileStep1.vue";
import ProfileStep2 from "../pages/auth/ProfileStep2.vue";
import ProfileStep3 from "../pages/auth/ProfileStep3.vue";
import ProfileStep4 from "../pages/auth/ProfileStep4.vue";
import ProfileStep5 from "../pages/auth/ProfileStep5.vue";
import ProfileComplete from "../pages/auth/ProfileComplete.vue";

// mypage (공통 컴포넌트 재사용)
import ProfileStep6 from "../pages/mypage/financetest/ProfileStep6.vue";
import ProfileStep7 from "../pages/mypage/financetest/ProfileStep7.vue";
import ProfileStep8 from "../pages/mypage/financetest/ProfileStep8.vue";
import ProfileStep9 from "../pages/mypage/financetest/ProfileStep9.vue";
import ProfileStep10 from "../pages/mypage/financetest/ProfileStep10.vue";

// ARS
import ArsAuth from "../pages/ars/ArsAuth.vue";
import ArsVerification from "../pages/ars/ArsVerification.vue";
import ArsComplete from "../pages/ars/ArsComplete.vue";
import ArsFail from "../pages/ars/ArsFail.vue";

// finance pages
import FinanceHome from "../pages/finance/FinanceHome.vue";
import Deposit from "../pages/finance/Deposit.vue";
import Installment from "../pages/finance/Installment.vue";
import Fund from "../pages/finance/Fund.vue";
import Stock from "../pages/finance/Stock.vue";
import FavoriteProducts from "../pages/finance/FavoriteProducts.vue";
import StockCompare from "@/pages/finance/StockCompare.vue";

// finance components (test routes)
import ProductInputForm from "../components/finance/deposit/ProductInputForm_deposit.vue";
import ProductInputForm_installment from "../components/finance/installment/ProductInputForm_installment.vue";
import ProductCard from "../components/finance/deposit/ProductCard_deposit.vue";
import ProductCardList_deposit from "../components/finance/deposit/ProductCardList_deposit.vue";
import ProductCard_stock from "../components/finance/stock/ProductCard_stock.vue";
import ProductCardList_stock from "../components/finance/stock/ProductCardList_stock.vue";
import ProductCard_fund from "../components/finance/fund/ProductCard_fund.vue";
import ProductCardList_fund from "../components/finance/fund/ProductCardList_fund.vue";
import ProductCard_installment from "../components/finance/installment/ProductCard_installment.vue";

// home/misc
import Home from "../pages/home/Home.vue";
import Notification from "../pages/home/Notification.vue";
import Quiz from "../pages/home/Quiz.vue";
import Dictionary from "../pages/home/Dictionary.vue";
import Mypage from "../pages/mypage/Mypage.vue";
import Withdraw from "../pages/mypage/Withdraw.vue";
import WithdrawSuccess from "../pages/mypage/WithdrawSuccess.vue";
import Profile from "../pages/mypage/Profile.vue";
import MyHistory from "../pages/mypage/MyHistory.vue";
import MyCertificates from "../pages/mypage/MyCertificate/MyCertificates.vue";
import CertificateDetail from "../pages/mypage/MyCertificate/CertificateDetail.vue";
import CertificatePasswordChange from "../pages/mypage/MyCertificate/CertificatePasswordChange.vue";
import CertificatePasswordChangeNew from "../pages/mypage/MyCertificate/CertificatePassword-Change-New.vue";
import CertificatePasswordChangeConfirm from "../pages/mypage/MyCertificate/CertificatePassword-Change-Confirm.vue";
import CustomerSupport from "../pages/mypage/CustomerSupport.vue";
import AvatarShop from "../pages/mypage/avatar/AvatarShop2.vue";

// openbanking
import OpenBankingHome from "../pages/openbanking/OpenBankingHome.vue";
import AccountLinkSelect from "../pages/openbanking/openAuth/AccountLinkSelect.vue";
import AccountAgreement from "../pages/openbanking/openAuth/AccountAgreement.vue";
import OpenBankingPinAuth from "../pages/openbanking/OpenBankingPinAuth.vue";

// 핀픽 인증서 관련 컴포넌트들
import CreateCertificate from "../pages/openbanking/openAuth/CertificateCreate.vue";
import SetCertificatePassword from "../pages/openbanking/openAuth/CertificateSetPassword.vue";
import ConfirmCertificatePassword from "../pages/openbanking/openAuth/CertificateConfirmPass.vue";
import CertificateComplete from "../pages/openbanking/openAuth/CertificateComplete.vue";

import AccountList from "../pages/openbanking/myaccount/AccountList.vue";
import AccountDetail from "../pages/openbanking/myaccount/AccountDetail.vue";
import CardList from "../pages/openbanking/myaccount/CardList.vue";
import CardDetail from "../pages/openbanking/myaccount/CardDetail.vue";
import OpenbankingMonthlyReport from "../pages/openbanking/Report/OpenbankingMonthlyReport.vue";
import OpenbankingCalendar from "../pages/openbanking/Report/OpenbankingCalendar.vue";
import CalendarSelect from "../pages/openbanking/Report/CalendarSelect.vue";
import CalendarDetail from "../pages/openbanking/Report/CalendarDetail.vue";

// 챌린지
import ChallengeHome from "../pages/challenge/ChallengeHome.vue";
import ChallengeJoinedList from "../pages/challenge/ChallengeJoinedList.vue";
import ChallengeRecruitingList from "../pages/challenge/ChallengeRecruitingList.vue";
import ChallengeCreate from "../pages/challenge/ChallengeCreate.vue";
import ChallengeRanking from "../pages/challenge/ChallengeRanking.vue";
import ChallengeCommonDetail from "../pages/challenge/ChallengeCommonDetail.vue";
import ChallengeGroupDetail from "../pages/challenge/ChallengeGroupDetail.vue";
import ChallengePersonalDetail from "../pages/challenge/ChallengePersonalDetail.vue";

// admin
import AdminLayout from "@/layouts/AdminLayout.vue";
import AdminHome from "@/pages/admin/AdminHome.vue";
import AdminCommonChallenge from "@/pages/admin/AdminCommonChallenge.vue";
import AdminSupport from "@/pages/admin/AdminSupport.vue";
import AdminFaq from "@/pages/admin/AdminFaq.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 재테크 컴포넌트 테스트
    {
      path: "/finance/product-input-form",
      name: "ProductInputForm",
      component: ProductInputForm,
    },
    {
      path: "/finance/product-card",
      name: "ProductCard",
      component: ProductCard,
    },
    {
      path: "/finance/product-card-list-deposit",
      name: "ProductCardList",
      component: ProductCardList_deposit,
    },
    {
      path: "/finance/product-card-list-stock",
      name: "ProductCardListStock",
      component: ProductCardList_stock,
    },
    {
      path: "/finance/product-card-stock",
      name: "ProductCardStock",
      component: ProductCard_stock,
    },
    {
      path: "/finance/product-card-list-fund",
      name: "ProductCardListFund",
      component: ProductCardList_fund,
    },
    {
      path: "/finance/product-card-fund",
      name: "ProductCardFund",
      component: ProductCard_fund,
    },
    {
      path: "/finance/product-input-form-installment",
      name: "ProductInputFormInstallment",
      component: ProductInputForm_installment,
    },
    {
      path: "/finance/product-card-installment",
      name: "ProductCardInstallment",
      component: ProductCard_installment,
    },
    {
      path: "/finance/favorite-products",
      name: "FavoriteProducts",
      component: FavoriteProducts,
    },

    // 로그인/회원가입/ARS (레이아웃 없이)
    { path: "/login", name: "Login", component: Login },
    { path: "/signup", name: "Signup", component: Signup },
    {
      path: "/auth/signup-complete",
      name: "SignupComplete",
      component: SignupComplete,
    },
    { path: "/profile-step-1", name: "ProfileStep1", component: ProfileStep1 },
    { path: "/profile-step-2", name: "ProfileStep2", component: ProfileStep2 },
    { path: "/profile-step-3", name: "ProfileStep3", component: ProfileStep3 },
    { path: "/profile-step-4", name: "ProfileStep4", component: ProfileStep4 },
    { path: "/profile-step-5", name: "ProfileStep5", component: ProfileStep5 },
    {
      path: "/profile-complete",
      name: "ProfileComplete",
      component: ProfileComplete,
    },

    // 마이페이지 finance test ProfileStep6~10
    {
      path: "/profile-step-6",
      name: "ProfileStep6",
      component: ProfileStep6,
    },
    {
      path: "/profile-step-7",
      name: "ProfileStep7",
      component: ProfileStep7,
    },
    {
      path: "/profile-step-8",
      name: "ProfileStep8",
      component: ProfileStep8,
    },
    {
      path: "/profile-step-9",
      name: "ProfileStep9",
      component: ProfileStep9,
    },
    {
      path: "/profile-step-10",
      name: "ProfileStep10",
      component: ProfileStep10,
    },

    { path: "/ars-auth", name: "ARSAuth", component: ArsAuth },
    {
      path: "/ars/verification",
      name: "ArsVerification",
      component: ArsVerification,
    },
    { path: "/ars/complete", name: "ArsComplete", component: ArsComplete },
    { path: "/ars/fail", name: "ArsFail", component: ArsFail },
    {
      path: "/ars/link-banking",
      name: "ArsLinkBanking",
      component: () => import("../pages/ars/ArsLinkBanking.vue"),
    },

    // 오픈뱅킹 인증 (레이아웃 없이)
    {
      path: "/openbanking/ars-agreement",
      name: "ObArsAgreement",
      component: () =>
        import("../pages/openbanking/openAuth/ObArsAgreement.vue"),
    },
    {
      path: "/openbanking/agreement",
      name: "OpenBankingAgreement",
      component: () => import("../pages/openbanking/openAuth/ObAgreement.vue"),
    },
    {
      path: "/openbanking/account-link-select",
      name: "AccountLinkSelect",
      component: AccountLinkSelect,
    },
    {
      path: "/openbanking/account-agreement",
      name: "AccountAgreement",
      component: AccountAgreement,
    },
    {
      path: "/openbanking/auth",
      name: "OpenBankingPinAuth",
      component: OpenBankingPinAuth,
    },
    // 인증서(레이아웃 없이)
    {
      path: "/openbanking/create-certificate",
      name: "CreateCertificate",
      component: CreateCertificate,
    },
    {
      path: "/openbanking/set-certificate-password",
      name: "SetCertificatePassword",
      component: SetCertificatePassword,
    },
    {
      path: "/openbanking/confirm-certificate-password",
      name: "ConfirmCertificatePassword",
      component: ConfirmCertificatePassword,
    },
    {
      path: "/openbanking/certificate-complete",
      name: "CertificateComplete",
      component: CertificateComplete,
    },

    // 간편 비밀번호 관련 (레이아웃 없이)
    {
      path: "/certificate-password-change",
      name: "certificate-password-change",
      component: CertificatePasswordChange,
    },

    // 회원탈퇴 관련 (레이아웃 없이)
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

    // 메인 레이아웃
    {
      path: "/",
      component: MainLayout,
      children: [
        { path: "", name: "Home", component: Home },
        { path: "dictionary", name: "dictionary", component: Dictionary },
        { path: "notification", name: "Notification", component: Notification },
        { path: "quiz", name: "Quiz", component: Quiz },
        { path: "finance", name: "FinanceHome", component: FinanceHome },

        // 오픈뱅킹 (MainLayout 하위 엔트리)
        {
          path: "openbanking",
          name: "OpenBankingHome",
          component: OpenBankingHome,
        },

        // 마이페이지
        { path: "mypage", name: "mypage", component: Mypage },
        { path: "profile", name: "profile", component: Profile },
        { path: "my-history", name: "my-history", component: MyHistory },
        {
          path: "mycertificate",
          name: "mycertificate",
          component: MyCertificates,
        },
        {
          path: "certificate-detail",
          name: "certificate-detail",
          component: CertificateDetail,
        },

        {
          path: "/certificate-password-change-new",
          name: "certificate-password-change-new",
          component: CertificatePasswordChangeNew,
        },

        {
          path: "/certificate-password-change-confirm",
          name: "certificate-password-change-confirm",
          component: CertificatePasswordChangeConfirm,
        },

        {
          path: "customer-support",
          name: "customer-support",
          component: CustomerSupport,
        },
        { path: "avatar-shop", name: "avatar-shop", component: AvatarShop },
      ],
    },

    // 파이낸스 레이아웃
    {
      path: "/finance",
      component: FinanceLayout,
      children: [
        { path: "deposit", name: "Deposit", component: Deposit },
        { path: "fund", name: "Fund", component: Fund },
        { path: "stock", name: "Stock", component: Stock },
        { path: "installment", name: "Installment", component: Installment },
        {
          path: "installment/:id",
          name: "InstallmentDetail",
          component: () => import("../pages/finance/InstallmentDetail.vue"),
        },
        {
          path: "deposit/:id",
          name: "DepositDetail",
          component: () => import("../pages/finance/DepositDetail.vue"),
        },
        {
          path: "fund/:id",
          name: "FundDetail",
          component: () => import("../pages/finance/FundDetail.vue"),
        },
        {
          path: "stock/:id",
          name: "StockDetail",
          component: () => import("../pages/finance/StockDetail.vue"),
        },
        {
          path: "stock/compare/:id",
          name: "StockCompare",
          component: StockCompare,
        },
      ],
    },

    // 챌린지 레이아웃
    {
      path: "/challenge",
      component: ChallengeLayout,
      children: [
        { path: "", name: "ChallengeHome", component: ChallengeHome },
        {
          path: "joined-list",
          name: "ChallengeJoinedList",
          component: ChallengeJoinedList,
        },
        {
          path: "recruiting-list",
          name: "ChallengeRecruitingList",
          component: ChallengeRecruitingList,
        },
        { path: "create", name: "ChallengeCreate", component: ChallengeCreate },
        {
          path: "ranking",
          name: "ChallengeRanking",
          component: ChallengeRanking,
        },
        {
          path: "common-detail/:id",
          name: "ChallengeCommonDetail",
          component: ChallengeCommonDetail,
        },
        {
          path: "group-detail/:id",
          name: "ChallengeGroupDetail",
          component: ChallengeGroupDetail,
        },
        {
          path: "personal-detail/:id",
          name: "ChallengePersonalDetail",
          component: ChallengePersonalDetail,
        },
      ],
    },

    // 오픈뱅킹 레이아웃
    {
      path: "/openbanking",
      component: OpenBankingLayout,
      children: [
        {
          path: "myhome",
          name: "OpenBankingMyHome",
          component: () => import("../pages/openbanking/OpenBankingMyHome.vue"),
        },
        { path: "", name: "OpenBankingHome", component: OpenBankingHome },
        { path: "account-list", name: "AccountList", component: AccountList },
        {
          path: "account-detail/:accountId",
          name: "AccountDetail",
          component: AccountDetail,
          props: true,
        },
        { path: "card-list", name: "CardList", component: CardList },
        {
          path: "card-detail/:cardId",
          name: "CardDetail",
          component: CardDetail,
          props: true,
        },
        {
          path: "calendar",
          name: "OpenbankingCalendar",
          component: OpenbankingCalendar,
        },
        {
          path: "calendar/select",
          name: "CalendarSelect",
          component: CalendarSelect,
        },
        {
          path: "calendar/detail/:id",
          name: "CalendarDetail",
          component: CalendarDetail,
          props: true,
        },
        {
          path: "monthly-report",
          name: "OpenbankingMonthlyReport",
          component: OpenbankingMonthlyReport,
        },
      ],
    },
    // 관리자 레이아웃
    {
      path: "/admin",
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: "", name: "AdminHome", component: AdminHome },
        {
          path: "challenges/common",
          name: "AdminCommonChallenge",
          component: AdminCommonChallenge,
        },
        {
          path: "support",
          name: "AdminSupport",
          component: AdminSupport,
        },
        {
          path: "faq",
          name: "AdminFaq",
          component: AdminFaq,
        },
      ],
    },
    // 404 Not Found catch-all
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../pages/home/404/404.vue"),
    },
  ],
});

import { useAuthStore } from "@/stores/auth";
import { getAccountsWithTotal } from "@/api/openbanking/accountsApi";
import { getCardsWithTotal } from "@/api/openbanking/cardsApi";

/** 안전하게 배열 꺼내기 */
function deepGet(obj, path) {
  return path.reduce(
    (acc, k) => (acc && typeof acc === "object" ? acc[k] : undefined),
    obj
  );
}
function pickArray(
  res,
  primary = ["data", "data", "accounts"],
  alt = ["data", "accounts"]
) {
  const a = deepGet(res, primary);
  if (Array.isArray(a)) return a;
  const b = deepGet(res, alt);
  return Array.isArray(b) ? b : [];
}
function pickCards(res) {
  return pickArray(res, ["data", "data", "cards"], ["data", "cards"]);
}
function obCacheKey(userId) {
  return `ob:linked:${userId ?? "anon"}`;
}

/**
 * 오픈뱅킹 연동 데이터 존재 여부 확인
 * - 캐시가 'true'면 재검증
 * - 캐시가 'false'면 그대로 신뢰
 */
async function ensureHasOpenBankingData(auth) {
  const uid = auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
  const key = obCacheKey(uid);

  // 재검증 or 최초검증
  try {
    const [accRes, cardRes] = await Promise.allSettled([
      getAccountsWithTotal(),
      getCardsWithTotal(),
    ]);

    const accounts =
      accRes.status === "fulfilled"
        ? pickArray(
            accRes.value,
            ["data", "data", "accounts"],
            ["data", "accounts"]
          )
        : [];
    const cards =
      cardRes.status === "fulfilled" ? pickCards(cardRes.value) : [];

    const has = (accounts?.length || 0) > 0 || (cards?.length || 0) > 0;

    sessionStorage.setItem(key, has ? "true" : "false");
    return has;
  } catch {
    // 오류면 안전하게 false로 보고, 다음 진입 시 다시 시도
    sessionStorage.setItem(key, "false");
    return false;
  }
}

router.beforeEach(async (to,from) => {
  const publicPages = new Set([
    "Login",
    "Signup",
    "SignupComplete",
    "ProfileStep1",
    "ProfileStep2",
    "ProfileStep3",
    "ProfileStep4",
    "ProfileStep5",
    "MypageProfileStep1",
    "MypageProfileStep2",
    "MypageProfileStep3",
    "MypageProfileStep4",
    "MypageProfileStep5",
    "ProfileStep6",
    "ProfileStep7",
    "ProfileStep8",
    "ProfileStep9",
    "ProfileStep10",
    "ARSAuth",
    "ArsVerification",
    "ArsComplete",
    "ArsFail",
  ]);

  const auth = useAuthStore();

  // 보호 라우트 인증 체크
  if (!publicPages.has(to.name)) {
    if (!auth.isAuthenticated) {
      await auth.bootstrap();
      if (!auth.isAuthenticated) {
        return { name: "Login", query: { redirect: to.fullPath } };
      }
    }
  }

  // 관리자 판별 유틸(여러 형태 대비)
  const role = auth?.user?.role || auth?.role;
  const authorities = auth?.user?.authorities || auth?.authorities || [];
  const isAdmin =
    role === "ADMIN" ||
    authorities.includes("ADMIN") ||
    authorities.includes("ROLE_ADMIN");

  // 1) /admin 이하 접근은 관리자만
  if (to.matched.some((r) => r.meta?.requiresAdmin)) {
    if (!isAdmin) {
      return { name: "Home" }; // 권한 없으면 홈으로
    }
  }

  // 2) 로그인 직후 관리자면 홈으로 들어오더라도 관리자 홈으로 돌리기
  //    (원치 않으면 이 블록은 주석 처리)
  if ((to.name === "Home" || to.path === "/") && isAdmin) {
    return { name: "AdminHome", replace: true };
  }

  // // 오픈뱅킹 엔트리('/openbanking') 접근 시: 연동 데이터 있으면 MyHome으로
  // if (to.name === "OpenBankingHome" || to.name === "OpenBankingMyHome") {
  //   if (to.name !== 'OpenBankingPinAuth') {
  //     try {
  //       const has = await ensureHasOpenBankingData(auth);
  //       if (has) {
  //         return{
  //         name: "OpenBankingPinAuth",
  //             query: { redirect: to.fullPath }
  //         };
  //       }
  //     } catch (e) {
  //       console.error("오픈뱅킹 데이터 확인 중 오류", e);
  //     }
  //   }
  // }

  const openBankingProtectedRoutes = new Set([
    "OpenBankingHome", "OpenBankingMyHome"
  ]);

  if (openBankingProtectedRoutes.has(to.name)) {
    // 계좌 연동 여부 확인
    try {
      const hasData = await ensureHasOpenBankingData(auth);
      if (hasData) {
        // 계좌가 있는 사용자의 경우 최종 목적지는OpenBankingMyHome
        const finalDestination = { name: 'OpenBankingMyHome' };

        // PIN 인증 세션 확인
        const isAuthenticated = sessionStorage.getItem('openBankingAuthenticated') === 'true';

        if (isAuthenticated) {
          // 통행권이 있으면 바로 최종 목적지로 보냅니다.
          if (to.name !== finalDestination.name) return finalDestination;
          else return;
        } else {
          // 통행권이 없으면 PIN 인증 페이지로 보낸 뒤 MyHome으로 보냄
          if (to.name !== 'OpenBankingPinAuth') {
            return {
              name: "OpenBankingPinAuth",
              query: { redirect: router.resolve(finalDestination).fullPath }
            };
          }
        }
      } else {
        // 계좌가 없는 사용자의 경우 OpenBankingHome
        if (to.name !== 'OpenBankingHome') {
          return { name: 'OpenBankingHome' };
        }
      }
    } catch (e) {
      console.error("오픈뱅킹 데이터 확인 중 오류", e);
      // 에러 발생 시 홈으로
      return { name: 'Home' };
    }
  }
});

export default router;
