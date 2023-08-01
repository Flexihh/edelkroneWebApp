<template lang="pug">
.focus(:class="{'dummy': !isAction}")
  .focus-content
    .focus-content__title FOCUS
    .focus-content__shadow
    .focus-content__lines(style="transform: translateY(-9px);")
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
      div
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('layout', [
      'isAction'
    ])
  }
}
</script>
