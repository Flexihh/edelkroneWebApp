<template lang="pug">
.link(v-if="screenVisibility" :class="linkDisabledClass")
  .link__control
    template(v-if="bundleStatus.keyposeSlotsFilled.length === 3 && !supportedAxes.focus")
      template(v-if="supportedAxes.headPanTilt")
        ControlJoystick(name="headPanTilt" :pan="true" :tilt="true" :slide="false")
      template(v-else-if="supportedAxes.jibPanTilt")
        ControlJoystick(name="jibPanTilt" :pan="true" :tilt="true" :slide="false")
      template(v-else)
        template(v-if="supportedAxes.headPan")
          ControlJoystick(name="headPan" :pan="true" :tilt="false" :slide="false")
        template(v-else-if="supportedAxes.headTilt")
          ControlJoystick(name="headTilt" :pan="false" :tilt="true" :slide="false")
      template(v-if="supportedAxes.slide")
        ControlJoystick(name="slide" :pan="false" :tilt="false" :slide="true")
    template(v-else)
      .wrap
        template(v-if="supportedAxes.headPanTilt && supportedAxes.jibPanTilt")
          .col.xl-width-174
            ControlJoystick(name="headPanTilt" title="head" :pan="true" :tilt="true" :slide="false")
        template(v-else)
          template(v-if="supportedAxes.headPanTilt")
            .col.xl-width-174
              ControlJoystick(name="headPanTilt" :pan="true" :tilt="true" :slide="false")
          template(v-else)
            template(v-if="supportedAxes.headPan")
              .col.xl-width-174
                ControlJoystick(name="headPan" :pan="true" :tilt="false" :slide="false")
            template(v-else-if="supportedAxes.headTilt")
              .col.xl-width-174
                ControlJoystick(name="headTilt" :pan="false" :tilt="true" :slide="false")
            template(v-else)
              .col.xl-width-174
                ControlDummyJoystick(name="headPanTiltDummy")
        template(v-if="supportedAxes.focus")
          .col.xl-width-100
            ControlFocus
        template(v-else)
          .col.xl-width-100
            ControlDummyFocus
        template(v-if="supportedAxes.slide")
          .col.xl-width-174
            ControlJoystick(name="slide" :pan="false" :tilt="false" :slide="true")
        template(v-else-if="supportedAxes.headPanTilt && supportedAxes.jibPanTilt")
          .col.xl-width-174
            ControlJoystick(name="jibPanTilt" title="jib" :pan="true" :tilt="true" :slide="false")
        template(v-else)
          template(v-if="supportedAxes.jibPanTilt")
            .col.xl-width-174
              ControlJoystick(name="jibPanTilt" title="jib" :pan="true" :tilt="true" :slide="false")
          template(v-else)
            .col.xl-width-174
              ControlDummyJoystick(name="slideDummy")
  .link__keypose
    ControlKeypose
  ControlRange(name="speed")
  ControlRange(name="acceleration")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import ControlJoystick from '../../../components/ControlJoystick.vue'
import ControlFocus from '../../../components/ControlFocus.vue'
import ControlDummyJoystick from '../../../components/ControlDummyJoystick.vue'
import ControlDummyFocus from '../../../components/ControlDummyFocus.vue'
import ControlKeypose from '../../../components/ControlKeypose.vue'
import ControlRange from '../../../components/ControlRange.vue'

export default {
  watch: {
    bundleStatus () {
      if (this.bundleStatus.state === 'keyposeMove') {
        this.setIsAction(true)
      } else {
        this.setIsAction(false)
      }
    }
  },
  computed: {
    ...mapGetters('app', [
      'bundleStatus',
      'supportedAxes'
    ]),
    ...mapGetters('layout', [
      'screenVisibility',
      'isAction'
    ]),
    linkDisabledClass () {
      if (this.bundleStatus.state === 'unsupportedActivity') {
        return 'link--disabled'
      } else {
        if (this.isAction) {
          return 'link--disabled-control'
        } else {
          return ''
        }
      }
    }
  },
  methods: {
    ...mapActions('layout', [
      'setIsAction'
    ])
  },
  components: {
    ControlJoystick,
    ControlFocus,
    ControlDummyJoystick,
    ControlDummyFocus,
    ControlKeypose,
    ControlRange
  }
}
</script>
