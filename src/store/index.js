import Vue from 'vue'
import Vuex from 'vuex'
import errors from './modules/errors'
import auth from './modules/auth'
import loader from './modules/loader'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    errors,
    auth,
    loader,
  },
})
