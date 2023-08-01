<template lang="pug">
.app-loading-modal-mask(:style="screenHeight" v-if="(appLoadingModal && $route.name === 'link-pairing') || appLoadingModal && $route.name === 'vision'")
  .app-loading-modal-mask__overlay(:style="screenHeight")
  .app-loading-modal-wrapper
    .app-loading-modal-container
      .app-loading
        IconLoading
      .app-loading-header
        .app-loading-header__icon
          IconEdelkrone
        .app-loading-header__title
          | Web App
        .app-loading-header__version
          | v{{ appVersion }}
</template>

<script>
import { mapGetters } from 'vuex'

import IconEdelkrone from '../components/IconEdelkrone.vue'
import IconLoading from '../components/IconLoading.vue'

export default {
  computed: {
    ...mapGetters('settings', [
      'appVersion'
    ]),
    ...mapGetters('layout', [
      'appLoadingModal',
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
  components: {
    IconEdelkrone,
    IconLoading
  }
}
</script>
