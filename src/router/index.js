import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import User from '../views/user-[hash].vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/user/:hash',
      name: 'user',
      component: User,
    },
  ],
});

export default router;
