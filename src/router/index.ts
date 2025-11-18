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
      path: '/products/:categoryId',
      name: 'productsByCategory',
      component: () => import('../domain/products/products/views/ProductsView.vue'),
    },
    {
      path: '/products/:categoryId/:id',
      name: 'productDetail',
      component: () => import('../domain/products/products/views/ProductDetailView.vue'),
      props: true
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import('../domain/cart-summary/views/PaymentView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../domain/checkout/views/CheckoutView.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../domain/orders/views/OrdersListView.vue'),
    },

  ],
})

export default router
