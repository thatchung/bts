import Vue from 'vue'
import Vuex from 'vuex'

// module
import app from './module/app'
import systemConfig from './module/systemConfig'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    collapsed: false
  },
  mutations: {
    setUserInfo (state, data) {
      state.userInfo = data || {}
    },
    setCollapsedInfo (state, data) {
      state.collapsed = data || false
    }
  },
  getters: {
    getUserInfo: (state) => () => {
      return state.userInfo
    },
    getCollapsedInfo: (state) => () => {
      console.log(state.collapsed)
      return state.collapsed
    }
  },
  modules: {
    app,
    systemConfig
  }
})
