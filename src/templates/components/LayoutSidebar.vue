<template lang="pug">
.sidebar
  template(v-if="$route.name === 'link-pairing'")
    router-link.sidebar-header(to="/link")
      .sidebar-header__icon
        IconEdelkrone
      .sidebar-header__title
        | Web App
      .sidebar-header__version
        | v{{ appVersion }}
  template(v-else-if="$route.name === 'vision'")
    .sidebar-header
      .sidebar-header__icon
        IconEdelkrone
      .sidebar-header__title
        | Web App
      .sidebar-header__version
        | v{{ appVersion }}
  template(v-else)
    .sidebar-header(@click="linkPairing()")
      .sidebar-header__icon
        IconEdelkrone
      .sidebar-header__title
        | Web App
      .sidebar-header__version
        | v{{ appVersion }}
  .sidebar-content
    template(v-if="linkRouteName === 'channel-pairing' || linkRouteName.includes('device-pairing--') || linkRouteName.includes('loading--') || linkRouteName.includes('control-screen--') || linkRouteName === 'firmware-update' || linkRouteName === 'firmware-update--radio'")
      template(v-if="linkRouteName.includes('control-screen--')")
        template(v-if="selectedDevice && selectedDevice.isPairingDone && $route.params.id === selectedDevice.linkId && selectedDevice.isValid && bundleStatus !== null && bundleStatus.deviceInfo.length")
          .box.box--safe(v-if="bundleStatus.inclineMode === 'safe'")
            .box-content
              .box-content__item.box-content__item--warning
                .icon
                  img(src="../../assets/icon-warning.png")
                span Safety instructions
          .box.box--danger(v-if="bundleStatus.inclineMode === 'danger'")
            .box-content
              .box-content__item.box-content__item--warning
                .icon
                  img(src="../../assets/icon-warning.png")
                span Unsupported incline angle
          .box
            .box-content
              .box__title Status
              template(v-if="!loopStarting")
                div(v-html="statusMessage(bundleStatus.state)")
              template(v-else)
                div Loop is starting...
          .box(v-if="bundleStatus.deviceInfoEverythingReady")
            .box__title Batteries
            .box-content
              .box-content__item.box-content__item--product(v-for="device in bundleStatus.deviceInfo")
                .icon
                  template(v-if="batteryLevel(device.batteryLevel) < 16")
                    img(src="../../assets/icon-battery--empty.png")
                  template(v-else-if="batteryLevel(device.batteryLevel) < 32")
                    img(src="../../assets/icon-battery--warning.png")
                  template(v-else-if="batteryLevel(device.batteryLevel) < 48")
                    img(src="../../assets/icon-battery--one.png")
                  template(v-else-if="batteryLevel(device.batteryLevel) < 64")
                    img(src="../../assets/icon-battery--two.png")
                  template(v-else-if="batteryLevel(device.batteryLevel) < 80")
                    img(src="../../assets/icon-battery--three.png")
                  template(v-else)
                    img(src="../../assets/icon-battery--four.png")
                template(v-if="device.type === 'headOne' && device.isTilted !== undefined")
                  template(v-if="device.isTilted")
                    span(v-html="`${productName(device.type)} (Tilt)`")
                  template(v-else)
                    span(v-html="`${productName(device.type)} (Pan)`")
                template(v-else)
                  span(v-html="productName(device.type)")
          .box
            .box__title Selected Link Adapter
            .box-content
              .box-content__item
                | Paired
              LayoutCopyLinkId(:linkId="selectedDevice.linkId")
      template(v-else)
        .box(v-if="selectedDevice && $route.params.id === selectedDevice.linkId && selectedDevice.isValid")
          .box__title Selected Link Adapter
          .box-content
            .box-content__item
              | Non-Paired
            LayoutCopyLinkId(:linkId="selectedDevice.linkId")
  .sidebar-footer
    LayoutButtons
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import IconEdelkrone from '../components/IconEdelkrone.vue'
import LayoutButtons from '../components/LayoutButtons.vue'
import LayoutCopyLinkId from '../components/LayoutCopyLinkId.vue'

import { connection, productName, statusMessage, consoleLogGroup } from '../../utils'

import filter from 'lodash/filter'

export default {
  data () {
    return {
      selectedDevice: null
    }
  },
  mounted () {
    this.updateSelectedDevice()
  },
  watch: {
    deviceList () {
      this.updateSelectedDevice()
    },
    linkRouteName () {
      this.updateSelectedDevice()
    },
    $route (to, from) {
      this.updateSelectedDevice()
    }
  },
  computed: {
    ...mapGetters('settings', [
      'ipAddress',
      'appVersion'
    ]),
    ...mapGetters('app', [
      'devMode',
      'deviceList',
      'bundleStatus',
      'loopStarting'
    ]),
    ...mapGetters('layout', [
      'linkRouteName'
    ])
  },
  methods: {
    ...mapActions('app', [
      'setErrorMessage'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName'
    ]),
    productName (value) {
      return productName(value)
    },
    statusMessage (value) {
      return statusMessage(value)
    },
    async linkPairing () {
      const start = +new Date()
      if (this.deviceList !== null) {
        const path = '/link'
        if (this.$route.path !== path) this.$router.push(path)
        this.setLinkRouteName('')
      } else {
        await connection({
          baseURL: `http://${this.ipAddress}/v1`,
          url: '/device',
          data: JSON.stringify({
            command: 'linkStatus'
          }),
          timeout: 1000
        }).then(async response => {
          if (response.data.result === 'ok') {
            const path = '/link'
            if (this.$route.path !== path) this.$router.push(path)
            this.setLinkRouteName('')
          } else {
            const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
            this.setErrorMessage(errorMessage)
            if (this.devMode) {
              consoleLogGroup('ERROR_MESSAGE: deviceList', errorMessage, true, +new Date() - start)
            }
          }
        }).catch(error => {
          const errorMessage = JSON.parse(`${JSON.stringify(error)}`)
          this.setErrorMessage(errorMessage)
          if (this.devMode) {
            consoleLogGroup('ERROR_MESSAGE: deviceList', errorMessage, true, +new Date() - start)
          }
        })
      }
    },
    home () {
      const path = '/'
      if (this.$route.path !== path) this.$router.push(path)
      this.setLinkRouteName('')
    },
    updateSelectedDevice () {
      if (this.deviceList !== null) {
        if (this.$route.params.id) {
          if (filter(this.deviceList, { linkId: this.$route.params.id })[0]) {
            this.selectedDevice = filter(this.deviceList, { linkId: this.$route.params.id })[0]
          }
        }
      }
    },
    batteryLevel (value) {
      return parseInt(value * 100)
    }
  },
  components: {
    IconEdelkrone,
    LayoutButtons,
    LayoutCopyLinkId
  }
}
</script>
