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
import {clamp} from 'lodash/lodash.js'

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

      _stream: null,
      _audioMeter: null,
    };
  },
  created: function() {
    setInterval(() => { this.now = Date.now(); }, 1000);

    setInterval(() => {
      if (this.volumeLevel && this.volumeLevel > 0) {
        this.latestVolumeLevelReadings.push(this.volumeLevel);
        this.latestVolumeLevelReadings = this.latestVolumeLevelReadings.slice(-10);
      }
    }, 300);

    this.$watch("captioningOn", function(captioningOn) {
      if (captioningOn) {
        let self = this;
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
          self._stream = stream; // save reference to stream so we can close it later

          let audioContext = new AudioContext();
          let mediaStream = audioContext.createMediaStreamSource(stream);
          self._audioMeter = AudioStreamMeter.audioStreamProcessor(
            audioContext,
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
      }
      else {
        // Stop audio meter
        this._audioMeter.close();
        
        // Close all the media stream tracks (should just be one)
        let tracks = this._stream.getTracks();
        for (let i = 0; i < tracks.length; i++) {
          tracks[i].stop();
        }
      }
    });

    this.$watch("volumeTooLow", function(newValue, oldValue) {
      if (typeof newValue !== 'undefined' && newValue != oldValue) {
        this.$store.commit('captioner/VOLUME_TOO_LOW', { volumeTooLow: newValue });
      }
    });

    this.$watch("volumeTooHigh", function(newValue, oldValue) {
      if (typeof newValue !== 'undefined' && newValue != oldValue) {
        this.$store.commit('captioner/VOLUME_TOO_HIGH', { volumeTooHigh: newValue });
      }
    });
  },
  methods: {
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
    captioningOn: function() {
      return this.$store.state.captioner.on;
    },
    volumeTooLow: function () {
      const volumeTooLow = this.averageVolumeReading() < 0.1;
      if (volumeTooLow) {
        this.lastVolumeTooLowEvent = Date.now();
      }
      return volumeTooLow;
    },
    volumeTooHigh: function () {
      const volumeTooHigh = this.averageVolumeReading() > 0.85;
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
