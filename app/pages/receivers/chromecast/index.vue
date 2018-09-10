<template>
  <div>
    <div v-if="transcript">
      <transcript></transcript>
      <nav id="navbar" class="navbar fixed-bottom navbar-expand" style="padding:0.5vw 2vw;background:rgba(0,0,0,.2)">
          <span class="navbar-brand mr-auto text-white" style="opacity:.6">
              <img src="/static/img/logo.svg" width="17" height="17" class="d-inline-block" style="position:relative;top:-1px;margin-right:10px" alt="Web Captioner" />
              <span class="d-none d-md-inline">Web Captioner</span>
          </span>
      </nav>
    </div>
    <receiver-splash v-else />
  </div>
</template>

<script>
import Transcript from '~/components/Transcript.vue';
import ReceiverSplash from '~/components/ReceiverSplash.vue';
import loadScript from 'load-script';

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
  mounted: function() {
    let self = this;
    loadScript(
      "https://www.gstatic.com/cast/sdk/libs/receiver/2.0.0/cast_receiver.js",
      { async: false },
      function(err, script) {
        if (err) {
          // print useful message
        } else {
          self.initCastReceiver();
        }
      }
    );
  },
  computed: {
    transcript: function() {
        return this.$store.state.captioner.transcript.final + this.$store.state.captioner.transcript.interim;
    },
  },
  methods: {
    initCastReceiver: function() {
      let self = this;
      cast.receiver.logger.setLevelValue(0);
      this.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

      // handler for the 'ready' event
      this.castReceiverManager.onReady = function(event) {
        self.message = "Received Ready event: " + JSON.stringify(event.data);
        self.castReceiverManager.setApplicationState(
          "Ready to Caption"
        );
      };

      // handler for 'senderconnected' event
      this.castReceiverManager.onSenderConnected = function(event) {
        self.message = "Received Sender Connected event: " + event.data;
        console.log(self.castReceiverManager.getSender(event.data).userAgent);
      };

      // handler for 'senderdisconnected' event
      this.castReceiverManager.onSenderDisconnected = function(event) {
        self.message = "Received Sender Disconnected event: " + event.data;
        if (self.castReceiverManager.getSenders().length == 0) {
          window.close();
        }
      };

      // handler for 'systemvolumechanged' event
      this.castReceiverManager.onSystemVolumeChanged = function(event) {
        console.log(
          "Received System Volume Changed event: " +
            event.data["level"] +
            " " +
            event.data["muted"]
        );
      };

      // create a CastMessageBus to handle messages for a custom namespace
      this.messageBus = this.castReceiverManager.getCastMessageBus(
        "urn:x-cast:com.google.cast.sample.helloworld"
      );

      // handler for the CastMessageBus message event
      this.messageBus.onMessage = this.processMessage;

      // initialize the CastReceiverManager with an application status message
      this.castReceiverManager.start({
        statusText: "Application is starting2"
      });
      console.log("Receiver Manager started");
      this.message = "Receiver Manager started";

      window.onerror = function(error, url, line) {
        this.message = {
          acc: "error",
          data: "ERR:" + error + " URL:" + url + " L:" + line
        };
      };
    },

    processMessage: function({ type, senderId, data }) {
      this.castReceiverManager.setApplicationState("Captioning");

      let { type: mutationType, payload } = JSON.parse(data);
      this.$store.commit(mutationType, payload);

      // inform all senders on the CastMessageBus of the incoming message event
      // sender message listener will be invoked
      this.messageBus.send(senderId, data);
    },
  }
};
</script>
