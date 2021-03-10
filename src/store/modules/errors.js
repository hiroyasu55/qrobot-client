const state = () => ({
  errors: [],
})

const getters = {
  errors: (state) => state.errors,
}

const mutations = {
  add: function (state, error) {
    state.errors.append(error)
  },
  clear: function (state) {
    state.errors = []
  },
}

const actions = {
  add: function ({commit}, error) {
    commit('add', error)
  },
  clear: function ({commit}) {
    commit('clear')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
