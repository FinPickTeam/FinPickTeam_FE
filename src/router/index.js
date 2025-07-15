import { createRouter, createWebHistory } from 'vue-router';
import ArsAuth from '../pages/ArsAuth.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'ARSAuth',
      component: ArsAuth,
    },
  ],
});

export default router;
