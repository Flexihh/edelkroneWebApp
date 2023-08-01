<template lang="pug">
div
  template(v-if="handle === 'dollyplus'")
    .wrap.xl-middle.xl-center(:class="{'calibration-media--margin': supportedAxes.headPanTilt}")
      .col.xl-1-5
        .calibration-media__title
          | PAN
      .col.xl-4-5.xl-lh0
        .calibration-media__image
          img(:src="require(`../../../../../../assets/calibration--${handle}--pan.png`)")
  template(v-else)
    .calibration-media
      .calibration-media__title PAN
      .calibration-media__image
        img(:src="require(`../../../../../../assets/calibration--${handle}--pan.png`)")
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: [
    'handle'
  ],
  computed: {
    ...mapGetters('app', [
      'supportedAxes'
    ])
  }
}
</script>
