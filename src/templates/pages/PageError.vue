<template lang="pug">
.link(v-if="screenVisibility")
  .error
    .error-content
      .error-content__title ERROR
      .error-content__desc
        | A problem occurred while connecting.
      .wrap.xl-2.xl-gutter-6.xl-center
        .col
          .button.button--xl(@click="home()") HOME
        .col(v-if="devMode")
          .button.button--xl(@click="setSettingsModal(true)") SETTINGS
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  async mounted () {
    if (this.deviceList !== null || this.visionList !== null) {
      await this.emptyData()
    }
  },
  watch: {
    async errorMessage () {
      if (this.errorMessage !== null) {
        await this.emptyData()
      }
    }
  },
  computed: {
    ...mapGetters('app', [
      'devMode',
      'deviceList',
      'visionList',
      'errorMessage'
    ]),
    ...mapGetters('layout', [
      'screenVisibility'
    ])
  },
  methods: {
    ...mapActions('app', [
      'setWirelessPairingScanStop',
      'emptyDeviceList',
      'emptyVisionList',
      'emptyBundleStatus',
      'emptyWirelessProductList',
      'emptyWirelessPairingStatus',
      'emptyCanbusProductList',
      'emptyCanbusPairingStatus',
      'emptyLinkDeviceFirmwareUpdateStatus',
      'emptyLinkRadioFirmwareUpdateStatus'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName',
      'setSettingsModal'
    ]),
    async emptyData () {
      this.setWirelessPairingScanStop()
      await this.emptyDeviceList()
      await this.emptyVisionList()
      await this.emptyBundleStatus()
      await this.emptyWirelessProductList()
      await this.emptyWirelessPairingStatus()
      await this.emptyCanbusProductList()
      await this.emptyCanbusPairingStatus()
      await this.emptyLinkDeviceFirmwareUpdateStatus()
      await this.emptyLinkRadioFirmwareUpdateStatus()
    },
    home () {
      const path = '/'
      if (this.$route.path !== path) this.$router.push(path)
      this.setLinkRouteName('')
    }
  }
}
</script>
