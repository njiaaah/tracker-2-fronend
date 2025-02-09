import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import User from '../views/user-[hash].vue'

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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: User,
    },
  ],
})

export default router
