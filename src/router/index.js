import { createRouter, createWebHistory } from 'vue-router';
import ArsAuth from '../pages/ars/ArsAuth.vue';
import ArsVerification from '../pages/ars/ArsVerification.vue';

import Login from '../pages/auth/Login.vue';
import Signup from '../pages/auth/Signup.vue';
import SignupComplete from '../pages/auth/SignupComplete.vue';
import ProfileStep1 from '../pages/auth/ProfileStep1.vue';
import ProfileStep2 from '../pages/auth/ProfileStep2.vue';
import ProfileStep3 from '../pages/auth/ProfileStep3.vue';
import ProfileStep4 from '../pages/auth/ProfileStep4.vue';

import Home from '../pages/home/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/home',
      name: 'Home',
      component: Home,
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
  ],
});

export default router;
