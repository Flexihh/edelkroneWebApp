<template lang="pug">
.keypose-numeric-modal-mask(:style="screenHeight" v-if="screenVisibility && !connectionProblemModal && $route.name === 'link' && linkRouteName === 'control-screen--keypose' && numericValues !== null && numericLimitValues !== null")
  .keypose-numeric-modal-mask__overlay(:style="screenHeight" @click="setKeyposeNumericModal(null)")
  .keypose-numeric-modal-wrapper
    .keypose-numeric-modal-container
      .keypose-numeric-modal__close(@click="setKeyposeNumericModal(null)")
        img(src="../../assets/icon-remove.png")
      .keypose-numeric
        .keypose-numeric__title {{ keyposeNumericModal.type }} POSITION
        .space-16
        .wrap.xl-center.xl-gutter-8(:class="calibratedAxesCol")
          template(v-if="supportedAxes.headPan || supportedAxes.headPanTilt")
            .col
              .keypose-numeric__title PAN
              template(v-if="calibratedAxes.headPan || calibratedAxes.headPanTilt")
                label.form-field.form-field--keypose-numeric(for="formFieldHeadPan")
                  .form-field__value
                    input(:style="`width: ${(valueHeadPan.length + 1) * 8}px`"
                          v-if="numericLimitValues !== null"
                          id="formFieldHeadPan"
                          v-model="valueHeadPan"
                          @click="select"
                          @keypress="isNumber"
                          @change="changeHeadPanValue"
                          @focus="setIsInputActive(true)"
                          @blur="setIsInputActive(false)")
                  .form-field__unit
                    | °
              template(v-else)
                .button.button--keypose-numeric(@click="calibrate('head')") CALIBRATE
          template(v-if="supportedAxes.headTilt || supportedAxes.headPanTilt")
            .col
              .keypose-numeric__title TILT
              template(v-if="calibratedAxes.headTilt || calibratedAxes.headPanTilt")
                label.form-field.form-field--keypose-numeric(for="formFieldHeadTilt")
                  .form-field__value
                    input(:style="`width: ${(valueHeadTilt.length + 1) * 8}px`"
                          v-if="numericLimitValues !== null"
                          id="formFieldHeadTilt"
                          v-model="valueHeadTilt"
                          @click="select"
                          @keypress="isNumber"
                          @change="changeHeadTiltValue"
                          @focus="setIsInputActive(true)"
                          @blur="setIsInputActive(false)")
                  .form-field__unit
                    | °
              template(v-else)
                .button.button--keypose-numeric(@click="calibrate('head')") CALIBRATE
          template(v-if="supportedAxes.focus")
            .col
              .keypose-numeric__title FOCUS
              template(v-if="calibratedAxes.focus")
                label.form-field.form-field--keypose-numeric(for="formFieldFocus")
                  .form-field__value
                    input(:style="`width: ${(valueFocus.length + 1) * 8}px`"
                          v-if="numericLimitValues !== null"
                          id="formFieldFocus"
                          v-model="valueFocus"
                          @click="select"
                          @keypress="isNumber"
                          @change="changeFocusValue"
                          @focus="setIsInputActive(true)"
                          @blur="setIsInputActive(false)")
                  .form-field__unit
                    | enc
              template(v-else)
                .button.button--keypose-numeric(@click="calibrate('focusplus-pro')") CALIBRATE
          template(v-if="supportedAxes.slide")
            .col
              .keypose-numeric__title SLIDE
              template(v-if="calibratedAxes.slide")
                label.form-field.form-field--keypose-numeric(for="formFieldSlide")
                  .form-field__value
                    input(:style="`width: ${(valueSlide.length + 1) * 8}px`"
                          v-if="numericLimitValues !== null"
                          id="formFieldSlide"
                          v-model="valueSlide"
                          @click="select"
                          @keypress="isNumber"
                          @change="changeSlideValue"
                          @focus="setIsInputActive(true)"
                          @blur="setIsInputActive(false)")
                  .form-field__unit
                    | {{ unit }}
              template(v-else)
                .button.button--keypose-numeric(@click="calibrate('slide')") CALIBRATE
          template(v-if="supportedAxes.jibPanTilt")
            .col
              .keypose-numeric__title JIB PAN
              template(v-if="calibratedAxes.jibPanTilt")
                label.form-field.form-field--keypose-numeric(for="formFieldJibPan")
                  .form-field__value
                    input(:style="`width: ${(valueJibPan.length + 1) * 8}px`"
                          v-if="numericLimitValues !== null"
                          id="formFieldJibPan"
                          v-model="valueJibPan"
                          @click="select"
                          @keypress="isNumber"
                          @change="changeJibPanValue"
                          @focus="setIsInputActive(true)"
                          @blur="setIsInputActive(false)")
                  .form-field__unit
                    | °
              template(v-else)
                .button.button--keypose-numeric(@click="calibrate('jibone-head')") CALIBRATE
            .col
              .keypose-numeric__title JIB TILT
              template(v-if="calibratedAxes.jibPanTilt")
                label.form-field.form-field--keypose-numeric(for="formFieldJibTilt")
                  .form-field__value
                    input(:style="`width: ${(valueJibTilt.length + 1) * 8}px`"
                          v-if="numericLimitValues !== null"
                          id="formFieldJibTilt"
                          v-model="valueJibTilt"
                          @click="select"
                          @keypress="isNumber"
                          @change="changeJibTiltValue"
                          @focus="setIsInputActive(true)"
                          @blur="setIsInputActive(false)")
                  .form-field__unit
                    | °
              template(v-else)
                .button.button--keypose-numeric(@click="calibrate('jibone-head')") CALIBRATE
        template(v-if="calibratedAxes.slide")
          .space-16
          .wrap.xl-auto.xl-gutter-8.xl-center
            .col
              .box-button__radio-title
                | CM
            .col.xl-lh0
              label.box-button__radio.box-button__radio--selected(for="unit")
                input(id="unit" type="checkbox" v-model="isUnitInch")
                span.box-button__radio-icon
                  span.box-button__radio-icon-circle
                    span.box-button__radio-icon-circle-inner
            .col
              .box-button__radio-title
                | INCH
        .space-16
        .wrap.xl-2.xl-gutter-8
          .col
            .button.button--xl(@click="setKeyposeNumericModal(null)") CANCEL
          .col
            .button.button--xl(@click="save" :class="{'button--disabled': bundleStatus.calibratedAxes.length !== bundleStatus.supportedAxes.length}")
              span SAVE
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { connection, consoleLogGroup } from '../../utils'

