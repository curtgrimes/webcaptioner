<template>
  <div ref="transcript" class="transcript d-flex align-items-end" v-bind:style="{color: textColor}">
    <span>{{finalTranscript}} <span>{{interimTranscript}}</span></span>
  </div>
</template>

<script>

export default {
  name: 'transcript',
  props: [],
  methods: {
    scrollToBottom: function () {
      this.$nextTick(function () {
        if (this.$refs.transcript) {
          this.$refs.transcript.scrollTop = this.$refs.transcript.scrollHeight;
        }
      });
    },
  },
  computed: {
    textColor () {
      return this.$store.state.settings.appearance.text.textColor;
    },
    finalTranscript () {
      this.scrollToBottom();
      return this.$store.state.captioner.transcript.final;
    },
    interimTranscript () {
      this.scrollToBottom();
      return ' ' + this.$store.state.captioner.transcript.interim;
    },
  },
}
</script>

<style lang="css">
</style>
