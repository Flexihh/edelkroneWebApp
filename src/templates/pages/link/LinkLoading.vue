<template lang="pug">
div
  template(v-if="linkRouteName === 'loading--wireless'")
    LoadingWireless
  template(v-if="linkRouteName === 'loading--canbus'")
    LoadingCanbus
</template>

<script>
import { mapGetters } from 'vuex'

import LoadingWireless from './loading/LoadingWireless.vue'
import LoadingCanbus from './loading/LoadingCanbus.vue'

export default {
  computed: {
    ...mapGetters('layout', [
      'linkRouteName'
    ])
  },
  components: {
    LoadingWireless,
    LoadingCanbus
  }
}
</script>
