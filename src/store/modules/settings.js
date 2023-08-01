const packageJSON = require('../../../package.json')

const settings = {
  namespaced: true,
  state: () => ({
    ipAddress: null,
    visionPort: null,
    sdkVersion: null,
    appVersion: packageJSON.version,
    unit: 'cm'
  }),
  getters: {
    ipAddress: state => state.ipAddress,
    visionPort: state => state.visionPort,
    sdkVersion: state => state.sdkVersion,
    appVersion: state => state.appVersion,
    unit: state => state.unit
  },
  actions: {
    setIpAddress: ({ commit }, data) => commit('SET_IP_ADDRESS', data),
    setVisionPort: ({ commit }, data) => commit('SET_VISION_PORT', data),
    setSdkVersion: ({ commit }, data) => commit('SET_SDK_VERSION', data),
    setAppVersion: ({ commit }, data) => commit('SET_APP_VERSION', data),
    setUnit: ({ commit }, data) => commit('SET_UNIT', data)
  },
  mutations: {
    SET_IP_ADDRESS (state, data) {
      state.ipAddress = data
    },
    SET_VISION_PORT (state, data) {
      state.visionPort = data
    },
    SET_SDK_VERSION (state, data) {
      state.sdkVersion = data
    },
    SET_APP_VERSION (state, data) {
      state.appVersion = data
    },
    SET_UNIT (state, data) {
      state.unit = data
    }
  }
}

export default settings
