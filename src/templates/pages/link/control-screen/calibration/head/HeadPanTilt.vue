<template lang="pug">
div
  template(v-if="isDollyPlus")
    .calibration-media.calibration-media--horizontal
      template(v-if="supportedAxes.headPanTilt")
        HeadPan(v-if="handle" :handle="handle")
        HeadTilt(v-if="handle" :handle="handle")
      template(v-else)
        template(v-if="supportedAxes.headPan")
          HeadPan(v-if="handle" :handle="handle")
        template(v-else-if="supportedAxes.headTilt")
          HeadTilt(v-if="handle" :handle="handle")
  template(v-else)
    template(v-if="supportedAxes.headPanTilt")
      .wrap.xl-gutter-6
        .col.xl-3-5
          HeadPan(v-if="handle" :handle="handle")
        .col.xl-2-5
          HeadTilt(v-if="handle" :handle="handle")
    template(v-else)
      template(v-if="supportedAxes.headPan")
        HeadPan(v-if="handle" :handle="handle")
      template(v-else-if="supportedAxes.headTilt")
        HeadTilt(v-if="handle" :handle="handle")
  .calibration-title
    | <span>Straighten</span> camera as shown.
</template>

<script>
import { mapGetters } from 'vuex'

import HeadPan from './HeadPan.vue'
import HeadTilt from './HeadTilt.vue'

import filter from 'lodash/filter'
import map from 'lodash/map'

export default {
  computed: {
    ...mapGetters('app', [
      'bundleStatus',
      'supportedAxes'
    ]),
    isDollyPlus () {
      if (this.supportedAxes.slideDevice && this.supportedAxes.slideDevice.includes('dollyPlus')) {
        return true
      } else {
        return false
      }
    },
    handle () {
      if (!this.supportedAxes.slide && !this.supportedAxes.jibPanTilt) {
        if (this.supportedAxes.headDevice === 'headOne') {
          if (filter(map(this.bundleStatus.deviceInfo, device => device.type), type => type === 'headOne').length === 2) {
            return 'headone-x2'
          } else {
            return 'headone'
          }
        } else if (this.supportedAxes.headDevice === 'panPro') {
          return 'pan-pro'
        } else if (this.supportedAxes.headDevice && this.supportedAxes.headDevice.includes('headPlus')) {
          return 'headplus'
        } else {
          return null
        }
      } else {
        if ((this.supportedAxes.slide && (this.supportedAxes.slideDevice === 'jibOne' || this.supportedAxes.slideDevice === 'jibOneV2')) || this.supportedAxes.jibPanTilt) {
          if (this.supportedAxes.headDevice === 'headOne') {
            return 'jibone--headone'
          } else if (this.supportedAxes.headDevice === 'panPro') {
            return 'jibone--pan-pro'
          } else if (this.supportedAxes.headDevice && this.supportedAxes.headDevice.includes('headPlus')) {
            return 'jibone--headplus'
          } else {
            return null
          }
        } else if (this.supportedAxes.slide) {
          if (this.supportedAxes.slideDevice && this.supportedAxes.slideDevice.includes('slideModule')) {
            return 'slide-module'
          } else if (this.supportedAxes.slideDevice === 'sliderOne') {
            return 'sliderone'
          } else if (this.supportedAxes.slideDevice === 'dollyOne' || this.supportedAxes.slideDevice === 'surfaceOne') {
            return 'dollyone'
          } else if (this.supportedAxes.slideDevice && this.supportedAxes.slideDevice.includes('dollyPlus')) {
            return 'dollyplus'
          } else {
            return null
          }
        } else {
          return null
        }
      }
    }
  },
  components: {
    HeadPan,
    HeadTilt
  }
}
</script>
