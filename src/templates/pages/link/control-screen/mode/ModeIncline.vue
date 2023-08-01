<template lang="pug">
.mode.mode--incline(:class="`mode--step-${step}`")
  .mode-content
    template(v-if="step === 1")
      .mode-content__title.mode-content__title--warning
        span UNSUPPORTED INCLINE ANGLE
      .mode-content__desc
        div
          div You have not attached your Slide Module to the side with the <span>“INCLINE”</span> sign and your angle is more than <span>22.5°</span>. Your device does not support these conditions & it might cause <span>danger</span>.
          div Please learn more about <span>how to do inclined</span> shots safely and set your incline in the right way.
      .mode-content__buttons
        .button.button--xl(@click="next")
          | LEARN MORE
        .button.button--xl(@click="inclineWarningConfirm")
          | OK
    template(v-if="step !== 1")
      .mode-content__title
        span HOW TO SET INCLINE SAFELY
      .mode-content-dots(:class="`mode-content-dots--${step - 1}`")
        .mode-content-dots__item
        .mode-content-dots__item
        .mode-content-dots__item
        .mode-content-dots__item
    template(v-if="step === 2")
      .mode-content-media
        .mode-content-media__image
          img(src="../../../../../assets/mode--incline--step-1.png")
      .mode-content__desc
        div
          div
            | Attach your Slide Module
            br
            | to the side that has the <span>“INCLINE”</span> sign.
          div
            | Only the Slider<span>PLUS v5</span> series have this feature
            br
            | and the <span>“INCLINE”</span> sign.
    template(v-if="step === 3")
      .mode-content-media
        .mode-content-media__image
          img(src="../../../../../assets/mode--incline--step-2.png")
      .mode-content__desc
        div
          div
            | <span>Keep</span> your Slide Module at the <span>down side</span>
            br
            | for all incline setups.
    template(v-if="step === 4")
      .mode-content-media
        .mode-content-media__image
          img(src="../../../../../assets/mode--incline--step-3.png")
      .mode-content__desc
        div
          div
            | Max <span>weight</span> : 5.5 lb / 2.5kg
            br
            | Max <span>angle</span> : 22.5°
    template(v-if="step === 5")
      .mode-content-media
        .mode-content-media__image
          img(src="../../../../../assets/mode--incline--step-4.png")
      .mode-content__desc
        div
          div
            | <span>Increase tension</span> with an allen key
    template(v-if="step !== 1")
      .mode-content__buttons
        .wrap.xl-2.xl-gutter-6.xl-center
          .col
            .button.button--xl(@click="back")
              | BACK
          .col
            .button.button--xl(@click="next")
              template(v-if="step === 5")
                | CONFIRM
              template(v-else)
                | NEXT
      template(v-if="step === 5")
        .mode-content__warning
          | Apart from these instructions, edelkrone cannot be held responsible for any accident caused by improper use of the incline mode.
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { connection, consoleLogGroup } from '../../../../../utils'

export default {
  data () {
    return {
      step: 1
    }
  },
  mounted () {
    if (this.bundleStatus.inclineMode === 'danger') {
      this.step = 1
    } else {
      this.step = 2
    }
  },
  watch: {
    linkRouteName () {
      if (this.bundleStatus.inclineMode === 'danger') {
        this.step = 1
      } else {
        this.step = 2
      }
    }
  },
  computed: {
    ...mapGetters('settings', [
      'ipAddress'
    ]),
    ...mapGetters('app', [
      'devMode',
      'bundleStatus'
    ]),
    ...mapGetters('layout', [
      'linkRouteName'
    ])
  },
  methods: {
    ...mapActions('app', [
      'setErrorMessage'
    ]),
    back () {
      if (this.step === 2) {
        this.inclineWarningConfirm()
      } else {
        this.step = this.step - 1
      }
    },
    next () {
      if (this.step === 5) {
        this.inclineWarningConfirm()
      } else {
        this.step = this.step + 1
      }
    },
    async inclineWarningConfirm () {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${this.ipAddress}/v1`,
        url: `/bundle/${this.$route.params.id}`,
        data: JSON.stringify({
          command: 'slideModuleInclineWarningConfirm'
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
