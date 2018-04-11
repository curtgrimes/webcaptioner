<template>
  <div class="h-100">
    <div v-if="!transcriptExists" class="bg-primary h-100" style="position:relative">
        <div class="text-left ml-5 mt-5 pl-2" style="position:absolute;left:0;right:50%;top:0;">
            <span class="mt-4 w-50 display-4">Captioning will begin shortly.</span>
        </div>
        <div class="text-right mr-5 mb-4" style="position:absolute;left:0;right:0;bottom:0;">
            <img src="/public/logo-inverse.svg" style="max-width:15vw" />
            <h1 class="mt-4">Web Captioner</h1>
        </div>
    </div>
    <transcript></transcript>
    <data-receiver></data-receiver>
  </div>
</template>

<script>
import Transcript from '../components/Transcript.vue'
import DataReceiver from '../components/DataReceiver.vue'

export default {
  name: 'receiver-view',
  components: {
    Transcript,
    DataReceiver,
  },
  computed: {
    transcriptExists: function() {
      return this.$store.state.captioner.transcript.final.length || this.$store.state.captioner.transcript.interim.length;
    },
  },
}
</script>
