<template>
  <div class="transcript" v-bind:style="{color: textColor}">
    {{finalTranscript}} <span>{{interimTranscript}}</span>
  </div>
</template>

<script>

export default {
  name: 'transcript',
  props: [],
  computed: {
    textColor () {
      return this.$store.state.appearance.textColor;
    },
    finalTranscript () {
      return this.$store.state.captioner.transcript.final;
    },
    interimTranscript () {
      return ' ' + this.$store.state.captioner.transcript.interim;
    },
  },
}
</script>

<style lang="css">
</style>
