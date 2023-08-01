<template lang="pug">
div
  template(v-if="$route.name !== 'vision-stream'")
    .scale(:style="scaleStyle")
      .scale__content(:style="scaleContentStyle")
        .screen(:class="screenClass")
          ModalAppLoading
          ModalSkipUpdate
          ModalTopBottom
          ModalFirmwareError
          ModalCanbusMemberDevice
          ModalKeyposeNumeric(v-if="keyposeNumericModal !== null")
          ModalConnectionProblem
          ModalSettings(v-if="settingsModal")
          .wrap.xl-table.xs-normal.xs-1.xs-center
            .col.xl-width-480
              LayoutButtons(v-if="screenVisibility && $route.name !== 'home'")
              router-view
            template(v-if="$route.name !== 'home'")
              .col.xl-center.xl-oh(:class="{'xs-hidden': $route.name === 'link-pairing' || $route.name === 'vision' || $route.name === 'error' || $route.name === '404' || linkRouteName === 'firmware-update--device' || $route.name === 'firmware-update'}")
                LayoutSidebar(v-if="screenVisibility")
  template(v-else)
    router-view
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import LayoutButtons from './templates/components/LayoutButtons.vue'
import LayoutSidebar from './templates/components/LayoutSidebar.vue'

import ModalAppLoading from './templates/modals/ModalAppLoading.vue'
import ModalSkipUpdate from './templates/modals/ModalSkipUpdate.vue'
import ModalTopBottom from './templates/modals/ModalTopBottom.vue'
import ModalFirmwareError from './templates/modals/ModalFirmwareError.vue'
import ModalCanbusMemberDevice from './templates/modals/ModalCanbusMemberDevice.vue'
import ModalKeyposeNumeric from './templates/modals/ModalKeyposeNumeric.vue'
import ModalConnectionProblem from './templates/modals/ModalConnectionProblem.vue'
import ModalSettings from './templates/modals/ModalSettings.vue'

import { consoleLogGroup } from './utils'

import filter from 'lodash/filter'
import intersection from 'lodash/intersection'
import map from 'lodash/map'
import isUndefined from 'lodash/isUndefined'

const packageJSON = require('../package.json')

