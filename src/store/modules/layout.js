const layout = {
  namespaced: true,
  state: () => ({
    screenVisibility: false,
    linkRouteName: '',
    appLoadingModal: true,
    skipUpdateModal: null,
    topBottomModal: null,
    firmwareErrorModal: null,
    canbusMemberDeviceModal: false,
    keyposeNumericModal: null,
    connectionProblemModal: false,
    settingsModal: false,
    isInputActive: false,
    isAction: false,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    screenScale: 1
  }),
  getters: {
    screenVisibility: state => state.screenVisibility,
    linkRouteName: state => state.linkRouteName,
    appLoadingModal: state => state.appLoadingModal,
    skipUpdateModal: state => state.skipUpdateModal,
    topBottomModal: state => state.topBottomModal,
    firmwareErrorModal: state => state.firmwareErrorModal,
    canbusMemberDeviceModal: state => state.canbusMemberDeviceModal,
    keyposeNumericModal: state => state.keyposeNumericModal,
    connectionProblemModal: state => state.connectionProblemModal,
    settingsModal: state => state.settingsModal,
    isInputActive: state => state.isInputActive,
    isAction: state => state.isAction,
    windowWidth: state => state.windowWidth,
    windowHeight: state => state.windowHeight,
    screenScale: state => state.screenScale
  },
  actions: {
    setScreenVisibility: ({ commit }, data) => commit('SET_SCREEN_VISIBILITY', data),
    setLinkRouteName: ({ commit }, data) => commit('SET_LINK_ROUTE_NAME', data),
    setAppLoadingModal: ({ commit }, data) => commit('SET_APP_LOADING_MODAL', data),
    setSkipUpdateModal: ({ commit }, data) => commit('SET_SKIP_UPDATE_MODAL', data),
    setTopBottomModal: ({ commit }, data) => commit('SET_TOP_BOTTOM_MODAL', data),
    setFirmwareErrorModal: ({ commit }, data) => commit('SET_FIRMWARE_ERROR_MODAL', data),
    setCanbusMemberDeviceModal: ({ commit }, data) => commit('SET_CANBUS_MEMBER_DEVICE_MODAL', data),
    setKeyposeNumericModal: ({ commit }, data) => commit('SET_KEYPOSE_NUMERIC_MODAL', data),
    setConnectionProblemModal: ({ commit }, data) => commit('SET_CONNECTION_PROBLEM_MODAL', data),
    setSettingsModal: ({ commit }, data) => commit('SET_SETTINGS_MODAL', data),
    setIsInputActive: ({ commit }, data) => commit('SET_IS_INPUT_ACTIVE', data),
    setIsAction: ({ commit }, data) => commit('SET_IS_ACTION', data),
    setWindowWidth: ({ commit }, data) => commit('SET_WINDOW_WIDTH', data),
    setWindowHeight: ({ commit }, data) => commit('SET_WINDOW_HEIGHT', data),
    setScreenScale: ({ commit }, data) => commit('SET_SCREEN_SCALE', data)
  },
  mutations: {
    SET_SCREEN_VISIBILITY (state, data) {
      state.screenVisibility = data
    },
    SET_LINK_ROUTE_NAME (state, data) {
      state.linkRouteName = data
    },
    SET_APP_LOADING_MODAL (state, data) {
      state.appLoadingModal = data
    },
    SET_SKIP_UPDATE_MODAL (state, data) {
      state.skipUpdateModal = data
    },
    SET_TOP_BOTTOM_MODAL (state, data) {
      state.topBottomModal = data
    },
    SET_FIRMWARE_ERROR_MODAL (state, data) {
      state.firmwareErrorModal = data
    },
    SET_CANBUS_MEMBER_DEVICE_MODAL (state, data) {
      state.canbusMemberDeviceModal = data
    },
    SET_KEYPOSE_NUMERIC_MODAL (state, data) {
      state.keyposeNumericModal = data
    },
    SET_CONNECTION_PROBLEM_MODAL (state, data) {
      state.connectionProblemModal = data
    },
    SET_SETTINGS_MODAL (state, data) {
      state.settingsModal = data
    },
    SET_IS_INPUT_ACTIVE (state, data) {
      state.isInputActive = data
    },
    SET_IS_ACTION (state, data) {
      state.isAction = data
    },
    SET_WINDOW_WIDTH (state, data) {
      state.windowWidth = data
    },
    SET_WINDOW_HEIGHT (state, data) {
      state.windowHeight = data
    },
    SET_SCREEN_SCALE (state, data) {
      state.screenScale = data
    }
  }
}

export default layout
