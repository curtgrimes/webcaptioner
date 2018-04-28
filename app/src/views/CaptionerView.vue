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
import socket from '../api/socket'
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
    socket.on("remoteDisplays", function ({ remoteDisplays }) {
        self.remoteDisplays = remoteDisplays;
    });

    if (self.$store.state.settings.roomLeaderToken) {
        socket.emit("restoreMyRoomIdFromRoomLeaderToken", {
            roomLeaderToken: self.$store.state.settings.roomLeaderToken,
        }, function({success}) {
            if (!success) {
                socket.emit("getMyRoomLeaderToken", null, function({ roomLeaderToken }) {
                    self.$store.commit("SET_ROOM_LEADER_TOKEN", { roomLeaderToken });
                });
            }
        });        
    }
    else {
        socket.emit("getMyRoomLeaderToken", null, function({ roomLeaderToken }) {
            self.$store.commit("SET_ROOM_LEADER_TOKEN", { roomLeaderToken });
        });
    }

    RemoteEventBus.$on('sendMutationToReceivers', throttle(({type, payload}) => {
      if (self.remoteDisplays.length) {
          console.log('sending');
          socket.emit("sendMessageToRoom", {type, payload});
      }
      else {
        console.log("no remote displays to send to");
      }
    }, 0, {leading: true}));
  },
  computed: {
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