export default {
  data () {
    return {
      screenHeightDesktop: null,
      screenHeightMobile: null
    }
  },
  async created () {
    document.title = this.$route.meta.title

    if (window.location.hostname === 'localhost') {
      window.location.href = `${window.location.href.replace('localhost', '127.0.0.1')}`
    }

    if (this.$route.query.port) {
      await this.setIpAddress(`${window.location.hostname}:${this.$route.query.port}`)

      const query = Object.assign({}, this.$route.query)
      delete query.port
      this.$router.replace({ query })
    } else {
      if (!this.ipAddress) {
        await this.setIpAddress(`${window.location.hostname}:32222`)
      }
    }

    if (this.$route.query.vision_port) {
      await this.setVisionPort(this.$route.query.vision_port)

      const query = Object.assign({}, this.$route.query)
      delete query.vision_port
      this.$router.replace({ query })
    } else {
      if (!this.visionPort) {
        await this.setVisionPort('32225')
      }
    }

    if (this.$route.query.version) {
      await this.setSdkVersion(this.$route.query.version)

      const query = Object.assign({}, this.$route.query)
      delete query.version
      this.$router.replace({ query })
    } else {
      if (!this.sdkVersion) {
        await this.setSdkVersion(this.appVersion)
      }
    }

    await this.setAppVersion(packageJSON.version)

    this.changeScreenVisibility()
  },
  mounted () {
    // App
    window.addEventListener('resize', this.handleWindowResize)
    this.changeScreenScale()
    this.error()
  },
  destroyed () {
    // App
    window.removeEventListener('resize', this.handleWindowResize)
  },
  watch: {
    appLoadingModal () {
      if (this.appLoadingModal) {
        document.getElementsByTagName('html')[0].classList.add('noscroll')
      } else {
        document.getElementsByTagName('html')[0].classList.remove('noscroll')
      }
    },
    skipUpdateModal () {
      if (this.skipUpdateModal !== null) {
        document.getElementsByTagName('html')[0].classList.add('noscroll')
      } else {
        document.getElementsByTagName('html')[0].classList.remove('noscroll')
      }
    },
    topBottomModal () {
      if (this.topBottomModal !== null) {
        document.getElementsByTagName('html')[0].classList.add('noscroll')
      } else {
        document.getElementsByTagName('html')[0].classList.remove('noscroll')
      }
    },
    firmwareErrorModal () {
      if (this.firmwareErrorModal !== null) {
        document.getElementsByTagName('html')[0].classList.add('noscroll')
      } else {
        document.getElementsByTagName('html')[0].classList.remove('noscroll')
      }
    },
    canbusMemberDeviceModal () {
      if (this.canbusMemberDeviceModal) {
        document.getElementsByTagName('html')[0].classList.add('noscroll')
      } else {
        document.getElementsByTagName('html')[0].classList.remove('noscroll')
      }
    },
    keyposeNumericModal () {
      if (this.keyposeNumericModal !== null) {
        document.getElementsByTagName('html')[0].classList.add('noscroll')
      } else {
        document.getElementsByTagName('html')[0].classList.remove('noscroll')
      }
    },
    connectionProblemModal () {
      if (this.connectionProblemModal) {
        document.getElementsByTagName('html')[0].classList.add('noscroll')
      } else {
        document.getElementsByTagName('html')[0].classList.remove('noscroll')
      }
    },
    settingsModal () {
      if (this.settingsModal) {
        document.getElementsByTagName('html')[0].classList.add('noscroll')
      } else {
        document.getElementsByTagName('html')[0].classList.remove('noscroll')
      }
    },
    screenVisibility () {
      this.$nextTick(() => {
        this.changeScreenScale()
      })
    },
    windowWidth () {
      this.changeScreenScale()
    },
    windowHeight () {
      this.changeScreenScale()
    },
    async deviceList () {
      const start = +new Date()
      await this.routeControl()
      this.changeScreenVisibility()

      if (this.linkRouteName === 'firmware-update--device' || this.$route.name === 'firmware-update') {
        this.$wait.start('empty device list')
        await this.emptyDeviceList()
        setTimeout(() => {
          this.$wait.end('empty device list')
        }, 1050)
      } else {
        if (this.$route.name === 'home' || this.$route.name === 'link-pairing' || this.$route.name === 'link' || this.$route.name.includes('vision')) {
          await this.getDeviceList()
        }
      }
      this.changeScreenScale()

      if (this.devMode) {
        consoleLogGroup('deviceList', this.deviceList, false, +new Date() - start)
      }
    },
    async visionList () {
      const start = +new Date()

      if (this.$route.name === 'home' || this.$route.name === 'link-pairing' || this.$route.name === 'link' || this.$route.name.includes('vision')) {
        await this.getVisionList()
      }

      this.changeScreenVisibility()
      this.changeScreenScale()

      if (this.devMode) {
        consoleLogGroup('visionList', this.visionList, false, +new Date() - start)
      }
    },
    async bundleStatus () {
      const start = +new Date()
      if (this.$route.params.id && this.linkRouteName.includes('control-screen--')) {
        this.changeMode()
        await this.getBundleStatus({ linkId: this.$route.params.id })
        this.updateSupportedAxes()
        this.updateCalibratedAxes()
        this.calibrationLoading()
      }
      this.changeScreenVisibility()
      this.changeScreenScale()

      if (this.devMode) {
        consoleLogGroup('bundleStatus', this.bundleStatus, false, +new Date() - start)
      }
    },
    async wirelessProductList () {
      const start = +new Date()
      if (this.linkRouteName === 'device-pairing--wireless') {
        await this.getWirelessProductList({ linkId: this.$route.params.id })
      }
      this.changeScreenScale()

      if (this.devMode) {
        consoleLogGroup('wirelessProductList', this.wirelessProductList, false, +new Date() - start)
      }
    },
    async wirelessPairingStatus () {
      const start = +new Date()
      if (this.linkRouteName === 'loading--wireless') {
        await this.getWirelessPairingStatus({ linkId: this.$route.params.id })
      }

      if (this.devMode) {
        consoleLogGroup('wirelessPairingStatus', this.wirelessPairingStatus, false, +new Date() - start)
      }
    },
    async canbusProductList () {
      const start = +new Date()
      if (this.linkRouteName === 'device-pairing--canbus') {
        await this.getCanbusProductList({ linkId: this.$route.params.id })
      }
      this.changeScreenScale()

      if (this.devMode) {
        consoleLogGroup('canbusProductList', this.canbusProductList, false, +new Date() - start)
      }
    },
    async canbusPairingStatus () {
      const start = +new Date()
      if (this.linkRouteName === 'loading--canbus') {
        await this.getCanbusPairingStatus({ linkId: this.$route.params.id })
      }

      if (this.devMode) {
        consoleLogGroup('canbusPairingStatus', this.canbusPairingStatus, false, +new Date() - start)
      }
    },
    async linkDeviceFirmwareUpdateStatus () {
      const start = +new Date()
      if (this.linkRouteName === 'firmware-update--device' || this.$route.name === 'firmware-update') {
        await this.getLinkDeviceFirmwareUpdateStatus()
      }

      if (this.devMode) {
        consoleLogGroup('linkDeviceFirmwareUpdateStatus', this.linkDeviceFirmwareUpdateStatus, false, +new Date() - start)
      }
    },
    async linkRadioFirmwareUpdateStatus () {
      const start = +new Date()
      if (this.linkRouteName === 'firmware-update--radio') {
        await this.getLinkRadioFirmwareUpdateStatus({ linkId: this.$route.params.id })
      }

      if (this.devMode) {
        consoleLogGroup('linkRadioFirmwareUpdateStatus', this.linkRadioFirmwareUpdateStatus, false, +new Date() - start)
      }
    },
    errorMessage () {
      this.error()
    },
    async linkRouteName () {
      if (!this.linkRouteName.includes('control-screen--') && this.bundleStatus !== null) {
        await this.emptyBundleStatus()
      }
      if (this.linkRouteName !== 'device-pairing--wireless' && this.wirelessProductList !== null) {
        this.setWirelessPairingScanStop()
        await this.emptyWirelessProductList()
      }
      if (this.linkRouteName !== 'device-pairing--canbus' && this.canbusProductList !== null) {
        await this.emptyCanbusProductList()
      }
      if (this.linkRouteName !== 'loading--wireless' && this.wirelessPairingStatus !== null) {
        await this.emptyWirelessPairingStatus()
      }
      if (this.linkRouteName !== 'loading--canbus' && this.canbusPairingStatus !== null) {
        await this.emptyCanbusPairingStatus()
      }
      if ((this.linkRouteName !== 'firmware-update--device' || this.$route.name === 'firmware-update') && this.linkDeviceFirmwareUpdateStatus !== null) {
        await this.emptyLinkDeviceFirmwareUpdateStatus()
      }
      if (this.linkRouteName !== 'firmware-update--radio' && this.linkRadioFirmwareUpdateStatus !== null) {
        await this.emptyLinkRadioFirmwareUpdateStatus()
      }
      if (this.$route.name !== 'link-pairing' && this.skipUpdateModal !== null) {
        this.setSkipUpdateModal(null)
      }
      if (this.linkRouteName !== 'device-pairing--wireless' && this.topBottomModal !== null) {
        this.setTopBottomModal(null)
      }
      if (!this.linkRouteName.includes('device-pairing--') && this.firmwareErrorModal !== null) {
        this.setFirmwareErrorModal(null)
      }
      if (this.linkRouteName !== 'device-pairing--wireless' && this.canbusMemberDeviceModal) {
        this.setCanbusMemberDeviceModal(false)
      }
      if (this.linkRouteName !== 'control-screen--keypose' && this.keyposeNumericModal !== null) {
        this.setKeyposeNumericModal(null)
      }

      this.routeChange()
    },
    async $route (to, from) {
      document.title = to.meta.title
      if ((from.name === 'home' && this.$route.name === 'link-pairing') || (from.name === 'home' && this.$route.name === 'vision')) {
        this.setAppLoadingModal(true)
      }
      this.routeChange()
    }
  },
  computed: {
    ...mapGetters('settings', [
      'ipAddress',
      'visionPort',
      'sdkVersion',
      'appVersion'
    ]),
    ...mapGetters('app', [
      'devMode',
      'deviceList',
      'deviceListTimestamp',
      'visionList',
      'bundleStatus',
      'supportedAxes',
      'calibratedAxes',
      'wirelessProductList',
      'wirelessPairingStatus',
      'canbusProductList',
      'canbusPairingStatus',
      'linkDeviceFirmwareUpdateStatus',
      'linkDeviceFirmwareUpdateStatusTimestamp',
      'linkRadioFirmwareUpdateStatus',
      'errorMessage'
    ]),
    ...mapGetters('layout', [
      'screenVisibility',
      'linkRouteName',
      'appLoadingModal',
      'skipUpdateModal',
      'topBottomModal',
      'firmwareErrorModal',
      'canbusMemberDeviceModal',
      'keyposeNumericModal',
      'connectionProblemModal',
      'settingsModal',
      'windowWidth',
      'windowHeight',
      'screenScale'
    ]),
    scaleStyle () {
      if ((this.appLoadingModal && this.$route.name === 'link-pairing') || (this.appLoadingModal && this.$route.name === 'vision')) {
        return 'height: 100vh; overflow: hidden;'
      } else {
        if (this.windowWidth > 700) {
          return `height: ${this.screenHeightDesktop}px;`
        } else if (this.windowWidth < 480) {
          return `height: ${this.screenHeightMobile}px;`
        } else {
          return ''
        }
      }
    },
    scaleContentStyle () {
      if (this.windowWidth > 700) {
        return `transform: scale(${this.screenScale}); transform-origin: top center;`
      } else if (this.windowWidth < 480) {
        return `transform: scale(${this.screenScale}); transform-origin: top left;`
      } else {
        return ''
      }
    },
    screenClass () {
      let screenClass = ''
      if (this.$route.params.id) {
        screenClass = `screen--${this.linkRouteName}`
      } else {
        screenClass = `screen--${this.$route.name}`
      }

      if (this.bundleStatus !== null && this.bundleStatus.keyposeSlotsFilled.length === 3 && this.supportedAxes !== null && !this.supportedAxes.focus) {
        return `${screenClass} screen--joystick--single`
      } else {
        return screenClass
      }
    }
  },
  methods: {
    ...mapActions('settings', [
      'setIpAddress',
      'setVisionPort',
      'setSdkVersion',
      'setAppVersion'
    ]),
    ...mapActions('app', [
      'getDeviceList',
      'getVisionList',
      'getBundleStatus',
      'setSupportedAxes',
      'setCalibratedAxes',
      'getWirelessProductList',
      'getWirelessPairingStatus',
      'setWirelessPairingScanStop',
      'getCanbusProductList',
      'getCanbusPairingStatus',
      'getLinkDeviceFirmwareUpdateStatus',
      'getLinkRadioFirmwareUpdateStatus',
      'emptyDeviceList',
      'emptyBundleStatus',
      'emptyWirelessProductList',
      'emptyWirelessPairingStatus',
      'emptyCanbusProductList',
      'emptyCanbusPairingStatus',
      'emptyLinkDeviceFirmwareUpdateStatus',
      'emptyLinkRadioFirmwareUpdateStatus'
    ]),
    ...mapActions('layout', [
      'setScreenVisibility',
      'setLinkRouteName',
      'setAppLoadingModal',
      'setSkipUpdateModal',
      'setTopBottomModal',
      'setFirmwareErrorModal',
      'setCanbusMemberDeviceModal',
      'setKeyposeNumericModal',
      'setWindowWidth',
      'setWindowHeight',
      'setScreenScale'
    ]),
    changeMode () {
      if (this.bundleStatus !== null) {
        if (this.linkRouteName.includes('control-screen--mode--')) {
          if (this.bundleStatus.inclineMode === 'flat' || this.bundleStatus.inclineMode === 'invalid' || !this.bundleStatus.inclineModeWarningFlag || this.bundleStatus.parkMode === 'idle') {
            this.setLinkRouteName('control-screen--keypose')
          }
        }
        if (this.bundleStatus.parkMode === 'positioning' || this.bundleStatus.parkMode === 'parked') {
          this.setLinkRouteName('control-screen--mode--park')
        } else {
          if (this.bundleStatus.inclineModeWarningFlag) {
            if (this.bundleStatus.inclineMode === 'safe') {
              this.setLinkRouteName('control-screen--mode--incline-safe')
            }
            if (this.bundleStatus.inclineMode === 'danger') {
              this.setLinkRouteName('control-screen--mode--incline-danger')
            }
          }
        }
      }
    },
    calibrationLoading () {
      if (this.bundleStatus !== null) {
        if (this.bundleStatus.state === 'focusCalibration') {
          this.setLinkRouteName('control-screen--calibration--loading--focusplus-pro')
        } else if (this.bundleStatus.state === 'sliderCalibration') {
          this.setLinkRouteName('control-screen--calibration--loading--sliderone')
        } else {
          if (this.linkRouteName.includes('control-screen--calibration--loading--')) {
            this.setLinkRouteName('control-screen--keypose')
          }
        }
      }
    },
    changeScreenVisibility () {
      if (this.$route.name === 'link-pairing' || this.$route.name === 'vision') {
        this.setScreenVisibility(true)
      } else if (this.$route.name === 'link') {
        if (this.linkRouteName === 'channel-pairing') {
          if (this.deviceList) {
            this.setScreenVisibility(true)
          } else {
            this.setScreenVisibility(false)
          }
        } else if (this.linkRouteName.includes('device-pairing--')) {
          this.setScreenVisibility(true)
        } else if (this.linkRouteName.includes('loading--')) {
          this.setScreenVisibility(true)
        } else if (this.linkRouteName.includes('control-screen--')) {
          if (this.deviceList && this.bundleStatus) {
            this.setScreenVisibility(true)
          } else {
            this.setScreenVisibility(false)
          }
        } else if (this.linkRouteName.includes('firmware-update')) {
          this.setScreenVisibility(true)
        } else {
          this.setScreenVisibility(false)
        }
      } else {
        this.setScreenVisibility(true)
      }
    },
    handleWindowResize (event) {
      this.setWindowWidth(event.currentTarget.innerWidth)
      this.setWindowHeight(event.currentTarget.innerHeight)
    },
    changeScreenScale () {
      if (this.$route.name !== 'vision-stream') {
        if (this.windowWidth > 700) {
          const screenScale = Math.min(this.windowWidth / 700, this.windowHeight / (650 + 16))
          this.setScreenScale(screenScale.toFixed(4))

          const screenHeightDesktop = document.getElementsByClassName('scale__content')[0].offsetHeight
          this.screenHeightDesktop = Math.ceil((screenHeightDesktop / 100) * screenScale * 100)
        } else if (this.windowWidth < 480) {
          const screenScale = Math.min(this.windowWidth / 480)
          this.setScreenScale(screenScale.toFixed(4))

          const screenHeightMobile = document.getElementsByClassName('scale__content')[0].offsetHeight
          this.screenHeightMobile = Math.ceil((screenHeightMobile / 100) * screenScale * 100)
        } else {
          this.setScreenScale(1)
        }
      }
    },
    async error () {
      if (this.errorMessage !== null) {
        const now = +new Date()
        const deviceListTimestampEpoch = now - this.deviceListTimestamp
        const linkDeviceFirmwareUpdateStatusTimestampEpoch = now - this.linkDeviceFirmwareUpdateStatusTimestamp
        const command = JSON.parse(this.errorMessage.config.data).command
        if (command === 'linkDeviceFirmwareUpdateStatus') {
          if (linkDeviceFirmwareUpdateStatusTimestampEpoch > 5000) {
            if (this.$route.name !== 'error') {
              const path = '/error'
              if (this.$route.path !== path) this.$router.push(path)
              this.setLinkRouteName('')
            }
          } else {
            await this.getLinkDeviceFirmwareUpdateStatus()
          }
        } else {
          if (deviceListTimestampEpoch > 5000) {
            if (this.$route.name !== 'error') {
              const path = '/error'
              if (this.$route.path !== path) this.$router.push(path)
              this.setLinkRouteName('')
            }
          } else {
            if (!isUndefined(command)) {
              if (command === 'linkStatus') {
                await this.getDeviceList()
              }
              if (command === 'wirelessPairingStatus') {
                await this.getWirelessPairingStatus({ linkId: this.$route.params.id })
              }
              if (command === 'link2PairingStatus') {
                await this.getCanbusPairingStatus({ linkId: this.$route.params.id })
              }
              if (command === 'wirelessPairingScanResults') {
                await this.getWirelessProductList({ linkId: this.$route.params.id })
              }
              if (command === 'link2PairingScanResults') {
                await this.getCanbusProductList({ linkId: this.$route.params.id })
              }
              if (command === 'linkRadioFirmwareUpdateStatus') {
                await this.getLinkRadioFirmwareUpdateStatus({ linkId: this.$route.params.id })
              }
            }
          }
        }
      }
    },
    updateSupportedAxes () {
      if (this.bundleStatus !== null) {
        const headPan = filter(this.bundleStatus.supportedAxes, item => item === 'headPan').length
        const headTilt = filter(this.bundleStatus.supportedAxes, item => item === 'headTilt').length
        const focus = filter(this.bundleStatus.supportedAxes, item => item === 'focus').length
        const slide = filter(this.bundleStatus.supportedAxes, item => item === 'slide').length
        const jibPan = filter(this.bundleStatus.supportedAxes, item => item === 'jibPan').length
        const jibTilt = filter(this.bundleStatus.supportedAxes, item => item === 'jibTilt').length

        let _headPanTilt = false
        let _headPan = false
        let _headTilt = false
        let _focus = false
        let _slide = false
        let _jibPanTilt = false

        let devices = map(this.bundleStatus.deviceInfo, device => device.type)

        const jibOne = filter(devices, device => device === 'jibOne').length + filter(devices, device => device === 'jibOneV2').length
        const panPro = filter(devices, device => device === 'panPro').length

        if (devices.length > 2 && jibOne && panPro) {
          devices = filter(devices, device => device !== 'panPro')
        }

        let _headDevice = null
        let _focusDevice = null
        let _slideDevice = null
        let _jibPanTiltDevice = null

        if (headPan || headTilt) {
          const headDevice = intersection(devices, [
            'headOne',
            'panPro',
            'headPlus',
            'headPlusPro',
            'headPlusV2',
            'headPlusProV2'
          ])[0]
          _headDevice = headDevice
        }
        if (headPan && headTilt) {
          _headPanTilt = true
        } else {
          if (headPan) {
            _headPan = true
          }
          if (headTilt) {
            _headTilt = true
          }
        }
        if (focus) {
          _focus = true
          _focusDevice = 'focusPlusPro'
        }
        if (slide) {
          _slide = true
          _slideDevice = intersection(devices, [
            'slideModuleV1',
            'slideModule',
            'slideModuleV3',
            'sliderOne',
            'sliderOnePro',
            'jibOne',
            'jibOneV2',
            'surfaceOne',
            'dollyOne',
            'dollyPlus',
            'dollyPlusPro'
          ])[0]
        }
        if (jibPan && jibTilt) {
          _jibPanTilt = true
          _jibPanTiltDevice = intersection(devices, ['jibOne', 'jibOneV2'])[0]
        }

        this.setSupportedAxes({
          headPanTilt: _headPanTilt,
          headPan: _headPan,
          headTilt: _headTilt,
          focus: _focus,
          slide: _slide,
          jibPanTilt: _jibPanTilt,
          headDevice: _headDevice,
          focusDevice: _focusDevice,
          slideDevice: _slideDevice,
          jibPanTiltDevice: _jibPanTiltDevice
        })
      }
    },
    updateCalibratedAxes () {
      if (this.bundleStatus !== null) {
        const headPan = filter(this.bundleStatus.calibratedAxes, item => item === 'headPan').length
        const headTilt = filter(this.bundleStatus.calibratedAxes, item => item === 'headTilt').length
        const focus = filter(this.bundleStatus.calibratedAxes, item => item === 'focus').length
        const slide = filter(this.bundleStatus.calibratedAxes, item => item === 'slide').length
        const jibPan = filter(this.bundleStatus.calibratedAxes, item => item === 'jibPan').length
        const jibTilt = filter(this.bundleStatus.calibratedAxes, item => item === 'jibTilt').length

        let _headPanTilt = false
        let _headPan = false
        let _headTilt = false
        let _focus = false
        let _slide = false
        let _jibPanTilt = false

        if (headPan && headTilt) {
          _headPanTilt = true
        } else {
          if (headPan) {
            _headPan = true
          }
          if (headTilt) {
            _headTilt = true
          }
        }
        if (focus) {
          _focus = true
        }
        if (slide) {
          _slide = true
        }
        if (jibPan && jibTilt) {
          _jibPanTilt = true
        }

        this.setCalibratedAxes({
          headPanTilt: _headPanTilt,
          headPan: _headPan,
          headTilt: _headTilt,
          focus: _focus,
          slide: _slide,
          jibPanTilt: _jibPanTilt
        })
      }
    },
    async routeControl () {
      if (this.deviceList !== null) {
        if (this.$route.params.id) {
          if (filter(this.deviceList, { linkId: this.$route.params.id })[0]) {
            const selectedDevice = filter(this.deviceList, { linkId: this.$route.params.id })[0]
            if (!this.linkRouteName.includes('control-screen--') && selectedDevice.isPairingDone) {
              await this.getBundleStatus({ delay: false, linkId: this.$route.params.id })
              this.updateSupportedAxes()
              this.updateCalibratedAxes()
              this.setLinkRouteName('control-screen--keypose')
              this.calibrationLoading()
              this.changeMode()
            } else {
              if (!selectedDevice.isValid) {
                const path = '/link'
                if (this.$route.path !== path) this.$router.push(path)
                this.setLinkRouteName('')
              } else {
                if (this.linkRouteName.includes('control-screen--') && !selectedDevice.isPairingDone) {
                  const path = '/link'
                  if (this.$route.path !== path) this.$router.push(path)
                  this.setLinkRouteName('')
                }
              }
            }
          } else {
            const path = '/link'
            if (this.$route.path !== path) this.$router.push(path)
            this.setLinkRouteName('')
          }
        }
      }
    },
    routeChange () {
      this.$wait.end('link disconnecting')

      this.updateSupportedAxes()
      this.updateCalibratedAxes()

      this.$nextTick(() => {
        this.changeScreenVisibility()
        this.changeScreenScale()
        this.changeMode()
      })
    }
  },
  components: {
    LayoutButtons,
    LayoutSidebar,
    ModalAppLoading,
    ModalSkipUpdate,
    ModalTopBottom,
    ModalFirmwareError,
    ModalCanbusMemberDevice,
    ModalKeyposeNumeric,
    ModalConnectionProblem,
    ModalSettings
  }
}
</script>

<style lang="scss">
  @import 'styles/index.scss';
</style>
