<template lang="pug">
.calibration.calibration--slide-module
  template(v-if="step === 1")
    .calibration-content.calibration-content--step-1
      .calibration-title
        | <span>Please Select</span>
      .calibration-buttons
        .wrap.xl-2.xl-gutter-6
          .col
            .button.button--xxl(@click.stop.prevent="selectType(true)")
              | ON <span>GROUND</span>
            .calibration-desc Make sure the leg extensions are attached.
          .col
            .button.button--xxl(@click.stop.prevent="selectType(false)")
              | ON <span>TRIPOD</span>
            .calibration-desc Make sure the tripod legs are extended as recommended.
  template(v-if="step === 2")
    .calibration-content.calibration-content--step-2
      .calibration-media
        .calibration-media__image
          template(v-if="slideModuleGifLeft")
            img(src="../../../../../assets/calibration--slide-module--left.png")
          template(v-else)
            img(src="../../../../../assets/calibration--slide-module--right.png")
      .calibration-title
        | <span>Choose</span> your Slide Module attachment side
      .wrap.xl-2.xl-gutter-6
        .col
          .button.button--xl(@click="selectSide(true)")
            | LEFT
        .col
          .button.button--xl(@click="selectSide(false)")
            | RIGHT
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { connection, consoleLogGroup } from '../../../../../utils'

export default {
  data () {
    return {
      slideModuleGifTimer: null,
      slideModuleGifLeft: true,
      step: 1,
      isOnGround: null,
      isOnLeftSide: null
    }
  },
  destroyed () {
    clearInterval(this.slideModuleGifTimer)
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
    slideModuleGif () {
      this.slideModuleGifLeft = !this.slideModuleGifLeft
    },
    selectType (value) {
      this.isOnGround = value
      this.step = 2
      this.slideModuleGifTimer = setInterval(this.slideModuleGif, 1500)
    },
    async selectSide (value) {
      const start = +new Date()
      this.isOnLeftSide = value
      const response = await connection({
        baseURL: `http://${this.ipAddress}/v1`,
        url: `/bundle/${this.$route.params.id}`,
        data: JSON.stringify({
          command: 'calibrate',
          device: this.supportedAxes.slideDevice,
          isOnGround: this.isOnGround,
          isOnLeftSide: this.isOnLeftSide
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
