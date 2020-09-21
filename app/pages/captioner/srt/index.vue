<template>
  <div class="d-flex flex-grow-1">
    <transcript />
    <b-modal
      v-model="showModal"
      lazy
      size="lg"
      ref="modal"
      title="Export Closed Caption File"
      @hide="replaceRouteToParent"
      hide-footer
    >
      <div class="row">
        <div
          class="col-8 col-lg-9 my-n3 py-3"
          style="overflow: auto; max-height: calc(70vh + 4.5rem)"
        >
          <pre v-if="output" class="small">{{ output }}</pre>
          <span v-else class="text-muted small">No transcript to export</span>
        </div>
        <div class="col-4 col-lg-3 bg-white rounded-right border-left my-n3">
          <div
            class="mx-n3 px-3 pb-1 py-3"
            style="margin-bottom: 4.5rem; overflow-y: auto; max-height: 70vh"
          >
            <b-form-group label="Format" class="small mb-2">
              <b-form-radio v-model="format" name="text" value="text" size="sm"
                >Text (.txt)</b-form-radio
              >
              <b-form-radio v-model="format" name="format" value="srt" size="sm"
                >SubRip (.srt)</b-form-radio
              >
              <b-form-radio v-model="format" name="format" value="sbv" size="sm"
                >SubViewer (.sbv)</b-form-radio
              >
              <b-form-radio
                v-model="format"
                name="format"
                value="webvtt"
                size="sm"
                >WebVTT</b-form-radio
              >
              <b-form-radio
                v-model="format"
                name="format"
                value="audacity"
                size="sm"
                >Audacity Label
                <a
                  href="https://manual.audacityteam.org/man/importing_and_exporting_labels.html"
                  target="_blank"
                  ><fa icon="question-circle" /></a
              ></b-form-radio>
              <b-form-radio
                v-model="format"
                name="format"
                value="json"
                size="sm"
                >JSON (Word timings)</b-form-radio
              >
            </b-form-group>
            <hr class="py-1" />
            <b-button
              @click="showOptions = !showOptions"
              :disabled="!enableOptions"
              variant="light"
              size="sm"
              class="contains-chevron"
              :class="{ showing: showOptions }"
            >
              <fa icon="chevron-down" fixed-width />
              Options
            </b-button>
            <transition name="fade-in">
              <div v-if="showOptions" class="pt-3 mb-n1">
                <b-form-group
                  label="Maximum group size"
                  class="small"
                  v-if="!['audacity', 'json'].includes(format)"
                >
                  <b-input-group append="lines" size="sm">
                    <b-form-input
                      v-model="linesPerGroup"
                      type="number"
                      trim
                      size="sm"
                      min="1"
                      oninput="validity.valid||(value='');"
                    ></b-form-input>
                  </b-input-group>
                </b-form-group>

                <b-form-group
                  label="Maximum line length"
                  class="small"
                  v-if="!['json'].includes(format)"
                >
                  <b-input-group append="chars." size="sm">
                    <b-form-input
                      v-model="maxLineLengthCharacters"
                      type="number"
                      trim
                      size="sm"
                      min="1"
                      oninput="validity.valid||(value='');"
                    ></b-form-input>
                  </b-input-group>
                </b-form-group>

                <b-form-group
                  label="Start new group after pause in speech"
                  class="small"
                  v-if="!['json'].includes(format)"
                >
                  <b-input-group append="secs." size="sm">
                    <b-form-input
                      v-model="newGroupAfterPauseSeconds"
                      type="number"
                      trim
                      size="sm"
                      min="0.5"
                      step="0.1"
                      oninput="validity.valid||(value='');"
                    ></b-form-input>
                  </b-input-group>
                </b-form-group>
                <b-button
                  variant="link"
                  class="text-secondary p-0 small mt-n2"
                  size="sm"
                  v-if="!settingsAreDefaults"
                  @click="resetToDefaults()"
                  >Reset to defaults</b-button
                >
              </div>
            </transition>
          </div>
          <div
            class="p-3 d-flex bg-light border-top rounded-right"
            style="
              height: 4.5rem;
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
            "
          >
            <b-button
              variant="secondary"
              @click="saveFile()"
              class="w-100 mr-1"
              :disabled="!this.output"
              >Export</b-button
            >
            <b-button
              size="sm"
              variant="outline-dark"
              class="ml-auto"
              @click="copyToClipboard()"
              :disabled="copyToClipboardSuccess || !this.output"
              v-b-tooltip.hover.top="
                copyToClipboardSuccess ? 'Copied!' : 'Copy to clipboard'
              "
            >
              <fa icon="check" v-if="copyToClipboardSuccess" fixed-width />
              <fa icon="copy" v-else fixed-width />
            </b-button>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import transcript from '~/components/Transcript.vue';
import { format as formatDate } from 'date-fns';

