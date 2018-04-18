<template>
  <div
    class="transcript d-flex"
    v-bind:class="[wrapTextPositionClass, (chromeless ? 'chromeless' : '')]"
    v-bind:style="{color, backgroundColor, fontSize, lineHeight, letterSpacing, textTransform, padding, textShadow}">
    <span
      v-bind:class="textPositionClass"
      class="transcript-scroller"
      ref="scroller">
      <span class="transcript-scroller-child">{{finalTranscript}} <span v-if="interimTranscript" v-bind:style="{color: interimColor}">{{interimTranscript}}</span></span>
    </span>
  </div>
</template>

<script>
import hexToRgb from '../util/hexToRGB'

export default {
  name: 'transcript',
  props: ['chromeless'],
  methods: {
    scrollToBottom: function () {
      this.$nextTick(function () {
        if (this.$refs.scroller) {
          this.$refs.scroller.scrollTop = this.$refs.scroller.scrollHeight;
        }
      });
    },
  },
  mounted: function() {
    this.scrollToBottom();
  },
  computed: {

    // Appearance
    color () {
      return this.$store.state.settings.appearance.text.textColor;
    },
    interimColor () {
      return this.$store.state.settings.appearance.text.textColorInterim;
    },
    backgroundColor () {
      return this.$store.state.settings.appearance.background.color;
    },
    fontSize () {
      return this.$store.state.settings.appearance.text.textSize + 'em';
    },
    lineHeight () {
      return this.$store.state.settings.appearance.text.lineHeight + 'em';
    },
    letterSpacing () {
      return this.$store.state.settings.appearance.text.letterSpacing + 'em';
    },
    textTransform () {
      return this.$store.state.settings.appearance.text.textTransform;
    },
    padding () {
      return this.$store.state.settings.appearance.text.alignment.padding + 'em '
        + this.$store.state.settings.appearance.text.alignment.padding + 'em '
        + this.$store.state.settings.appearance.text.alignment.padding + 'em '
        + this.$store.state.settings.appearance.text.alignment.padding + 'em ';
    },
    textShadow () {
      const {r, g, b} = hexToRgb(this.$store.state.settings.appearance.shadow.color);
      const blurRadius = this.$store.state.settings.appearance.shadow.blurRadius + 'px';
      const opacity = this.$store.state.settings.appearance.shadow.opacity;
      const offsetX = this.$store.state.settings.appearance.shadow.offsetX + 'em';
      const offsetY = this.$store.state.settings.appearance.shadow.offsetY + 'em';

      return offsetX + ' ' + offsetY + ' ' + blurRadius + ' rgba('+ r +',' + g + ',' + b + ',' + parseInt(opacity)/100 + ')';
    },

    finalTranscript () {
      this.scrollToBottom();
      return this.$store.state.captioner.transcript.final;
    },
    interimTranscript () {
      this.scrollToBottom();

      // Prepend a space if string is not empty
      return (this.$store.state.captioner.transcript.interim && this.$store.state.captioner.transcript.interim.length ? ' ' : '')
        + this.$store.state.captioner.transcript.interim;
    },

    textPositionClass: function () {
      return {
        /* Horizontal alignments */
        'w-100 mx-0': this.$store.state.settings.appearance.text.alignment.horizontal == 'full',
        'w-50 mr-auto': this.$store.state.settings.appearance.text.alignment.horizontal == 'left',
        'w-50 mx-auto': this.$store.state.settings.appearance.text.alignment.horizontal == 'middle',
        'w-50 ml-auto': this.$store.state.settings.appearance.text.alignment.horizontal == 'right',

        /* Vertical alignments */
        'h-100': this.$store.state.settings.appearance.text.alignment.vertical == 'full',
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