import isNaN from 'lodash/isNaN'
import includes from 'lodash/includes'
import filter from 'lodash/filter'

export default {
  data () {
    return {
      isUnitInch: false,
      valueHeadPan: this.numericValueFormat(0, 0),
      valueHeadTilt: this.numericValueFormat(0, 0),
      valueFocus: this.numericValueFormat(0, 0),
      valueSlide: this.numericValueFormat(0, 0),
      valueJibPan: this.numericValueFormat(0, 0),
      valueJibTilt: this.numericValueFormat(0, 0),
      numericValues: null,
      numericLimitValues: null
    }
  },
  mounted () {
    this.updateNumericValues()
    if (this.unit === 'inch') {
      this.isUnitInch = true
    }
  },
  watch: {
    isUnitInch () {
      if (!this.isUnitInch) {
        this.setUnit('cm')
      } else {
        this.setUnit('inch')
      }
      this.updateNumericValues(true)
    }
  },
  computed: {
    ...mapGetters('settings', [
      'ipAddress',
      'unit'
    ]),
    ...mapGetters('app', [
      'devMode',
      'bundleStatus',
      'supportedAxes',
      'calibratedAxes'
    ]),
    ...mapGetters('layout', [
      'screenVisibility',
      'linkRouteName',
      'keyposeNumericModal',
      'connectionProblemModal',
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
    },
    calibratedAxesCol () {
      if (this.bundleStatus.supportedAxes.length === 5) {
        return 'xl-5'
      } else if (this.bundleStatus.supportedAxes.length === 4) {
        return 'xl-4'
      } else {
        return 'xl-3'
      }
    }
  },
  methods: {
    ...mapActions('settings', [
      'setUnit'
    ]),
    ...mapActions('app', [
      'setErrorMessage'
    ]),
    ...mapActions('layout', [
      'setLinkRouteName',
      'setKeyposeNumericModal',
      'setIsInputActive'
    ]),
    select (event) {
      event.target.select()
    },
    isNumber (event) {
      const key = event.key
      const keys = ['.', ',', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Enter', 'Backspace', 'ArrowLeft', 'ArrowRight']
      if (!includes(keys, key)) {
        event.preventDefault()
      }

      let keyArray = []
      if (key === '.' || key === ',' || key === '-') {
        keyArray.push(event.key)
      }
      keyArray = [...keyArray, ...event.target.value.split('')]
      if (filter(keyArray, key => key === '.' || key === ',').length > 1) {
        event.preventDefault()
      }
      if (key === '-' && (keyArray[0] !== '-' || event.target.selectionStart !== 0)) {
        event.preventDefault()
      }
    },
    async calibrate (value) {
      const start = +new Date()
      if (value === 'focusplus-pro') {
        const response = await connection({
          baseURL: `http://${this.ipAddress}/v1`,
          url: `/bundle/${this.$route.params.id}`,
          data: JSON.stringify({
            command: 'calibrate',
            device: this.supportedAxes.focusDevice
          })
        })
        if (response.data.result !== 'ok') {
          const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
          this.setErrorMessage(errorMessage)
          if (this.devMode) {
            consoleLogGroup('ERROR_MESSAGE: calibrate', errorMessage, true, +new Date() - start)
          }
        }
      } else if (value === 'slide') {
        if (this.supportedAxes.slideDevice === 'jibOne' || this.supportedAxes.jibPanTiltDevice === 'jibOne' || this.supportedAxes.slideDevice === 'jibOneV2' || this.supportedAxes.jibPanTiltDevice === 'jibOneV2') {
          this.setLinkRouteName('control-screen--calibration--jibone')
        } else {
          this.setLinkRouteName('control-screen--calibration--slide-module')
        }
      } else if (value === 'head') {
        this.setLinkRouteName('control-screen--calibration--head')
      } else if (value === 'jibone-head') {
        this.setLinkRouteName('control-screen--calibration--jibone')
      }
    },
    async save () {
      const start = +new Date()
      const keyposeStoreWithNumericData = {
        command: 'keyposeStoreWithNumericData',
        index: this.keyposeNumericModal.index
      }
      if (this.supportedAxes.headPanTilt) {
        keyposeStoreWithNumericData.headPan = parseFloat(this.valueHeadPan)
        keyposeStoreWithNumericData.headTilt = parseFloat(this.valueHeadTilt)
      }
      if (this.supportedAxes.headPan) {
        keyposeStoreWithNumericData.headPan = parseFloat(this.valueHeadPan)
      }
      if (this.supportedAxes.headTilt) {
        keyposeStoreWithNumericData.headTilt = parseFloat(this.valueHeadTilt)
      }
      if (this.supportedAxes.focus) {
        keyposeStoreWithNumericData.focus = parseFloat(this.valueFocus)
      }
      if (this.supportedAxes.slide) {
        keyposeStoreWithNumericData.slide = this.unit === 'inch' ? parseFloat(this.valueSlide) * 2.54 : parseFloat(this.valueSlide)
      }
      if (this.supportedAxes.jibPanTilt) {
        keyposeStoreWithNumericData.jibPlusPan = parseFloat(this.unit === 'inch' ? this.valueJibPan * 2.54 : this.valueJibPan)
        keyposeStoreWithNumericData.jibPlusTilt = parseFloat(this.unit === 'inch' ? this.valueJibTilt * 2.54 : this.valueJibTilt)
      }

      const response = await connection({
        baseURL: `http://${this.ipAddress}/v1`,
        url: `/bundle/${this.$route.params.id}`,
        data: JSON.stringify(keyposeStoreWithNumericData)
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        this.setErrorMessage(errorMessage)
        if (this.devMode) {
          consoleLogGroup('ERROR_MESSAGE: keyposeStoreWithNumericData', errorMessage, true, +new Date() - start)
        }
      }
      this.setKeyposeNumericModal(null)
    },
    async updateNumericValues (onlyChangeUnit) {
      this.updateNumericLimitValues()
      const start = +new Date()
      if (!onlyChangeUnit) {
        const response = await connection({
          baseURL: `http://${this.ipAddress}/v1`,
          url: `/bundle/${this.$route.params.id}`,
          data: JSON.stringify({
            command: 'keyposeReadNumericValues',
            index: this.keyposeNumericModal.index
          })
        })
        if (response.data.result !== 'ok') {
          const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
          this.setErrorMessage(errorMessage)
          if (this.devMode) {
            consoleLogGroup('ERROR_MESSAGE: keyposeReadNumericValues', errorMessage, true, +new Date() - start)
          }
        }
        this.numericValues = response.data.data

        if (this.keyposeNumericModal.type === 'EDIT') {
          this.valueHeadPan = this.numericValueFormat(this.numericValues.headPan)
          this.valueHeadTilt = this.numericValueFormat(this.numericValues.headTilt)
          this.valueFocus = this.numericValueFormat(this.numericValues.focus)
          this.valueSlide = this.numericValueFormat(this.unit === 'inch' ? this.numericValues.slide * 0.39370079 : this.numericValues.slide)
          this.valueJibPan = this.numericValueFormat(this.numericValues.jibPlusPan)
          this.valueJibTilt = this.numericValueFormat(this.numericValues.jibPlusTilt)
        } else {
          this.valueHeadPan = this.numericValueFormat(this.bundleStatus.readings.headPan)
          this.valueHeadTilt = this.numericValueFormat(this.bundleStatus.readings.headTilt)
          this.valueFocus = this.numericValueFormat(this.bundleStatus.readings.focus)
          this.valueSlide = this.numericValueFormat(this.unit === 'inch' ? this.bundleStatus.readings.slide * 0.39370079 : this.bundleStatus.readings.slide)
          this.valueJibPan = this.numericValueFormat(this.bundleStatus.readings.jibPan)
          this.valueJibTilt = this.numericValueFormat(this.bundleStatus.readings.jibTilt)
        }
      } else {
        this.valueHeadPan = this.numericValueFormat(this.valueHeadPan)
        this.valueHeadTilt = this.numericValueFormat(this.valueHeadTilt)
        this.valueFocus = this.numericValueFormat(this.valueFocus)
        this.valueSlide = this.numericValueFormat(this.unit === 'inch' ? this.valueSlide * 0.39370079 : this.valueSlide * 2.54)
        this.valueJibPan = this.numericValueFormat(this.valueJibPan)
        this.valueJibTilt = this.numericValueFormat(this.valueJibTilt)
      }
    },
    async updateNumericLimitValues () {
      const start = +new Date()
      const response = await connection({
        baseURL: `http://${this.ipAddress}/v1`,
        url: `/bundle/${this.$route.params.id}`,
        data: JSON.stringify({
          command: 'numericLimitValues'
        })
      })
      if (response.data.result !== 'ok') {
        const errorMessage = JSON.parse(`${JSON.stringify(response)}`)
        this.setErrorMessage(errorMessage)
        if (this.devMode) {
          consoleLogGroup('ERROR_MESSAGE: numericLimitValues', errorMessage, true, +new Date() - start)
        }
      }
      this.numericLimitValues = {
        panStep: 0.1,
        panMinLimit: response.data.data.panMinLimit,
        panMaxLimit: response.data.data.panMaxLimit,
        tiltStep: 0.1,
        tiltMinLimit: response.data.data.tiltMinLimit,
        tiltMaxLimit: response.data.data.tiltMaxLimit,
        slideStep: 0.1,
        slideMinLimit: this.unit === 'inch' ? response.data.data.slideMinLimit * 0.39370079 : response.data.data.slideMinLimit,
        slideMaxLimit: this.unit === 'inch' ? response.data.data.slideMaxLimit * 0.39370079 : response.data.data.slideMaxLimit,
        focusStep: 0.1,
        focusMinLimit: response.data.data.focusMinLimit,
        focusMaxLimit: response.data.data.focusMaxLimit,
        jibPanStep: 0.1,
        jibPanMinLimit: response.data.data.jibPanMinLimit,
        jibPanMaxLimit: response.data.data.jibPanMaxLimit,
        jibTiltStep: 0.1,
        jibTiltMinLimit: response.data.data.jibTiltMinLimit,
        jibTiltMaxLimit: response.data.data.jibTiltMaxLimit
      }
    },
    numericValueFormat (value, step) {
      let roundValue = Math.round(value / step) * step
      if (isNaN(roundValue)) {
        roundValue = value
      }
      return parseFloat(roundValue).toFixed(1).toString().replace('-0', '0')
    },
    changeHeadPanValue () {
      this.valueHeadPan = isNaN(parseFloat(this.valueHeadPan.replace(',', '.'))) ? 0 : parseFloat(this.valueHeadPan.replace(',', '.'))
      if (this.valueHeadPan < this.numericLimitValues.panMinLimit) {
        this.valueHeadPan = this.numericValueFormat(this.numericLimitValues.panMinLimit, this.numericLimitValues.panStep)
      } else if (this.valueHeadPan > this.numericLimitValues.panMaxLimit) {
        this.valueHeadPan = this.numericValueFormat(this.numericLimitValues.panMaxLimit, this.numericLimitValues.panStep)
      } else if (this.valueHeadPan === '') {
        this.valueHeadPan = this.numericValueFormat(0, 0)
      } else {
        this.valueHeadPan = this.numericValueFormat(this.valueHeadPan, this.numericLimitValues.panStep)
      }
    },
    changeHeadTiltValue () {
      this.valueHeadTilt = isNaN(parseFloat(this.valueHeadTilt.replace(',', '.'))) ? 0 : parseFloat(this.valueHeadTilt.replace(',', '.'))
      if (this.valueHeadTilt < this.numericLimitValues.tiltMinLimit) {
        this.valueHeadTilt = this.numericValueFormat(this.numericLimitValues.tiltMinLimit, this.numericLimitValues.tiltStep)
      } else if (this.valueHeadTilt > this.numericLimitValues.tiltMaxLimit) {
        this.valueHeadTilt = this.numericValueFormat(this.numericLimitValues.tiltMaxLimit, this.numericLimitValues.tiltStep)
      } else if (this.valueHeadTilt === '') {
        this.valueHeadTilt = this.numericValueFormat(0, 0)
      } else {
        this.valueHeadTilt = this.numericValueFormat(this.valueHeadTilt, this.numericLimitValues.tiltStep)
      }
    },
    changeFocusValue () {
      this.valueFocus = isNaN(parseFloat(this.valueFocus.replace(',', '.'))) ? 0 : parseFloat(this.valueFocus.replace(',', '.'))
      if (this.valueFocus < this.numericLimitValues.focusMinLimit) {
        this.valueFocus = this.numericValueFormat(this.numericLimitValues.focusMinLimit, this.numericLimitValues.focusStep)
      } else if (this.valueFocus > this.numericLimitValues.focusMaxLimit) {
        this.valueFocus = this.numericValueFormat(this.numericLimitValues.focusMaxLimit, this.numericLimitValues.focusStep)
      } else if (this.valueFocus === '') {
        this.valueFocus = this.numericValueFormat(0, 0)
      } else {
        this.valueFocus = this.numericValueFormat(this.valueFocus, this.numericLimitValues.focusStep)
      }
    },
    changeSlideValue () {
      this.valueSlide = isNaN(parseFloat(this.valueSlide.replace(',', '.'))) ? 0 : parseFloat(this.valueSlide.replace(',', '.'))
      if (this.valueSlide < this.numericLimitValues.slideMinLimit) {
        this.valueSlide = this.numericValueFormat(this.numericLimitValues.slideMinLimit, this.numericLimitValues.slideStep)
      } else if (this.valueSlide > this.numericLimitValues.slideMaxLimit) {
        this.valueSlide = this.numericValueFormat(this.numericLimitValues.slideMaxLimit, this.numericLimitValues.slideStep)
      } else if (this.valueSlide === '') {
        this.valueSlide = this.numericValueFormat(0, 0)
      } else {
        this.valueSlide = this.numericValueFormat(this.valueSlide, this.numericLimitValues.slideStep)
      }
    },
    changeJibPanValue () {
      this.valueJibPan = isNaN(parseFloat(this.valueJibPan.replace(',', '.'))) ? 0 : parseFloat(this.valueJibPan.replace(',', '.'))
      if (this.valueJibPan < this.numericLimitValues.jibPanMinLimit) {
        this.valueJibPan = this.numericValueFormat(this.numericLimitValues.jibPanMinLimit, this.numericLimitValues.jibPanStep)
      } else if (this.valueJibPan > this.numericLimitValues.jibPanMaxLimit) {
        this.valueJibPan = this.numericValueFormat(this.numericLimitValues.jibPanMaxLimit, this.numericLimitValues.jibPanStep)
      } else if (this.valueJibPan === '') {
        this.valueJibPan = this.numericValueFormat(0, 0)
      } else {
        this.valueJibPan = this.numericValueFormat(this.valueJibPan, this.numericLimitValues.jibPanStep)
      }
    },
    changeJibTiltValue () {
      this.valueJibTilt = isNaN(parseFloat(this.valueJibTilt.replace(',', '.'))) ? 0 : parseFloat(this.valueJibTilt.replace(',', '.'))
      if (this.valueJibTilt < this.numericLimitValues.jibTiltMinLimit) {
        this.valueJibTilt = this.numericValueFormat(this.numericLimitValues.jibTiltMinLimit, this.numericLimitValues.jibTiltStep)
      } else if (this.valueJibTilt > this.numericLimitValues.jibTiltMaxLimit) {
        this.valueJibTilt = this.numericValueFormat(this.numericLimitValues.jibTiltMaxLimit, this.numericLimitValues.jibTiltStep)
      } else if (this.valueJibTilt === '') {
        this.valueJibTilt = this.numericValueFormat(0, 0)
      } else {
        this.valueJibTilt = this.numericValueFormat(this.valueJibTilt, this.numericLimitValues.jibTiltStep)
      }
    }
  }
}
</script>
