<template lang="pug">
.link(v-if="screenVisibility")
  .link__title-mini STREAMING DEVICES
  .link__content.link__content--vision
    .box.box-button(v-for="vision in visionList" v-if="vision.isValid")
      .wrap.xl-middle.xl-left
        .col.xl-7-13
          .box-button__title Vision Module
          .box-button__desc
            div
              LayoutCopyLinkId(:linkId="vision.linkId")
        .col.xl-6-13
          .wrap.xl-2.xl-gutter-6.xl-right
            .col
              a.button.button--watch(:href="`/vision/${vision.linkId}`" target="_blank") WATCH
  .link__desc
    IconLoading
    div
      | Please make sure your Vision Module and mobile device on the same Wi-Fi network.
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import IconLoading from '../components/IconLoading.vue'
import LayoutCopyLinkId from '../components/LayoutCopyLinkId.vue'

export default {
  async mounted () {
    if (this.appLoadingModal) {
      setTimeout(async () => {
        if (this.visionList === null) {
          await this.getVisionList({ delay: false })
        }
        this.setAppLoadingModal(false)
      }, 500)
    } else {
      if (this.visionList === null) {
        await this.getVisionList({ delay: false })
      }
    }
  },
  computed: {
    ...mapGetters('app', [
      'visionList'
    ]),
    ...mapGetters('layout', [
      'screenVisibility',
      'appLoadingModal'
    ])
  },
  methods: {
    ...mapActions('app', [
      'getVisionList'
    ]),
    ...mapActions('layout', [
      'setAppLoadingModal'
    ])
  },
  components: {
    IconLoading,
    LayoutCopyLinkId
  }
}
</script>
