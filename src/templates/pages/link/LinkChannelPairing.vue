<template lang="pug">
.link(v-if="screenVisibility")
  .link__title Please Choose Your Communication Channel
  .link__content
    .button.button--left(@click="canbus") <span>LINK</span> - via 3.5mm link port
    .button.button--left(@click="wireless") <span>WIRELESS</span> - via 2.4GHz direct link
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('app', [
      'wirelessProductList',
      'wirelessPairingScanStart'
    ]),
    ...mapGetters('layout', [
      'screenVisibility'
    ])
  },
  methods: {
    ...mapActions('app', [
      'getWirelessProductList',
      'setWirelessPairingScanStart',
      'getCanbusProductList'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName'
    ]),
    async canbus () {
      await this.getCanbusProductList({ delay: false, linkId: this.$route.params.id })
      this.setLinkRouteName('device-pairing--canbus')
    },
    async wireless () {
      await this.setWirelessPairingScanStart({ linkId: this.$route.params.id })
      if (this.wirelessPairingScanStart) {
        await this.getWirelessProductList({ delay: false, linkId: this.$route.params.id })
        this.setLinkRouteName('device-pairing--wireless')
      }
    }
  }
}
</script>
