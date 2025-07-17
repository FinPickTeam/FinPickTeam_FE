import { createRouter, createWebHistory } from 'vue-router';
import ArsAuth from '../pages/ars/ArsAuth.vue';
import ArsVerification from '../pages/ars/ArsVerification.vue';
import Login from '../pages/Login.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
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
