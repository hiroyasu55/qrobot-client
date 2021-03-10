const state = () => ({
  loading: false,
})

const getters = {
  count: (state) => {
    return state.loading
  },
}

const mutations = {
  set: function (state, loading) {
    state.loading = loading
  },
}

const actions = {
  start: function ({commit}) {
    commit('set', true)
  },
  stop: function ({commit}) {
    commit('set', false)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
