<template lang="pug">
.link(v-if="screenVisibility")
  .link__title-mini NON-PAIRED DEVICES
  .link__content.link__content--non-paired-devices(v-if="!isLoading && nonPairedDevicesTimestampFilter.length" :class="{'link__content--non-paired-devices--full': !pairedGroups.length}")
    .box.box-button(v-for="(device, key) in nonPairedDevicesTimestampFilter"
                    :class="{'box-button--action': device.isCanbus && device.setup === 'none'}"
                    @click="showCanbusSlateDevicesInfo(device.isCanbus && device.setup === 'none')")
      .wrap.xl-table.xl-middle
        .col.xl-width-134
          template(v-if="device.type === 'headOne'")
            template(v-if="device.isTilted")
              .box-button__title(v-html="`${productName(device.type)} <p>(Tilt)</p>`")
            template(v-else)
              .box-button__title(v-html="`${productName(device.type)} <p>(Pan)</p>`")
          template(v-else)
            .box-button__title(v-html="productName(device.type)")
        .col
          .wrap.xl-gutter-16.xl-auto.xl-middle.xl-right
            .col(v-if="device.setup === 'firmwareError'")
              .button.button--xs(@click="setFirmwareErrorModal('missing')")
                | FIRMWARE
                br
                | MISSING
            .col(v-else-if="device.isRadioFirmwareUpdateAvailable")
              .button.button--xs(@click="setFirmwareErrorModal('radioUpdateAvailable')")
                | UPDATE
                br
                | AVAILABLE
            .col(v-else-if="device.isDeviceFirmwareUpdateAvailable")
              .button.button--xs(@click="setFirmwareErrorModal('deviceUpdateAvailable')")
                | UPDATE
                br
                | AVAILABLE
            .col(v-if="device.isCanbus")
              .box-button__icon.box-button__icon--cable
                img(src="../../../../assets/icon-cable.png")
            template(v-if="device.isCanbus && device.setup === 'none'")
            template(v-else)
              .col
                .box-button__icon
                  template(v-if="device.rssiLevel === 1")
                    img(src="../../../../assets/icon-connection--one.png")
                  template(v-else-if="device.rssiLevel === 2")
                    img(src="../../../../assets/icon-connection--two.png")
                  template(v-else-if="device.rssiLevel === 3")
                    img(src="../../../../assets/icon-connection--three.png")
                  template(v-else)
                    img(src="../../../../assets/icon-connection--four.png")
            .col.xl-lh0
              label.box-button__radio(:for="`device${key}`" :class="{'box-button__radio--disabled': device.setup === 'firmwareError' || (device.isCanbus && device.setup === 'none')}")
                input(:id="`device${key}`" type="checkbox" v-model="macList" :value="{ mac: device.mac, type: device.type, isCanbus: device.isCanbus, setup: device.setup }")
                span.box-button__radio-icon
                  span.box-button__radio-icon-circle
                    span.box-button__radio-icon-circle-inner
  .link__desc.link__desc--center(:class="{'link__desc--pt0': isLoading || !nonPairedDevicesTimestampFilter.length}")
    IconLoading
    | If your device is not listed here, remove and reinsert the battery.
  .button.button--xl(@click="pairAndConnect", :class="{ 'button--disabled':  isLoading || !nonPairedDevicesTimestampFilter.length || !macList.length }")
    span PAIR & CONNECT
  template
    .space-16
    .link__title-mini PAIRED GROUPS
    template(v-if="!isLoading && pairedGroups.length")
      .link__content.link__content--paired-groups(:class="{'link__content--paired-groups--full': !nonPairedDevicesTimestampFilter.length}")
        .box.box-button(v-for="(group, key) in pairedGroups")
          input(v-show="false" :id="`group${key}`" type="checkbox" v-model="unpairGroupIds" :value="group.id")
          template(v-if="showUnpairInfo(group.id)")
            .wrap.xl-table.xl-middle
              .col
                .box-button__unpair-message
                  | Please detach the battery from one of the devices in the group.
              .col.xl-width-28
                .box-button__unpair-close
                  label.icon(:for="`group${key}`")
                    img(src="../../../../assets/icon-close--unpair.png")
          template(v-else)
            .wrap.xl-table.xl-middle
              .col.xl-width-134
                .box-button__title
                  template(v-for="product in group.products")
                    template(v-if="product.type === 'headOne'")
                      template(v-if="product.isTilted")
                        div(v-html="`${productName(product.type)} <p>(Tilt)</p>`")
                      template(v-else)
                        div(v-html="`${productName(product.type)} <p>(Pan)</p>`")
                    template(v-else)
                      div(v-html="productName(product.type)")
                    .box-button__desc(v-if="group.masterDevice.isCanbus")
                      | {{ setupName(group.masterDevice.setup) }}
              .col
                .wrap.xl-table.xl-middle
                  .col
                    .wrap.xl-gutter-16.xl-auto.xl-middle.xl-right
                      .col(v-if="group.masterDevice.isCanbus")
                        .box-button__icon.box-button__icon--cable
                          img(src="../../../../assets/icon-cable.png")
                      .col
                        .box-button__icon
                          template(v-if="group.masterDevice.rssiLevel === 1")
                            img(src="../../../../assets/icon-connection--one.png")
                          template(v-else-if="group.masterDevice.rssiLevel === 2")
                            img(src="../../../../assets/icon-connection--two.png")
                          template(v-else-if="group.masterDevice.rssiLevel === 3")
                            img(src="../../../../assets/icon-connection--three.png")
                          template(v-else)
                            img(src="../../../../assets/icon-connection--four.png")
                      .col
                        .box-button__icon--empty
                  .col.xl-width-192
                    .wrap.xl-2.xl-gutter-6
                      .col
                        .button.button--connect(@click="connect(group.masterDevice.mac)")
                          | CONNECT
                      .col
                        label.button.button--warning(:for="`group${key}`")
                          | UNPAIR
    template(v-else)
      .link__desc.link__desc--center.link__desc--pt0 No paired group is discovered.
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import IconLoading from '../../../components/IconLoading.vue'

