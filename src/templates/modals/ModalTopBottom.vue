<template lang="pug">
.top-bottom-modal-mask(:style="screenHeight" v-if="screenVisibility && topBottomModal !== null && $route.name === 'link' && linkRouteName.includes('device-pairing--')")
  .top-bottom-modal-mask__overlay(:style="screenHeight" @click="setTopBottomModal(null)")
  .top-bottom-modal-wrapper
    .top-bottom-modal-container
      .top-bottom-modal__close(@click="setTopBottomModal(null)")
        img(src="../../assets/icon-close--modal.png")
      .top-bottom
        .top-bottom__title-desc You can use your PAN PRO as Panning Head or Panning Jib
        .top-bottom__title Please Choose;
        .top-bottom__buttons
          .wrap.xl-2.xl-gutter-16
            .col
              .button.button--image(@click="pairAndConnect('top')")
                .button__image
                  img(src="../../assets/calibration--pan-pro--top.png")
                | PAIR AS
                br
                | PANNING HEAD
            .col
              .button.button--image(@click="pairAndConnect('bottom')")
                .button__image
                  img(src="../../assets/calibration--pan-pro--bottom.png")
                | PAIR AS
                br
                | PANNING JIB
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import map from 'lodash/map'
import filter from 'lodash/filter'

export default {
  computed: {
    ...mapGetters('layout', [
      'screenVisibility',
      'linkRouteName',
      'topBottomModal',
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
    ...mapActions('app', [
      'getWirelessPairingStatus',
      'setWirelessPairingCreateBundle',
      'getCanbusPairingStatus',
      'setCanbusPairingConnect'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName',
      'setTopBottomModal'
    ]),
    async pairAndConnect (value) {
      let jibOneType = 'jibOne'
      if (filter(this.topBottomModal.macList, device => device.type === 'jibOneV2').length) {
        jibOneType = 'jibOneV2'
      }
      let masterDevice = 'none'
      if (value === 'top') {
        masterDevice = 'panPro'
      }
      if (value === 'bottom') {
        masterDevice = jibOneType
      }

      if (this.topBottomModal.devicePairing === 'wireless') {
        await this.setWirelessPairingCreateBundle({
          linkId: this.$route.params.id,
          macList: map(this.topBottomModal.macList, device => device.mac),
          masterDevice: masterDevice
        })
        await this.getWirelessPairingStatus({ delay: false, linkId: this.$route.params.id })
        this.setLinkRouteName('loading--wireless')
      }
      if (this.topBottomModal.devicePairing === 'canbus') {
        await this.setCanbusPairingConnect({
          linkId: this.$route.params.id,
          masterDevice: masterDevice
        })
        await this.getCanbusPairingStatus({ delay: false, linkId: this.$route.params.id })
        this.setLinkRouteName('loading--canbus')
      }
    }
  }
}
</script>
