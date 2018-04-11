<template>
  <b-button variant="link" @click="requestSessionTest()"><img src="/public/cast-icon.svg"/></b-button>
</template>

<script>
import loadScript from 'load-script'

var applicationID = 'C97D0419';
var namespace = 'urn:x-cast:com.google.cast.sample.helloworld';
var session = null;

export default {
  name: 'castButton',
  data: function() {
    return {
      sendCastMessage: null,
    };
  },
  methods: {
    requestSessionTest: function() {
      chrome.cast.requestSession(function(e) {
            let session = e;
            session.sendMessage(namespace, {
              mutationType: 'RESTORE_SETTINGS',
              payload: {
                settings: this.$store.state.settings,
                verstion: this.$store.state.version,
              },
            },
              function () {
                console.log('Message sent: ');
              },
              function(e){
                console.log(e)
              }
            );
          },
          function(e){
            console.log(e)
          }
        );
    },
  },
  mounted: function() {
    window['__onGCastApiAvailable'] = function(isAvailable) {
      if (isAvailable) {
        initializeCastApi();
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

    /**
     * Call initialization for Cast
     */
    if (!chrome.cast || !chrome.cast.isAvailable) {
      setTimeout(initializeCastApi, 1000);
    }

    /**
     * initialization
     */
    function initializeCastApi() {
      var sessionRequest = new chrome.cast.SessionRequest(applicationID);
      var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
        sessionListener,
        receiverListener);

      chrome.cast.initialize(apiConfig, onInitSuccess, onError);
    }

    /**
     * initialization success callback
     */
    function onInitSuccess() {
      appendMessage('onInitSuccess');
    }

    /**
     * initialization error callback
     */
    function onError(message) {
      appendMessage('onError: ' + JSON.stringify(message));
    }

    /**
     * generic success callback
     */
    function onSuccess(message) {
      appendMessage('onSuccess: ' + message);
    }

    /**
     * callback on success for stopping app
     */
    function onStopAppSuccess() {
      appendMessage('onStopAppSuccess');
    }

    /**
     * session listener during initialization
     */
    function sessionListener(e) {
      appendMessage('New session ID:' + e.sessionId);
      session = e;
      session.addUpdateListener(sessionUpdateListener);
      session.addMessageListener(namespace, receiverMessage);
    }

    /**
     * listener for session updates
     */
    function sessionUpdateListener(isAlive) {
      var message = isAlive ? 'Session Updated' : 'Session Removed';
      message += ': ' + session.sessionId;
      appendMessage(message);
      if (!isAlive) {
        session = null;
      }
    }

    /**
     * utility function to log messages from the receiver
     * @param {string} namespace The namespace of the message
     * @param {string} message A message string
     */
    function receiverMessage(namespace, message) {
      appendMessage('receiverMessage: ' + namespace + ', ' + message);
    }

    /**
     * receiver listener during initialization
     */
    function receiverListener(e) {
      if(e === 'available') {
        appendMessage('receiver found');
      }
      else {
        appendMessage('receiver list empty');
      }
    }

    /**
     * stop app/session
     */
    function stopApp() {
      session.stop(onStopAppSuccess, onError);
    }

    /**
     * send a message to the receiver using the custom namespace
     * receiver CastMessageBus message handler will be invoked
     * @param {string} message A message string
     */
    this.sendCastMessage = function(message) {
      if (session != null) {
        session.sendMessage(namespace, message, onSuccess.bind(this, 'Message sent: ' + message),
          onError);
      }
      else {
        chrome.cast.requestSession(function(e) {
            let session = e;
            session.sendMessage(namespace, message, onSuccess.bind(this, 'Message sent: ' +
              message), onError);
          }, onError);
      }
    }

    /**
     * append message to debug message window
     * @param {string} message A message string
     */
    function appendMessage(message) {
      console.log(message);
    }

    /**
     * utility function to handle text typed in by user in the input field
     */
    function update() {
      this.sendCastMessage(document.getElementById('input').value);
    }

    /**
     * handler for the transcribed text from the speech input
     * @param {string} words A transcibed speech string
     */
    function transcribe(words) {
      this.sendCastMessage(words);
    }
  },
}
</script>
