<template lang="pug">
div
  template(v-if="linkRouteName === 'control-screen--calibration--head'")
    CalibrationHead
  template(v-if="linkRouteName === 'control-screen--calibration--slide-module'")
    CalibrationSlideModule
  template(v-if="linkRouteName === 'control-screen--calibration--jibone'")
    CalibrationJibOne
  template(v-if="linkRouteName === 'control-screen--calibration--loading--sliderone'")
    CalibrationSliderOne
  template(v-if="linkRouteName === 'control-screen--calibration--loading--focusplus-pro'")
    CalibrationFocusPlusPro
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import CalibrationHead from './calibration/CalibrationHead.vue'
import CalibrationJibOne from './calibration/CalibrationJibOne.vue'
import CalibrationSlideModule from './calibration/CalibrationSlideModule.vue'
import CalibrationSliderOne from './calibration/CalibrationSliderOne.vue'
import CalibrationFocusPlusPro from './calibration/CalibrationFocusPlusPro.vue'

export default {
  watch: {
    bundleStatus () {
      if (this.linkRouteName === 'control-screen--calibration--head') {
        if (this.supportedAxes.headPanTilt && this.calibratedAxes.headPanTilt) {
          this.setLinkRouteName('control-screen--keypose')
        } else {
          if (this.supportedAxes.headPan && this.calibratedAxes.headPan) {
            this.setLinkRouteName('control-screen--keypose')
          } else if (this.supportedAxes.headTilt && this.calibratedAxes.headTilt) {
            this.setLinkRouteName('control-screen--keypose')
          }
        }
      }
      if (this.linkRouteName === 'control-screen--calibration--slide-module') {
        if (this.supportedAxes.slide && this.calibratedAxes.slide) {
          this.setLinkRouteName('control-screen--keypose')
        }
      }
      if (this.linkRouteName === 'control-screen--calibration--jibone') {
        if ((this.supportedAxes.slide && this.calibratedAxes.slide) || (this.supportedAxes.jibPanTilt && this.calibratedAxes.jibPanTilt)) {
          this.setLinkRouteName('control-screen--keypose')
        }
      }
    }
  },
  computed: {
    ...mapGetters('app', [
      'bundleStatus',
      'supportedAxes',
      'calibratedAxes'
    ]),
    ...mapGetters('layout', [
      'linkRouteName'
    ])
  },
  methods: {
    ...mapActions('layout', [
      'setLinkRouteName'
    ])
  },
  components: {
    CalibrationHead,
    CalibrationJibOne,
    CalibrationSlideModule,
    CalibrationSliderOne,
    CalibrationFocusPlusPro
  }
}
</script>
