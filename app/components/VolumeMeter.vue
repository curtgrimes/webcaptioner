<template>
  <div
    v-if="$store.state.settings.controls.volumeMeter.show && captioningOn && (lastVolumeTooLowEventIsRecent || volumeTooLow || lastVolumeTooHighEventIsRecent || volumeTooHigh)"
  >
    <b-button variant="white" class="meter-outer mr-2 border-0 text-left text-danger px-2 bg-white">
      <fa icon="exclamation-triangle" class="mr-1" />
      <span
        v-if="(volumeTooLow || lastVolumeTooLowEventIsRecent) && !volumeTooHigh"
      >{{$t('captioner.volumeMeter.tooQuiet')}}</span>
      <span
        v-else-if="(volumeTooHigh || lastVolumeTooHighEventIsRecent) && !volumeTooLow"
      >{{$t('captioner.volumeMeter.tooLoud')}}</span>
      <b-button
        variant="danger"
        class="meter-inner border-0 px-0 text-left rounded-0"
        v-bind:style="{width: (volumeLevel * 100) + '%'}"
      >
        <span class="px-2">
          <fa icon="exclamation-triangle" class="mr-1" />
          <span
            v-if="(volumeTooLow || lastVolumeTooLowEventIsRecent) && !volumeTooHigh"
          >{{$t('captioner.volumeMeter.tooQuiet')}}</span>
          <span
            v-else-if="(volumeTooHigh || lastVolumeTooHighEventIsRecent) && !volumeTooLow"
          >{{$t('captioner.volumeMeter.tooLoud')}}</span>
        </span>
      </b-button>
    </b-button>
  </div>
</template>

<style scoped>
.meter-outer {
  width: 150px;
  position: relative;
  overflow: hidden;
  cursor: default !important;
}

.meter-inner {
  width: 20px;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  transition: width 100ms;
  cursor: default !important;
}
</style>


<script>
import AudioStreamMeter from 'audio-stream-meter';
import clamp from 'lodash.clamp';
import { BButton } from 'bootstrap-vue';

