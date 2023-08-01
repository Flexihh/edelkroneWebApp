<template lang="pug">
.home(style="text-align: center;")
  .home-header
    .home-header__icon
      IconEdelkrone
    .home-header__title
      | SDK
    .home-header__version
      | v{{ sdkVersion }}
  .home-buttons
    .button.button--xxl(@click="linkPairing()") edelkrone <span>Web App</span>
    .button.button--xxl(@click="streamingDevices()") <span>Vision</span> Module Stream
    a.button.button--xxl(href="/docs/index.html" target="_blank") <span>SDK</span> Documentation
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import IconEdelkrone from '../components/IconEdelkrone.vue'

import { connection, consoleLogGroup } from '../../utils'

export default {
  computed: {
    ...mapGetters('settings', [
      'ipAddress',
      'visionPort',
      'sdkVersion'
    ]),
    ...mapGetters('app', [
      'devMode',
      'deviceList',
      'visionList'
    ])
  },
  methods: {
    ...mapActions('app', [
      'setErrorMessage'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName'
    ]),
    async linkPairing () {
      const start = +new Date()
      if (this.deviceList !== null) {
        const path = '/link'
        if (this.$route.path !== path) this.$router.push(path)
        this.setLinkRouteName('')
      } else {
        await connection({
          baseURL: `http://${this.ipAddress}/v1`,
          url: '/device',
          data: JSON.stringify({
            command: 'linkStatus'
          }),
          timeout: 1000
        }).then(async response => {
          if (response.data.result === 'ok') {
            const path = '/link'
            if (this.$route.path !== path) this.$router.push(path)
            this.setLinkRouteName('')
          } else {
            const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
            this.setErrorMessage(errorMessage)
            if (this.devMode) {
              consoleLogGroup('ERROR_MESSAGE: deviceList', errorMessage, true, +new Date() - start)
            }
          }
        }).catch(error => {
          const errorMessage = JSON.parse(`${JSON.stringify(error)}`)
          this.setErrorMessage(errorMessage)
          if (this.devMode) {
            consoleLogGroup('ERROR_MESSAGE: deviceList', errorMessage, true, +new Date() - start)
          }
        })
      }
    },
    async streamingDevices () {
      const start = +new Date()
      if (this.visionList !== null) {
        const path = '/vision'
        if (this.$route.path !== path) this.$router.push(path)
        this.setLinkRouteName('')
      } else {
        await connection({
          baseURL: `http://${this.ipAddress.split(':')[0]}:${this.visionPort}/v1`,
          url: '/vision',
          data: JSON.stringify({
            command: 'visionStatus'
          }),
          timeout: 1000
        }).then(async response => {
          if (response.data.result === 'ok') {
            const path = '/vision'
            if (this.$route.path !== path) this.$router.push(path)
            this.setLinkRouteName('')
          } else {
            const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
            this.setErrorMessage(errorMessage)
            if (this.devMode) {
              consoleLogGroup('ERROR_MESSAGE: visionList', errorMessage, true, +new Date() - start)
            }
          }
        }).catch(error => {
          const errorMessage = JSON.parse(`${JSON.stringify(error)}`)
          this.setErrorMessage(errorMessage)
          if (this.devMode) {
            consoleLogGroup('ERROR_MESSAGE: visionList', errorMessage, true, +new Date() - start)
          }
        })
      }
    }
  },
  components: {
    IconEdelkrone
  }
}
</script>
