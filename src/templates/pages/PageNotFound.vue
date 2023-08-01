<template lang="pug">
.not-found(v-if="screenVisibility")
  .not-found__title 404
  .not-found__desc Page not found!
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('layout', [
      'screenVisibility'
    ])
  }
}
</script>
