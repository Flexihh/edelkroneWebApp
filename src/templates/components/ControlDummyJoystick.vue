<template lang="pug">
div(:class="{'dummy': !isAction}")
  template(v-if="name === 'headPanTiltDummy'")
    .joystick.joystick--pan.joystick--tilt
      .joystick__nipple(:ref="name")
      .joystick__corner.joystick__corner--tilt
        span TILT
      .joystick__corner.joystick__corner--pan
        span PAN
  template(v-if="name === 'slideDummy'")
    .joystick.joystick--slide
      .joystick__nipple(:ref="name")
</template>

<script>
import { mapGetters } from 'vuex'

import nipplejs from 'nipplejs'

export default {
  props: [
    'name'
  ],
  mounted () {
    this.joystickInit()
  },
  destroyed () {
    this.joystick.destroy()
  },
  computed: {
    ...mapGetters('layout', [
      'isAction'
    ]),
    joystickData () {
      return {
        name: this.name,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'grey',
        shape: 'square',
        restOpacity: 1,
        dynamicPage: true,
        size: 100
      }
    }
  },
  methods: {
    joystickInit () {
      this.joystick = nipplejs.create({
        zone: this.$refs[this.joystickData.name],
        ...this.joystickData
      })
      const lineItem = Array.from(document.querySelectorAll('.back'))
      lineItem.forEach((arrayElement, index) => {
        lineItem[index].innerHTML = '<div class="joystick__arrow joystick__arrow--horizontal"></div><div class="joystick__arrow joystick__arrow--vertical"></div><div class="joystick__title joystick__title--head"></div><div class="joystick__title joystick__title--jib"></div>'
      })
    }
  }
}
</script>
