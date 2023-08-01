<template lang="pug">
.link
  .loading
    IconLoading
    .loading__message
      | Slider is calibrating...
</template>

<script>
import IconLoading from '../../../../components/IconLoading.vue'

export default {
  components: {
    IconLoading
  }
}
</script>
