<template>
  <div>
    <b-button variant="link" @click="sendInitMessage"><img src="/public/cast-icon.svg"/></b-button>
    <button @click="sendInitMessage">Send message</button>
  </div>
</template>

<script>
import loadScript from 'load-script'

const applicationID = 'C97D0419';
const namespace = 'urn:x-cast:com.google.cast.sample.helloworld';

export default {
  name: 'castButton',
  data: function() {
    return {
      sendCastMessage: null,

      session: null,
    };
  },
  // mounted: function() {
  //   this.initializeCastApi();

  //   this.$watch("captioningOn", function(captioningOn) {
  // },
  methods: {
    initializeCastApi: function() {
      console.log(this);
      let self = this;
      let sessionRequest = new chrome.cast.SessionRequest(applicationID);
      const onReceivedMessage = function(namespace, message) {
        console.log('Received message:');
        console.log(namespace, message);
      }

      const sessionListener = function (e) {
        console.log('New session ID:' + e.sessionId);
        self.session = e;
        self.session.addUpdateListener(sessionUpdateListener);
        self.session.addMessageListener(namespace, onReceivedMessage);
      };

      const sessionUpdateListener = function sessionUpdateListener(isAlive) {
        var message = isAlive ? 'Session Updated' : 'Session Removed';
        message += ': ' + self.session.sessionId;
        console.log(message);
        if (!isAlive) {
          self.session = null;
        }
      }

      const receiverListener = function receiverListener(e) {
        if(e === 'available') {
          console.log('receiver found');
        }
        else {
          console.log('receiver list empty');
        }
      };

      let apiConfig = new chrome.cast.ApiConfig(
        sessionRequest,
        sessionListener,
        receiverListener);

      chrome.cast.initialize(apiConfig, () => { console.log('init success')}, (e) => { console.log(e); });
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
          console.log("success: "+ JSON.stringify(message));
        },
          function(e) {
          console.log("error: ");
          console.log(e);
        });
      }
      else {
        let self = this;
        chrome.cast.requestSession(function(e) {
            self.session = e;
            self.session.sendMessage(namespace, message, 
            
            function() {
          console.log("success: "+ message);
        }, function(e) {
          console.log("error: ");
          console.log(e);
        })
          }, function(e) {
          console.log("error: ");
          console.log(e);
        });
      }
    },
  },
  computed: {
    transcriptFinal () {
      return this.$store.state.captioner.transcript.final;
    },
    transcriptInterim () {
      return this.$store.state.captioner.transcript.interim;
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
      if (err) {
        // print useful message 
      }
      else {
        // console.log(cast);
        console.log(script.src);// Prints 'foo'.js' 
        // use script 
        // note that in IE8 and below loading error wouldn't be reported 
      }
    });

    this.$watch("transcriptInterim", function(transcriptInterim) {
      if (this.session) {
        this.sendMessage({
          mutationType: 'captioner/SET_TRANSCRIPT_INTERIM',
          payload: {
            transcriptInterim,
          }
        });
      }
    });

    this.$watch("transcriptFinal", function(transcriptFinal) {
      if (this.session) {
        this.sendMessage({
          mutationType: 'captioner/APPEND_TRANSCRIPT_FINAL',
          payload: {
            transcriptFinal,
          }
        });
      }
    });

    /**
     * Call initialization for Cast
     */
    // if (!chrome.cast || !chrome.cast.isAvailable) {
    //   setTimeout(initializeCastApi, 1000);
    // }


    /**
     * stop app/session
     */
    // function stopApp() {
    //   session.stop((e) => { console.log('App successfully stopped');}, (e) => { console.log(e); });
    // }
  },
}
</script>
