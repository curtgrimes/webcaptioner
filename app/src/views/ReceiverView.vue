<template>
  <div class="h-100">
    <cast-receiver v-if="chromecastReceiver"></cast-receiver>
    <chromeless-receiver v-if="chromelessReceiver"></chromeless-receiver>
    <div v-if="!transcriptExists && !recentlyHadCaptions" class="bg-primary h-100">
        <div style="z-index:5;position:absolute;left:0;right:0;top:0;bottom:0">
            <div class="display-3 w-auto" style="font-size:10vh;position:absolute;left:7vw;top:10vh;width:41vw">
                Captioning will<br class="d-none d-lg-block" /> begin shortly. 
            </div>
            <div v-bind:class="{show: loopVideoLoaded}" class="fade d-none d-sm-block" style="position:absolute;right:7vw;bottom:10vh;width:43vw;height:65vh;">
                <video ref="loopVideo" src="/public/cast-loop.mp4" loop preload autoplay type="video/mp4" class="float-right mw-100 mh-100" style="position:absolute;bottom:0;box-shadow: 0 2px 57px rgba(0, 0, 0, 0.3);"></video>
            </div>
            <div class="h-25 d-flex align-items-center " style="position:absolute;left:7vw;right:0;bottom:0">
                <div class="h2" style="font-size:5vh;opacity:.8">
                    <img src="/public/logo-inverse.svg" class="d-inline-block" style="height:6vh;width:6vh" />
                    <span style="position:relative;top:0.5vh;left:2vh">Web Captioner</span>
                </div>
            </div>
        </div>
        <div class="h-25 bg-primary bg-zigzag" style="z-index:4;position:absolute;left:0;right:0;bottom:0"></div>
    </div>
    <div v-else>
        <transcript :chromeless="chromelessReceiver"></transcript>
        <nav v-if="!chromelessReceiver" class="navbar fixed-bottom navbar-expand" style="padding:0.5vw 2vw;background:rgba(0,0,0,.2)">
            <span class="navbar-brand mr-auto text-white" style="opacity:.6">
                <img src="/public/logo.svg" width="17" height="17" class="d-inline-block" style="position:relative;top:-1px;margin-right:10px" alt="Web Captioner" />
                <span class="d-none d-md-inline">Web Captioner</span>
            </span>
        </nav>
    </div>
  </div>
</template>

<style scoped>
</style>



<script>
import Transcript from "../components/Transcript.vue";
import CastReceiver from "../components/CastReceiver.vue";
import ChromelessReceiver from "../components/ChromelessReceiver.vue";

export default {
  name: "receiver-view",
  components: {
    Transcript,
    CastReceiver,
    ChromelessReceiver,
  },
  data: function() {
      return {
          loopVideoLoaded: false,
          now: Date.now(),
          transcriptLastUpdated: 'b',
      };
  },
  mounted: function() {
    this._dateUpdateInterval = setInterval(() => { this.now = Date.now(); }, 250);

    this.$watch('transcriptExists', function(transcriptExists) {
        this.initVideo();
    });

    this.$watch('transcript', function() {
        this.transcriptLastUpdated = Date.now();
    });

    this.$watch('recentlyHadCaptions', function() {
        this.initVideo();
    });
  },
  methods: {
      initVideo: function() {
        if (this.$refs.loopVideo) {
            let self = this;
            this.$refs.loopVideo.addEventListener("play", function() {
                self.loopVideoLoaded = true;
            }, false);
            this.$refs.loopVideo.play();
        }
      },
  },
  computed: {
    transcript: function() {
        return this.$store.state.captioner.transcript.final + this.$store.state.captioner.transcript.interim;
    },
    transcriptExists: function() {
        return this.$store.state.captioner.transcript.final.length > 0 ||
            this.$store.state.captioner.transcript.interim.length > 0;
    },
    recentlyHadCaptions: function() {
        return this.now - this.transcriptLastUpdated < (5 * 1000);
    },
    chromelessReceiver: function() {
        return this.$route.name === 'receiver-chromeless';
    },
    chromecastReceiver: function() {
        return this.$route.name === 'receiver-chromecast';
    },
  }
};
</script>
