<template lang="pug">
.link(v-if="screenVisibility")
  .link__title-mini DEVICE LIST
  .link__content.link__content--canbus--full
    .box.box-button(v-for="product in canbusProductList")
      .wrap.xl-middle
        .col.xl-3-5
          .box-button__title(v-html="productName(product.type)")
        .col.xl-2-5
          .wrap.xl-gutter-16.xl-auto.xl-middle.xl-right
            .col(v-if="product.isDeviceFirmwareUpdateAvailable")
              .button.button--xs(@click="setFirmwareErrorModal('deviceUpdateAvailable')")
                | UPDATE
                br
                | AVAILABLE
            .col
              .box-button__icon.box-button__icon--cable
                img(src="../../../../assets/icon-cable.png")
  .link__desc
    IconLoading
    div
      span If your device is not listed here;
      ul
        li Your devices may need a firmware update.
        li Your cables may not be properly connected.
        li You may have more than one link adapter, please make sure you are connected to the right edelkrone Link Adapter.
  .button.button--xl(@click="connect", :class="{ 'button--disabled':  !canbusProductList.length }")
    span CONTINUE
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import IconLoading from '../../../components/IconLoading.vue'

import { productName } from '../../../../utils'

import filter from 'lodash/filter'

export default {
  async mounted () {
    await this.getCanbusProductList({ delay: false, linkId: this.$route.params.id })
  },
  computed: {
    ...mapGetters('app', [
      'canbusProductList',
      'canbusPairingStatus'
    ]),
    ...mapGetters('layout', [
      'screenVisibility'
    ])
  },
  methods: {
    ...mapActions('app', [
      'getCanbusProductList',
      'getCanbusPairingStatus',
      'setCanbusPairingConnect'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName',
      'setTopBottomModal',
      'setFirmwareErrorModal'
    ]),
    productName (value) {
      return productName(value)
    },
    async connect () {
      const jibOne = filter(this.canbusProductList, device => device.type === 'jibOne').length + filter(this.canbusProductList, device => device.type === 'jibOneV2').length
      const panPro = filter(this.canbusProductList, device => device.type === 'panPro').length

      if (this.canbusProductList.length === 2 && jibOne && panPro) {
        this.setTopBottomModal({
          devicePairing: 'canbus',
          macList: this.canbusProductList
        })
      } else {
        await this.setCanbusPairingConnect({
          linkId: this.$route.params.id,
          masterDevice: 'none'
        })
        await this.getCanbusPairingStatus({ delay: false, linkId: this.$route.params.id })
        this.setLinkRouteName('loading--canbus')
      }
    }
  },
  components: {
    IconLoading
  }
}
</script>
