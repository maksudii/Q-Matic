import { createRouter, createWebHistory } from 'vue-router'
import CustomerView from '../views/CustomerView.vue'
import AdminView from '../views/AdminView.vue'
import HomeView from '../views/HomeView.vue' // <-- 1. YENİ EKLENEN SATIR

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { // <-- 2. YENİ EKLENEN ROTA
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/k/:channelId',
      name: 'customer',
      component: CustomerView
    },
    {
      path: '/p/:channelId',
      name: 'admin',
      component: AdminView
    }
  ]
})

export default router