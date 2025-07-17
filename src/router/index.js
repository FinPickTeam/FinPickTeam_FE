import { createRouter, createWebHistory } from 'vue-router';
import ArsAuth from '../pages/ars/ArsAuth.vue';
import ArsVerification from '../pages/ars/ArsVerification.vue';
import Login from '../pages/auth/Login.vue';
import Signup from '../pages/auth/Signup.vue';
import SignupComplete from '../pages/auth/SignupComplete.vue';
import ProfileStep1 from '../pages/auth/ProfileStep1.vue';

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
