<template lang="pug">
.range(:class="rangeClass")
  .wrap.xl-table.xl-gutter-16.xl-middle
    .col.xl-width-80
      template(v-if="name === 'speed'")
        label.form-field(v-if="rangeValuePercent !== null" for="formFieldSpeed")
          .form-field__value
            input(:style="`width: ${(rangeValuePercent.length + 1) * 8}px`"
                  id="formFieldSpeed"
                  v-model="rangeValuePercent"
                  @click="select"
                  @keydown="isNumber"
                  @change="changeRangeValuePercent"
                  @focus="setIsInputActive(true)"
                  @blur="setIsInputActive(false)")
          .form-field__unit
            | %
      template(v-if="name === 'acceleration'")
        img(src="../../assets/icon-acceleration--in.png")
    .col
      .range-input
        .range-input__circle(:style="sliderThumbStyle")
          .range-input__circle-inner
        input(type="range" min="0.01" max="1" step="0.001" v-model="rangeValue")
    .col.xl-width-80
      template(v-if="name === 'acceleration'")
        img(src="../../assets/icon-acceleration--out.png")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import includes from 'lodash/includes'
import filter from 'lodash/filter'
import isNaN from 'lodash/isNaN'

export default {
  props: [
    'name'
  ],
  data () {
    return {
      rangeValue: null,
      rangeValuePercent: null
    }
  },
  mounted () {
    if (this.name === 'speed') {
      this.rangeValue = this.speed
    }
    if (this.name === 'acceleration') {
      this.rangeValue = this.acceleration
    }
    this.rangeValuePercent = parseFloat(this.rangeValue * 100).toFixed(1)
  },
  watch: {
    rangeValue () {
      if (this.name === 'speed') {
        this.setSpeed(parseFloat(this.rangeValue))
      }
      if (this.name === 'acceleration') {
        this.setAcceleration(parseFloat(this.rangeValue))
      }
      this.rangeValuePercent = parseFloat(this.rangeValue * 100).toFixed(1)
    }
  },
  computed: {
    ...mapGetters('app', [
      'speed',
      'acceleration'
    ]),
    rangeClass () {
      return `range--${this.name}`
    },
    sliderThumbStyle () {
      let rangeValuePercent = this.rangeValuePercent
      if (rangeValuePercent < 1) {
        rangeValuePercent = 1
      }
      let element = (48 * rangeValuePercent / 100)
      if (rangeValuePercent < 0) {
        rangeValuePercent = 0
        element = 0
      }
      if (rangeValuePercent > 100) {
        rangeValuePercent = 100
        element = 48
      }
      return `left: calc(${rangeValuePercent - 0.25}% - ${parseInt(element)}px)`
    }
  },
  methods: {
    ...mapActions('app', [
      'setSpeed',
      'setAcceleration'
    ]),
    ...mapActions('layout', [
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
    changeRangeValuePercent () {
      this.rangeValuePercent = isNaN(parseFloat(this.rangeValuePercent.replace(',', '.'))) ? 0 : parseFloat(this.rangeValuePercent.replace(',', '.'))
      if (this.rangeValuePercent) {
        if (this.rangeValuePercent < 1) {
          this.rangeValuePercent = parseFloat(1).toFixed(1)
        } else if (this.rangeValuePercent > 100) {
          this.rangeValuePercent = parseFloat(100).toFixed(1)
        } else {
          this.rangeValuePercent = parseFloat(this.rangeValuePercent).toFixed(1)
        }
        this.rangeValue = this.rangeValuePercent / 100
        this.rangeValuePercent = parseFloat(this.rangeValue * 100).toFixed(1)
      } else {
        this.rangeValue = 0.01
        this.rangeValuePercent = parseFloat(this.rangeValue * 100).toFixed(1)
      }
    }
  }
}
</script>
