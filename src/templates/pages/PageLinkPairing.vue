<template lang="pug">
.link(v-if="screenVisibility")
  .link__title Please choose link device to connect with:
  .link__desc
    IconLoading
    | If your device is not listed here, remove and reinsert the usb cable.
  .link__content.link__content--link-pairing--full(v-if="!$wait.is(['empty device list'])")
    .box.box-button(v-for="device in deviceList" v-if="device.isValid")
      .wrap.xl-middle.xl-left(:class="{'xl-1': device.linkType === 'stopMotionModule'}")
        .col(:class="{'xl-7-13': device.linkType !== 'stopMotionModule'}")
          .box-button__title(v-html="productName(device.linkType)")
          .box-button__desc
            div
              template(v-if="device.isPairingDone")
                | Paired
              template(v-else)
                | Non-Paired
            LayoutCopyLinkId(:linkId="device.linkId")
          template(v-if="device.isRadioFirmwareUpdateRequired")
            .button.button--xs(@click="setSkipUpdateModal({id: device.linkId, type: 'required'})")
              | FIRMWARE UPDATE REQUIRED
          template(v-else-if="device.isDeviceFirmwareUpdateRequired")
            .button.button--xs(@click="setSkipUpdateModal({id: device.linkId, type: 'required'})")
              | FIRMWARE UPDATE REQUIRED
          template(v-else-if="device.isRadioFirmwareUpdateAvailable")
            .button.button--xs(@click="setSkipUpdateModal({id: device.linkId, type: 'available'})")
              | FIRMWARE UPDATE AVAILABLE
          template(v-else-if="device.isDeviceFirmwareUpdateAvailable")
            .button.button--xs(@click="setSkipUpdateModal({id: device.linkId, type: 'available'})")
              | FIRMWARE UPDATE AVAILABLE
          template(v-if="device.linkType === 'stopMotionModule'")
            .box-button__desc.box-button__desc--info
              | Stop Motion Module for HeadPLUS v1 / HeadPLUS v1 PRO does not work with edelkrone Web App. Can be developed with edelkrone SDK. Furthermore, please check the SDK documentation.
        .col.xl-6-13(v-if="device.linkType !== 'stopMotionModule'")
          .wrap.xl-2.xl-gutter-6
            .col
              .button.button--connect(@click="connect(device.linkId, device.isPairingDone)" :class="{'button--disabled': device.isRadioFirmwareUpdateRequired || device.isDeviceFirmwareUpdateRequired}") CONNECT
            .col
              .button.button--warning(@click="detect(device.linkId)" :class="{'button--disabled': device.isPairingDone || device.linkType !== 'linkAdapter' || device.isRadioFirmwareUpdateRequired || device.isDeviceFirmwareUpdateRequired}") DETECT
  .link__footer
    .box.box--detect
      img(src="../../assets/icon-search.png")
      | <span>“DETECT”</span> button lets you know which link adapter you are selecting by blinking the light on devices.
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import IconLoading from '../components/IconLoading.vue'
import LayoutCopyLinkId from '../components/LayoutCopyLinkId.vue'

import { productName, connection, consoleLogGroup } from '../../utils'

export default {
  async mounted () {
    if (this.appLoadingModal) {
      setTimeout(async () => {
        if (this.deviceList === null) {
          await this.getDeviceList({ delay: false })
        }
        this.setAppLoadingModal(false)
      }, 500)
    } else {
      if (this.deviceList === null) {
        await this.getDeviceList({ delay: false })
      }
    }
  },
  computed: {
    ...mapGetters('settings', [
      'ipAddress'
    ]),
    ...mapGetters('app', [
      'devMode',
      'deviceList'
    ]),
    ...mapGetters('layout', [
      'screenVisibility',
      'appLoadingModal'
    ])
  },
  methods: {
    ...mapActions('app', [
      'getDeviceList',
      'getBundleStatus',
      'setErrorMessage'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName',
      'setAppLoadingModal',
      'setSkipUpdateModal'
    ]),
    async detect (linkId) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${this.ipAddress}/v1`,
        url: `/link/${linkId}/detect`
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        this.setErrorMessage(errorMessage)
        if (this.devMode) {
          consoleLogGroup('ERROR_MESSAGE: detect', errorMessage, true, +new Date() - start)
        }
      }
    },
    productName (value) {
      return productName(value)
    },
    async connect (linkId, isPairingDone) {
      if (isPairingDone) {
        await this.getBundleStatus({ delay: false, linkId: linkId })
        const path = `/link/${linkId}`
        if (this.$route.path !== path) this.$router.push(path)
        this.setLinkRouteName('control-screen--keypose')
      } else {
        const path = `/link/${linkId}`
        if (this.$route.path !== path) this.$router.push(path)
        this.setLinkRouteName('channel-pairing')
      }
    }
  },
  components: {
    IconLoading,
    LayoutCopyLinkId
  }
}
</script>
