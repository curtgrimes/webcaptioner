<template>
  <div
    class="transcript d-flex flex-grow-1"
    v-bind:class="[wrapTextPositionClass]"
    v-bind:style="{
      color,
      backgroundColor,
      fontFamily: `'${fontFamily}'`,
      fontSize,
      fontStyle,
      fontWeight,
      lineHeight,
      letterSpacing,
      textTransform,
      padding,
      textShadow,
      cursor,
    }"
    @click="focusIfInTypingMode()"
  >
    <span
      v-bind:class="textPositionClass"
      class="transcript-scroller"
      ref="scroller"
    >
      <span class="transcript-scroller-child">
        <span v-if="$store.state.settings.stabilizedThresholdMs !== 0">{{
          $store.state.captioner.transcript.stabilized
        }}</span
        ><span
          v-else
          :class="{ 'd-block w-100': finalTranscriptEndsInNewline }"
          >{{ $store.state.captioner.transcript.final }}</span
        ><span
          v-if="
            $store.state.captioner.transcript.interim &&
              $store.state.settings.stabilizedThresholdMs === 0
          "
          v-bind:style="{ color: interimColor }"
          >{{ $store.state.captioner.transcript.interim }}</span
        ><span
          v-show="typingModeOn && showTypedLiveReadOnly !== true"
          :contenteditable="typingModeOn"
          v-text="transcriptTypedForDisplay"
          @input="typedTranscriptDidChange()"
          ref="typedTranscript"
          class="transcriptTyped combokeys"
        ></span
        ><span
          v-if="
            showTypedLiveReadOnly && $store.state.captioner.transcript.typed
          "
          class="d-block"
          >{{ $store.state.captioner.transcript.typed }}</span
        ><br
          v-if="
            finalTranscriptEndsInNewline &&
              !$store.state.captioner.transcript.interim
          "/><br
          v-if="typedTranscriptEndsInNewline && showTypedLiveReadOnly"/><span
          ref="scrollerEndMarker"
        ></span
      ></span>
    </span>
    <transition name="fade">
      <b-button
        class="autoscrollButton"
        ref="autoscrollButton"
        v-if="!isScrolledNearToEnd"
        @click="scrollToEnd({ immediate: true })"
      >
        <fa icon="chevron-down" size="2x" class="backToLatestIcon" />
      </b-button>
    </transition>
    <b-popover
      v-if="!isScrolledNearToEnd"
      :target="() => $refs.autoscrollButton"
      placement="top"
      triggers="hover"
      custom-class="wider shadow"
      variant="dark"
    >
      <div
        class="d-flex align-items-end"
        style="overflow:hidden;max-height:5rem"
      >
        <div
          style="padding:0.25rem 0.5rem;user-select: none"
          v-bind:style="{
            color,
            backgroundColor,
            fontFamily: `'${fontFamily}'`,
            fontStyle,
            fontWeight,
            textTransform,
          }"
        >
          {{
            $store.state.captioner.transcript.final +
              ' ' +
              $store.state.captioner.transcript.interim
          }}
        </div>
      </div>
    </b-popover>
    <font-stylesheet
      v-if="$store.state.settingsLoaded"
      :font-family="fontFamily"
      :font-variant="$store.state.settings.appearance.text.fontVariant"
    />
  </div>
</template>

<script>
import hexToRGB from '~/mixins/hexToRGB';
import Combokeys from 'combokeys';
import fontStylesheet from '~/components/FontStylesheet.vue';
import { BButton } from 'bootstrap-vue';

