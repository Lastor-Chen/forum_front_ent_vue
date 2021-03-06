import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'

Vue.use(VueRouter)

// Router config
const router = new VueRouter({
  linkExactActiveClass: 'active',
  routes: [
    ...require('./sign.js').default,
    ...require('./restaurants.js').default,
    ...require('./users.js').default,
    ...require('./admin.js').default,
    {
      path: '*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue')
    },
  ]
})

// Global middleware for authenticate
router.beforeEach(async (to, from, next) => {
  try {
    const localToken = localStorage.getItem('token')
    const storedToken = store.state.token
    let isAuthenticated = store.state.isAuthenticated

    // 未持有 token && 與 storedToken 不一致時，向 Server 核對
    if (localToken && (storedToken !== localToken)) {
      isAuthenticated = await store.dispatch('fetchCurrentUser')
    }

    // 不需驗證的 routes
    const openPaths = ['/signin', '/signup']
    const isOpenPaths = openPaths.includes(to.path)

    // 登入註冊頁之跳轉動線，openPaths 防無限 loop
    if (!isAuthenticated && !isOpenPaths) return next('/signin')
    if (isAuthenticated && isOpenPaths) return next('/restaurants')

    next()

  } catch(err) {
    console.log(err)
  }
})

export default router
