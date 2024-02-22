import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ThemeView from '../views/ThemeView.vue'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/theme-preview',
      name: 'theme-preview',
      component: () => import('../views/ThemeView.vue')
    },
    {
      path: '/listing/:id',
      name: 'listing',
      component: () => import('../views/AdminListing.vue')
    }
  ]
})

export default router
