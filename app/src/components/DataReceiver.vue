<template></template>

<script>
import loadScript from "load-script";

export default {
  name: "data-receiver",
  data: function() {
    return {
      castReceiverManager: null
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
        cast.receiver.logger.setLevelValue(0);
      this.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

      // handler for the 'ready' event
      this.castReceiverManager.onReady = function(event) {
        console.log("Received Ready event: " + JSON.stringify(event.data));
        this.castReceiverManager.setApplicationState(
          "Application status is ready..."
        );
      };

      // handler for 'senderconnected' event
      this.castReceiverManager.onSenderConnected = function(event) {
        console.log("Received Sender Connected event: " + event.data);
        console.log(window.castReceiverManager.getSender(event.data).userAgent);
      };

      // handler for 'senderdisconnected' event
      this.castReceiverManager.onSenderDisconnected = function(event) {
        console.log("Received Sender Disconnected event: " + event.data);
        if (this.castReceiverManager.getSenders().length == 0) {
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
      window.messageBus = this.castReceiverManager.getCastMessageBus(
        "urn:x-cast:com.google.cast.sample.helloworld"
      );

      // handler for the CastMessageBus message event
      window.messageBus.onMessage = function(event) {
        console.log("Message [" + event.senderId + "]: " + event.data);
        // display the message from the sender
        this.processMessage(event);
        // inform all senders on the CastMessageBus of the incoming message event
        // sender message listener will be invoked
        window.messageBus.send(event.senderId, event.data);
      };

      // initialize the CastReceiverManager with an application status message
      this.castReceiverManager.start({
        statusText: "Application is starting"
      });
      console.log("Receiver Manager started");
    },

    processMessage: function({ mutationType, payload }) {
      this.$store.commit(mutationType, payload);
    }
  }
};
</script>
