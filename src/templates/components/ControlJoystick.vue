<template lang="pug">
div
  template(v-if="pan && tilt")
    .joystick(:class="{'joystick--disabled': lockY && lockX, 'joystick--head': title === 'head', 'joystick--jib': title === 'jib', 'joystick--pan': !lockY, 'joystick--tilt': !lockX}")
      .joystick__nipple(:ref="name" :class="`joystick__nipple--${name}`")
      .joystick__corner.joystick__corner--tilt(:class="{'joystick__corner--disabled': lockX}" @click="lockX = !lockX")
        span TILT
      .joystick__corner.joystick__corner--pan(:class="{'joystick__corner--disabled': lockY}" @click="lockY = !lockY")
        span PAN
  template(v-else)
    .joystick(:class="joystickClass")
      .joystick__nipple(:ref="name" :class="`joystick__nipple--${name}`")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { connection, consoleLogGroup } from '../../utils'

import nipplejs from 'nipplejs'

export default {
  props: [
    'name',
    'title',
    'pan',
    'tilt',
    'slide'
  ],
  data () {
    return {
      axes: {
        X: 0,
        Y: 0
      },
      lockX: false,
      lockY: false,
      // Joystick
      joystick: null,
      joystickCacheAxes: {
        X: 0,
        Y: 0
      },
      joystickIntervalTime: 100,
      joystickOnPressTimer: null,
      joystickTimer: null
    }
  },
  mounted () {
    if (this.pan && this.tilt) {
      this.lockX = false
      this.lockY = false
    } else {
      if (this.pan) {
        this.lockX = true
        this.lockY = false
      } else if (this.tilt) {
        this.lockX = false
        this.lockY = true
      } else if (this.slide) {
        this.lockX = true
        this.lockY = false
      } else {
        this.lockX = false
        this.lockY = false
      }
    }

    // Joystick
    this.joystickInit()
  },
  destroyed () {
    // Joystick
    this.joystick.destroy()
  },
  watch: {
    async axes () {
      await this.setJoystickMove()
    },
    lockX () {
      this.joystick.destroy()
      this.joystickInit()
    },
    lockY () {
      this.joystick.destroy()
      this.joystickInit()
    },
    screenScale () {
      this.joystick.destroy()
      this.joystickInit()
    }
  },
  computed: {
    ...mapGetters('settings', [
      'ipAddress'
    ]),
    ...mapGetters('app', [
      'devMode',
      'bundleStatus',
      'supportedAxes'
    ]),
    ...mapGetters('layout', [
      'isAction',
      'screenScale'
    ]),
    joystickData () {
      return {
        name: this.name,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'grey',
        shape: 'square',
        restOpacity: 1,
        lockX: this.lockX,
        lockY: this.lockY,
        dynamicPage: true,
        size: this.joystickSize
      }
    },
    joystickClass () {
      if (this.pan && this.tilt) {
        return ''
      } else {
        if (this.pan) {
          return 'joystick--pan'
        } else if (this.tilt) {
          return 'joystick--tilt'
        } else if (this.slide) {
          return 'joystick--slide'
        } else {
          return 'joystick--disabled'
        }
      }
    },
    joystickSize () {
      if (this.bundleStatus.keyposeSlotsFilled.length === 3 && !this.supportedAxes.focus) {
        return 100 * (1.862 * this.screenScale)
      } else {
        return 100 * this.screenScale
      }
    }
  },
  methods: {
    ...mapActions('app', [
      'setErrorMessage'
    ]),
    async setJoystickMove () {
      const start = +new Date()
      const joystickMove = {
        command: 'joystickMove'
      }
      if (this.name === 'headPanTilt') {
        joystickMove.headPan = this.axes.X
        joystickMove.headTilt = this.axes.Y
      }
      if (this.name === 'headPan') {
        joystickMove.headPan = this.axes.X
      }
      if (this.name === 'headTilt') {
        joystickMove.headTilt = this.axes.Y
      }
      if (this.name === 'slide') {
        joystickMove.slide = this.axes.X
      }
      if (this.name === 'jibPanTilt') {
        joystickMove.jibPlusPan = this.axes.X
        joystickMove.jibPlusTilt = this.axes.Y
      }

      const response = await connection({
        baseURL: `http://${this.ipAddress}/v1`,
        url: `/bundle/${this.$route.params.id}`,
        data: JSON.stringify(joystickMove)
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        this.setErrorMessage(errorMessage)
        if (this.devMode) {
          consoleLogGroup('ERROR_MESSAGE: joystickMove', errorMessage, true, +new Date() - start)
        }
      }
    },
    // Joystick
    joystickInit () {
      this.joystick = nipplejs.create({
        zone: this.$refs[this.joystickData.name],
        ...this.joystickData
      })
      this.joystick
        .on('start', () => {
          this.joystick.active = true
        })
        .on('move', this.joystickOnMove)
        .on('end', () => {
          this.joystick.active = false
          clearInterval(this.joystickOnPressTimer)
          this.joystickOnPressTimer = null
          this.axes = {
            X: 0,
            Y: 0
          }
          this.joystickCacheAxes = {
            X: 0,
            Y: 0
          }
          this.joystick.destroy()
          this.joystickInit()
        })

      const lineItem = Array.from(document.querySelectorAll('.back'))
      lineItem.forEach((arrayElement, index) => {
        lineItem[index].innerHTML = '<div class="joystick__arrow joystick__arrow--horizontal"></div><div class="joystick__arrow joystick__arrow--vertical"></div><div class="joystick__title joystick__title--head"></div><div class="joystick__title joystick__title--jib"></div>'
      })
    },
    joystickOnMove (e, data) {
      const frontElement = document.querySelectorAll(`.joystick__nipple--${this.name} .front`)[0]
      frontElement.style.left = `${parseInt((data.instance.frontPosition.x / data.instance.options.size) * 100)}px`
      frontElement.style.top = `${parseInt((data.instance.frontPosition.y / data.instance.options.size) * 100)}px`

      this.joystickKeepPress()
      this.joystickCacheAxes = {
        X: +data.vector.x.toFixed(2),
        Y: +data.vector.y.toFixed(2)
      }
      this.joystickTimerControl({ time: this.joystickIntervalTime, X: this.joystickCacheAxes.X, Y: this.joystickCacheAxes.Y })
    },
    joystickKeepPress () {
      if (this.joystickOnPressTimer) {
        clearInterval(this.joystickOnPressTimer)
      }
      this.joystickOnPressTimer = setInterval(() => {
        if (this.joystick.active) {
          this.joystickTimerControl({
            time: this.joystickIntervalTime / 2,
            X: this.joystickCacheAxes.X,
            Y: this.joystickCacheAxes.Y
          })
        }
      }, this.joystickIntervalTime / 2)
    },
    joystickTimerControl (data) {
      if (this.joystickTimer) {
        return
      }
      return this.joystickBeforeSend({ time: data.time, X: data.X, Y: data.Y })
    },
    joystickBeforeSend (data) {
      this.axes = {
        X: data.X,
        Y: data.Y
      }
      this.joystickTimer = setTimeout(() => {
        clearTimeout(this.joystickTimer)
        this.joystickTimer = null
      }, data.time)
    }
  }
}
</script>
