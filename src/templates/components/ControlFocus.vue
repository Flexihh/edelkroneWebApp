<template lang="pug">
.focus(@mousedown="startWheel" @mousemove="doWheel" @touchstart="startWheel" @touchmove="doWheel")
  .focus-content
    .focus-content__title FOCUS
    .focus-content__shadow
    .focus-content__lines(:style="`${focusAnimation}`")
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
</template>

<script>
import { connection, consoleLogGroup } from '../../utils'

import { mapGetters, mapActions } from 'vuex'

import isUndefined from 'lodash/isUndefined'

export default {
  data () {
    return {
      wheeling: false,
      y: -1,
      yPercent: 1000,
      yPixel: 0,
      focusHeight: 174
    }
  },
  mounted () {
    window.addEventListener('mouseup', this.stopWheel)
    window.addEventListener('touchend', this.stopWheel)

    this.focusHeightCalculate()
  },
  destroyed () {
    window.removeEventListener('mouseup', this.stopWheel)
    window.removeEventListener('touchend', this.stopWheel)
  },
  watch: {
    wheeling () {
      if (this.wheeling) {
        document.getElementsByTagName('html')[0].classList.add('noscroll')
      } else {
        document.getElementsByTagName('html')[0].classList.remove('noscroll')
      }
    },
    windowWidth () {
      this.focusHeightCalculate()
    },
    windowHeight () {
      this.focusHeightCalculate()
    },
    screenScale () {
      this.focusHeightCalculate()
    },
    y: {
      handler: async function (val, oldVal) {
        const start = +new Date()
        let deltaEnc = null
        if (!isUndefined(val) && !isUndefined(oldVal) && val !== -1 && oldVal !== -1 && val !== oldVal) {
          if (val > oldVal) {
            deltaEnc = val - oldVal
          } else {
            deltaEnc = oldVal - val
          }
          if (val < oldVal) {
            deltaEnc = -Math.abs(deltaEnc)
          }
          const response = await connection({
            baseURL: `http://${this.ipAddress}/v1`,
            url: `/bundle/${this.$route.params.id}`,
            data: JSON.stringify({
              command: 'focusManualMove',
              deltaEnc: deltaEnc * 10
            })
          })
          if (response.data.result !== 'ok') {
            const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
            this.setErrorMessage(errorMessage)
            if (this.devMode) {
              consoleLogGroup('ERROR_MESSAGE: focusManualMove', errorMessage, true, +new Date() - start)
            }
          }
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters('app', [
      'devMode'
    ]),
    ...mapGetters('layout', [
      'windowWidth',
      'windowHeight',
      'screenScale'
    ]),
    ...mapGetters('settings', [
      'ipAddress'
    ]),
    focusAnimation () {
      let value = 0
      value = 174 + parseInt(174 - this.yPixel)

      if (this.y !== -1) {
        return `transition: all linear; transform: translateY(-${value}px);`
      } else {
        return 'transform: translateY(-9px);'
      }
    }
  },
  methods: {
    ...mapActions('app', [
      'setErrorMessage'
    ]),
    startWheel () {
      this.wheeling = true
    },
    doWheel (event) {
      if (this.wheeling) {
        let y = null
        if (event.clientY) {
          y = (event.clientY - document.getElementsByClassName('focus')[0].getBoundingClientRect().top) + 1
        } else {
          y = (parseInt(event.touches[0].clientY) - document.getElementsByClassName('focus')[0].getBoundingClientRect().top) + 1
        }

        if (this.yPixel < 0) {
          this.yPixel = 0
        } else if (this.yPixel < this.focusHeight) {
          this.yPixel = y
        } else {
          this.yPixel = this.focusHeight
        }

        y = parseInt((y / this.focusHeight) * this.yPercent)
        if (y < 0) {
          this.yCache = 0
        } else if (y < this.yPercent) {
          this.yCache = y
        } else {
          this.yCache = this.yPercent
        }

        this.focusManualMoveOnPressTimer = setInterval(this.focusManualMove, 100)
      }
    },
    stopWheel () {
      this.wheeling = false
      this.y = -1
      this.yCache = -1
      clearInterval(this.focusManualMoveOnPressTimer)
    },
    focusManualMove () {
      this.y = this.yCache
    },
    focusHeightCalculate () {
      if (this.screenScale === 1) {
        this.focusHeight = 174
      } else {
        this.focusHeight = Math.ceil((174 / 100) * this.screenScale * 100)
      }
    }
  }
}
</script>
