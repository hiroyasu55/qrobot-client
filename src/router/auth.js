import Login from '@/components/auth/Login'
import Logout from '@/components/auth/Logout'

export default [
  {
    path: '/login',
    name: 'auth.login',
    component: Login,
    meta: {title: 'Login'},
  },
  {
    path: '/logout',
    name: 'auth.logout',
    component: Logout,
    meta: {title: 'Logout'},
  },
]
