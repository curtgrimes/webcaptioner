<template>
  <div class="d-flex flex-grow-1">
    <transcript />
    <b-modal
      v-model="showModal"
      lazy
      size="lg"
      ref="modal"
      title="Export SRT"
      @hide="replaceRouteToParent"
      footer-class="sticky-bottom bg-white bottom-0"
    >
      <pre
        >{{ srt }}
      </pre>
      <template v-slot:modal-footer="{}">
        <b-button
          size="sm"
          variant="secondary"
          @click="copyToClipboard()"
          :disabled="copyToClipboardSuccess"
        >
          <span v-if="copyToClipboardSuccess">Copied!</span>
          <span v-else>Copy to clipboard</span>
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import transcript from '~/components/Transcript.vue';

const routeName = 'save-to-file';

export default {
  components: {
    transcript,
  },
  data: function() {
    return {
      showModal: true,
      copyToClipboardSuccess: false,
    };
  },
  computed: {
    stabilizedTranscript() {
      return this.$store.state.captioner.transcript.stabilizedWithTimings;
    },
    srt() {
      const MAX_LINE_LENGTH_CHARACTERS = 42;
      let line1 = [],
        line2 = [],
        line1CharacterCount = 0,
        line2CharacterCount = 0,
        linePairs = [];

      for (let i = 0; i < this.stabilizedTranscript.length; i++) {
        // Decide whether to start a new pair of lines
        if (
          // There hasn't been too much time since the last word
          // There is a previous item
          !this.stabilizedTranscript[i - 1] ||
          // It happened less than 2000 MS before the current item
          this.stabilizedTranscript[i].time -
            this.stabilizedTranscript[i - 1].time <=
            2000
        ) {
          // Figure out whether to put it on line 1, line 2, or on a new line 1
          if (
            // Adding this wouldn't make line 1 too long
            line1CharacterCount + this.stabilizedTranscript[i].text.length <=
              MAX_LINE_LENGTH_CHARACTERS &&
            // And we haven't already started adding to line 2
            line2CharacterCount === 0
          ) {
            line1.push(this.stabilizedTranscript[i]);
            line1CharacterCount += this.stabilizedTranscript[i].text.length;
          } else if (
            // Adding this wouldn't make line 2 too long
            line2CharacterCount + this.stabilizedTranscript[i].text.length <=
            MAX_LINE_LENGTH_CHARACTERS
          ) {
            line2.push(this.stabilizedTranscript[i]);
            line2CharacterCount += this.stabilizedTranscript[i].text.length;
          } else {
            // Start a new pair of lines
            linePairs.push({ line1, line2 });
            line1 = [];
            line2 = [];
            line1CharacterCount = 0;
            line2CharacterCount = 0;

            // Add to line 1
            line1.push(this.stabilizedTranscript[i]);
            line1CharacterCount += this.stabilizedTranscript[i].text.length;
          }
        } else {
          // Start a new pair of lines
          linePairs.push({ line1, line2 });
          line1 = [];
          line2 = [];
          line1CharacterCount = 0;
          line2CharacterCount = 0;

          // Add to line 1
          line1.push(this.stabilizedTranscript[i]);
          line1CharacterCount += this.stabilizedTranscript[i].text.length;
        }
      }

      if (line1.length || line2.length) {
        // One final push
        linePairs.push({ line1, line2 });
      }

      function getLastWord(linePairs) {
        if (linePairs.line2[linePairs.line2.length - 1]) {
          // Line 2 has a last item
          return linePairs.line2[linePairs.line2.length - 1];
        } else {
          // Return line 1's last item
          return linePairs.line1[linePairs.line1.length - 1];
        }
      }
      function getDurationString(ms) {
        // Given a count of milliseconds, get the duration back in the format
        // HH:MM:SS,mmm
        const secondDuration = 1000;
        const minuteDuration = secondDuration * 60;
        const hourDuration = minuteDuration * 60;

        // 7200000 = 2 hours

        let hours = Math.floor(ms / hourDuration);
        let minutes = Math.floor((ms % hourDuration) / minuteDuration);
        let seconds = Math.floor(
          ((ms % hourDuration) % minuteDuration) / secondDuration
        );
        let milliseconds =
          ((ms % hourDuration) % minuteDuration) % secondDuration;

        function zeroPadded(num, digits) {
          return ('0'.repeat(digits) + num).substr(digits * -1, digits);
        }

        return (
          zeroPadded(hours, 2) +
          ':' +
          zeroPadded(minutes, 2) +
          ':' +
          zeroPadded(seconds, 2) +
          ',' +
          zeroPadded(milliseconds, 3)
        );
      }

      let srtStartTime;
      let output = '';
      for (let i = 0; i < linePairs.length; i++) {
        let startTime = linePairs[i].line1[0].time;
        let endTime = getLastWord(linePairs[i]).time;

        if (!srtStartTime) {
          // This is the first pairing
          srtStartTime = startTime;
        }

        if (startTime === endTime) {
          // This line pair has the same start and end time.
          // Adjust the end time to be closer to the next line pair, or
          // if that's too far into the future, estimate each word is a small
          // amount of time and adjust the endTime that amount into the future.
          // const nextLinePairStartTime = linePairs[i + 1]?.line1[0]?.time;

          const nextLinePairStartTime = linePairs[i + 1]
            ? linePairs[i + 1].line1[0]
              ? linePairs[i + 1].line1[0].time
              : null
            : null;

          // Estimate a short period of time for each word in this pair
          const maxDurationForThisLinePair =
            (linePairs[i].line1.length + linePairs[i].line2.length) * 500;

          if (
            !nextLinePairStartTime || // We are at the end
            nextLinePairStartTime - endTime > maxDurationForThisLinePair // The next pair start time exceeds the estimated length
          ) {
            // Add the estimated duration instead of using
            // a following pair duration (which doesn't exist or is too far into the future)
            endTime = startTime + maxDurationForThisLinePair;
          } else {
            // Next line pair starts sooner than estimate. Use that
            // start time minus a MS so times don't overlap.
            endTime = nextLinePairStartTime - 1;
          }
        }

        let startTimestampString = getDurationString(startTime - srtStartTime);
        let endTimestampString = getDurationString(endTime - srtStartTime);

        output += (i > 0 ? '\n' : '') + (i + 1);
        output += '\n' + startTimestampString + ' --> ' + endTimestampString;
        output += '\n' + linePairs[i].line1.map((t) => t.text).join(' ');
        output +=
          linePairs[i].line2.length > 0
            ? '\n' + linePairs[i].line2.map((t) => t.text).join(' ')
            : '';
        output += '\n';
      }
      return output;
    },
  },
  mounted: function() {
    if (!this.$store.state.settings.exp.includes('srt')) {
      this.$router.replace('/captioner');
    }

    if (this.$route.name == routeName) {
      this.$refs.modal.show();
    }
  },
  watch: {
    '$route.name': function(routeTo, routeFrom) {
      if (routeTo == routeName) {
        this.$refs.modal.show();
      } else if (routeFrom == routeName) {
        this.$refs.modal.hide();
      }
    },
  },
  methods: {
    copyToClipboard() {
      navigator?.clipboard?.writeText(this.srt).then(
        () => {
          this.copyToClipboardSuccess = true;
          setTimeout(() => {
            this.copyToClipboardSuccess = false;
          }, 1000);
        },
        (e) => {
          alert('Unable to copy to clipbaord: ' + JSON.stringify(e));
        }
      );
    },
    replaceRouteToParent(e) {
      // e.trigger is set if the user interacted with the dialog UI directly
      // to cause it to close. Only replace the state when this happens. Otherwise,
      // if e.trigger isn't set, the dialog closing is due to a route change already
      // in progress, (keyboard shortcuts, etc.) so we don't want to change the route.
      if (e.trigger) {
        this.$router.replace(this.localePath('captioner'));
      }
    },
  },
};
</script>
