<template>
  <remote-display-receiver/>
</template>

<script>
import RemoteDisplayReceiver from "~/components/RemoteDisplayReceiver.vue";

export default {
  name: "remote-display-receiver",
  components: {
    RemoteDisplayReceiver,
  },
  mounted: function() {


    let self = this;
    // socket.emit('getMyConnectId', {device: self.getDeviceInfo()}, function ({connectId}) {
    //   self.connectId = connectId;
    // });

    // socket.on('joinedRoom', function(message) {
    //     console.log('JOINED ROOM!');
    //     console.log(message);
    // });

    // socket.on('processMessage', function({type, payload}) {
    //     self.$store.commit(type, payload);
    // });
  },
  computed: {
    connectId: {
      get () {
        return this.$store.state.connectId;
      },
      set (connectId) {
        this.$store.commit('SET_CONNECT_ID', {connectId});
      },
    },
    transcriptExists: function() {
        return this.$store.state.captioner.transcript.final.length > 0 ||
            this.$store.state.captioner.transcript.interim.length > 0;
    },
    recentlyHadCaptions: function() {
        return this.now - this.transcriptLastUpdated < (5 * 1000);
    },
  },
  methods: {
    getDeviceInfo: function() {
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return {
            isAndroid: /android/i.test(userAgent),
            isIosPhone: /iPhone|iPod/.test(userAgent) && !window.MSStream,
            isIosTablet: /iPad/.test(userAgent) && !window.MSStream,
            isMac: navigator ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : false,
            isLinux: navigator ? navigator.platform.toUpperCase().indexOf('Linux') >= 0 : false,
            isWindows: navigator ? navigator.platform.toUpperCase().indexOf('Win') >= 0 : false,
        }
    },
    processMessage: function ({detail:{type, payload}}) {
      this.$store.commit(type, payload);
    },
  }
};
</script>
