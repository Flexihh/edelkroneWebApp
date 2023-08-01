<template lang="pug">
.link
  .loading
    IconLoading
    .loading__message
      | Searching lens limits...
</template>

<script>
import IconLoading from '../../../../components/IconLoading.vue'

export default {
  components: {
    IconLoading
  }
}
</script>
