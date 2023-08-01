<template lang="pug">
.link
  template(v-if="linkRadioFirmwareUpdateStatus && linkRadioFirmwareUpdateStatus.status === 'error'")
    .error
      .error-content
        .error-content__title UPDATE PROCESS FAILED
        .error-content__desc
          | An unknown problem occurred, please start the device firmware update process again.
  template(v-else-if="linkRadioFirmwareUpdateStatus && linkRadioFirmwareUpdateStatus.status === 'finished'")
    .error.error--done
      .error-content
        .error-content__title UPDATE PROCESS COMPLETED
        .error-content__desc
          | Please, unplug edelkrone Link Adapter and plug it back in.
        .wrap.xl-2.xl-gutter-6.xl-center
          .col
            .button.button--xl(@click="done()") DONE
  template(v-else)
    .process
      .process-content
        .process-content__title
          | RADIO FIRMWARE UPDATE PROCESS
        template(v-if="!timeInSeconds")
          .button.button--xl(@click="start")
            span START
        template(v-else)
          .button.button--xl.button--disabled
            | UPDATING...&nbsp;
            template(v-if="hours && timeInSeconds >= 3600")
              | {{ hours }}h&nbsp;
            template(v-if="minutes && timeInSeconds >= 60")
              | {{ minutes }}m&nbsp;
            template(v-if="seconds && seconds")
              | {{ seconds }}s
        .process-content__info
          | Update may take 1 minute to complete. Please, do not leave the page while updating!
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { connection, consoleLogGroup } from '../../../../utils'

export default {
  data () {
    return {
      timeInSeconds: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    }
  },
  destroyed () {
    this.stopTimer()
  },
  watch: {
    timeInSeconds () {
      this.getTime(this.timeInSeconds)
    }
  },
  computed: {
    ...mapGetters('settings', [
      'ipAddress'
    ]),
    ...mapGetters('app', [
      'devMode',
      'linkRadioFirmwareUpdateStatus'
    ])
  },
  methods: {
    ...mapActions('app', [
      'getLinkRadioFirmwareUpdateStatus',
      'setErrorMessage'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName'
    ]),
    startTimer () {
      if (!this.timeInSeconds) {
        this.timeInSeconds = 1
      }
      this.timeInSecondsInterval = setInterval(() => {
        this.timeInSeconds += 1
      }, 1000)
    },
    stopTimer () {
      clearInterval(this.timeInSecondsInterval)
    },
    getTime (timeInSeconds) {
      const pad = (num, size) => ('000' + num).slice(size * -1)
      const time = parseFloat(timeInSeconds).toFixed(3)
      const hours = Math.floor(time / 60 / 60)
      const minutes = Math.floor(time / 60) % 60
      const seconds = Math.floor(time - minutes * 60)
      const milliseconds = time.slice(-3)

      this.hours = parseInt(pad(hours, 2))
      this.minutes = parseInt(pad(minutes, 2))
      this.seconds = parseInt(pad(seconds, 2))
      this.milliseconds = parseInt(pad(milliseconds, 3))
    },
    async start () {
      const start = +new Date()
      this.startTimer()
      const response = await connection({
        baseURL: `http://${this.ipAddress}/v1`,
        url: `/link/${this.$route.params.id}`,
        data: JSON.stringify({
          command: 'startLinkRadioFirmwareUpdate'
        })
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        this.setErrorMessage(errorMessage)
        if (this.devMode) {
          consoleLogGroup('ERROR_MESSAGE: startLinkRadioFirmwareUpdate', errorMessage, true, +new Date() - start)
        }
      }
      await this.getLinkRadioFirmwareUpdateStatus({ delay: false, linkId: this.$route.params.id })
    },
    async back () {
      this.setLinkRouteName('firmware-update')
    },
    async done () {
      const path = '/link'
      if (this.$route.path !== path) this.$router.push(path)
      this.setLinkRouteName('')
    }
  }
}
</script>