import { setupName, productName } from '../../../../utils'

import filter from 'lodash/filter'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import isEqual from 'lodash/isEqual'
import difference from 'lodash/difference'
import differenceBy from 'lodash/differenceBy'
import intersection from 'lodash/intersection'
import intersectionWith from 'lodash/intersectionWith'
import isUndefined from 'lodash/isUndefined'

export default {
  data () {
    return {
      time: +new Date(),
      unpairGroupIds: [],
      macList: [],
      nonPairedDevicesTimestamp: [],
      isLoading: true
    }
  },
  async mounted () {
    this.isLoading = true
    if (!this.wirelessPairingScanStart) {
      await this.setWirelessPairingScanStart({ linkId: this.$route.params.id })
    }
    await this.getWirelessProductList({ delay: false, linkId: this.$route.params.id })
  },
  watch: {
    nonPairedDevicesTimestampFilter () {
      const macList = map(this.nonPairedDevicesTimestampFilter, device => {
        return {
          mac: device.mac,
          type: device.type,
          isCanbus: device.isCanbus,
          setup: device.setup
        }
      })
      const canbusMemberMacList = filter(macList, device => device.isCanbus && device.setup === 'none')
      const excludeCanbusMemberMacList = differenceBy(this.macList, canbusMemberMacList, 'mac')

      this.macList = intersectionWith(excludeCanbusMemberMacList, macList, isEqual)

      if (+new Date() - this.time > 250 && this.nonPairedDevices.length === this.nonPairedDevicesTimestampFilter.length) {
        this.isLoading = false
      }
    },
    nonPairedDeviceMacList: {
      handler: function (val, oldVal) {
        const macList = difference(val, oldVal)
        if (!isEqual(val, oldVal)) {
          this.nonPairedDevicesTimestamp = map(this.nonPairedDevices, device => {
            if (intersection(macList, [device.mac]).length) {
              device.timestamp = +new Date()
            } else {
              if (filter(this.nonPairedDevicesTimestamp, _device => _device.mac === device.mac).length) {
                device.timestamp = filter(this.nonPairedDevicesTimestamp, _device => _device.mac === device.mac)[0].timestamp
              } else {
                device.timestamp = 0
              }
            }
            return device
          })
        } else {
          this.nonPairedDevicesTimestamp = map(this.nonPairedDevices, device => {
            if (filter(this.nonPairedDevicesTimestamp, _device => _device.mac === device.mac).length) {
              device.timestamp = filter(this.nonPairedDevicesTimestamp, _device => _device.mac === device.mac)[0].timestamp
            } else {
              device.timestamp = 0
            }
            return device
          })
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters('app', [
      'devMode',
      'wirelessProductList',
      'wirelessPairingScanStart'
    ]),
    ...mapGetters('layout', [
      'screenVisibility'
    ]),
    nonPairedDeviceMacList () {
      return map(this.nonPairedDevices, device => {
        return device.mac
      })
    },
    nonPairedDevices () {
      const nonPairedDevices = filter(this.wirelessProductList, product => {
        return product.setup === 'none' ||
               product.setup === 'firmwareError' ||
               product.setup === 'possibleCanbusMaster'
      })

      const canbusSlateDevices = filter(nonPairedDevices, product => product.isCanbus && product.setup === 'none')
      const excludeCanbusSlateDevices = differenceBy(nonPairedDevices, canbusSlateDevices, 'mac')

      return [...excludeCanbusSlateDevices, ...canbusSlateDevices]
    },
    nonPairedDevicesTimestampFilter () {
      if (+new Date() - this.time > 3250) {
        return filter(this.nonPairedDevicesTimestamp, device => +new Date() - device.timestamp > 3000)
      } else {
        return filter(this.nonPairedDevicesTimestamp, device => +new Date() - device.timestamp > 250)
      }
    },
    pairedGroups () {
      const wirelessProductList = filter(this.wirelessProductList, product => {
        return product.setup !== 'none' &&
               product.setup !== 'ignore' &&
               product.setup !== 'bootingUp' &&
               product.setup !== 'firmwareError'
      })

      const groups = uniq(map(wirelessProductList, group => {
        return group.groupId
      }))

      const pairedGroups = map(groups, id => {
        const masterDevice = filter(wirelessProductList, product => product.setup !== 'groupMember' && product.setup !== 'possibleCanbusMaster' && id === product.groupId)[0]
        if (masterDevice) {
          return {
            id: id,
            masterDevice: masterDevice,
            products: filter(wirelessProductList, { groupId: id })
          }
        }
      })

      return filter(pairedGroups, group => !isUndefined(group))
    }
  },
  methods: {
    ...mapActions('app', [
      'getWirelessProductList',
      'getWirelessPairingStatus',
      'setWirelessPairingCreateBundle',
      'setWirelessPairingAttachToBundle',
      'setWirelessPairingScanStart'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName',
      'setTopBottomModal',
      'setFirmwareErrorModal',
      'setCanbusMemberDeviceModal'
    ]),
    showUnpairInfo (groupId) {
      if (filter(this.unpairGroupIds, (unpairGroupId) => unpairGroupId === groupId)[0]) {
        return true
      } else {
        return false
      }
    },
    showCanbusSlateDevicesInfo (value) {
      if (value) {
        this.setCanbusMemberDeviceModal(true)
      }
    },
    setupName (value) {
      return setupName(value)
    },
    productName (value) {
      return productName(value)
    },
    async pairAndConnect () {
      const jibOne = filter(this.macList, device => device.type === 'jibOne').length + filter(this.macList, device => device.type === 'jibOneV2').length
      const panPro = filter(this.macList, device => device.type === 'panPro').length

      if (this.macList.length === 2 && jibOne && panPro) {
        this.setTopBottomModal({
          devicePairing: 'wireless',
          macList: this.macList
        })
      } else {
        await this.setWirelessPairingCreateBundle({
          linkId: this.$route.params.id,
          macList: map(this.macList, device => device.mac),
          masterDevice: 'none'
        })
        await this.getWirelessPairingStatus({ delay: false, linkId: this.$route.params.id })
        this.setLinkRouteName('loading--wireless')
      }
    },
    async connect (mac) {
      await this.setWirelessPairingAttachToBundle({ linkId: this.$route.params.id, mac: mac })
      this.setLinkRouteName('loading--wireless')
    }
  },
  components: {
    IconLoading
  }
}
</script>
