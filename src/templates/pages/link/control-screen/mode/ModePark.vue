<template lang="pug">
.mode.mode--park
  .mode-content
    template(v-if="bundleStatus.parkMode === 'positioning'")
      .mode-content__loading
        IconLoading
      .mode-content__title
        span PARKING
      .mode-content__desc-mini
        div When your battery is critically low, the Slide Module will place itself in a safe parking position to prevent accidents that may occur due to unexpected shutdowns.
        div To exit the parking mode, you must replace the batteries or use your products fully horizontal.
    template(v-if="bundleStatus.parkMode === 'parked'")
      .mode-content__title.mode-content__title--warning
        span YOUR SLIDE MODULE PARKED!
      .mode-content__desc-mini
        div When your battery is critically low, the Slide Module will place itself in a safe parking position to prevent accidents that may occur due to unexpected shutdowns.
        div To exit the parking mode, you must replace the batteries or use your products fully horizontal.
</template>

<script>
import { mapGetters } from 'vuex'

import IconLoading from '../../../../components/IconLoading.vue'

export default {
  computed: {
    ...mapGetters('app', [
      'bundleStatus'
    ])
  },
  components: {
    IconLoading
  }
}
</script>
