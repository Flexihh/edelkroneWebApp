<template lang="pug">
.link
  template(v-if="linkDeviceFirmwareUpdateStatus && (linkDeviceFirmwareUpdateStatus.status === 'error' || linkDeviceFirmwareUpdateStatus.status === 'multipleDFUDevice' || linkDeviceFirmwareUpdateStatus.status === 'noDevice')")
    .error
      .error-content
        template(v-if="linkDeviceFirmwareUpdateStatus.status === 'error'")
          .error-content__title UPDATE PROCESS FAILED
          .error-content__desc
            | An unknown problem occurred, please start the device firmware update process again.
        template(v-if="linkDeviceFirmwareUpdateStatus.status === 'multipleDFUDevice'")
          .error-content__title UPDATE PROCESS FAILED
          .error-content__desc
            | Multiple devices found. Please make sure, a single edelkrone Link Adapter is connected in update mode.
        template(v-if="linkDeviceFirmwareUpdateStatus.status === 'noDevice'")
          .error-content__title UPDATE PROCESS FAILED
          .error-content__desc
            | Device not found. Please make sure, a single edelkrone Link Adapter is connected in update mode.
        .wrap.xl-2.xl-gutter-6.xl-center
          .col
            .button.button--xl(@click="back()") BACK
  template(v-else-if="linkDeviceFirmwareUpdateStatus && linkDeviceFirmwareUpdateStatus.status === 'finished'")
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
          | DEVICE FIRMWARE UPDATE PROCESS
        .process-content__image
          img(src="../../../../assets/firmware-update--device--edelkrone-link-adapter.png")
        .process-content__desc
          | Press & hold the button on edelkrone Link Adapter while plugging it into your computer. Once it's plugged, you may release the button.
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
      'deviceList',
      'linkDeviceFirmwareUpdateStatus'
    ])
  },
  methods: {
    ...mapActions('app', [
      'devMode',
      'getDeviceList',
      'getLinkDeviceFirmwareUpdateStatus',
      'setLinkDeviceFirmwareUpdateStatusTimestamp',
      'setErrorMessage'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName'
    ]),
    startTimer () {
      this.setLinkDeviceFirmwareUpdateStatusTimestamp(+new Date())
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
        url: '/device',
        data: JSON.stringify({
          command: 'startLinkDeviceFirmwareUpdate'
        })
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        this.setErrorMessage(errorMessage)
        if (this.devMode) {
          consoleLogGroup('ERROR_MESSAGE: startLinkDeviceFirmwareUpdate', errorMessage, true, +new Date() - start)
        }
      }
      await this.getLinkDeviceFirmwareUpdateStatus({ delay: false })
    },
    async back () {
      if (this.$route.name === 'firmware-update') {
        window.location.href = '/firmware-update'
      } else {
        if (this.deviceList === null) {
          await this.getDeviceList({ delay: false })
        }
        this.setLinkRouteName('firmware-update')
      }
    },
    async done () {
      if (this.deviceList === null) {
        await this.getDeviceList({ delay: false })
      }
      const path = '/link'
      if (this.$route.path !== path) this.$router.push(path)
      this.setLinkRouteName('')
    }
  }
}
</script>
