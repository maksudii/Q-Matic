import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/admin/:channelId',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/customer/:channelId',
      name: 'customer',
      component: () => import('../views/CustomerView.vue'),
    },
  ],
})

// Router navigation logları
router.beforeEach((to, from, next) => {
  console.log('🚀 Router: Navigating from', from.path, 'to', to.path)
  console.log('📍 Route params:', to.params)
  console.log('📍 Route name:', to.name)
  next()
})

router.afterEach((to, from) => {
  console.log('✅ Router: Navigation completed to', to.path)
})

router.onError((error) => {
  console.error('❌ Router Error:', error)
})

export default router
