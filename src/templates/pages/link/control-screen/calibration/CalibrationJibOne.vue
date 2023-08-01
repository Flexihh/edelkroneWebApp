<template lang="pug">
.calibration.calibration--jibone
  template(v-if="step === 1")
    .calibration-content.calibration-content--step-1
      .calibration-title
        span Please make sure JibONE's locked. This calibration finds the hard limits of the JibONE.
      .calibration-media
        .calibration-media__image
          img(src="../../../../../assets/calibration--jibone--lock.png")
      .wrap.xl-2.xl-gutter-6
        .col
          .button.button--xl(@click="back")
            | BACK
        .col
          .button.button--xl(@click="done")
            span DONE
  template(v-if="step === 2")
    .calibration-content.calibration-content--step-2
      .calibration-content-jib-length
        .calibration-media
          .calibration-media__image
            img(src="../../../../../assets/calibration--jibone--jib-length.png")
        .wrap.xl-center.xl-middle
          .col.xl-3-5
            .calibration-title--selectbox <span>ENTER</span> JIB LENGTH FROM THE RULER
          .col.xl-2-5
            .form-field.form-field--select
              select(v-model="jibLength")
                option(disabled :value="null") -
                option 27
                option 26
                option 25
                option 24
                option 23
                option 22
                option 21
                option 20
                option 19
                option 18
                option 17
                option 16
                option 15
                option 14
                option 13
                option 12
                option 11
                option 10
                option 9
                option 8
                option 7
                option 6
                option 5
                option 4
                option 3
                option 2
                option 1
      .calibration-content-rod-length
        .calibration-media.calibration-media
          .calibration-media__image
            img(src="../../../../../assets/calibration--jibone--rod-length.png")
        .wrap.xl-center.xl-middle
          .col.xl-3-5
            .calibration-title--selectbox <span>COUNT</span> THE LINES <span>& ENTER</span> ROD LENGTH
          .col.xl-2-5
            .form-field.form-field--select
              select(v-model="rodLength")
                option(disabled :value="null") -
                option 4
                option 3
                option 2
                option 1
      .wrap.xl-2.xl-gutter-6
        .col
          .button.button--xl(@click="back")
            | BACK
        .col
          .button.button--xl(@click="set()" :class="{'button--disabled': !this.jibLength || !this.rodLength}")
            span SET
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { connection, consoleLogGroup } from '../../../../../utils'

export default {
  data () {
    return {
      step: 1,
      jibLength: null,
      rodLength: null
    }
  },
  computed: {
    ...mapGetters('settings', [
      'ipAddress'
    ]),
    ...mapGetters('app', [
      'devMode',
      'supportedAxes'
    ])
  },
  methods: {
    ...mapActions('app', [
      'setErrorMessage'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName'
    ]),
    back () {
      if (this.step === 1) {
        this.setLinkRouteName('control-screen--keypose')
      }
      if (this.step === 2) {
        this.step = 1
      }
    },
    done () {
      this.step = 2
    },
    async set () {
      const start = +new Date()
      let device = null
      if (this.supportedAxes.slide) {
        device = this.supportedAxes.slideDevice
      }
      if (this.supportedAxes.jibPanTilt) {
        device = this.supportedAxes.jibPanTiltDevice
      }
      const response = await connection({
        baseURL: `http://${this.ipAddress}/v1`,
        url: `/bundle/${this.$route.params.id}`,
        data: JSON.stringify({
          command: 'calibrate',
          device: device,
          jibLength: parseInt(this.jibLength),
          rodLength: parseInt(this.rodLength)
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
  }
}
</script>
