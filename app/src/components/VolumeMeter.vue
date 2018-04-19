<template>
  <div class="volumeMeter" v-if="captioningOn && (lastVolumeTooLowEventIsRecent || volumeTooLow || lastVolumeTooHighEventIsRecent || volumeTooHigh)">
    <div class="row mr-1" style="width:350px">
      <div class="col text-right mt-1">
        <span class="navbar-text text-white bg-danger px-2 small">
          <i class="fa fa-exclamation-triangle pr-1" aria-hidden="true"></i>
          <span v-if="(volumeTooLow || lastVolumeTooLowEventIsRecent) && !volumeTooHigh">Too quiet</span>
          <span v-else-if="(volumeTooHigh || lastVolumeTooHighEventIsRecent) && !volumeTooLow">Too loud</span>
        </span>
      </div>
      <div class="col pl-0">
        <div class="progress bg-light" style="margin-top:.8rem" ref="volumeBar">
          <div style="transition-duration:75ms" class="progress-bar bg-danger" role="progressbar" v-bind:style="{width: volumeBarWidth() * volumeLevel + 'px'}"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AudioStreamMeter from "audio-stream-meter";
import clamp from 'lodash.clamp'

const VOLUME_TOO_LOW_THRESHOLD = 0.25; // in the range 0 - 1
const VOLUME_TOO_HIGH_THRESHOLD = 0.92; // in the range 0 - 1

export default {
  name: "volumeMeter",
  props: [],
  data: function() {
    return {
      volumeLevel: 0,
      latestVolumeLevelReadings: [],
      lastVolumeTooLowEvent: null,
      lastVolumeTooHighEvent: null,
      now: Date.now(),

      _audioContext: null,
      _stream: null,
      _audioMeter: null,
      _dateUpdateInterval: null,
      _recordVolumeReadingsInterval: null,
    };
  },
  watch: {
    captioningOn: function(captioningOn) {
      if (captioningOn) {
        this.initAudioStream();
      }
      else {
        this.closeAudioStream();
      }
    },
    volumeTooLow: function(newValue, oldValue) {
      if (typeof newValue !== 'undefined' && newValue != oldValue) {
        this.$store.commit('captioner/VOLUME_TOO_LOW', { volumeTooLow: newValue });
      }
    },
    volumeTooHigh: function(newValue, oldValue) {
      if (typeof newValue !== 'undefined' && newValue != oldValue) {
        this.$store.commit('captioner/VOLUME_TOO_HIGH', { volumeTooHigh: newValue });
      }
    }
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
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        self._stream = stream; // save reference to stream so we can close it later

        // Get the name of the device
        const tracks = self._stream.getTracks();
        if (tracks && tracks[0] && tracks[0].label) {
          if (self.microphoneName != tracks[0].label) {
            // It has a new name
            self.microphoneName = tracks[0].label;
          }
        }

        self._audioContext = self._audioContext || new AudioContext();

        let mediaStream = self._audioContext.createMediaStreamSource(stream);
        self._audioMeter = AudioStreamMeter.audioStreamProcessor(
          self._audioContext,
          function() {
            self.volumeLevel = clamp(self._audioMeter.volume * 4, 0, 1);
          },
          {
            // https://www.npmjs.com/package/audio-stream-meter
            volumeFall: 0.85,
            bufferSize: 4096,
          },
        );
        mediaStream.connect(self._audioMeter);
      });

      this._dateUpdateInterval = setInterval(() => { this.now = Date.now(); }, 1000);
    
      this._recordVolumeReadingsInterval = setInterval(() => {
        if (this.volumeLevel && this.volumeLevel > 0) {
          this.latestVolumeLevelReadings.push(this.volumeLevel);
          this.latestVolumeLevelReadings = this.latestVolumeLevelReadings.slice(-10);
        }
      }, 300);
    },
    closeAudioStream: function() {
      // Stop audio meter
      if (this._audioMeter) {
        this._audioMeter.close();
      }
              
      // Close all the media stream tracks (should just be one)
      if (this._stream) {
        let tracks = this._stream.getTracks();
        for (let i = 0; i < tracks.length; i++) {
          tracks[i].stop();
        }
      }

      clearInterval(this._dateUpdateInterval);
      clearInterval(this._recordVolumeReadingsInterval);
    },
    averageVolumeReading: function() {
      let sum = 0;
      for(let i = 0; i < this.latestVolumeLevelReadings.length; i++) {
        sum += this.latestVolumeLevelReadings[i];
      }

      return sum / this.latestVolumeLevelReadings.length;
    },
    volumeBarWidth: function() {
      return this.$refs.volumeBar ? this.$refs.volumeBar.clientWidth : 0;
    }
  },
  computed: {
    microphoneName: {
      get () {
        return this.$store.state.captioner.microphoneName;
      },
      set (microphoneName) {
        this.$store.commit('captioner/SET_MICROPHONE_NAME', {microphoneName});
      },
    },
    captioningOn: function() {
      return this.$store.state.captioner.on;
    },
    volumeTooLow: function () {
      const volumeTooLow = this.averageVolumeReading() < VOLUME_TOO_LOW_THRESHOLD;
      if (volumeTooLow) {
        this.lastVolumeTooLowEvent = Date.now();
      }
      return volumeTooLow;
    },
    volumeTooHigh: function () {
      const volumeTooHigh = this.averageVolumeReading() > VOLUME_TOO_HIGH_THRESHOLD;
      if (volumeTooHigh) {
        this.lastVolumeTooHighEvent = Date.now();
      }
      return volumeTooHigh;
    },
    lastVolumeTooLowEventIsRecent: function () {
      // Last volume too low event was < x seconds ago
      return (this.now - this.lastVolumeTooLowEvent) < (1000 * 0.5);
    },
    lastVolumeTooHighEventIsRecent: function () {
      // Last volume too high event was < x seconds ago
      return (this.now - this.lastVolumeTooHighEvent) < (1000 * 0.5);
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
  }
};
</script>
