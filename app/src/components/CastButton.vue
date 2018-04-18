<template>
  <div v-if="receiversAvailable">
    <b-button v-if="connecting" id="castConnectingButton" v-b-tooltip.hover title="Connecting" variant="link" disabled>
      <svg style="vertical-align:middle" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
              <g id="ic_cast0_black_24dp" sketch:type="MSArtboardGroup">
                  <g id="ic_remove_circle_white_24dp" sketch:type="MSLayerGroup">
                      <path class="cast-connecting-bar cast-connecting-bar-1" d="M1,18 L1,21 L4,21 C4,19.34 2.66,18 1,18 L1,18 Z" id="Path" fill="#ffffff" sketch:type="MSShapeGroup"></path>
                      <path class="cast-connecting-bar cast-connecting-bar-2" d="M1,14 L1,16 C3.76,16 6,18.24 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z" id="Path" fill="#ffffff" sketch:type="MSShapeGroup"></path>
                      <path class="cast-connecting-bar cast-connecting-bar-3" d="M1,10 L1,12 C5.97,12 10,16.03 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z" id="Path" fill="#ffffff" sketch:type="MSShapeGroup"></path>
                      <path d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z" id="Path" fill="#ffffff" sketch:type="MSShapeGroup"></path>
                      <rect id="bounds" sketch:type="MSShapeGroup" x="0" y="0" width="24" height="24"></rect>
                  </g>
              </g>
              <g id="assets" sketch:type="MSLayerGroup" transform="translate(-240.000000, -106.000000)">
                  <g id="64px" transform="translate(0.000000, 114.000000)"></g>
              </g>
          </g>
      </svg>
    </b-button>
    <b-button v-else-if="connected" v-b-tooltip.hover="'Casting to ' + receiverName" variant="link" @click="stop()">
      <img src="/public/cast-icons/cast-icon-connected.svg"/>
    </b-button>
    <b-button v-else variant="link" v-b-tooltip.hover="'Cast'" @click="sendInitMessage()">
      <img src="/public/cast-icons/cast-icon.svg"/>
    </b-button>
    <b-modal title="Casting Failed" :hide-header="true" ref="castFailedModal" :ok-only="true" ok-variant="secondary" :hide-header-close="true">
      <div class="py-2">
        <div class="pb-2 h4"><i class="fa fa-exclamation-triangle fa-3x" aria-hidden="true"></i></div>
        <h2>Unable to Cast</h2>
        <p class="lead">Please try again.</p>
      </div>
    </b-modal>
  </div>
</template>

<style scoped>
  .cast-connecting-bar {
    opacity:.3;
  }

  @keyframes blink {
    0% { opacity: 1 }
    33% { opacity: 0.3 }
  }

  .cast-connecting-bar-1 {
    animation: blink 1000ms steps(1) infinite;
  }
  .cast-connecting-bar-2 {
    animation: blink 1000ms steps(1) 333ms infinite;
  }
  .cast-connecting-bar-3 {
    animation: blink 1000ms steps(1) 666ms infinite;
  }
</style>


<script>
import loadScript from 'load-script'
import RemoteEventBus from '../components/RemoteEventBus'

const applicationID = 'C97D0419';
const namespace = 'urn:x-cast:com.google.cast.sample.helloworld';

export default {
  name: 'castButton',
  data: function() {
    return {
      session: null,
      receiversAvailable: false,
    };
  },
  methods: {
    initializeCastApi: function() {
      let self = this;
      let sessionRequest = new chrome.cast.SessionRequest(applicationID);
      const onReceivedMessage = function(namespace, message) {
        console.log('Received message:');
        console.log(namespace, message);
      }

      const sessionListener = function (e) {
        self.session = e;
        self.session.addUpdateListener(sessionUpdateListener);
        self.session.addMessageListener(namespace, onReceivedMessage);
        self.connected = true;
        self.connecting = false;
        self.receiverName = self.session.receiver.friendlyName;
      };

      const sessionUpdateListener = function sessionUpdateListener(isAlive) {
        self.connected = isAlive;
        if (isAlive) {
          // Session updated
          // self.session.sessionId
        }
        else {
          // Session removed
          self.session = null;
          self.connected = false;
          self.receiverName = null;
        }
      }

      const receiverListener = function receiverListener(e) {
        if(e === 'available') {
          self.receiversAvailable = true;
        }
        else {
          self.receiversAvailable = false;
        }
      };

      let apiConfig = new chrome.cast.ApiConfig(
        sessionRequest,
        sessionListener,
        receiverListener);

      chrome.cast.initialize(apiConfig, function(e) {
        // Initialized, but not connected to anything yet
        self.connected = false;
      },
      function (e) {
        // console.log(e);
      });
    },
    sendInitMessage: function() {
      this.sendMessage({
        mutationType: 'RESTORE_SETTINGS',
        payload: {
          settings: this.$store.state.settings,
          verstion: this.$store.state.version,
        }
      });
    },
    sendMessage: function (message) {
      if (this.session != null) {
        this.session.sendMessage(namespace, message, function() {
          // console.log("success: "+ JSON.stringify(message));
        },
          function(e) {
          // console.log("error: ");
          // console.log(e);
        });
      }
      else {
        let self = this;
        self.connecting = true;
        chrome.cast.requestSession(
          function(e) {
            self.connecting = false;
            self.connected = true;
            self.session = e;
            self.receiverName = self.session.receiver.friendlyName;
            self.sendMessage(message);
          },
          function(e) {
            self.connecting = false;
            self.connected = false;
            self.receiverName = null;

            if (e.code !== 'cancel') {
              // Ended abnormally (instead of canceled by user)
              self.$refs.castFailedModal.show();
            }
        });
      }
    },
    stop: function() {
      let self = this;
      this.session.stop(function() {
        self.connected = false;
        self.session = null;
        self.receiverName = null;
      }, function(e) {
        // console.log("error: ");
        // console.log(e);
      });
    },
  },
  computed: {
    transcriptFinal () {
      return this.$store.state.captioner.transcript.final;
    },
    transcriptInterim () {
      return this.$store.state.captioner.transcript.interim;
    },
    connected: {
      get () {
        return this.$store.state.receivers.chromecast.connected;
      },
      set (chromecastConnected) {
        this.$store.commit('SET_CHROMECAST_CONNECTED', {chromecastConnected});

        // Hide any tooltips that may be open on the cast button
        this.$root.$emit('bv::hide::tooltip');
      },
    },
    connecting: {
      get () {
        return this.$store.state.receivers.chromecast.connecting;
      },
      set (chromecastConnecting) {
        this.$store.commit('SET_CHROMECAST_CONNECTING', {chromecastConnecting});

        // Hide any tooltips that may be open on the cast button
        this.$root.$emit('bv::hide::tooltip');
      },
    },
    receiverName: {
      get () {
        return this.$store.state.receivers.chromecast.receiverName;
      },
      set (receiverName) {
        // Unescape any HTML entities in name
        let doc = new DOMParser().parseFromString(receiverName, "text/html");
        this.$store.commit('SET_CHROMECAST_RECEIVER_NAME', {receiverName: doc.documentElement.textContent});
      },
    },
  },
  mounted: function() {
    let self = this;
    
    window['__onGCastApiAvailable'] = function(isAvailable) {
      if (isAvailable) {
        self.initializeCastApi();
      }
    };
    
    loadScript('https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1', {async:false}, function (err, script) {
      // if (err) {}
      // else {}
    });

    RemoteEventBus.$on('sendMutation', ({type, payload}) => {
      if (this.session) {
        this.sendMessage({type, payload});
      }
    });
  },
}
</script>
