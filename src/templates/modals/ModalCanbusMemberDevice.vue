<template lang="pug">
.canbus-member-device-modal-mask(:style="screenHeight" v-if="screenVisibility && canbusMemberDeviceModal && $route.name === 'link' && linkRouteName === 'device-pairing--wireless'")
  .canbus-member-device-modal-mask__overlay(:style="screenHeight" @click="setCanbusMemberDeviceModal(false)")
  .canbus-member-device-modal-wrapper
    .canbus-member-device-modal-container
      .canbus-member-device
        .canbus-member-device__title MEMBER DEVICE
        .canbus-member-device__desc The device you tried to connect is a member device and is listed as disabled. It cannot be connected as a single device or cannot be bundled into your selected setup.
        .wrap.xl-2.xl-gutter-8.xl-center
          .col
            .button.button--xl(@click="setCanbusMemberDeviceModal(false)") OK
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('layout', [
      'screenVisibility',
      'linkRouteName',
      'canbusMemberDeviceModal',
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
      'setCanbusMemberDeviceModal'
    ])
  }
}
</script>
