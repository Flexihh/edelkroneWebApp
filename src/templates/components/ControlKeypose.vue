<template lang="pug">
.keypose
  .keypose__stop(v-if="isAction" @click="stop")
  .keypose__icon-info(v-for="keypose in keyposes" :class="keyposeClass('info', keypose.index)", @click="keyposeInfo(keypose.index)")
    template(v-if="keypose.active")
      img(src="../../assets/icon-info--active.png")
    template(v-else)
      img(src="../../assets/icon-info.png")
  label.keypose__icon-remove(v-for="(keypose, key) in keyposes" v-if="keypose.active" :class="keyposeClass('remove', keypose.index)" :for="`sure${key}`")
    input(v-show="false" :id="`sure${key}`" type="checkbox" v-model="sureIndexes" :value="keypose.index + 1")
    img(src="../../assets/icon-remove.png")
  .keypose__sure(v-for="keypose in keyposes" v-if="showSureInfo(keypose.index + 1) && keypose.active" :class="keyposeClass('sure', keypose.index)", @click="keyposeRemove(keypose.index)")
    | SURE?
  .keypose__draw(@mousedown="startDraw" @mousemove="doDraw" @touchstart="startDraw" @touchmove="doDraw")
    svg(:viewBox="`0 0 ${keyposeDrawWidth} ${keyposeDrawHeight}`" xmlns='http://www.w3.org/2000/svg')
      path(v-if="!isAction && keyposeA !== null && keyposeB !== null && keyposeA !== keyposeB" :d="`M${xPixelStart} ${yPixelStart} S${keyposeDrawWidth / 2} ${keyposeDrawHeight / 2} ${xPixel} ${yPixel}`" :stroke-width="strokeWidthStyle" :stroke-dasharray="strokeDasharrayStyle" stroke-linecap="round" fill='transparent' style='stroke: #eab933;')
  .keypose__items
    .keypose-item(v-for="keypose in keyposes" :class="{'keypose-item--active': keypose.active, 'keypose-item--loop': keypose.loop}")
      .keypose-item__title POSE {{ keypose.index + 1}}
      template(v-if="keyposeLoading(keypose.index)")
        template(v-if="bundleStatus.keyposeMotionStartIndex === -1 && bundleStatus.keyposeLoopActive")
          template(v-if="!showSecs")
            .keypose-item__loading(:style="`width: ${parseInt(bundleStatus.plannedMotionProgress * 100)}%;`" v-if="bundleStatus.plannedMotionProgress < 1")
          template(v-else)
            .keypose-item__loading(:style="`width: ${parseInt(bundleStatus.plannedMotionProgress * 100)}%;`" v-if="bundleStatus.plannedMotionProgress < 1")
            .keypose-item__time(v-if="keyposeLoading(keypose.index)")
              | {{ parseInt(secs) }} sec
        template(v-else)
          .keypose-item__loading(:style="`width: ${parseInt(bundleStatus.plannedMotionProgress * 100)}%;`" v-if="bundleStatus.plannedMotionProgress < 1")
          .keypose-item__time(v-if="keyposeLoading(keypose.index)")
            | {{ parseInt(secs) }} sec
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { connection, consoleLogGroup } from '../../utils'

import map from 'lodash/map'
import filter from 'lodash/filter'
import difference from 'lodash/difference'

