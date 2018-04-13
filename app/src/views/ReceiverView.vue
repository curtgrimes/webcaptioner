<template>
  <div class="h-100">
    <data-receiver v-if="loopVideoLoaded"></data-receiver>
    <div v-if="!transcriptExists" class="bg-primary h-100">
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
    <div v-if="transcriptExists">
        <transcript></transcript>
        <nav class="navbar fixed-bottom navbar-expand" style="padding:0.5vw 2vw;background:rgba(0,0,0,.2)">
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
import DataReceiver from "../components/DataReceiver.vue";

let videoCache = [];

export default {
  name: "receiver-view",
  components: {
    Transcript,
    DataReceiver
  },
  data: function() {
      return {
          loopVideoLoaded: false,
      };
  },
  mounted: function() {
    let self = this;
    this.$refs.loopVideo.addEventListener("play", function() {
        self.loopVideoLoaded = true;
    }, false);
  },
  computed: {
    transcriptExists: function() {
      return (
        this.$store.state.captioner.transcript.final.length > 0 ||
        this.$store.state.captioner.transcript.interim.length > 0
      );
    },
  }
};
</script>
