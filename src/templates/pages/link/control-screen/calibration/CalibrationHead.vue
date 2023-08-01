<template lang="pug">
.calibration
  .calibration-content
    HeadPanTilt
    .calibration-joystick
      .wrap.xl-center
        .col.xl-width-174
          template(v-if="supportedAxes.headPanTilt && supportedAxes.jibPanTilt")
            ControlJoystick(name="headPanTilt" title="head" :pan="true" :tilt="true" :slide="false")
          template(v-else)
            template(v-if="supportedAxes.headPanTilt")
              ControlJoystick(name="headPanTilt" :pan="true" :tilt="true" :slide="false")
            template(v-else)
              template(v-if="supportedAxes.headPan")
                ControlJoystick(name="headPan" :pan="true" :tilt="false" :slide="false")
              template(v-else-if="supportedAxes.headTilt")
                ControlJoystick(name="headTilt" :pan="false" :tilt="true" :slide="false")
    .calibration-buttons
      .wrap.xl-2.xl-gutter-6
        .col
          .button.button--xl(@click="back") BACK
        .col
          .button.button--xl(@click="done")
            span DONE
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import HeadPanTilt from './head/HeadPanTilt.vue'
import ControlJoystick from '../../../../components/ControlJoystick.vue'

import { connection, consoleLogGroup } from '../../../../../utils'

export default {
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
    async done () {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${this.ipAddress}/v1`,
        url: `/bundle/${this.$route.params.id}`,
        data: JSON.stringify({
          command: 'calibrate',
          device: this.supportedAxes.headDevice
        })
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        this.setErrorMessage(errorMessage)
        if (this.devMode) {
          consoleLogGroup('ERROR_MESSAGE: calibrate', errorMessage, true, +new Date() - start)
        }
      }
    },
    back () {
      this.setLinkRouteName('control-screen--keypose')
    }
  },
  components: {
    HeadPanTilt,
    ControlJoystick
  }
}
</script>
