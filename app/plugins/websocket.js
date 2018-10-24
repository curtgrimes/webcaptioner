import Vue from 'vue'
import VueNativeWebsocket from 'vue-native-websocket'

let delayedEventCleanupInterval;

export default ({ store }, inject) => {
  Vue.use(VueNativeWebsocket, window.location.protocol.replace('http','ws') + '//' + window.location.host, {
    store,
    format: 'json',
    reconnection: true, // reconnect automatically
    passToStoreHandler: function (eventName, event, next) {
      store.$socket_passToStoreHandler_next = next.bind(this);
      if (store.state.captioner.transcript.delay > 0) {
        if (!delayedEventCleanupInterval) {
          delayedEventCleanupInterval = setInterval(()=> {
            store.commit('DELAYED_EVENT_CLEAN_UP');
          }, 5000);
        }

        let timeoutId = setTimeout(()=>{
          next(eventName, event);  
        }, store.state.captioner.transcript.delay);

        store.commit('PUSH_DELAYED_EVENT', {
          eventName,
          event,
          timeoutId,
          scheduledTime: (new Date()).getTime() + store.state.captioner.transcript.delay,
        });
      }
      else {
        clearInterval(delayedEventCleanupInterval);
        next(eventName, event);
      }
    },
  });
}