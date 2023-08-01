<template lang="pug">
div
  template(v-if="linkRouteName === 'device-pairing--wireless'")
    DevicePairingWireless
  template(v-if="linkRouteName === 'device-pairing--canbus'")
    DevicePairingCanbus
</template>

<script>
import { mapGetters } from 'vuex'

import DevicePairingWireless from './device-pairing/DevicePairingWireless.vue'
import DevicePairingCanbus from './device-pairing/DevicePairingCanbus.vue'

export default {
  computed: {
    ...mapGetters('layout', [
      'linkRouteName'
    ])
  },
  components: {
    DevicePairingWireless,
    DevicePairingCanbus
  }
}
</script>
