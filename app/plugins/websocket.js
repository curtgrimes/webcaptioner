import Vue from 'vue'
import VueNativeWebsocket from 'vue-native-websocket'

export default ({ store }, inject) => {
  Vue.use(VueNativeWebsocket, window.location.protocol.replace('http','ws') + '//' + window.location.host, {
    store,
    format: 'json',
    reconnection: true, // reconnect automatically
  });
}