import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import { ADDRESS, KEY_STORE } from '@/store/mutation-types'
import notification from 'ant-design-vue/es/notification'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['login', 'agreement', 'privacy']
const loginRoutePath = '/login'
const defaultRoutePath = '/menu/'
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  const address = storage.get(ADDRESS)
  const keystore = storage.get(KEY_STORE)
  if (address && keystore) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      if (!store.getters.address || !store.getters.keystore) {
        store.dispatch('Login', { address, keystore })
          .then(() => {
            next()
            NProgress.done()
          })
          .catch(() => {
            notification.error({
              key: 'message',
              message: 'error',
              description: 'server is something wrong!'
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
