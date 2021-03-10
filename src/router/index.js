import Vue from 'vue'
import Router from 'vue-router'
import home from './home'
import auth from './auth'
import question from './question'
import store from '@/store'
import NotFound from '@/components/NotFound'
import {setTitle, setDescription} from '@/utility'
import {AmplifyEventBus} from 'aws-amplify-vue'

Vue.use(Router)

async function getUser() {
  try {
    const user = await Vue.prototype.$Amplify.Auth.currentAuthenticatedUser()
    if (user && user.signInUserSession) {
      store.dispatch('auth/setUser', user)
      return user
    } else {
      throw new Error('login failed.')
    }
  } catch (e) {
    console.error(e)
    store.dispatch('auth/setUser', null)
    return null
  }
}

const router = new Router({
  mode: 'history',
  routes: [
    ...home,
    ...auth,
    ...question,
    {
      name: 'notFound',
      path: '*',
      component: NotFound,
    },
  ],
})

AmplifyEventBus.$on('authState', async (state) => {
  console.log(`authState:${state}`)
  if (state === 'signedOut') {
    store.commit('auth/setUser', null)
    router.push({path: '/login'})
  } else if (state === 'signedIn') {
    const user = await getUser()
    router.push({path: '/'})
  }
})

router.beforeEach((to, from, next) => {
  setTitle(to.meta.title)
  setDescription(to.meta.description)
  next()
})

router.beforeResolve(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const user = await getUser()
    console.log('[router]beforeResolve')
    if (!user) {
      return next({
        path: '/login',
      })
    }
    return next()
  }
  return next()
})

export default router
