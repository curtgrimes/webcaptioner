<template>
  <div class="h-100">
    <data-receiver></data-receiver>
    <div v-if="!transcriptExists" class="bg-primary h-100" style="position:relative">
        <div class="text-left ml-5 mt-5 pl-2" style="position:absolute;left:0;right:50%;top:0;">
            <span class="mt-4 w-50 display-4">Captioning will begin shortly. {{message}}</span>
        </div>
        <div class="text-right mr-5 mb-4" style="position:absolute;left:0;right:0;bottom:15px;">
            <span class="h2" style="font-size:1.6rem">
                <img src="/public/logo-inverse.svg" class="d-inline-block" style="height:2rem;width:2rem;position:relative;top:-0.1rem" />
                Web Captioner
            </span>
        </div>
    </div>
    <transcript></transcript>
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
