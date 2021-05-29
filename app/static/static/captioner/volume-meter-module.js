registerProcessor(
  'volume-meter',
  class extends AudioWorkletProcessor {
    constructor() {
      super();
      this.volume = 0;
      this.updateIntervalMs = 100;
      this.nextUpdateFrame = this.updateIntervalMs;

      this.smoothingFactor = 0.92;
      this.amplifyFactor = 3.5;

      this.intervalInFrames = (this.updateIntervalMs / 1000) * sampleRate;
    }

    process(inputs) {
      const input = inputs[0];

      // Note that the input will be down-mixed to mono; however, if no inputs are
      // connected then zero channels will be passed in.
      if (!input.length) {
        return;
      }

      const samples = input[0];

      if (!samples.length) {
        return true;
      }

      this.nextUpdateFrame -= samples.length;

      if (this.nextUpdateFrame >= 0) {
        // Not ready to update yet
        return true;
      }

      this.nextUpdateFrame += this.intervalInFrames;

      let sum = 0;

      for (let i = 0; i < samples.length; ++i) {
        sum += samples[i] * samples[i];
      }

      let rms = Math.sqrt(sum / samples.length);

      this.volume = Math.max(
        Math.min(1, rms * this.amplifyFactor),
        this.volume * this.smoothingFactor // have it gradually fall down after a peak
      );

      this.port.postMessage(this.volume);
      return true;
    }
  }
);
