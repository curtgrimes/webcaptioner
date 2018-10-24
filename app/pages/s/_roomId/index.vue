<template>
    <div class="d-flex w-100 flex-column" style="height: 100vh;">
        <div v-if="showTranscript" class="d-flex flex-grow-1">
            <backlink :roomId="$route.params.roomId"/>
            <transcript show-typed-live-read-only />
        </div>
        <nav v-if="showTranscript" class="navbar navbar-expand bg-dark">
            <span class="navbar-brand mr-auto text-white" style="opacity:.6">
                <img src="/static/img/logo.svg" width="17" height="17" class="d-inline-block" style="position:relative;top:-1px;margin-right:10px" alt="Web Captioner" />
                <span class="d-none d-md-inline">Web Captioner</span>
            </span>
            <b-dropdown variant="info" text="Settings" class="mr-2" no-caret right>
                <template slot="button-content">
                    <fa icon="cog"/> <span class="sr-only">Settings</span>
                </template>
                <b-dropdown-item @click="$refs.delayModal.show()">Delay</b-dropdown-item>
            </b-dropdown>
            <b-button-group>
                <b-btn variant="primary" class="px-4" @click="decreaseTextSize()" @mousedown="startLongPress(decreaseTextSize)" @mouseleave="stopLongPress(decreaseTextSize)" @mouseup="stopLongPress(decreaseTextSize)" @touchstart="startLongPress(decreaseTextSize)" @touchend="stopLongPress(decreaseTextSize)" @touchcancel="stopLongPress(decreaseTextSize)" v-b-tooltip.hover title="Smaller"><fa icon="minus" /></b-btn>
                <b-btn variant="primary" class="px-4" @click="increaseTextSize()" @mousedown="startLongPress(increaseTextSize)" @mouseleave="stopLongPress(increaseTextSize)" @mouseup="stopLongPress(increaseTextSize)" @touchstart="startLongPress(increaseTextSize)" @touchend="stopLongPress(increaseTextSize)" @touchcancel="stopLongPress(increaseTextSize)" v-b-tooltip.hover title="Larger"><fa icon="plus" /></b-btn>
            </b-button-group>
        </nav>
        <receiver-splash :minimized="showTranscript" :notFound="notFound" :backlink-data="backlinkData" :roomId="$route.params.roomId" />

        <b-modal ref="delayModal" title="Delay" :ok-title="(delay > 0 && delayUnsavedMs == 0) ? 'Remove Delay' : 'Set Delay'" ok-variant="secondary" cancel-variant="link" @ok="setDelay()" @cancel="resetDelay()">
            <div class="form-group">
                <label for="delayRange" class="text-center w-100">
                    <span v-if="delayUnsavedMs <= 0">No delay.</span>
                    <span v-else>Delay captions by {{(delayUnsavedMs/1000).toFixed(1)}} second<span v-if="delayUnsavedMs/1000 !== 1">s</span>.</span>
                </label>
                <div class="row">
                    <div class="col-2">
                        <b-btn variant="outline-info" block @click="decreaseDelay()" @mousedown="startLongPress(decreaseDelay)" @mouseleave="stopLongPress(decreaseDelay)" @mouseup="stopLongPress(decreaseDelay)" @touchstart="startLongPress(decreaseDelay)" @touchend="stopLongPress(decreaseDelay)" @touchcancel="stopLongPress(decreaseDelay)"><fa icon="minus" /></b-btn>
                    </div>
                    <div class="col-8 mt-1 pt-2 px-0"><input id="delayRange" type="range" :min="minDelayMs" :max="maxDelayMs" :step="delayInputStep" class="form-control-range" v-model="delayUnsavedMs" /></div>
                    <div class="col-2">
                        <b-btn variant="outline-info" block @click="increaseDelay()" @mousedown="startLongPress(increaseDelay)" @mouseleave="stopLongPress(increaseDelay)" @mouseup="stopLongPress(increaseDelay)" @touchstart="startLongPress(increaseDelay)" @touchend="stopLongPress(increaseDelay)" @touchcancel="stopLongPress(increaseDelay)"><fa icon="plus" /></b-btn>
                    </div>
                </div>
            </div>
        </b-modal>
        <b-modal ref="delayProgressModal" v-model="startingDelay" title="Delaying..." hide-footer hide-header-close>
            <div class="row">
                <div class="col-9">
                    <b-progress height="2rem" class="border" variant="secondary" :max="delay/1000">
                        <b-progress-bar :value="startingDelayProgress/1000" style="overflow:hidden">
                            {{Math.floor(startingDelayProgress/1000)}}s
                        </b-progress-bar>
                    </b-progress>
                </div>
                <div class="col-3">
                    <b-btn @click="restorePreviousDelaySetting()" block class="py-1" variant="light" size="sm">Cancel</b-btn>
                </div>
            </div>
        </b-modal>
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
          longPressTimeout: null,
          longPressDuration: 0,
          longPressTickMsLevel1: 250,
          longPressTickMsLevel2: 100,

          delayUnsavedMs: 0, // temporary value used in the delay dialog
          maxDelayMs: 30000,
          minDelayMs: 0,
          delayInputStep: 500,
          startingDelay: false,
          startingDelayProgress: 0,
          previousDelaySetting: 0,
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
    startLongPress: function(fn) {
        this.longPressDuration = 0;
        this.longPressTick(fn);
    },
    stopLongPress: function() {
        if (this.longPressTimeout) {
            clearTimeout(this.longPressTimeout);
        }
    },
    longPressTick: function(fn) {
        fn.bind(this)();

        let tickMs = this.longPressDuration <= 900 ? this.longPressTickMsLevel1 : this.longPressTickMsLevel2;
        this.longPressDuration += tickMs;
        this.longPressTimeout = setTimeout(() => {
            this.longPressTick(fn);
        }, tickMs);
    },
    setDelay: function() {
        this.$store.commit('captioner/SET_TRANSCRIPT_DELAY', {delay: this.delayUnsavedMs});
    },
    resetDelay: function() {
        // Cancelling the dialog; reset the value to what is in the store
        this.delayUnsavedMs = this.$store.state.captioner.transcript.delay;
    },
    increaseDelay: function() {
        const increased = this.delayUnsavedMs + this.delayInputStep;
        this.delayUnsavedMs = increased >= this.maxDelayMs ? this.maxDelayMs : increased;
    },
    decreaseDelay: function() {
        const decreased = this.delayUnsavedMs - this.delayInputStep;
        this.delayUnsavedMs = decreased <= this.minDelayMs ? this.minDelayMs : decreased;
    },
    restorePreviousDelaySetting: function() {
        this.$store.state.captioner.transcript.delay = this.delayUnsavedMs = this.previousDelaySetting;
        this.startingDelay = false;
    },
  },
  computed: {
    socketConnected: function() {
      return this.$store.state.socket.isConnected;
    },
    transcriptExists: function() {
        return this.$store.state.captioner.transcript.final || this.$store.state.captioner.transcript.interim || this.$store.state.captioner.transcript.typed;
    },
    delay: function() {
        return parseInt(this.$store.state.captioner.transcript.delay);
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
      },
      delay: function(newDelay, oldDelay) {
        this.previousDelaySetting = oldDelay;
        if (newDelay < oldDelay) {
            // So the delay was changed from a larger number to a smaller number.
            // This presents a problem because now we have past events backed up that
            // would be delayed longer than an event that just comes in.
            // We'll solve this by immediately firing all of the events in the queue now
            // (in order) and then continuing on with the new (shorter) delay value.
            this.$store.commit('DELAYED_EVENT_CLEAN_UP');

            this.$store.state.delayedEvents.forEach((delayedEvent) => {
                clearTimeout(delayedEvent.timeoutId);
                this.$store.$socket_passToStoreHandler_next(delayedEvent.eventName, delayedEvent.event);
            });
            
            this.$store.commit('CLEAR_DELAYED_EVENTS');

            // Continue with new delay like normal
        }
        else {
            // The delay increased. Show a progress bar while the delay is starting.
            const tick = 50;

            this.startingDelay = true;
            this.startingDelayProgress = 0;
            this.startingDelayProgressInterval = setInterval(() => {
                this.startingDelayProgress += tick;

                if (this.startingDelayProgress >= this.delay) {
                    clearInterval(this.startingDelayProgressInterval);
                    this.startingDelay = false;
                }
            }, tick);
        }
      }
  }
}
</script>