<template>
  <div
    class="transcript d-flex align-items-end" v-bind:class="wrapTextPositionClass"
    v-bind:style="{color, backgroundColor}"
  >
    <span class="" v-bind:class="textPositionClass">
      <span class="transcript-child d-flex align-items-end" ref="transcriptScroller">
        <span>
          {{finalTranscript}} <span v-bind:style="{color: interimColor}">{{interimTranscript}}</span>
        </span>
      </span>
    </span>
  </div>
</template>

<script>

export default {
  name: 'transcript',
  props: [],
  methods: {
    scrollToBottom: function () {
      this.$nextTick(function () {
        if (this.$refs.transcriptScroller) {
          this.$refs.transcriptScroller.scrollTop = this.$refs.transcriptScroller.scrollHeight;
        }
      });
    },
  },
  computed: {
    color () {
      return this.$store.state.settings.appearance.text.textColor;
    },
    interimColor () {
      return this.$store.state.settings.appearance.text.textColorInterim;
    },
    backgroundColor () {
      return this.$store.state.settings.appearance.background.color;
    },
    finalTranscript () {
      this.scrollToBottom();
      return this.$store.state.captioner.transcript.final;
    },
    interimTranscript () {
      this.scrollToBottom();
      return ' ' + this.$store.state.captioner.transcript.interim;
    },

    textPositionClass: function () {
      return {
        /* Horizontal alignments */
        'w-100 mx-0': this.$store.state.settings.appearance.text.alignment.horizontal == 'full',
        'w-50 mr-auto': this.$store.state.settings.appearance.text.alignment.horizontal == 'left',
        'w-50 mx-auto': this.$store.state.settings.appearance.text.alignment.horizontal == 'middle',
        'w-50 ml-auto': this.$store.state.settings.appearance.text.alignment.horizontal == 'right',

        /* Vertical alignments */
        // 'h-100': this.$store.state.settings.appearance.text.alignment.vertical == 'full',
        'h-50': ['top','middle','bottom'].includes(this.$store.state.settings.appearance.text.alignment.vertical),
        'h-25': this.$store.state.settings.appearance.text.alignment.vertical == 'lowerThird',
      }
    },
    wrapTextPositionClass: function () {
      return {
        /* Vertical alignments */
        'align-items-start': ['full','top'].includes(this.$store.state.settings.appearance.text.alignment.vertical),
        'align-items-center': this.$store.state.settings.appearance.text.alignment.vertical == 'middle',
        'align-items-end': ['bottom','lowerThird'].includes(this.$store.state.settings.appearance.text.alignment.vertical),
      }
    },
  },
}
</script>

<style lang="css">
</style>
