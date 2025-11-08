import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/products/:category',
      name: 'productsByCategory',
      component: () => import('../domain/products/products/views/ProductsView.vue'),
    },
    {
      path: '/products/:category/:id',
      name: 'productDetail',
      component: () => import('../domain/products/products/views/ProductDetailView.vue'),
      props: true
    }
  ],
})

export default router
