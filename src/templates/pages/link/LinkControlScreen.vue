<template lang="pug">
div
  template(v-if="linkRouteName === 'control-screen--keypose'")
    ControlScreenKeypose
  template(v-if="linkRouteName.includes('control-screen--calibration')")
    ControlScreenCalibration
  template(v-if="linkRouteName.includes('control-screen--mode')")
    ControlScreenMode
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { connection, consoleLogGroup } from '../../../utils'

import ControlScreenKeypose from './control-screen/ControlScreenKeypose.vue'
import ControlScreenCalibration from './control-screen/ControlScreenCalibration.vue'
import ControlScreenMode from './control-screen/ControlScreenMode.vue'

export default {
  async mounted () {
    await this.updateConnectionProblem()
    const start = +new Date()
    if (this.supportedAxes.focus && !this.calibratedAxes.focus && this.bundleStatus.deviceInfo.length === 1 && this.bundleStatus.deviceInfo[0].type === 'focusPlusPro') {
      const response = await connection({
        baseURL: `http://${this.ipAddress}/v1`,
        url: `/bundle/${this.$route.params.id}`,
        data: JSON.stringify({
          command: 'calibrate',
          device: this.supportedAxes.focusDevice
        })
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        this.setErrorMessage(errorMessage)
        if (this.devMode) {
          consoleLogGroup('ERROR_MESSAGE: calibrate', errorMessage, true, +new Date() - start)
        }
      }
    }
    await this.getBundleStatus({ delay: false, linkId: this.$route.params.id })
  },
  watch: {
    localTimestampEpoch () {
      this.updateConnectionProblem()
    }
  },
  computed: {
    ...mapGetters('settings', [
      'ipAddress'
    ]),
    ...mapGetters('app', [
      'devMode',
      'bundleStatus',
      'supportedAxes',
      'calibratedAxes'
    ]),
    ...mapGetters('layout', [
      'linkRouteName',
      'connectionProblemModal'
    ]),
    localTimestampEpoch () {
      const now = +new Date()
      return now - this.bundleStatus.timestampEpoch
    }
  },
  methods: {
    ...mapActions('app', [
      'getBundleStatus',
      'setErrorMessage'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName',
      'setConnectionProblemModal'
    ]),
    updateConnectionProblem () {
      if (this.localTimestampEpoch > 4000) {
        this.setConnectionProblemModal(true)
      } else {
        if (this.connectionProblemModal) {
          this.setConnectionProblemModal(false)
        }
      }
    }
  },
  components: {
    ControlScreenKeypose,
    ControlScreenCalibration,
    ControlScreenMode
  }
}
</script>
