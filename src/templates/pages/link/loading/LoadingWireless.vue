<template lang="pug">
.link(v-if="screenVisibility")
  template(v-if="isLoading")
    .loading
      IconLoading
      .loading__message
        | Please wait... Discovering devices and bundling them.
  template(v-else)
    .error
      .error-content
        .error-content__title PAIRING FAILED
        template(v-if="wirelessPairingStatus.lastPairError === 'wifiChannelMismatch'")
          .error-content__desc
            | Wireless channels are different. Please make sure, wireless channels are the same.
        template(v-else-if="wirelessPairingStatus.lastPairError === 'impossibleScenario'")
          .error-content__desc
            | Selected devices can not be bundled into a single setup.
        template(v-else-if="wirelessPairingStatus.lastPairError === 'radioFirmwareUpdateRequired'")
          .error-content__desc
            | Radio firmware update required for one or more of your devices in the current bundle. Please connect with edelkrone App (iOS/Android) to your bundle to check which device(s) need the update, then follow the instructions from the edelkrone app (iOS/Android) to continue.
        template(v-else-if="wirelessPairingStatus.lastPairError === 'deviceFirmwareUpdateRequired'")
          .error-content__desc
            | Device firmware update required for one or more devices in the current bundle. Please connect with edelkrone App (iOS/Android) to your bundle to check which device(s) need the update, then follow the instructions from the edelkrone app (iOS/Android) to continue.
        template(v-else-if="wirelessPairingStatus.lastPairError === 'unknown'")
          .error-content__desc
            | Please retry to reconnect your device(s).
        template(v-else-if="wirelessPairingStatus.lastPairError === 'deviceSearchProblem'")
          .error-content__desc
            | Please make sure your devices are powered up and in wireless range.
        template(v-else-if="wirelessPairingStatus.lastPairError === 'connectionProblem' || wirelessPairingStatus.lastPairError === 'problem'")
          .error-content__desc
            | A problem occurred while connecting. Please retry to reconnect your device(s).
        template(v-else)
          .error-content__desc
            | A problem occurred while connecting. Please retry to reconnect your device(s).
        .wrap.xl-2.xl-gutter-6.xl-center
          .col
            .button.button--xl(@click="back()") BACK
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import IconLoading from '../../../components/IconLoading.vue'

import isUndefined from 'lodash/isUndefined'

export default {
  async mounted () {
    await this.getWirelessPairingStatus({ delay: false, linkId: this.$route.params.id })
  },
  computed: {
    ...mapGetters('app', [
      'wirelessPairingStatus'
    ]),
    ...mapGetters('layout', [
      'screenVisibility'
    ]),
    isLoading () {
      if (this.wirelessPairingStatus === null || isUndefined(this.wirelessPairingStatus) || isUndefined(this.wirelessPairingStatus.lastPairError) || this.wirelessPairingStatus.lastPairError === 'none') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions('app', [
      'getWirelessPairingStatus'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName'
    ]),
    back () {
      const path = `/link/${this.$route.params.id}`
      if (this.$route.path !== path) this.$router.push(path)
      this.setLinkRouteName('device-pairing--wireless')
    }
  },
  components: {
    IconLoading
  }
}
</script>
