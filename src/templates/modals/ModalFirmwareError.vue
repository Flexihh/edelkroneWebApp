<template lang="pug">
.firmware-error-modal-mask(:style="screenHeight" v-if="screenVisibility && firmwareErrorModal !== null && $route.name === 'link' && linkRouteName.includes('device-pairing--')")
  .firmware-error-modal-mask__overlay(:style="screenHeight" @click="setFirmwareErrorModal(null)")
  .firmware-error-modal-wrapper
    .firmware-error-modal-container
      .firmware-error
        .firmware-error__title FIRMWARE UPDATE REQUIRED
        .firmware-error__desc Device firmware update required for one or more devices in the current bundle. Please connect with edelkrone App (iOS/Android) to your bundle to check which device(s) need the update, then follow the instructions from the edelkrone app (iOS/Android) to continue.
        .wrap.xl-2.xl-gutter-8.xl-center
          .col
            .button.button--xl(@click="setFirmwareErrorModal(null)") OK
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('layout', [
      'screenVisibility',
      'linkRouteName',
      'firmwareErrorModal',
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
    ...mapActions('layout', [
      'setFirmwareErrorModal'
    ])
  }
}
</script>
