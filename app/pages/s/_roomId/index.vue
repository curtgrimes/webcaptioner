<template>
  <div class="d-flex w-100 flex-column" style="height: 100vh;">
    <div v-if="transcriptExists" class="d-flex flex-grow-1">
        <transition name="fade">
            <b-btn v-if="backlink" @mouseover="infoHovering = true" @mouseleave="infoHovering = false" :href="backlink.url" target="_blank" rel="noopener noreferrer" class="text-left d-flex align-items-center backlink-button p-2 border border-dark" style="position:absolute;top:15px;right:15px;z-index:1" :style="backlink.colors ? {backgroundColor: backlink.colors.background, color: backlink.colors.text} : {}">
                <div v-if="backlink.imageUrl" class="og-image flex-shrink-0" :style="{backgroundImage: 'url(\''+ backlink.imageUrl +'\')'}"></div>
                <fa v-else icon="info-circle" class="m-1" size="2x" />
                <transition name="fade">
                    <div v-show="shouldShowInfo" class="og-text px-1 ml-2">
                        {{backlink.title}}<br/>
                        <span class="normal-text small">{{backlink.description}}</span>
                    </div>
                </transition>
            </b-btn>
        </transition>
        <transcript show-typed-live-read-only></transcript>
    </div>
    <nav v-if="transcriptExists" class="navbar navbar-expand" style="padding:0.5vw 2vw;background:rgba(0,0,0,.2)">
        <span class="navbar-brand mr-auto text-white" style="opacity:.6">
            <img src="/static/img/logo.svg" width="17" height="17" class="d-inline-block" style="position:relative;top:-1px;margin-right:10px" alt="Web Captioner" />
            <span class="d-none d-md-inline">Web Captioner</span>
        </span>
        <b-button-group>
            <b-btn variant="primary" class="px-4" @click="decreaseTextSize()" v-b-tooltip.hover title="Smaller"><fa icon="minus" /></b-btn>
            <b-btn variant="primary" class="px-4" @click="increaseTextSize()" v-b-tooltip.hover title="Larger"><fa icon="plus" /></b-btn>
        </b-button-group>
    </nav>
    <receiver-splash  v-if="!transcriptExists" />
  </div>
</template>

<style scoped>
    .backlink-button {
        max-width:350px;
    }

    .og-text {
        text-overflow:ellipsis;
        overflow: hidden;
        line-height:1.2rem;
    }

    .og-image {
        width:45px;
        height:45px;
        background-size:cover;
        background-position: center center;
        background-repeat:no-repeat;
    }
</style>


<script>
import transcript from '~/components/Transcript.vue'
import ReceiverSplash from '~/components/ReceiverSplash.vue';
import navbar from '~/components/Navbar.vue'

export default {
  components: {
    transcript,
    ReceiverSplash,
    navbar,
  },
  data: function() {
      return {
          backlink: null,
          infoHovering: false,
          shouldShowInfo: false,
          aboutToCloseTimeout: null,
      };
  },
  async asyncData ({app, params, res}) {
    try {
        await app.$axios.$get('/api/rooms/' + params.roomId);
        // Success if we're here; nothing to do
    }
    catch (error) {
        if (res) {
            res.statusCode = 404; // send 404 back
        }
    }
  },
  mounted: function () {
      if (this.socketConnected) {
          this.initSubscription();
      }

      setInterval(this.updateRoomBacklink, 1000 * 60 * 2);
      this.updateRoomBacklink();
  },
  methods: {
    updateRoomBacklink: async function() {
          try {
            const {backlink} = await this.$axios.$get('/api/rooms/' + this.$route.params.roomId +'/backlink');
            this.backlink = backlink;
          }
          catch (e) {}
    },
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
      infoHovering: function(infoHovering) {
          if (infoHovering) {
              this.shouldShowInfo = true;
              clearTimeout(this.aboutToCloseTimeout);
          }
          else {
              this.aboutToCloseTimeout = setTimeout(() => {
                  if (!this.infoHovering) { // if we're still not hoving on it
                    this.shouldShowInfo = false;
                  }
              },600);
          }
      },
  }
}
</script>