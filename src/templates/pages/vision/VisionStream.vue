<template lang="pug">
.vision-stream
  .vision-stream-area(:class="visionStreamAreaClass" :style="visionStreamAreaStyle")
    .vision-stream-footer
      .vision-stream-area__quality(v-if="qualityButton" @click="setQuality(visionBitRate)")
        | {{ visionBitRate }}
      LayoutCopyLinkId(v-if="qualityButton" :linkId="$route.params.linkId")
    img(id="visionStreamArea" :src="visionStreamSrc")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { connection, consoleLogGroup } from '../../../utils'

import LayoutCopyLinkId from '../../components/LayoutCopyLinkId.vue'

import filter from 'lodash/filter'
import isUndefined from 'lodash/isUndefined'

export default {
  data () {
    return {
      visionStreamSrc: require('../../../assets/vision-stream-area.jpg'),
      visionStreamAreaHeight: null,
      visionStreamAreaWidth: null,
      visionStreamAreaClass: 'vision-stream-area--fit',
      visionStreamAreaStyle: '',
      visionBitRate: null,
      qualityButton: false,
      changeBitrateDelay: false,
      timer: 0
    }
  },
  async mounted () {
    if (this.visionList === null) {
      await this.getVisionList({ delay: false })
    }
    if (!isUndefined(this.vision)) {
      this.resize()
      this.visionStreamSrc = `http://${this.ipAddress.split(':')[0]}:${this.visionPort}/${this.$route.params.linkId}`
      this.changeBitrate()
      this.qualityButton = true
    } else {
      const path = '/vision'
      if (this.$route.path !== path) this.$router.push(path)
      this.setLinkRouteName('')
    }
  },
  watch: {
    windowWidth () {
      this.resize()
    },
    windowHeight () {
      this.resize()
    },
    visionList () {
      if (isUndefined(this.vision)) {
        const path = '/vision'
        if (this.$route.path !== path) this.$router.push(path)
        this.setLinkRouteName('')
      } else {
        if (this.changeBitrateDelay) {
          this.changeBitrate()
        }
      }
    }
  },
  computed: {
    ...mapGetters('settings', [
      'ipAddress',
      'visionPort'
    ]),
    ...mapGetters('app', [
      'devMode',
      'visionList'
    ]),
    ...mapGetters('layout', [
      'windowWidth',
      'windowHeight'
    ]),
    vision () {
      return filter(this.visionList, vision => vision.linkId === this.$route.params.linkId && vision.isValid)[0]
    }
  },
  methods: {
    ...mapActions('app', [
      'getVisionList',
      'setErrorMessage'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName'
    ]),
    resize () {
      this.visionStreamAreaWidth = document.getElementById('visionStreamArea').clientWidth
      this.visionStreamAreaHeight = document.getElementById('visionStreamArea').clientHeight + 46
      if (this.windowWidth < this.visionStreamAreaWidth) {
        this.visionStreamAreaClass = ''
        this.visionStreamAreaStyle = ''
      } else {
        if (this.windowHeight <= this.visionStreamAreaHeight) {
          this.visionStreamAreaClass = 'vision-stream-area--fit'
          this.visionStreamAreaStyle = `width: ${this.visionStreamAreaWidth}px; display: inline-block;`
        } else {
          this.visionStreamAreaClass = ''
          this.visionStreamAreaStyle = ''
        }
      }
    },
    async setQuality (bitRate) {
      const start = +new Date()
      let value = ''
      if (bitRate === 'low') {
        value = 'medium'
      }
      if (bitRate === 'medium') {
        value = 'high'
      }
      if (bitRate === 'high') {
        value = 'low'
      }
      this.visionBitRate = value
      const response = await connection({
        baseURL: `http://${this.ipAddress}/v1`,
        url: `/vision/${this.$route.params.linkId}`,
        data: JSON.stringify({
          command: 'quality',
          value: value
        })
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        this.setErrorMessage(errorMessage)
        if (this.devMode) {
          consoleLogGroup('ERROR_MESSAGE: quality', errorMessage, true, +new Date() - start)
        }
      }
      this.changeBitrateDelay = false
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.changeBitrateDelay = true
      }, 5000)
    },
    changeBitrate () {
      if (this.vision.bitRate <= Math.pow(10.0, 5.0)) {
        this.visionBitRate = 'low'
      } else if (this.vision.bitRate <= 2 * Math.pow(10.0, 6.0)) {
        this.visionBitRate = 'medium'
      } else if (this.vision.bitRate <= Math.pow(10.0, 7.0)) {
        this.visionBitRate = 'high'
      } else {
        this.visionBitRate = 'high'
      }
    }
  },
  components: {
    LayoutCopyLinkId
  }
}
</script>
