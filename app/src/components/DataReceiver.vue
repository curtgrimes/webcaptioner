<template></template>

<script>
import loadScript from "load-script";

export default {
  name: "data-receiver",
  data: function() {
    return {
      message: null,
      castReceiverManager: null,
      messageBus: null
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
  methods: {
    initCastReceiver: function() {
      let self = this;
      cast.receiver.logger.setLevelValue(0);
      this.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

      // handler for the 'ready' event
      this.castReceiverManager.onReady = function(event) {
        self.message = "Received Ready event: " + JSON.stringify(event.data);
        self.castReceiverManager.setApplicationState(
          "Application status is ready..."
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
      let { mutationType, payload } = JSON.parse(data);
      // this.message = typeof payload;
      // this.message({mutationType,payload});
      this.$store.commit(mutationType, payload);
      let self = this;
      setTimeout(function() {
        self.message = self.$store.state.captioner;
      }, 1000);
      // inform all senders on the CastMessageBus of the incoming message event
      // sender message listener will be invoked
      this.messageBus.send(senderId, data);
    }
  }
};
</script>