export default {
  name: 'transcript',
  components: {
    fontStylesheet,
    BButton,
  },
  props: {
    showTypedLiveReadOnly: Boolean,
    delay: {
      type: Number,
      default: 0,
    },
    simpleScrolling: Boolean,
  },
  mixins: [hexToRGB],
  data: function() {
    return {
      transcriptTypedForDisplay: '',
      scrolledToEndObserver: null,
      isScrolledNearToEnd: true,
    };
  },
  methods: {
    async scrollToEnd({
      immediate = this.simpleScrolling || document.hidden,
    } = {}) {
      await this.$nextTick();
      this.$refs.scrollerEndMarker?.scrollIntoView({
        behavior: immediate ? 'auto' : 'smooth',
      });
    },
    startScrollWatcher() {
      this.scrolledToEndObserver = new IntersectionObserver(
        (intersections) => {
          this.isScrolledNearToEnd = intersections[0]?.isIntersecting;
        },
        {
          root: this.$refs.scroller,
          rootMargin: '0px 0px 100px 0px',
        }
      );

      this.scrolledToEndObserver.observe(this.$refs.scrollerEndMarker);
    },
    typedTranscriptDidChange: function() {
      this.$store.commit('captioner/SET_TRANSCRIPT_TYPED', {
        transcriptTyped: this.$refs.typedTranscript?.innerText || '',
      });
    },
    focusIfInTypingMode: function() {
      if (this.typingModeOn) {
        this.$refs.typedTranscript.focus();
      }
    },
  },
  mounted() {
    this.scrollToEnd({ immediate: true });

    if (!this.simpleScrolling) {
      this.startScrollWatcher();
    }

    new Combokeys(this.$refs.typedTranscript).bind('esc', () => {
      this.$store.dispatch('captioner/stopTypingMode');
    });
  },
  beforeDestroy() {
    this.scrolledToEndObserver?.disconnect();
  },
  watch: {
    typingModeOn: function(on) {
      if (on) {
        // Turned on. Copy the transcript over once.
        this.transcriptTypedForDisplay = this.$store.state.captioner.transcript.typed;

        // Add a space on the end if one doesn't already exist
        if (
          this.transcriptTypedForDisplay.length &&
          this.transcriptTypedForDisplay.substr(-1, 1) !== ' '
        ) {
          this.transcriptTypedForDisplay += ' ';
        }

        this.$nextTick(() => {
          this.$refs.typedTranscript.focus();

          // Put caret at end
          if (
            typeof window.getSelection != 'undefined' &&
            typeof document.createRange != 'undefined'
          ) {
            var range = document.createRange();
            range.selectNodeContents(this.$refs.typedTranscript);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          } else if (typeof document.body.createTextRange != 'undefined') {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(this.$refs.typedTranscript);
            textRange.collapse(false);
            textRange.select();
          }
        });
      } else {
        // Turned off.
        this.transcriptTypedForDisplay = '';
      }
    },
    '$store.state.captioner.transcript.final'() {
      if (this.isScrolledNearToEnd) {
        this.scrollToEnd();
      }
    },
    '$store.state.captioner.transcript.interim'() {
      if (this.isScrolledNearToEnd) {
        this.scrollToEnd();
      }
    },
    '$store.state.captioner.transcript.stabilized'() {
      if (this.isScrolledNearToEnd) {
        this.scrollToEnd();
      }
    },
    '$store.state.captioner.transcript.typed'() {
      if (this.isScrolledNearToEnd) {
        this.scrollToEnd();
      }
    },
  },
  computed: {
    // Appearance
    color() {
      return this.$store.state.settings.appearance.text.textColor;
    },
    interimColor() {
      return this.$store.state.settings.appearance.text.textColorInterim;
    },
    backgroundColor() {
      const { r, g, b } = this.hexToRGB(
        this.$store.state.settings.appearance.background.color
      );
      const opacity =
        parseInt(this.$store.state.settings.appearance.background.opacity) /
        100;
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
    },
    fontFamily() {
      return this.$store.state.settings.appearance.text.fontFamily;
    },
    fontStyle() {
      if (
        this.$store.state.settings.appearance.text.fontVariant
          ?.toLowerCase()
          .includes('italic')
      ) {
        return 'italic';
      } else {
        return 'normal';
      }
    },
    fontWeight() {
      // Remove 'italic' from the fontVariant string and assume what
      // remains is the font weight. Works for all the Google Font
      // variant values I've seen so far (700italic, regular, italic, etc.)
      const fontWeight = this.$store.state.settings.appearance.text.fontVariant
        ?.toLowerCase()
        .replace('italic', '')
        .trim();

      // Transform into font-weight property that CSS uses
      switch (fontWeight) {
        case 'regular':
          return 'normal';
        default:
          return fontWeight;
      }
    },
    fontSize() {
      return this.$store.state.settings.appearance.text.textSize + 'em';
    },
    lineHeight() {
      return this.$store.state.settings.appearance.text.lineHeight + 'em';
    },
    letterSpacing() {
      return this.$store.state.settings.appearance.text.letterSpacing + 'em';
    },
    textTransform() {
      return this.$store.state.settings.appearance.text.textTransform;
    },
    padding() {
      return (
        this.$store.state.settings.appearance.text.alignment.padding +
        'em ' +
        this.$store.state.settings.appearance.text.alignment.padding +
        'em ' +
        this.$store.state.settings.appearance.text.alignment.padding +
        'em ' +
        this.$store.state.settings.appearance.text.alignment.padding +
        'em '
      );
    },
    textShadow() {
      const { r, g, b } = this.hexToRGB(
        this.$store.state.settings.appearance.shadow.color
      );
      const blurRadius =
        this.$store.state.settings.appearance.shadow.blurRadius + 'px';
      const opacity = this.$store.state.settings.appearance.shadow.opacity;
      const offsetX =
        this.$store.state.settings.appearance.shadow.offsetX + 'em';
      const offsetY =
        this.$store.state.settings.appearance.shadow.offsetY + 'em';

      return (
        offsetX +
        ' ' +
        offsetY +
        ' ' +
        blurRadius +
        ' rgba(' +
        r +
        ',' +
        g +
        ',' +
        b +
        ',' +
        parseInt(opacity) / 100 +
        ')'
      );
    },
    typingModeOn() {
      return this.$store.state.captioner.typingModeOn;
    },
    finalTranscriptEndsInNewline() {
      // Used to determine if we need to display the final transcript inline-block
      // instead of inline so that we see the newlines (they don't take up space when inline)
      return this.$store.state.captioner.transcript.final.substr(-1) === '\n';
    },
    typedTranscriptEndsInNewline() {
      return this.$store.state.captioner.transcript.typed.substr(-1) === '\n';
    },
    textPositionClass: function() {
      return {
        /* Horizontal alignments */
        'w-100 mx-0':
          this.$store.state.settings.appearance.text.alignment.horizontal ==
          'full',
        'w-50 mr-auto':
          this.$store.state.settings.appearance.text.alignment.horizontal ==
          'left',
        'w-50 mx-auto':
          this.$store.state.settings.appearance.text.alignment.horizontal ==
          'middle',
        'w-50 ml-auto':
          this.$store.state.settings.appearance.text.alignment.horizontal ==
          'right',

        /* Vertical alignments */
        'h-100':
          this.$store.state.settings.appearance.text.alignment.vertical ==
          'full',
        'h-50': ['top', 'middle', 'bottom'].includes(
          this.$store.state.settings.appearance.text.alignment.vertical
        ),
        'h-25':
          this.$store.state.settings.appearance.text.alignment.vertical ==
          'lowerThird',
      };
    },
    wrapTextPositionClass: function() {
      return {
        /* Vertical alignments */
        'align-items-start': ['full', 'top'].includes(
          this.$store.state.settings.appearance.text.alignment.vertical
        ),
        'align-items-center':
          this.$store.state.settings.appearance.text.alignment.vertical ==
          'middle',
        'align-items-end': ['bottom', 'lowerThird'].includes(
          this.$store.state.settings.appearance.text.alignment.vertical
        ),
      };
    },
    cursor: function() {
      return this.typingModeOn ? 'text' : 'default';
    },
    largerLayout: function() {
      return this.$store.state.settings.controls.layout.larger;
    },
    transcriptEndPreview() {
      return (
        this.$store.state.captioner.transcript.final +
        ' ' +
        this.$store.state.captioner.transcript.interim
      ).substr(-250);
    },
  },
};
</script>

<style lang="css">
.transcriptTyped {
  display: inline-block;
  min-width: 5px;
  outline: none;
}

.autoscrollButton {
  padding: 1.75rem;
  position: absolute;
  bottom: 2rem;
  left: 50%;
  margin-left: -1.5rem;

  border-radius: 10rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.backToLatestIcon {
  animation: wiggle-y 1s infinite;
}

.popoverTextLeftGradient {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6rem;
  background: linear-gradient(90deg, #fff, transparent);
}

@keyframes wiggle-y {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
}
</style>
