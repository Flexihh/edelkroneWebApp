<template lang="pug">
div
  template(v-if="handle === 'dollyplus'")
    .wrap.xl-middle.xl-center
      .col.xl-1-5
        .calibration-media__title
          | TILT
      .col.xl-4-5.xl-lh0
        .calibration-media__image
          img(:src="require(`../../../../../../assets/calibration--${handle}--tilt.png`)")
  template(v-else)
    .calibration-media
      .calibration-media__title TILT
      .calibration-media__image
        img(:src="require(`../../../../../../assets/calibration--${handle}--tilt.png`)")
</template>

<script>
export default {
  props: [
    'handle'
  ]
}
</script>
