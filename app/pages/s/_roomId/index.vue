<template>
    <div class="d-flex w-100 flex-column" style="height: 100vh;">
        <div v-if="showTranscript" class="d-flex flex-grow-1">
            <backlink :roomId="$route.params.roomId"/>
            <transcript show-typed-live-read-only />
        </div>
        <nav v-if="showTranscript" class="navbar navbar-expand" style="padding:0.5vw 2vw;background:rgba(0,0,0,.2)">
            <span class="navbar-brand mr-auto text-white" style="opacity:.6">
                <img src="/static/img/logo.svg" width="17" height="17" class="d-inline-block" style="position:relative;top:-1px;margin-right:10px" alt="Web Captioner" />
                <span class="d-none d-md-inline">Web Captioner</span>
            </span>
            <b-button-group>
                <b-btn variant="primary" class="px-4" @click="decreaseTextSize()" v-b-tooltip.hover title="Smaller"><fa icon="minus" /></b-btn>
                <b-btn variant="primary" class="px-4" @click="increaseTextSize()" v-b-tooltip.hover title="Larger"><fa icon="plus" /></b-btn>
            </b-button-group>
        </nav>
        <receiver-splash :notFound="notFound" :backlink-data="backlinkData" :roomId="$route.params.roomId" v-if="!showTranscript" />
    </div>
</template>




<script>
import transcript from '~/components/Transcript.vue'
import ReceiverSplash from '~/components/ReceiverSplash.vue';
import navbar from '~/components/Navbar.vue'
import backlink from '~/components/Backlink.vue'

export default {
  components: {
    transcript,
    ReceiverSplash,
    navbar,
    backlink,
  },
  async asyncData ({app, params, res}) {
    try {
        await app.$axios.$get('/api/rooms/' + params.roomId); // if the page doesn't exist, this 404s
        let {backlink} = await app.$axios.$get('/api/rooms/' + params.roomId + '/backlink');
        return {backlinkData: backlink};
    }
    catch (error) {
        if (res) {
            res.statusCode = 404; // send 404 back
            return {notFound: true};
        }
    }
  },
  data: function() {
      return {
          notFound: false,
          backlinkData: null,
          showTranscript: false,
          transcriptExistsTimeout: null,
      };
  },
  mounted: function () {
      if (this.socketConnected) {
          this.initSubscription();
      }
  },
  methods: {
    initSubscription: function() {
        let {roomId} = this.$route.params;
        let {s} = this.$route.query; // s = stealth; don't increment subscriber count
        s = s !== undefined;

        if (roomId) {
            this.$socket.sendObj({
                action: 'subscribeToRoom',
                roomId,
                s,
            });
        }
    },
    increaseTextSize: function() {
        this.$store.commit('TEXT_SIZE_INCREASE');
    },
    decreaseTextSize: function() {
        this.$store.commit('TEXT_SIZE_DECREASE');
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
          this.initSubscription();
      },
      transcriptExists: function(transcriptExists) {
        if (this.transcriptExistsTimeout) {
            clearTimeout(this.transcriptExistsTimeout);
        }
        if (transcriptExists) {
            this.showTranscript = true;
        }
        else {
            // Wait a period of time before checking it again and hiding it in case
            // it's only blank very momentarily.

            this.transcriptExistsTimeout = setTimeout(() => {
                if (!this.transcriptExists) {
                    this.showTranscript = false;
                }
            }, 1000);
        }
      }
  }
}
</script>