import {Auth} from 'aws-amplify'
import config from '@/config'

const state = () => ({
  user: null,
})

const getters = {
  user: (state) => state.user,
  authenticated: (state) => (state.user ? true : false),
}

const mutations = {
  setUser: (state, user) => {
    state.user = user
  },
}

const actions = {
  async setUser({commit, state}, user) {
    console.log(`[auth]setUser:${user ? user.username : 'null'}`)
    commit('setUser', user)
  },
  async login({commit, state}, {name, password}) {
    await Auth.signIn(name, password)
    console.log(`[auth]login user=${name}`)
    const user = {
      name: name,
    }
    commit('setUser', user)
  },
  async logout({commit}) {
    console.log(`[auth]logout`)
    try {
      await Auth.signOut()
      commit('setUser', null)
    } catch (error) {
      console.error('error signing out: ', error)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
