<template>
  <div class="captioner-view h-100">
    <router-view></router-view>
    <save-to-file-modal ref="saveToFileModal"></save-to-file-modal>
    <clear-transcript-modal ref="clearTranscriptModal"></clear-transcript-modal>
    <welcome-modal ref="welcomeModal" />
    <microphone-permission-needed-modal ref="microphonePermissionNeededModal" />
    <microphone-permission-denied-modal ref="microphonePermissionDeniedModal" />
    <navbar></navbar>
  </div>
</template>

<script>
import navbar from '../components/Navbar.vue'
import SaveToFileModal from '../components/SaveToFileModal.vue'
import ClearTranscriptModal from '../components/ClearTranscriptModal.vue'
import WelcomeModal from '../components/WelcomeModal.vue'
import MicrophonePermissionNeededModal from '../components/MicrophonePermissionNeededModal.vue'
import MicrophonePermissionDeniedModal from '../components/MicrophonePermissionDeniedModal.vue'
import RemoteEventBus from '../components/RemoteEventBus'
import throttle from 'lodash.throttle'

export default {
  name: 'captioner-view',
  components: {
    navbar,
    SaveToFileModal,
    WelcomeModal,
    MicrophonePermissionNeededModal,
    MicrophonePermissionDeniedModal,
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

    // this.$refs.welcomeModal.showModal();

    if (this.vmixOn) {
      this.$store.dispatch('REFRESH_VMIX_SETUP_STATUS')
        .then(function() {
          if (!self.$store.state.integrations.vmix.cachedInputGUID) {
            self.$store.commit('SET_VMIX_SHOW_NOT_FULLY_SET_UP_MESSAGE', {on: true});
          }
        })
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
        // console.log("no remote displays to send to");
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
  watch: {
    transcript: function() {
      if (this.vmixOn) {
        this.$store.dispatch('SEND_TO_VMIX', {text: this.transcript});
      }
    },
    microphonePermissionNeeded: function() {
      if (this.microphonePermissionNeeded) {
        this.$refs.microphonePermissionNeededModal.showModal();
      }
      else {
        this.$refs.microphonePermissionNeededModal.hideModal();
      }
    },
    microphonePermissionDenied: function() {
      if (this.microphonePermissionDenied) {
        this.$refs.microphonePermissionNeededModal.hideModal();
        this.$refs.microphonePermissionDeniedModal.showModal();
      }
    },
  },
  computed: {
    transcript: function() {
      return this.$store.state.captioner.transcript.final + ' ' + this.$store.state.captioner.transcript.interim;
    },
    microphonePermissionNeeded: function() {
      return this.$store.state.captioner.microphonePermission.needed;
    },
    microphonePermissionDenied: function() {
      return this.$store.state.captioner.microphonePermission.denied;
    },
    socketConnected: function() {
      return this.$store.state.socket.isConnected;
    },
    vmixOn: function() {
      return this.$store.state.settings.integrations.vmix.on;
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
