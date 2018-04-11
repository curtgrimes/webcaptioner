<template>
  <div class="h-100">
    <div v-if="!transcriptExists" class="h-100 bg-primary bg-zigzag d-flex align-items-center">
        <div class="h-50 w-100 bg-primary">
            <div class="container h-100 fade show">
                <div class="row d-flex align-items-center h-100 mb-5">
                    <div class="col-5 mx-auto text-center">
                        <img src="/public/logo-inverse.svg" class="w-50" />
                        <h1 class="mt-4">Web Captioner</h1>
                    </div>
                </div>
            </div>
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
