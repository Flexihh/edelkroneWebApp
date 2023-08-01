<template lang="pug">
.firmware-update(v-if="selectedDevice")
  .firmware-update-device(:class="{'firmware-update-warning': selectedDevice.isDeviceFirmwareUpdateRequired || selectedDevice.isDeviceFirmwareUpdateAvailable}")
    .firmware-update-device__inner
      .firmware-update-header
        .firmware-update-header__title DEVICE FIRMWARE
        .firmware-update-header__desc
          template(v-if="selectedDevice.isDeviceFirmwareUpdateRequired || selectedDevice.isDeviceFirmwareUpdateAvailable")
            | New optional firmware update is available.
          template(v-else)
            | Your firmware is up-to-date.
      .firmware-update-content(v-if="selectedDevice.isDeviceFirmwareUpdateRequired || selectedDevice.isDeviceFirmwareUpdateAvailable")
        strong What is NEW?
        ul
          li {{ selectedDevice.deviceFirmwareChangelog }}
      template(v-if="selectedDevice.isDeviceFirmwareUpdateRequired || selectedDevice.isDeviceFirmwareUpdateAvailable")
        .button.button--firmware(@click="setLinkRouteName('firmware-update--device')")
          | UPDATE
          br
          | DEVICE FIRMWARE
      template(v-else)
        .button.button--firmware.button--disabled(@click="setLinkRouteName('firmware-update--device')")
          | UPDATE
          br
          | DEVICE FIRMWARE
      .firmware-update-info(v-if="selectedDevice.isDeviceFirmwareUpdateRequired || selectedDevice.isDeviceFirmwareUpdateAvailable")
        | Update may take 1 minute to complete.
  .firmware-update-radio(:class="{'firmware-update-warning': selectedDevice.isRadioFirmwareUpdateRequired || selectedDevice.isRadioFirmwareUpdateAvailable}")
    .firmware-update-radio__inner
      .firmware-update-header
        .firmware-update-header__title RADIO FIRMWARE
        .firmware-update-header__desc
          template(v-if="selectedDevice.isRadioFirmwareUpdateRequired || selectedDevice.isRadioFirmwareUpdateAvailable")
            | New optional firmware update is available.
          template(v-else)
            | Your firmware is up-to-date.
      .firmware-update-content(v-if="selectedDevice.isRadioFirmwareUpdateRequired || selectedDevice.isRadioFirmwareUpdateAvailable")
        strong What is NEW?
        ul
          li {{ selectedDevice.radioFirmwareChangelog }}
      template(v-if="selectedDevice.isRadioFirmwareUpdateRequired || selectedDevice.isRadioFirmwareUpdateAvailable")
        .button.button--firmware(@click="setLinkRouteName('firmware-update--radio')")
          | UPDATE
          br
          | RADIO FIRMWARE
      template(v-else)
        .button.button--firmware.button--disabled
          | UPDATE
          br
          | RADIO FIRMWARE
      .firmware-update-info(v-if="selectedDevice.isRadioFirmwareUpdateRequired || selectedDevice.isRadioFirmwareUpdateAvailable")
        | Update may take 1 minute to complete.
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import filter from 'lodash/filter'

export default {
  data () {
    return {
      selectedDevice: null
    }
  },
  async mounted () {
    if (this.deviceList === null) {
      await this.getDeviceList({ delay: false })
    }
    this.updateSelectedDevice()
  },
  watch: {
    deviceList () {
      this.updateSelectedDevice()
    }
  },
  computed: {
    ...mapGetters('app', [
      'deviceList'
    ])
  },
  methods: {
    ...mapActions('app', [
      'getDeviceList'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName'
    ]),
    updateSelectedDevice () {
      if (this.deviceList !== null) {
        if (this.$route.params.id) {
          if (filter(this.deviceList, { linkId: this.$route.params.id })[0]) {
            this.selectedDevice = filter(this.deviceList, { linkId: this.$route.params.id })[0]
          }
        }
      }
    }
  }
}
</script>
