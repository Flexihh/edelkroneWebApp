import store from '../../store'
import { connection, timeout, rssiLevel, consoleLogGroup } from '../../utils'
import isUndefined from 'lodash/isUndefined'
import map from 'lodash/map'

const app = {
  namespaced: true,
  state: () => ({
    devMode: false,
    deviceList: null,
    deviceListTimestamp: +new Date(),
    visionList: null,
    bundleStatus: null,
    supportedAxes: null,
    calibratedAxes: null,
    wirelessProductList: null,
    wirelessPairingStatus: null,
    wirelessPairingScanStart: false,
    canbusProductList: null,
    canbusPairingStatus: null,
    linkDeviceFirmwareUpdateStatus: null,
    linkDeviceFirmwareUpdateStatusTimestamp: +new Date(),
    linkRadioFirmwareUpdateStatus: null,
    loopStarting: false,
    speed: 0.5,
    acceleration: 0.5,
    errorMessage: null
  }),
  getters: {
    devMode: state => state.devMode,
    deviceList: state => state.deviceList,
    deviceListTimestamp: state => state.deviceListTimestamp,
    visionList: state => state.visionList,
    bundleStatus: state => state.bundleStatus,
    supportedAxes: state => state.supportedAxes,
    calibratedAxes: state => state.calibratedAxes,
    wirelessProductList: state => state.wirelessProductList,
    wirelessPairingStatus: state => state.wirelessPairingStatus,
    wirelessPairingScanStart: state => state.wirelessPairingScanStart,
    canbusProductList: state => state.canbusProductList,
    canbusPairingStatus: state => state.canbusPairingStatus,
    linkDeviceFirmwareUpdateStatus: state => state.linkDeviceFirmwareUpdateStatus,
    linkDeviceFirmwareUpdateStatusTimestamp: state => state.linkDeviceFirmwareUpdateStatusTimestamp,
    linkRadioFirmwareUpdateStatus: state => state.linkRadioFirmwareUpdateStatus,
    loopStarting: state => state.loopStarting,
    speed: state => state.speed,
    acceleration: state => state.acceleration,
    errorMessage: state => state.errorMessage
  },
  actions: {
    async getDeviceList ({ commit, state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: '/device',
        data: JSON.stringify({
          command: 'linkStatus'
        })
      })
      if (response.data.result === 'ok') {
        let deviceList = response.data.data
        deviceList = map(deviceList, _device => {
          const device = {}
          device.deviceFirmwareChangelog = _device.deviceFirmwareChangelog
          device.isDeviceFirmwareUpdateAvailable = _device.isDeviceFirmwareUpdateAvailable
          device.isDeviceFirmwareUpdateRequired = _device.isDeviceFirmwareUpdateRequired
          device.isPairingDone = _device.isPairingDone
          device.isRadioFirmwareUpdateAvailable = _device.isRadioFirmwareUpdateAvailable
          device.isRadioFirmwareUpdateRequired = _device.isRadioFirmwareUpdateRequired
          device.isValid = _device.isValid
          device.linkConnectionType = _device.linkConnectionType
          device.linkId = _device.linkID
          device.linkType = _device.linkType
          device.radioFirmwareChangelog = _device.radioFirmwareChangelog
          return device
        })
        if (!isUndefined(data) && !isUndefined(data.delay)) {
          commit('SET_DEVICE_LIST', deviceList)
          commit('SET_DEVICE_LIST_TIMESTAMP', +new Date())
        } else {
          setTimeout(() => {
            commit('SET_DEVICE_LIST', deviceList)
            commit('SET_DEVICE_LIST_TIMESTAMP', +new Date())
          }, timeout(start, 1000))
        }
      } else {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: deviceList', errorMessage, true, +new Date() - start)
        }
      }
    },
    async getVisionList ({ commit, state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress'].split(':')[0]}:${store.getters['settings/visionPort']}/v1`,
        url: '/vision',
        data: JSON.stringify({
          command: 'visionStatus'
        })
      })
      if (response.data.result === 'ok') {
        let visionList = response.data.data
        visionList = map(visionList, _vision => {
          const vision = {}
          vision.bitRate = _vision.bitRate
          vision.groupID = _vision.groupID
          vision.hdmiState = _vision.hdmiState
          vision.isValid = _vision.isValid
          vision.linkId = _vision.linkID
          vision.mcuVersion = _vision.mcuVersion
          vision.systemVersion = _vision.systemVersion
          vision.upTime = _vision.upTime
          return vision
        })
        if (!isUndefined(data) && !isUndefined(data.delay)) {
          commit('SET_VISION_LIST', visionList)
        } else {
          setTimeout(() => {
            commit('SET_VISION_LIST', visionList)
          }, timeout(start, 1000))
        }
      } else {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: visionList', errorMessage, true, +new Date() - start)
        }
      }
    },
    async getBundleStatus ({ commit, state }, data) {
      const start = +new Date()
      const response = await connection({
        method: 'GET',
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: `/bundle/${data.linkId}/status`
      })
      if (response.data.result === 'ok') {
        const _bundleStatus = response.data.data
        const bundleStatus = {}
        bundleStatus.calibratedAxes = map(_bundleStatus.calibratedAxes, axis => axis.axis)
        bundleStatus.deviceInfo = map(_bundleStatus.deviceInfo, _device => {
          const device = {}
          device.batteryLevel = _device.batteryLevel
          device.isTilted = _device.isTilted
          device.type = _device.type
          return device
        })
        bundleStatus.deviceInfoEverythingReady = _bundleStatus.deviceInfoEverythingReady
        bundleStatus.inclineMode = _bundleStatus.inclineMode
        bundleStatus.inclineModeWarningFlag = _bundleStatus.inclineModeWarningFlag
        bundleStatus.keyposeLoopActive = _bundleStatus.keyposeLoopActive
        bundleStatus.keyposeMotionAimIndex = _bundleStatus.keyposeMotionAimIndex
        bundleStatus.keyposeMotionStartIndex = _bundleStatus.keyposeMotionStartIndex
        bundleStatus.keyposeSlotsFilled = _bundleStatus.keyposeSlotsFilled
        bundleStatus.parkMode = _bundleStatus.parkMode
        bundleStatus.plannedMotionProgress = _bundleStatus.plannedMotionProgress
        bundleStatus.plannedMotionDuration = _bundleStatus.plannedMotionDuration
        bundleStatus.readings = {
          headPan: _bundleStatus.readings.headPan,
          headTilt: _bundleStatus.readings.headTilt,
          focus: _bundleStatus.readings.focus,
          slide: _bundleStatus.readings.slide,
          jibPan: _bundleStatus.readings.jibPan,
          jibTilt: _bundleStatus.readings.jibTilt
        }
        bundleStatus.state = _bundleStatus.state
        bundleStatus.supportedAxes = map(_bundleStatus.supportedAxes, axis => axis.axis)
        bundleStatus.timestampEpoch = _bundleStatus.timestampEpoch
        if (!isUndefined(data) && !isUndefined(data.delay)) {
          commit('SET_BUNDLE_STATUS', bundleStatus)
        } else {
          setTimeout(() => {
            commit('SET_BUNDLE_STATUS', bundleStatus)
          }, timeout(start, 100))
        }
      } else {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: bundleStatus', errorMessage, true, +new Date() - start)
        }
      }
    },
    setSupportedAxes ({ commit }, data) {
      commit('SET_SUPPORTED_AXES', data)
    },
    setCalibratedAxes ({ commit }, data) {
      commit('SET_CALIBRATED_AXES', data)
    },
    async getWirelessProductList ({ commit, state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: `/link/${data.linkId}`,
        data: JSON.stringify({
          command: 'wirelessPairingScanResults'
        })
      })
      if (response.data.result === 'ok') {
        let wirelessProductList = response.data.data
        wirelessProductList = map(wirelessProductList, _product => {
          const product = {}
          product.groupId = _product.linkPairigingActive ? _product.mac : _product.groupId
          product.isCanbus = _product.linkPairigingActive ? true : !true
          product.isDeviceFirmwareUpdateAvailable = _product.isDeviceFirmwareUpdateAvailable
          product.isRadioFirmwareUpdateAvailable = _product.isRadioFirmwareUpdateAvailable
          product.isTilted = _product.isTilted
          product.mac = _product.mac
          product.rssi = _product.rssi
          product.rssiLevel = rssiLevel(_product.rssi)
          product.setup = _product.setup
          product.type = _product.type
          return product
        })
        if (!isUndefined(data) && !isUndefined(data.delay)) {
          commit('SET_WIRELESS_PRODUCT_LIST', wirelessProductList)
        } else {
          setTimeout(() => {
            commit('SET_WIRELESS_PRODUCT_LIST', wirelessProductList)
          }, timeout(start, 100))
        }
      } else {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: wirelessProductList', errorMessage, true, +new Date() - start)
        }
      }
    },
    async getWirelessPairingStatus ({ commit, state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: `/link/${data.linkId}`,
        data: JSON.stringify({
          command: 'wirelessPairingStatus'
        })
      })
      if (response.data.result === 'ok') {
        if (!isUndefined(data) && !isUndefined(data.delay)) {
          commit('SET_WIRELESS_PAIRING_STATUS', response.data.data)
        } else {
          setTimeout(() => {
            commit('SET_WIRELESS_PAIRING_STATUS', response.data.data)
          }, timeout(start, 100))
        }
      } else {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: wirelessPairingStatus', errorMessage, true, +new Date() - start)
        }
      }
    },
    async setWirelessPairingScanStart ({ commit, state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: `/link/${data.linkId}`,
        data: JSON.stringify({
          command: 'wirelessPairingScanStart'
        })
      })
      if (response.data.result === 'ok') {
        commit('SET_WIRELESS_PAIRING_SCAN_START', true)
      } else {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: wirelessPairingScanStart', errorMessage, true, +new Date() - start)
        }
      }
    },
    async setWirelessPairingScanStop ({ commit }) {
      commit('SET_WIRELESS_PAIRING_SCAN_START', false)
    },
    async setWirelessPairingCreateBundle ({ state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: `/link/${data.linkId}`,
        data: JSON.stringify({
          command: 'wirelessPairingCreateBundle',
          deviceCount: data.macList.length,
          forcedMasterDevice: data.masterDevice,
          macList: data.macList
        })
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: wirelessPairingCreateBundle', errorMessage, true, +new Date() - start)
        }
      }
    },
    async setWirelessPairingAttachToBundle ({ state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: `/link/${data.linkId}`,
        data: JSON.stringify({
          command: 'wirelessPairingAttachToBundle',
          mac: data.mac
        })
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: wirelessPairingAttachToBundle', errorMessage, true, +new Date() - start)
        }
      }
    },
    async getCanbusProductList ({ commit, state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: `/link/${data.linkId}`,
        data: JSON.stringify({
          command: 'link2PairingScanResults'
        })
      })
      if (response.data.result === 'ok') {
        let canbusProductList = response.data.data
        canbusProductList = map(canbusProductList, _product => {
          const product = {}
          product.isDeviceFirmwareUpdateAvailable = _product.isDeviceFirmwareUpdateAvailable
          product.timestamp = +new Date()
          product.type = _product.type
          return product
        })

        if (!isUndefined(data) && !isUndefined(data.delay)) {
          commit('SET_CANBUS_PRODUCT_LIST', canbusProductList)
        } else {
          setTimeout(() => {
            commit('SET_CANBUS_PRODUCT_LIST', canbusProductList)
          }, timeout(start, 100))
        }
      } else {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: canbusProductList', errorMessage, true, +new Date() - start)
        }
      }
    },
    async getCanbusPairingStatus ({ commit, state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: `/link/${data.linkId}`,
        data: JSON.stringify({
          command: 'link2PairingStatus'
        })
      })
      if (response.data.result === 'ok') {
        if (!isUndefined(data) && !isUndefined(data.delay)) {
          commit('SET_CANBUS_PAIRING_STATUS', response.data.data)
        } else {
          setTimeout(() => {
            commit('SET_CANBUS_PAIRING_STATUS', response.data.data)
          }, timeout(start, 100))
        }
      } else {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: canbusPairingStatus', errorMessage, true, +new Date() - start)
        }
      }
    },
    async setCanbusPairingConnect ({ state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: `/link/${data.linkId}`,
        data: JSON.stringify({
          command: 'link2PairingConnect',
          forcedMasterDevice: data.masterDevice
        })
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: canbusPairingConnect', errorMessage, true, +new Date() - start)
        }
      }
    },
    async getLinkDeviceFirmwareUpdateStatus ({ commit, state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: '/device',
        data: JSON.stringify({
          command: 'linkDeviceFirmwareUpdateStatus'
        })
      })
      if (response.data.result === 'ok') {
        if (!isUndefined(data) && !isUndefined(data.delay)) {
          commit('SET_LINK_DEVICE_FIRMWARE_UPDATE_STATUS', {
            status: response.data.status,
            timestamp: +new Date()
          })
          commit('SET_LINK_DEVICE_FIRMWARE_UPDATE_STATUS_TIMESTAMP', +new Date())
        } else {
          setTimeout(() => {
            commit('SET_LINK_DEVICE_FIRMWARE_UPDATE_STATUS', {
              status: response.data.status,
              timestamp: +new Date()

            })
            commit('SET_LINK_DEVICE_FIRMWARE_UPDATE_STATUS_TIMESTAMP', +new Date())
          }, timeout(start, 100))
        }
      } else {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: linkDeviceFirmwareUpdateStatus', errorMessage, true, +new Date() - start)
        }
      }
    },
    async getLinkRadioFirmwareUpdateStatus ({ commit, state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: `/link/${data.linkId}`,
        data: JSON.stringify({
          command: 'linkRadioFirmwareUpdateStatus'
        })
      })
      if (response.data.result === 'ok') {
        if (!isUndefined(data) && !isUndefined(data.delay)) {
          commit('SET_LINK_RADIO_FIRMWARE_UPDATE_STATUS', {
            status: response.data.status,
            timestamp: +new Date()
          })
        } else {
          setTimeout(() => {
            commit('SET_LINK_RADIO_FIRMWARE_UPDATE_STATUS', {
              status: response.data.status,
              timestamp: +new Date()
            })
          }, timeout(start, 100))
        }
      } else {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: linkRadioFirmwareUpdateStatus', errorMessage, true, +new Date() - start)
        }
      }
    },
    emptyDeviceList: ({ commit }) => {
      setTimeout(() => {
        commit('SET_DEVICE_LIST', null)
      }, 1050)
    },
    emptyVisionList: ({ commit }) => {
      setTimeout(() => {
        commit('SET_VISION_LIST', null)
      }, 1050)
    },
    emptyBundleStatus: ({ commit }) => {
      setTimeout(() => {
        commit('SET_BUNDLE_STATUS', null)
      }, 150)
    },
    emptyWirelessProductList: ({ commit }) => {
      setTimeout(() => {
        commit('SET_WIRELESS_PRODUCT_LIST', null)
      }, 150)
    },
    emptyWirelessPairingStatus: ({ commit }) => {
      setTimeout(() => {
        commit('SET_WIRELESS_PAIRING_STATUS', null)
      }, 150)
    },
    emptyCanbusProductList: ({ commit }) => {
      setTimeout(() => {
        commit('SET_CANBUS_PRODUCT_LIST', null)
      }, 150)
    },
    emptyCanbusPairingStatus: ({ commit }) => {
      setTimeout(() => {
        commit('SET_CANBUS_PAIRING_STATUS', null)
      }, 150)
    },
    emptyLinkDeviceFirmwareUpdateStatus: ({ commit }) => {
      setTimeout(() => {
        commit('SET_LINK_DEVICE_FIRMWARE_UPDATE_STATUS', null)
      }, 150)
    },
    emptyLinkRadioFirmwareUpdateStatus: ({ commit }) => {
      setTimeout(() => {
        commit('SET_LINK_RADIO_FIRMWARE_UPDATE_STATUS', null)
      }, 150)
    },
    async setMotionAbort ({ state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: `/bundle/${data.linkId}`,
        data: JSON.stringify({
          command: 'motionAbort'
        })
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: motionAbort', errorMessage, true, +new Date() - start)
        }
      }
    },
    async setLinkDisconnect ({ state }, data) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${store.getters['settings/ipAddress']}/v1`,
        url: `/link/${data.linkId}`,
        data: JSON.stringify({
          command: 'disconnect'
        })
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        store.commit('app/SET_ERROR_MESSAGE', errorMessage)
        if (state.devMode) {
          consoleLogGroup('ERROR_MESSAGE: disconnect', errorMessage, true, +new Date() - start)
        }
      }
    },
    setLinkDeviceFirmwareUpdateStatusTimestamp: ({ commit }, data) => commit('SET_LINK_DEVICE_FIRMWARE_UPDATE_STATUS_TIMESTAMP', data),
    setLoopStarting: ({ commit }, data) => commit('SET_LOOP_STARTING', data),
    setSpeed: ({ commit }, data) => commit('SET_SPEED', data),
    setAcceleration: ({ commit }, data) => commit('SET_ACCELERATION', data),
    setErrorMessage: ({ commit }, data) => commit('SET_ERROR_MESSAGE', data)
  },
  mutations: {
    SET_DEVICE_LIST (state, data) {
      state.deviceList = data
    },
    SET_DEVICE_LIST_TIMESTAMP (state, data) {
      state.deviceListTimestamp = data
    },
    SET_VISION_LIST (state, data) {
      state.visionList = data
    },
    SET_BUNDLE_STATUS (state, data) {
      state.bundleStatus = data
    },
    SET_SUPPORTED_AXES (state, data) {
      state.supportedAxes = data
    },
    SET_CALIBRATED_AXES (state, data) {
      state.calibratedAxes = data
    },
    SET_WIRELESS_PRODUCT_LIST (state, data) {
      state.wirelessProductList = data
    },
    SET_WIRELESS_PAIRING_STATUS (state, data) {
      state.wirelessPairingStatus = data
    },
    SET_WIRELESS_PAIRING_SCAN_START (state, data) {
      state.wirelessPairingScanStart = data
    },
    SET_WIRELESS_PAIRING_SCAN_STOP (state, data) {
      state.wirelessPairingScanStop = data
    },
    SET_CANBUS_PRODUCT_LIST (state, data) {
      state.canbusProductList = data
    },
    SET_CANBUS_PAIRING_STATUS (state, data) {
      state.canbusPairingStatus = data
    },
    SET_LINK_DEVICE_FIRMWARE_UPDATE_STATUS (state, data) {
      state.linkDeviceFirmwareUpdateStatus = data
    },
    SET_LINK_DEVICE_FIRMWARE_UPDATE_STATUS_TIMESTAMP (state, data) {
      state.linkDeviceFirmwareUpdateStatusTimestamp = data
    },
    SET_LINK_RADIO_FIRMWARE_UPDATE_STATUS (state, data) {
      state.linkRadioFirmwareUpdateStatus = data
    },
    SET_LOOP_STARTING (state, data) {
      state.loopStarting = data
    },
    SET_SPEED (state, data) {
      state.speed = data
    },
    SET_ACCELERATION (state, data) {
      state.acceleration = data
    },
    SET_ERROR_MESSAGE (state, data) {
      if (data !== null && !isUndefined(data.data) && !isUndefined(data.data.result) && data.data.result === 'offline') {
        window.location.href = '/link'
      } else {
        state.errorMessage = data
      }
    }
  }
}

export default app
