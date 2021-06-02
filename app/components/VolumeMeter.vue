<template>
  <transition name="fade">
    <div v-if="showMessage" class="d-flex align-items-center text-white small">
      <span v-if="volumeTooLow">Too quiet</span>
      <span v-else-if="volumeTooHigh">Too loud</span>
      <span v-else>
        <fa icon="check-circle" class="text-success" /> Good volume
      </span>

      <button
        v-if="volumeTooLow || volumeTooHigh"
        @click="openArticle"
        class="btn btn-link text-white btn-sm p-1"
        v-b-tooltip.hover
        title="Help"
      >
        <fa icon="question-circle" />
      </button>
      <div class="volume-meter">
        <div
          class="unit"
          v-for="unitVolume in [0.9, 0.8, 0.3, 0.05, 0.01]"
          :key="unitVolume"
          :class="{ active: volume >= unitVolume }"
        ></div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.volume-meter {
  height: 100%;
  margin: 0 0.5rem;
  width: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .unit {
    background-color: rgba(255, 255, 255, 0.1);
    height: 16%;
    width: 100%;

    transition: background-color 100ms;

    &.active {
      &:nth-child(1) {
        background-color: rgb(194, 23, 23);
      }

      &:nth-child(2) {
        background-color: rgb(189, 138, 0);
      }

      &:nth-child(3) {
        background-color: rgb(60, 167, 46);
      }

      &:nth-child(4) {
        background-color: rgb(60, 167, 46);
      }

      &:nth-child(5) {
        background-color: rgb(60, 167, 46);
      }
    }
  }
}
</style>

<script>
// https://stackoverflow.com/a/62732195/1253034

let stream;
let audioContext;
let node;

export default {
  data: function() {
    return {
      volume: 0,

      messageWarmupPeriod: 0,
      messageCooldownPeriod: 0,
    };
  },
  watch: {
    '$store.state.captioner.shouldBeOn'() {
      if (this.$store.state.captioner.shouldBeOn) {
        this.initAudioStream();
      } else {
        this.stopAudioStream();
      }
    },
    '$store.state.captioner.transcript.waitingForInitial'() {
      if (!this.$store.state.captioner.transcript.waitingForInitial) {
        // We just received our first transcript after starting captioning.
        // If the meter would have shown due to a cooldown period at this
        // moment, force the cooldown period to zero to prevent the volume
        // meter possibly showing unnecessarily at this moment.
        this.messageCooldownPeriod = 0;
      }
    },
    volumeTooHighOrLow() {
      if (this.volumeTooHighOrLow) {
        if (this.messageCooldownPeriod > 0) {
          // We are already in a cooldown period, so the message is showing.
          // Don't do a warmup period.
        } else {
          // Start the warmup period. If the volume is still too high/low
          // at the end of the warmup period, then the message will show.
          this.messageWarmupPeriod = 7;
        }
      } else {
        /* Volume is no longer too high or low, but we want to continue
        to show the message for a short period of time so it doesn't disappear
        without the user being able to see it. */

        /* Cooldown period depends on sample rate in volume-meter-module.
        This gets decremented each sample after a volume high/low event.
        Avoid doing this with timeouts/intervals for performance and 
        to prevent browser from throttling this. */
        this.messageCooldownPeriod = 30;
      }
    },
  },
  beforeMount: function() {
    if (this.$store.state.captioner.shouldBeOn) {
      this.initAudioStream();
    }
  },
  beforeDestroy: function() {
    this.stopAudioStream();
  },
  methods: {
    async initAudioStream() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            autoGainControl: false,
          },
        });

        // Get the name of the device
        this.$store.commit('captioner/SET_MICROPHONE_NAME', {
          microphoneName: stream?.getTracks()?.[0].label,
        });

        audioContext = new AudioContext();

        if (!audioContext) {
          // We can't continue
          return;
        }

        try {
          await audioContext.audioWorklet.addModule(
            '/static/captioner/volume-meter-module.js'
          );
        } catch (e) {
          // We can't continue
          return;
        }

        let microphone = audioContext.createMediaStreamSource(stream);
        node = new AudioWorkletNode(audioContext, 'volume-meter');

        node.port.onmessage = ({ data: volume }) => {
          this.volume = volume;
          if (this.messageCooldownPeriod > 0) {
            this.messageCooldownPeriod -= 1;
          }
          if (this.messageWarmupPeriod > 0) {
            this.messageWarmupPeriod -= 1;
            this.messageCooldownPeriod = 0;
          }
        };

        microphone.connect(node).connect(audioContext.destination);
      } catch (e) {
        if (e.name === 'NotAllowedError') {
          // User denied microphone access
          return;
        }

        if (e.name === 'NotFoundError') {
          // User doesn't have a microphone
          return;
        }

        if (e.name === 'NotReadableError') {
          // Could not start audio source for some reason
          return;
        }

        // Some other error happened that we may want to log
        throw e;
      }
    },
    stopAudioStream() {
      node?.disconnect();
      node = null;
      audioContext?.close();
      audioContext = null;
      stream?.getTracks().forEach((track) => track.stop());
    },
    openArticle() {
      window.Beacon('article', '5f4af585042863444aa0ff88');
    },
  },
  computed: {
    showMessage() {
      return (
        this.$store.state.settings.controls.volumeMeter.show &&
        this.$store.state.captioner.shouldBeOn &&
        !this.$store.state.captioner.transcript.waitingForInitial &&
        this.messageWarmupPeriod <= 0 &&
        (this.volumeTooHighOrLow || this.messageCooldownPeriod > 0)
      );
    },
    volumeTooHighOrLow() {
      return this.volumeTooLow || this.volumeTooHigh;
    },
    volumeTooLow: function() {
      const volumeTooLowThreshold =
        this.$store.state.settings.controls.volumeMeter.sensitivity === 'high'
          ? 0.2 // high sensitivity setting
          : 0.05; // low sensitivity setting
      return this.volume < volumeTooLowThreshold;
    },
    volumeTooHigh: function() {
      // high threshold doesn't respond to sensitivity setting
      // because volume-meter-module is basically clipping it at 1.
      // So it's possible there are values above 1, but anothing already above
      // 1 is probably too loud.
      const volumeTooHighThreshold = 0.95;
      return this.volume > volumeTooHighThreshold;
    },
  },
};
</script>
