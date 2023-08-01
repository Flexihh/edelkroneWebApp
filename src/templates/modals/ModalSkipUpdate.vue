<template lang="pug">
.skip-update-modal-mask(:style="screenHeight" v-if="screenVisibility && skipUpdateModal !== null && $route.name === 'link-pairing'")
  .skip-update-modal-mask__overlay(:style="screenHeight")
  .skip-update-modal-wrapper
    .skip-update-modal-container
      .skip-update
        .skip-update__title
          template(v-if="skipUpdateModal.type === 'available'")
            | You can skip the update and continue to use your device without doing this update.
          template(v-else)
            | A new firmware update is required to continue.
        .skip-update__buttons
          .wrap.xl-2.xl-gutter-8.xl-center
            .col
              .wrap.xl-1
                .col
                  .button.button--xl(@click="firmwareUpdate()") SEE WHAT'S NEW
                  .button.button--xl(@click="setSkipUpdateModal(null)")
                    template(v-if="skipUpdateModal.type === 'available'")
                      | SKIP UPDATE
                    template(v-else)
                      | BACK
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('layout', [
      'screenVisibility',
      'skipUpdateModal',
      'windowWidth',
      'screenScale'
    ]),
    screenHeight () {
      if (this.windowWidth > 700) {
        return 'height: calc(650px + 16px);'
      } else if (this.windowWidth < 480) {
        return `height: ${Math.ceil((document.documentElement.clientHeight / 100) / this.screenScale * 100)}px;`
      } else {
        return 'height: 100%;'
      }
    }
  },
  methods: {
    ...mapActions('layout', [
      'setLinkRouteName',
      'setSkipUpdateModal'
    ]),
    firmwareUpdate () {
      const path = `/link/${this.skipUpdateModal.id}`
      if (this.$route.path !== path) this.$router.push(path)
      this.setLinkRouteName('firmware-update')
    }
  }
}
</script>
