<template>
  <div
    class="transcript d-flex"
    v-bind:class="[wrapTextPositionClass, (chromeless ? 'chromeless' : '')]"
    v-bind:style="{height, color, backgroundColor, fontFamily, fontSize, lineHeight, letterSpacing, textTransform, padding, textShadow, cursor}"
    @click="focusIfInTypingMode()">
    <link type="text/css" rel="stylesheet" :href="'https://fonts.googleapis.com/css?family=' + fontFamily" />
    <span
      v-bind:class="textPositionClass"
      class="transcript-scroller"
      ref="scroller">
      <span class="transcript-scroller-child">{{finalTranscript}} <span v-if="interimTranscript" v-bind:style="{color: interimColor}">{{interimTranscript}}</span> <span v-show="typingModeOn" contenteditable v-text="transcriptTypedForDisplay" @input="typedTranscriptDidChange()" ref="typedTranscript" class="transcriptTyped">Hello world</span></span>
    </span>
  </div>
</template>

<script>
import hexToRGB from '~/mixins/hexToRGB'
import appHeightAdjuster from '~/mixins/appHeightAdjuster'

export default {
  name: 'transcript',
  props: ['chromeless'],
  mixins: [
    appHeightAdjuster,
    hexToRGB,
  ],
  data: function() {
    return {
      height: '100vh',
      transcriptTypedForDisplay: '',
    }
  },
  methods: {
    scrollToBottom: function () {
      this.$nextTick(function () {
        if (this.$refs.scroller) {
          this.$refs.scroller.scrollTop = this.$refs.scroller.scrollHeight;
        }
      });
    },
    typedTranscriptDidChange: function() {
      this.$store.commit('captioner/SET_TRANSCRIPT_TYPED', {transcriptTyped: this.$refs.typedTranscript.innerText})
    },
    focusIfInTypingMode: function() {
      if (this.typingModeOn) {
        this.$refs.typedTranscript.focus();
      }
    },
  },
  mounted: function() {
    this.scrollToBottom();

    this.$nextTick(() => {
      setTimeout(() => {
        // Hacky way to make sure settings view is correct
        // height after load where it is immediately active
        this.height = this.adjustAppHeight();
      },500);
    });
    

    this.$watch('largerLayout', () => {
      this.height = this.adjustAppHeight();
    });
  },
  watch: {
    typingModeOn: function (on) {
      if (on) {
        // Turned on. Copy the transcript over once.
        this.transcriptTypedForDisplay = this.typedTranscript;
        this.$nextTick(() => {
          this.$refs.typedTranscript.focus();

          // Put caret at end
          if (typeof window.getSelection != "undefined"
                  && typeof document.createRange != "undefined") {
              var range = document.createRange();
              range.selectNodeContents(this.$refs.typedTranscript);
              range.collapse(false);
              var sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
          } else if (typeof document.body.createTextRange != "undefined") {
              var textRange = document.body.createTextRange();
              textRange.moveToElementText(this.$refs.typedTranscript);
              textRange.collapse(false);
              textRange.select();
          }
        });
      }
      else {
        // Turned off.
        this.transcriptTypedForDisplay = '';
      }
    },
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
    fontFamily () {
      return this.$store.state.settings.appearance.text.fontFamily;
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
      const {r, g, b} = this.hexToRGB(this.$store.state.settings.appearance.shadow.color);
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
    typingModeOn () {
      return this.$store.state.captioner.typingModeOn;
    },
    typedTranscript () {
      return this.$store.state.captioner.transcript.typed;
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
    cursor: function() {
      return this.typingModeOn ? 'text' : 'default';
    },
    largerLayout: function() {
      return this.$store.state.settings.controls.layout.larger;
    },
  },
}
</script>

<style lang="css">
  .transcriptTyped {
    outline:none;
    min-width:5px;
    display:inline-block;
    min-height:100px;
  }
</style>
