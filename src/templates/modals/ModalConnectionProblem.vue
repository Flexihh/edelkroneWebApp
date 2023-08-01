<template lang="pug">
.connection-problem-modal-mask(:style="screenHeight" v-if="screenVisibility && connectionProblemModal && $route.name === 'link' && linkRouteName.includes('control-screen--')")
  .connection-problem-modal-mask__overlay(:style="screenHeight")
  .connection-problem-modal-wrapper
    .connection-problem-modal-container
      .connection-problem
        IconLoading
        .connection-problem__message
          div Connection problem...
          div(v-if="selectedDevice.linkConnectionType === 'wireless'")
            | Please make sure your devices are powered up and in wireless range.
          div(v-else)
            | Please make sure your devices are powered up and the link cables are plugged in.
        .connection-problem__buttons
          .wrap.xl-2.xl-gutter-8.xl-center
            .col
              template(v-if="$wait.is(['link disconnecting'])")
                .button.button--xl.button--disabled
                  | LOADING...
              template(v-else)
                .button.button--xl(@click="switchSetup") SWITCH SETUP
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import IconLoading from '../components/IconLoading.vue'

import filter from 'lodash/filter'

export default {
  computed: {
    ...mapGetters('app', [
      'deviceList'
    ]),
    ...mapGetters('layout', [
      'screenVisibility',
      'linkRouteName',
      'connectionProblemModal',
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
    },
    selectedDevice () {
      return filter(this.deviceList, { linkId: this.$route.params.id })[0]
    }
  },
  methods: {
    ...mapActions('app', [
      'setLinkDisconnect'
    ]),
    async switchSetup () {
      this.$wait.start('link disconnecting')
      await this.setLinkDisconnect({ linkId: this.$route.params.id })
    }
  },
  components: {
    IconLoading
  }
}
</script>
