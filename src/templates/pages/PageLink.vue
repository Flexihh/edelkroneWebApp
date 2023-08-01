<template lang="pug">
div
  template(v-if="linkRouteName === 'channel-pairing'")
    LinkChannelPairing
  template(v-if="linkRouteName.includes('device-pairing--')")
    LinkDevicePairing
  template(v-if="linkRouteName.includes('loading--')")
    LinkLoading
  template(v-if="linkRouteName.includes('control-screen--')")
    LinkControlScreen
  template(v-if="linkRouteName === 'firmware-update'")
    LinkFirmwareUpdate
  template(v-if="linkRouteName === 'firmware-update--device'")
    FirmwareUpdateDevice
  template(v-if="linkRouteName === 'firmware-update--radio'")
    FirmwareUpdateRadio
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import LinkChannelPairing from './link/LinkChannelPairing.vue'
import LinkDevicePairing from './link/LinkDevicePairing.vue'
import LinkLoading from './link/LinkLoading.vue'
import LinkControlScreen from './link/LinkControlScreen.vue'
import LinkFirmwareUpdate from './link/LinkFirmwareUpdate.vue'
import FirmwareUpdateDevice from './link/firmware-update/FirmwareUpdateDevice.vue'
import FirmwareUpdateRadio from './link/firmware-update/FirmwareUpdateRadio.vue'

import filter from 'lodash/filter'

export default {
  async mounted () {
    if (this.deviceList === null) {
      await this.getDeviceList({ delay: false })
    }
    if (this.linkRouteName === '' && this.$route.params.id) {
      const selectedDevice = filter(this.deviceList, { linkId: this.$route.params.id })[0]
      if (selectedDevice && this.$route.params.id === selectedDevice.linkId) {
        if (selectedDevice.isValid && !selectedDevice.isPairingDone) {
          if (selectedDevice.isRadioFirmwareUpdateRequired || selectedDevice.isDeviceFirmwareUpdateRequired) {
            const path = '/link'
            if (this.$route.path !== path) this.$router.push(path)
            this.setLinkRouteName('')
          } else {
            this.setLinkRouteName('channel-pairing')
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters('app', [
      'deviceList'
    ]),
    ...mapGetters('layout', [
      'linkRouteName'
    ])
  },
  methods: {
    ...mapActions('app', [
      'getDeviceList'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName'
    ])
  },
  components: {
    LinkChannelPairing,
    LinkDevicePairing,
    LinkLoading,
    LinkControlScreen,
    LinkFirmwareUpdate,
    FirmwareUpdateDevice,
    FirmwareUpdateRadio
  }
}
</script>
