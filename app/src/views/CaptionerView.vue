<template>
  <div class="captioner-view h-100">
    <router-view></router-view>
    <save-to-file-modal ref="saveToFileModal"></save-to-file-modal>
    <clear-transcript-modal ref="clearTranscriptModal"></clear-transcript-modal>

    <navbar></navbar>
  </div>
</template>

<script>
import navbar from '../components/Navbar.vue'
import SaveToFileModal from '../components/SaveToFileModal.vue'
import ClearTranscriptModal from '../components/ClearTranscriptModal.vue'
import RemoteEventBus from '../components/RemoteEventBus'
import throttle from 'lodash.throttle'

export default {
  name: 'captioner-view',
  components: {
    navbar,
    SaveToFileModal,
    ClearTranscriptModal,
  },
  mounted: function() {
    let self = this;

    // Set up remote displays websocket
    // socket.on("remoteDisplays", function ({ remoteDisplays }) {
    //     self.remoteDisplays = remoteDisplays;
    // });

    if (!this.socketConnected) {
        this.$watch('socketConnected', function(socketConnected) {
            this.initRoom();
        });
    }
    else {
        this.initRoom();
    }

    RemoteEventBus.$on('sendMutationToReceivers', throttle(({type, payload}) => {
      if (self.remoteDisplays.length) {
          this.$socket.sendObj({
            action: 'sendMessageToRoom',
            type,
            payload,
          });
      }
      else {
        console.log("no remote displays to send to");
      }
    }, 0, {leading: true}));
  },
  methods: {
    initRoom: function() {
      if (this.$store.state.settings.roomLeaderToken) {
        this.$socket.sendObj({
          action: 'restoreMyRoomIdFromRoomLeaderToken',
          roomLeaderToken: this.$store.state.settings.roomLeaderToken,
        });
      }
      else {
        this.$socket.sendObj({action: 'getMyRoomLeaderToken'});
      }
    },
  },
  computed: {
    socketConnected: function() {
      return this.$store.state.socket.isConnected;
    },
    remoteDisplays: {
      get () {
        return this.$store.state.remoteDisplays;
      },
      set (remoteDisplays) {
        this.$store.commit('SET_REMOTE_DISPLAYS', {remoteDisplays});
      },
    },
  },
}
</script>
