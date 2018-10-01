<template>
  <div class="d-flex w-100 flex-column" style="height: 100vh;">
    <div v-if="transcriptExists" class="d-flex flex-grow-1">
      <transcript show-typed-live-read-only></transcript>
    </div>
    <nav v-if="transcriptExists" class="navbar navbar-expand" style="padding:0.5vw 2vw;background:rgba(0,0,0,.2)">
        <span class="navbar-brand mr-auto text-white" style="opacity:.6">
            <img src="/static/img/logo.svg" width="17" height="17" class="d-inline-block" style="position:relative;top:-1px;margin-right:10px" alt="Web Captioner" />
            <span class="d-none d-md-inline">Web Captioner</span>
        </span>
    </nav>
    <receiver-splash  v-if="!transcriptExists" />
  </div>
</template>


<script>
import transcript from '~/components/Transcript.vue'
import navbar from '~/components/Navbar.vue'

export default {
  components: {
    transcript,
    navbar,
  },
  mounted: function () {
      if (this.socketConnected) {
          this.initSubscription();
      }
  },
  methods: {
    initSubscription: function() {
        let {roomId} = this.$route.params;

        if (roomId) {
            this.$socket.sendObj({
                action: 'subscribeToRoom',
                roomId,
            });
        }
    },
  },
  computed: {
    socketConnected: function() {
      return this.$store.state.socket.isConnected;
    },
    transcriptExists: function() {
        return this.$store.state.captioner.transcript.final || this.$store.state.captioner.transcript.interim || this.$store.state.captioner.transcript.typed;
    },
  },
  watch: {
      socketConnected: function() {
          this.initSubscription;
      },
  }
}
</script>