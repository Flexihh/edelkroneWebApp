import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import settings from './modules/settings'
import app from './modules/app'
import layout from './modules/layout'

import forEach from 'lodash/forEach'
import includes from 'lodash/includes'

Vue.use(Vuex)

const vuexKey = 'edelkrone_2'

forEach(Object.keys(window.localStorage), key => {
  if (includes(key, 'edelkrone') && key !== vuexKey) {
    window.localStorage.removeItem(key)
  }
})

export default new Vuex.Store({
  modules: {
    settings,
    app,
    layout
  },
  plugins: [createPersistedState({
    key: vuexKey,
    paths: ['settings'],
    storage: window.localStorage
  })]
})