const routeName = 'save-to-file';
const defaults = {
  maxLineLengthCharacters: 42,
  linesPerGroup: 2,
  newGroupAfterPauseSeconds: 2,
};

export default {
  components: {
    transcript,
  },
  data: function () {
    return {
      showModal: true,
      copyToClipboardSuccess: false,
      maxLineLengthCharacters: defaults.maxLineLengthCharacters,
      linesPerGroup: defaults.linesPerGroup,
      newGroupAfterPauseSeconds: defaults.newGroupAfterPauseSeconds,
      format: 'text',
      showOptions: false,
      enableOptions: true,

      showLineLengthGuide: false,
    };
  },
  computed: {
    settingsAreDefaults() {
      return (
        this.maxLineLengthCharacters == defaults.maxLineLengthCharacters &&
        this.linesPerGroup == defaults.linesPerGroup &&
        this.newGroupAfterPauseSeconds == defaults.newGroupAfterPauseSeconds
      );
    },
    stabilizedTranscript() {
      return this.$store.state.captioner.transcript.stabilizedWithTimings;
    },
    output() {
      if (!this.stabilizedTranscript.length) {
        return '';
      }

      if (this.format === 'json') {
        return JSON.stringify(this.stabilizedTranscript, null, 4);
      }

      if (this.format === 'text') {
        return (
          this.getCaptionFileHeader() +
          this.stabilizedTranscript.map((t) => t.text).join(' ')
        );
      }

      const linesPerGroup = this.format === 'audacity' ? 1 : this.linesPerGroup;
      let thisLineGroup = [];
      let lineGroups = [];

      for (let i = 0; i < this.stabilizedTranscript.length; i++) {
        const wordToAdd = this.stabilizedTranscript[i];

        // Decide whether to start a new line group or not
        if (
          // There hasn't been too much time since the last word
          // There is a previous item
          !this.stabilizedTranscript[i - 1] ||
          // It happened less than newGroupAfterPauseSeconds before the current item
          this.stabilizedTranscript[i].time -
            this.stabilizedTranscript[i - 1].time <=
            this.newGroupAfterPauseSeconds * 1000
        ) {
          // Don't start a new line group (for now)

          // Put this on the first line in thisLineGroup that won't
          // cause that line to exceed maxLineLengthCharacters
          for (let j = 0; j <= thisLineGroup.length; j++) {
            if (!thisLineGroup[j] && j < linesPerGroup) {
              // This line needs to be initialized
              thisLineGroup[j] = [];
            }

            if (j >= linesPerGroup) {
              // This won't fit in the current line group. Finish up the current line group.
              lineGroups.push(thisLineGroup);

              // Start a new line group and add this text to it.
              thisLineGroup = [[wordToAdd]];
              break;
            }

            if (
              (thisLineGroup[j]?.map((word) => word.text).join().length || 0) +
                (wordToAdd.text.length + 1) <=
              this.maxLineLengthCharacters
            ) {
              // +1 for space
              // It fits on the jth line. Add it.
              thisLineGroup[j].push(wordToAdd);
              break;
            }
          }
        } else {
          // Start a new line group
          lineGroups.push(thisLineGroup);
          thisLineGroup = [];

          // Now add this text to the new line group
          thisLineGroup.push([]);
          thisLineGroup[0].push(wordToAdd);
        }
      }

      // We've gone through all the words, but the last line group
      // isn't pushed yet. Do one final push.

      if (thisLineGroup.length) {
        // One final push
        lineGroups.push(thisLineGroup);
      }

      function getLastWord(lineGroup) {
        const lastLine = lineGroup[lineGroup.length - 1];
        return lastLine[lastLine.length - 1];
      }

      const getDurationString = (ms) => {
        // Given a count of milliseconds, get the duration back in the format
        // HH:MM:SS,mmm
        const secondDuration = 1000;
        const minuteDuration = secondDuration * 60;
        const hourDuration = minuteDuration * 60;

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
          (this.format === 'srt' ? ',' : '.') +
          zeroPadded(milliseconds, 3)
        );
      };

      let srtStartTime;
      let output = '';
      for (let i = 0; i < lineGroups.length; i++) {
        const currentLineGroup = lineGroups[i];
        const nextLineGroup = lineGroups[i + 1];
        const startTime = currentLineGroup[0][0].time;
        const endTime = getLastWord(currentLineGroup).time;

        if (!srtStartTime) {
          // This is the first pairing
          srtStartTime = startTime;
        }

        if (startTime === endTime) {
          // This line pair has the same start and end time.
          // Adjust the end time to be closer to the next line pair, or
          // if that's too far into the future, estimate each word is a small
          // amount of time and adjust the endTime that amount into the future.

          const nextLineGroupStartTime = nextLineGroup?.[0]?.time;

          // Estimate a short period of time for each word in this group
          const countOfWordsInCurrentGroup = currentLineGroup.reduce(
            (accumulator, line) => {
              return (accumulator || 0) + line.length;
            },
            0
          );

          const maxEstimatedDurationForThisLineGroup =
            countOfWordsInCurrentGroup * 1000;

          if (
            !nextLineGroupStartTime || // We are at the end
            nextLineGroupStartTime - endTime >
              maxEstimatedDurationForThisLineGroup // The next pair start time exceeds the estimated length
          ) {
            // Add the estimated duration instead of using the next group's duration
            // (which doesn't exist or is too far into the future)
            endTime = startTime + maxEstimatedDurationForThisLineGroup;
          } else {
            // Next line pair starts sooner than estimate. Use that
            // start time minus a MS so times don't overlap.
            endTime = nextLineGroupStartTime - 1;
          }
        }

        if (i === 0) {
          // First iteration
          output += this.getCaptionFileHeader();
        }

        if (this.format === 'srt') {
          // SRT gets a sequence number
          output += i + 1 + '\n';
        }

        if (this.format === 'audacity') {
          // No concept of line groups in Audacity files.
          // The whole group gets printed on one line.
          const startSeconds = (startTime - srtStartTime) / 1000;
          const endSeconds = (endTime - srtStartTime) / 1000;
          output += startSeconds + '\t' + endSeconds + '\t';

          output += lineGroups[i]
            .map((lineGroup) => lineGroup.map((t) => t.text).join(' '))
            .join(' ');

          output += '\n';
        } else {
          const startTimestampString = getDurationString(
            startTime - srtStartTime
          );
          const endTimestampString = getDurationString(endTime - srtStartTime);
          const joiner = this.format === 'sbv' ? ',' : ' --> ';

          output += startTimestampString + joiner + endTimestampString;
          lineGroups[i].forEach((lineGroup) => {
            const text = lineGroup.map((t) => t.text).join(' ');
            if (text.length) {
              output += `\n${text}`;
            }
          });
          output += '\n\n';
        }
      }
      return output;
    },
  },
  mounted: function () {
    if (!this.$store.state.settings.exp.includes('srt')) {
      this.$router.replace('/captioner');
    }

    if (this.$route.name == routeName) {
      this.$refs.modal.show();
    }
  },
  watch: {
    '$route.name': function (routeTo, routeFrom) {
      if (routeTo == routeName) {
        this.$refs.modal.show();
      } else if (routeFrom == routeName) {
        this.$refs.modal.hide();
      }
    },
    format: {
      immediate: true,
      handler() {
        switch (this.format) {
          case 'text':
          case 'json':
            // These formats don't have any options
            this.showOptions = false;
            this.enableOptions = false;
            break;
          default:
            this.enableOptions = true;
        }
      },
    },
  },
  methods: {
    resetToDefaults() {
      this.maxLineLengthCharacters = defaults.maxLineLengthCharacters;
      this.linesPerGroup = defaults.linesPerGroup;
      this.newGroupAfterPauseSeconds = defaults.newGroupAfterPauseSeconds;
    },
    copyToClipboard() {
      navigator?.clipboard?.writeText(this.output).then(
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
    getFileExtension() {
      switch (this.format) {
        case 'srt':
          return 'srt';
        case 'sbv':
          return 'sbv';
        case 'webvtt':
          return 'vtt';
        case 'text':
        case 'audacity':
          return 'txt';
        case 'json':
          return 'json';
      }
    },
    getFileType() {
      switch (this.format) {
        case 'srt':
          return 'text/srt';
        case 'sbv':
          return 'text/sbv';
        case 'webvtt':
          return 'text/vtt';
        case 'txt':
        case 'audacity':
          return 'text/plain';
        case 'json':
          return 'application/json';
      }
    },
    getCaptionFileHeader() {
      switch (this.format) {
        case 'srt':
          return ``;
        case 'sbv':
          return ``;
        case 'text':
          return `Transcript generated by Web Captioner
on ${formatDate(new Date(), 'PPpp')}
https://webcaptioner.com\n\n`;
        case 'webvtt':
          return `WEBVTT Kind: captions${
            this.$store.state?.settings?.locale?.from
              ? `; Language: ${this.$store.state.settings.locale.from}`
              : ``
          }

NOTE
Transcript generated by Web Captioner
on ${formatDate(new Date(), 'PPpp')}
https://webcaptioner.com\n\n`;
        default:
          return ``;
      }
    },
    saveFile() {
      const file = new Blob([this.output], {
        type: this.getFileType(),
      });
      console.log(file);
      const a = document.createElement('a');
      const url = URL.createObjectURL(file);
      const filename = `web-captioner-${formatDate(
        new Date(),
        'yyyy-MM-dd-HH-mm-ss'
      )}.${this.getFileExtension()}`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      console.log(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
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

<style lang="scss" scoped>
.contains-chevron .fa-chevron-down {
  transition: transform 0.3s;
}

.contains-chevron.showing .fa-chevron-down {
  transform: rotate(180deg) translateY(0.05rem);
}
</style>