export default {
  data () {
    return {
      showSecs: false,
      loadingDuration: null,
      sureIndexes: [],
      sureIndexCache: null,
      sureIndexTimer: null,
      keyposeCache: null,
      keyposeDrawWidth: 448,
      keyposeDrawHeight: 300,
      timer: 0,
      dragging: false,
      xStart: -1,
      yStart: -1,
      x: -1,
      y: -1,
      xPixelStart: 0,
      yPixelStart: 0,
      xPixel: 0,
      yPixel: 0,
      keyposeA: null,
      keyposeB: null,
      keyposes: [
        {
          index: 0,
          active: false,
          loop: false
        },
        {
          index: 1,
          active: false,
          loop: false
        },
        {
          index: 2,
          active: false,
          loop: false
        },
        {
          index: 3,
          active: false,
          loop: false
        },
        {
          index: 4,
          active: false,
          loop: false
        },
        {
          index: 5,
          active: false,
          loop: false
        }
      ]
    }
  },
  mounted () {
    window.addEventListener('mouseup', this.stopDraw)
    window.addEventListener('touchend', this.stopDraw)

    this.keyposeDrawCalculate()
    this.keyposeUpdate()
    this.loadingDuration = this.secs
  },
  destroyed () {
    window.removeEventListener('mouseup', this.stopDraw)
    window.removeEventListener('touchend', this.stopDraw)
  },
  watch: {
    sureIndexes: {
      handler: function (val, oldVal) {
        setTimeout(() => {
          this.sureIndexCache = difference(val, oldVal)[0]
        }, 3000)
      },
      deep: true
    },
    sureIndexCache () {
      this.sureIndexes = filter(this.sureIndexes, (sureIndex) => sureIndex !== this.sureIndexCache)
    },
    dragging () {
      if (this.dragging) {
        document.getElementsByTagName('html')[0].classList.add('noscroll')
      } else {
        document.getElementsByTagName('html')[0].classList.remove('noscroll')
      }
    },
    bundleStatus () {
      if (this.bundleStatus.state === 'keyposeMove' && this.bundleStatus.keyposeLoopActive && this.bundleStatus.keyposeMotionStartIndex === -1) {
        this.setLoopStarting(true)
      } else {
        this.setLoopStarting(false)
      }
      this.keyposeUpdate()
    },
    bundleStatusState () {
      this.loadingDuration = this.secs
      if (this.bundleStatus.state !== 'keyposeMove') {
        this.showSecs = false
      }
    },
    aimIndex () {
      this.loadingDuration = this.secs
    },
    windowWidth () {
      this.keyposeDrawCalculate()
    },
    windowHeight () {
      this.keyposeDrawCalculate()
    },
    screenScale () {
      this.keyposeDrawCalculate()
    }
  },
  computed: {
    ...mapGetters('settings', [
      'ipAddress'
    ]),
    ...mapGetters('app', [
      'devMode',
      'bundleStatus',
      'speed',
      'acceleration'
    ]),
    ...mapGetters('layout', [
      'linkRouteName',
      'isAction',
      'windowWidth',
      'windowHeight',
      'screenScale'
    ]),
    secs () {
      return this.bundleStatus.plannedMotionDuration - (this.bundleStatus.plannedMotionDuration * this.bundleStatus.plannedMotionProgress * 100 / 100)
    },
    bundleStatusState () {
      return this.bundleStatus.state
    },
    aimIndex () {
      return this.bundleStatus.keyposeMotionAimIndex
    },
    strokeWidthStyle () {
      if (this.screenScale === 1) {
        return 4
      } else {
        return 4 * this.screenScale
      }
    },
    strokeDasharrayStyle () {
      if (this.screenScale === 1) {
        return 8
      } else {
        return 8 * this.screenScale
      }
    }
  },
  methods: {
    ...mapActions('app', [
      'setMotionAbort',
      'setLoopStarting',
      'setErrorMessage'
    ]),
    ...mapActions('layout', [
      'setKeyposeNumericModal'
    ]),
    startDraw (event) {
      this.dragging = true

      let x = null
      let y = null
      if (event.clientX || event.clientY) {
        x = (event.clientX - document.getElementsByClassName('keypose__draw')[0].getBoundingClientRect().left) + 2
        y = (event.clientY - document.getElementsByClassName('keypose__draw')[0].getBoundingClientRect().top) + 2
      } else {
        x = (parseInt(event.touches[0].clientX) - document.getElementsByClassName('keypose__draw')[0].getBoundingClientRect().left) + 2
        y = (parseInt(event.touches[0].clientY) - document.getElementsByClassName('keypose__draw')[0].getBoundingClientRect().top) + 2
      }

      this.xPixel = x
      this.yPixel = y
      this.xPixelStart = x
      this.yPixelStart = y

      x = parseInt((x / this.keyposeDrawWidth) * 100)
      if (x < 0) {
        this.x = 0
        this.xStart = 0
      } else if (x < 100) {
        this.x = x
        this.xStart = x
      } else {
        this.x = 100
        this.xStart = 100
      }
      y = parseInt((y / this.keyposeDrawHeight) * 100)
      if (y < 0) {
        this.y = 0
        this.yStart = 0
      } else if (y < 100) {
        this.y = y
        this.yStart = y
      } else {
        this.y = 100
        this.yStart = 100
      }

      this.keyposeA = null
      this.keyposeB = null
      this.keyposeSelect(true, this.x, this.y)
    },
    doDraw (event) {
      if (this.dragging) {
        let x = null
        let y = null
        if (event.clientX || event.clientY) {
          x = (event.clientX - document.getElementsByClassName('keypose__draw')[0].getBoundingClientRect().left) + 2
          y = (event.clientY - document.getElementsByClassName('keypose__draw')[0].getBoundingClientRect().top) + 2
        } else {
          x = (parseInt(event.touches[0].clientX) - document.getElementsByClassName('keypose__draw')[0].getBoundingClientRect().left) + 2
          y = (parseInt(event.touches[0].clientY) - document.getElementsByClassName('keypose__draw')[0].getBoundingClientRect().top) + 2
        }

        if (this.xPixel < 0) {
          this.xPixel = 0
        } else if (this.xPixel < this.keyposeDrawWidth) {
          this.xPixel = x
        } else {
          this.xPixel = this.keyposeDrawWidth
        }
        if (this.yPixel < 0) {
          this.yPixel = 0
        } else if (this.yPixel < this.keyposeDrawHeight) {
          this.yPixel = y
        } else {
          this.yPixel = this.keyposeDrawHeight
        }

        x = parseInt((x / this.keyposeDrawWidth) * 100)
        if (x < 0) {
          this.x = 0
        } else if (x < 100) {
          this.x = x
        } else {
          this.x = 100
        }
        y = parseInt((y / this.keyposeDrawHeight) * 100)
        if (y < 0) {
          this.y = 0
        } else if (y < 100) {
          this.y = y
        } else {
          this.y = 100
        }

        this.keyposeSelect(false, this.x, this.y)
      }
    },
    async stopDraw () {
      const start = +new Date()
      if (this.keyposeCache !== null) {
        if (this.keyposeA !== null && this.keyposeB !== null && this.keyposeA !== this.keyposeB) {
          const response = await connection({
            baseURL: `http://${this.ipAddress}/v1`,
            url: `/bundle/${this.$route.params.id}`,
            data: JSON.stringify({
              command: 'keyposeLoopFixedSpeed',
              index1: this.keyposeA,
              index2: this.keyposeB,
              speed: this.speed,
              acceleration: this.acceleration
            })
          })
          if (response.data.result !== 'ok') {
            const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
            this.setErrorMessage(errorMessage)
            if (this.devMode) {
              consoleLogGroup('ERROR_MESSAGE: keyposeLoopFixedSpeed', errorMessage, true, +new Date() - start)
            }
          }
        } else {
          if (this.keyposeA !== null) {
            const response = await connection({
              baseURL: `http://${this.ipAddress}/v1`,
              url: `/bundle/${this.$route.params.id}`,
              data: JSON.stringify({
                command: 'keyposeMoveFixedSpeed',
                index: this.keyposeA,
                speed: this.speed,
                acceleration: this.acceleration
              })
            })
            if (response.data.result !== 'ok') {
              const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
              this.setErrorMessage(errorMessage)
              if (this.devMode) {
                consoleLogGroup('ERROR_MESSAGE: keyposeMoveFixedSpeed', errorMessage, true, +new Date() - start)
              }
            }
            this.showSecs = true
          }
        }
      }
      this.keyposeCache = null
      this.keyposeA = null
      this.keyposeB = null

      clearTimeout(this.timer)
      this.dragging = false
      this.x = -1
      this.y = -1
      this.xStart = -1
      this.yStart = -1
    },
    async stop () {
      this.keyposeCache = null
      this.keyposeA = null
      this.keyposeB = null

      await this.setMotionAbort({ linkId: this.$route.params.id })
    },
    keyposeUpdate () {
      this.keyposes = map(this.keyposes, (keypose) => {
        keypose.active = this.bundleStatus.keyposeSlotsFilled[keypose.index]

        if (this.bundleStatus.state !== 'keyposeMove') {
          keypose.loop = false
        } else {
          if (keypose.index === this.bundleStatus.keyposeMotionAimIndex || keypose.index === this.bundleStatus.keyposeMotionStartIndex) {
            keypose.loop = true
          } else {
            keypose.loop = false
          }
        }
        return keypose
      })
    },
    keyposeDrawCalculate () {
      if (this.screenScale === 1) {
        this.keyposeDrawWidth = 448
        this.keyposeDrawHeight = 300
      } else {
        const keyposeDrawWidthPercent = Math.ceil((448 / 100) * this.screenScale * 100)
        this.keyposeDrawWidth = Math.ceil((448 / keyposeDrawWidthPercent) * this.screenScale * keyposeDrawWidthPercent)

        const keyposeDrawHeightPercent = Math.ceil((300 / 100) * this.screenScale * 100)
        this.keyposeDrawHeight = Math.ceil((300 / keyposeDrawHeightPercent) * this.screenScale * keyposeDrawHeightPercent)
      }
    },
    keyposeSelect (isStart, x, y) {
      const start = +new Date()
      if (x < 33 && y < 50) {
        this.keyposeCache = 0
      } else if (x < 66 && y < 50) {
        this.keyposeCache = 1
      } else if (x < 100 && y < 50) {
        this.keyposeCache = 2
      } else if (x < 33 && y < 100) {
        this.keyposeCache = 3
      } else if (x < 66 && y < 100) {
        this.keyposeCache = 4
      } else if (x < 100 && y < 100) {
        this.keyposeCache = 5
      } else {
        this.keyposeCache = null
      }

      if (this.keyposeA === this.keyposeB) {
        this.keyposeB = null
      }

      if (this.keyposes[this.keyposeCache]) {
        if (this.keyposes[this.keyposeCache].active) {
          if (isStart) {
            this.keyposeA = this.keyposeCache
          } else {
            this.keyposeB = this.keyposeCache
          }
        } else {
          if (isStart) {
            this.timer = setTimeout(async () => {
              this.sureIndexes = filter(this.sureIndexes, (sureIndex) => sureIndex !== this.keyposeCache + 1)
              const response = await connection({
                baseURL: `http://${this.ipAddress}/v1`,
                url: `/bundle/${this.$route.params.id}`,
                data: JSON.stringify({
                  command: 'keyposeStoreCurrentPose',
                  index: this.keyposeCache
                })
              })
              if (response.data.result !== 'ok') {
                const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
                this.setErrorMessage(errorMessage)
                if (this.devMode) {
                  consoleLogGroup('ERROR_MESSAGE: keyposeStoreCurrentPose', errorMessage, true, +new Date() - start)
                }
              }
            }, 750)
            this.keyposeA = null
          } else {
            this.keyposeB = null
          }
        }
      }
    },
    async keyposeInfo (index) {
      this.sureIndexes = filter(this.sureIndexes, (sureIndex) => sureIndex !== index + 1)
      this.setKeyposeNumericModal({
        index: index,
        type: !this.keyposes[index].active ? 'SET' : 'EDIT'
      })
    },
    async keyposeRemove (index) {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${this.ipAddress}/v1`,
        url: `/bundle/${this.$route.params.id}`,
        data: JSON.stringify({
          command: 'keyposeDeletePose',
          index: index
        })
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        this.setErrorMessage(errorMessage)
        if (this.devMode) {
          consoleLogGroup('ERROR_MESSAGE: keyposeDeletePose', errorMessage, true, +new Date() - start)
        }
      }
    },
    keyposeLoading (keyposeName) {
      return this.bundleStatus.state === 'keyposeMove' && keyposeName === this.bundleStatus.keyposeMotionAimIndex
    },
    keyposeClass (name, index) {
      if (name === 'sure') {
        return `keypose__${name}--${index}`
      } else {
        return `keypose__icon-${name}--${index}`
      }
    },
    showSureInfo (index) {
      if (filter(this.sureIndexes, (sureIndex) => sureIndex + 1 === index + 1)[0]) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
