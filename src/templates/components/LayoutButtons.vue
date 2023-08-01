<template lang="pug">
.buttons
  .wrap.xl-1.xs-2.xl-gutter-6.xl-center
    template(v-if="(linkRouteName === 'control-screen--keypose' || linkRouteName.includes('control-screen--mode--')) && !linkRouteName.includes('control-screen--calibration--')")
      .col
        template(v-if="$wait.is(['link disconnecting'])")
          .button.button--disabled
            | LOADING...
        template(v-else)
          .button(@click="switchSetup()") SWITCH SETUP
      .col
        .button(@click="home()") HOME
    template(v-else)
      template(v-if="linkRouteName !== '' && $route.params.id")
        .col
          .button(@click="back()" :class="{'button--disabled': linkRouteName.includes('control-screen--calibration--loading--')}") BACK
        .col
          .button(@click="home()") HOME
      template(v-else)
        template(v-if="$route.name === 'link-pairing' || $route.name === 'vision' || $route.name === 'firmware-update' || $route.name === 'error' || $route.name === '404'")
          .col
            .button(@click="home()") BACK
          .col
            .button(@click="home()") HOME
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('app', [
      'deviceList',
      'errorMessage'
    ]),
    ...mapGetters('layout', [
      'linkRouteName'
    ])
  },
  methods: {
    ...mapActions('app', [
      'getDeviceList',
      'setLinkDisconnect'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName',
      'setSettingsModal'
    ]),
    async switchSetup () {
      this.$wait.start('link disconnecting')
      await this.setLinkDisconnect({ linkId: this.$route.params.id })
    },
    home () {
      const path = '/'
      if (this.$route.path !== path) this.$router.push(path)
      this.setLinkRouteName('')
    },
    async back () {
      let path = '/'
      if (this.linkRouteName === 'firmware-update' || this.linkRouteName === 'channel-pairing') {
        path = '/link'
      }
      if (this.linkRouteName.includes('firmware-update--') || this.linkRouteName.includes('device-pairing--') || this.linkRouteName.includes('loading--') || this.linkRouteName.includes('control-screen--calibration--')) {
        path = `/link/${this.$route.params.id}`
      }
      if (this.$route.path !== path) this.$router.push(path)

      if (this.linkRouteName === 'firmware-update' || this.linkRouteName === 'channel-pairing') {
        this.setLinkRouteName('')
      }
      if (this.linkRouteName.includes('firmware-update--')) {
        if (this.linkRouteName === 'firmware-update--device') {
          if (this.deviceList === null) {
            await this.getDeviceList({ delay: false })
          }
        }
        this.setLinkRouteName('firmware-update')
      }
      if (this.linkRouteName.includes('device-pairing--')) {
        this.setLinkRouteName('channel-pairing')
      }
      if (this.linkRouteName === 'loading--canbus') {
        this.setLinkRouteName('device-pairing--canbus')
      }
      if (this.linkRouteName === 'loading--wireless') {
        this.setLinkRouteName('device-pairing--wireless')
      }
      if (this.linkRouteName.includes('control-screen--calibration--')) {
        this.setLinkRouteName('control-screen--keypose')
      }
    }
  }
}
</script>
