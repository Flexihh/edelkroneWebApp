<template lang="pug">
.settings-modal-mask(:style="screenHeight" v-if="screenVisibility")
  .settings-modal-mask__overlay(:style="screenHeight" @click="setSettingsModal(false)")
  .settings-modal-wrapper
    .settings-modal-container
      .settings
        .settings-header
          .wrap.xl-1.xl-center
            .col
              .settings-header__item.settings-header__item--active APP SETTINGS
        .settings-item
          .wrap.xl-2.xl-middle.xl-gutter-8
            .col
              .settings-item__title App Version
            .col
              .settings-item__value
                | {{ appVersion }}
        .settings-item
          .wrap.xl-2.xl-middle.xl-gutter-8
            .col
              .settings-item__title Unit
            .col
              .settings-item__value
                .wrap.xl-auto.xl-gutter-8.xl-center
                  .col
                    .box-button__radio-title
                      | CM
                  .col.xl-lh0
                    label.box-button__radio.box-button__radio--selected(for="unit")
                      input(id="unit" type="checkbox" v-model="isUnitInch")
                      span.box-button__radio-icon
                        span.box-button__radio-icon-circle
                          span.box-button__radio-icon-circle-inner
                  .col
                    .box-button__radio-title
                      | INCH
        .settings-item
          .wrap.xl-2.xl-middle.xl-gutter-8
            .col
              .settings-item__title Ip Address
            .col
              .settings-item__value
                input(class="input"
                      v-model="ip"
                      spellcheck="false"
                      @focus="setIsInputActive(true)"
                      @blur="setIsInputActive(false)"
                      placeholder="127.0.0.1")
        .settings-item
          .wrap.xl-2.xl-middle.xl-gutter-8
            .col
              .settings-item__title Port
            .col
              .settings-item__value
                input(class="input"
                      v-model="port"
                      spellcheck="false"
                      @focus="setIsInputActive(true)"
                      @blur="setIsInputActive(false)"
                      placeholder="32222")
        .settings-item
          .wrap.xl-2.xl-middle.xl-gutter-8
            .col
              .settings-item__title Vision Port
            .col
              .settings-item__value
                input(class="input"
                      v-model="localVisionPort"
                      spellcheck="false"
                      @focus="setIsInputActive(true)"
                      @blur="setIsInputActive(false)"
                      placeholder="32225")
        .settings-item
          .wrap.xl-2.xl-middle.xl-gutter-8
            .col
              .settings-item__title SDK Version
            .col
              .settings-item__value
                | {{ sdkVersion }}
        .settings-footer
          .wrap.xl-2.xl-gutter-8
            .col
              .button.button--xl(@click="setSettingsModal(false)") CANCEL
            .col
              .button.button--xl(@click="connect")
                span SAVE
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { connection, consoleLogGroup } from '../../utils'

export default {
  data () {
    return {
      isUnitInch: false,
      ip: `${window.location.hostname}`,
      port: '32222',
      localVisionPort: this.visionPort
    }
  },
  mounted () {
    if (this.ipAddress) {
      this.ip = this.ipAddress.split(':')[0]
      this.port = this.ipAddress.split(':')[1]
    }
    if (this.visionPort) {
      this.localVisionPort = this.visionPort
    }
    if (this.unit === 'inch') {
      this.isUnitInch = true
    }
  },
  watch: {
    isUnitInch () {
      if (!this.isUnitInch) {
        this.setUnit('cm')
      } else {
        this.setUnit('inch')
      }
    }
  },
  computed: {
    ...mapGetters('settings', [
      'ipAddress',
      'visionPort',
      'sdkVersion',
      'appVersion',
      'unit'
    ]),
    ...mapGetters('app', [
      'devMode'
    ]),
    ...mapGetters('layout', [
      'screenVisibility',
      'windowWidth',
      'screenScale'
    ]),
    screenHeight () {
      if (this.windowWidth > 700) {
        return 'height: calc(650px + 16px);'
      } else if (this.windowWidth < 480) {
        return `height: ${Math.ceil((document.documentElement.clientHeight / 100) / this.screenScale * 100)}px;`
      } else {
        return 'height: 100%;'
      }
    }
  },
  methods: {
    ...mapActions('settings', [
      'setIpAddress',
      'setVisionPort',
      'setUnit'
    ]),
    ...mapActions('app', [
      'setErrorMessage'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName',
      'setSettingsModal',
      'setIsInputActive'
    ]),
    async connect () {
      const start = +new Date()
      await this.setIpAddress(`${this.ip}:${this.port}`)
      await this.setVisionPort(this.localVisionPort)
      await connection({
        baseURL: `http://${this.ip}:${this.port}/v1`,
        url: '/device',
        data: JSON.stringify({
          command: 'linkStatus'
        }),
        timeout: 1000
      }).then(async response => {
        if (response.data.result === 'ok') {
          const path = '/'
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
      await this.setErrorMessage(null)
      await this.setSettingsModal(false)
    }
  }
}
</script>
