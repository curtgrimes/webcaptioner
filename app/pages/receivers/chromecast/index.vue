<template>
  <div class="d-flex w-100 flex-column" style="height: 100vh;">
    <div v-if="transcriptExists" class="d-flex flex-grow-1">
      <transcript show-typed-live-read-only></transcript>
    </div>
    <nav
      v-if="transcriptExists"
      class="navbar navbar-expand"
      style="padding:0.5vw 2vw;background:rgba(0,0,0,.2)"
    >
      <span class="navbar-brand mr-auto text-white" style="opacity:.6">
        <img
          src="/static/img/logo.svg"
          width="17"
          height="17"
          class="d-inline-block"
          style="position:relative;top:-1px;margin-right:10px"
          alt="Web Captioner"
        />
        <span class="d-none d-md-inline">Web Captioner</span>
      </span>
    </nav>
    <receiver-splash
      message="Live captioning will begin soon."
      v-if="!transcriptExists"
    />
  </div>
</template>

<script>
import Transcript from '~/components/Transcript.vue';
import ReceiverSplash from '~/components/ReceiverSplash.vue';
import loadScript from 'load-script2';

export default {
  components: {
    Transcript,
    ReceiverSplash,
  },
  data: function() {
    return {
      message: null,
      castReceiverManager: null,
      messageBus: null,
    };
  },
  async mounted() {
    await loadScript(
      'https://www.gstatic.com/cast/sdk/libs/receiver/2.0.0/cast_receiver.js'
    );
    this.initCastReceiver();
  },
  computed: {
    transcriptExists: function() {
      return (
        this.$store.state.captioner.transcript.final ||
        this.$store.state.captioner.transcript.interim ||
        this.$store.state.captioner.transcript.typed
      );
    },
  },
  methods: {
    initCastReceiver: function() {
      let self = this;
      cast.receiver.logger.setLevelValue(0);
      this.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

      // handler for the 'ready' event
      this.castReceiverManager.onReady = function(event) {
        self.message = 'Received Ready event: ' + JSON.stringify(event.data);
        self.castReceiverManager.setApplicationState('Ready to Caption');
      };

      // handler for 'senderconnected' event
      this.castReceiverManager.onSenderConnected = function(event) {
        self.message = 'Received Sender Connected event: ' + event.data;
        // console.log(self.castReceiverManager.getSender(event.data).userAgent);
      };

      // handler for 'senderdisconnected' event
      this.castReceiverManager.onSenderDisconnected = function(event) {
        self.message = 'Received Sender Disconnected event: ' + event.data;
        if (self.castReceiverManager.getSenders().length == 0) {
          window.close();
        }
      };

      // create a CastMessageBus to handle messages for a custom namespace
      this.messageBus = this.castReceiverManager.getCastMessageBus(
        'urn:x-cast:com.webcaptioner.cast.captioner'
      );

      // handler for the CastMessageBus message event
      this.messageBus.onMessage = this.processMessage;

      // initialize the CastReceiverManager with an application status message
      this.castReceiverManager.start({
        statusText: 'Web Captioner is loading',
      });
      this.message = 'Web Captioner started';

      window.onerror = function(error, url, line) {
        this.message = {
          acc: 'error',
          data: 'ERR:' + error + ' URL:' + url + ' L:' + line,
        };
      };
    },

    processMessage: function({ type, senderId, data }) {
      this.castReceiverManager.setApplicationState('Captioning');

      let { mutation, action, payload } = JSON.parse(data);
      if (mutation) {
        this.$store.commit(mutation, payload);
      } else if (action) {
        this.$store.dispatch(action, payload);
      }

      // inform all senders on the CastMessageBus of the incoming message event
      // sender message listener will be invoked
      this.messageBus.send(senderId, data);
    },
  },
};
</script>