export default {
  components: {
    BButton,
  },
  props: [],
  data: function() {
    return {
      volumeLevel: 0,
      latestVolumeLevelReadings: [],
      lastVolumeTooLowEvent: null,
      lastVolumeTooHighEvent: null,
      now: Date.now(),

      audioContext: null,
      stream: null,
      audioMeter: null,
      dateUpdateInterval: null,
      recordVolumeReadingsInterval: null,
    };
  },
  watch: {
    captioningOn: function(captioningOn) {
      if (captioningOn) {
        this.initAudioStream();
      } else {
        this.closeAudioStream();
      }
    },
    volumeTooLow: function(newValue, oldValue) {
      if (typeof newValue !== 'undefined' && newValue != oldValue) {
        this.$store.commit('captioner/VOLUME_TOO_LOW', {
          volumeTooLow: newValue,
        });
      }

      if (newValue) {
        this.lastVolumeTooLowEvent = Date.now();
      }
    },
    volumeTooHigh: function(newValue, oldValue) {
      if (typeof newValue !== 'undefined' && newValue != oldValue) {
        this.$store.commit('captioner/VOLUME_TOO_HIGH', {
          volumeTooHigh: newValue,
        });
      }
      if (newValue) {
        this.lastVolumeTooHighEvent = Date.now();
      }
    },
  },
  beforeMount: function() {
    if (this.captioningOn) {
      this.initAudioStream();
    }
  },
  beforeDestroy: function() {
    this.closeAudioStream();
  },
  methods: {
    initAudioStream: function() {
      let self = this;

      let constraints = {
        audio: {
          autoGainControl: false,
        },
      };

      let streamHandler = function(stream) {
        self.stream = stream; // save reference to stream so we can close it later

        // Get the name of the device
        const tracks = self.stream.getTracks();
        if (tracks && tracks[0] && tracks[0].label) {
          if (self.microphoneName != tracks[0].label) {
            // It has a new name
            self.microphoneName = tracks[0].label;
          }
        }

        self.audioContext = self.audioContext || new AudioContext();

        let mediaStream = self.audioContext.createMediaStreamSource(stream);
        self.audioMeter = AudioStreamMeter.audioStreamProcessor(
          self.audioContext,
          function() {
            self.volumeLevel = clamp(self.audioMeter.volume * 4, 0, 1);
          },
          {
            // https://www.npmjs.com/package/audio-stream-meter
            volumeFall: 0.85,
            bufferSize: 4096,
          }
        );
        mediaStream.connect(self.audioMeter);
      };

      if (typeof navigator.mediaDevices.getUserMedia === 'function') {
        // Use the current promise-based version of getUserMedia.
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        navigator.mediaDevices.getUserMedia(constraints).then(streamHandler);
      } else {
        // Use the deprecated version of getUserMedia that was a property of navigator
        // and uses a callback function.
        // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia

        // It was also prefixed.
        navigator.getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;

        navigator.getUserMedia(constraints, streamHandler, () => {});
      }

      this.dateUpdateInterval = setInterval(() => {
        this.now = Date.now();
      }, 1000);

      this.recordVolumeReadingsInterval = setInterval(() => {
        if (this.volumeLevel && this.volumeLevel > 0) {
          this.latestVolumeLevelReadings.push(this.volumeLevel);
          this.latestVolumeLevelReadings = this.latestVolumeLevelReadings.slice(
            -10
          );
        }
      }, 300);
    },
    closeAudioStream: function() {
      clearInterval(this.dateUpdateInterval);
      clearInterval(this.recordVolumeReadingsInterval);

      // Stop audio meter
      if (this.audioMeter) {
        this.audioMeter.close();
      }

      // Close all the media stream tracks (should just be one)
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
      }
    },
    averageVolumeReading: function() {
      let sum = 0;
      for (let i = 0; i < this.latestVolumeLevelReadings.length; i++) {
        sum += this.latestVolumeLevelReadings[i];
      }

      return sum / this.latestVolumeLevelReadings.length;
    },
  },
  computed: {
    microphoneName: {
      get() {
        return this.$store.state.captioner.microphoneName;
      },
      set(microphoneName) {
        this.$store.commit('captioner/SET_MICROPHONE_NAME', { microphoneName });
      },
    },
    captioningOn: function() {
      return this.$store.state.captioner.on;
    },
    volumeTooLow: function() {
      let volumeTooLowThreshold =
        this.$store.state.settings.controls.volumeMeter.sensitivity === 'high'
          ? 0.25 // high sensitivity setting
          : 0.05; // low sensitivity setting
      return this.averageVolumeReading() < volumeTooLowThreshold;
    },
    volumeTooHigh: function() {
      let volumeTooHighThreshold =
        this.$store.state.settings.controls.volumeMeter.sensitivity === 'high'
          ? 0.92 // high sensitivity setting
          : 0.98; // low sensitivity setting
      return this.averageVolumeReading() > volumeTooHighThreshold;
    },
    lastVolumeTooLowEventIsRecent: function() {
      // Last volume too low event was < x seconds ago
      return this.now - this.lastVolumeTooLowEvent < 1000 * 0.5;
    },
    lastVolumeTooHighEventIsRecent: function() {
      // Last volume too high event was < x seconds ago
      return this.now - this.lastVolumeTooHighEvent < 1000 * 0.5;
    },
    // backgroundColor () {
    //   return this.$store.state.settings.appearance.background.color;
    // },
    // finalTranscript () {
    //   this.scrollToBottom();
    //   return this.$store.state.captioner.transcript.final;
    // },
    // interimTranscript () {
    //   this.scrollToBottom();
    //   return ' ' + this.$store.state.captioner.transcript.interim;
    // },
  },
};
</script>
