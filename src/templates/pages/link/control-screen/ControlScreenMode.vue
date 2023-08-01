<template lang="pug">
div
  template(v-if="linkRouteName === 'control-screen--mode--incline-safe'")
    ModeIncline
  template(v-if="linkRouteName === 'control-screen--mode--incline-danger'")
    ModeIncline
  template(v-if="linkRouteName === 'control-screen--mode--park'")
    ModePark
</template>

<script>
import { mapGetters } from 'vuex'

import ModeIncline from './mode/ModeIncline.vue'
import ModePark from './mode/ModePark.vue'

export default {
  computed: {
    ...mapGetters('layout', [
      'linkRouteName'
    ])
  },
  components: {
    ModeIncline,
    ModePark
  }
}
</script>
