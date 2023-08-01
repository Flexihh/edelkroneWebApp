<template lang="pug">
.box-content__item.box-content__item--copy(@click="copyLinkId")
  input(type="hidden", :id="`copyLinkId${linkId}`", :value="linkId")
  span Link ID: <span>{{ linkId }}</span>
  .icon
    img(src="../../assets/icon-copy.png")
</template>

<script>
export default {
  props: [
    'linkId'
  ],
  methods: {
    copyLinkId () {
      const copyLinkId = document.getElementById(`copyLinkId${this.linkId}`)
      copyLinkId.setAttribute('type', 'text')
      copyLinkId.select()
      document.execCommand('copy')
      copyLinkId.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
      copyLinkId.blur()
    }
  }
}
</script>
