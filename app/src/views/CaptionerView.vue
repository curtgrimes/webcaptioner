<template>
  <div class="captioner-view h-100">
    <router-view></router-view>
    <save-to-file-modal ref="saveToFileModal"></save-to-file-modal>
    <clear-transcript-modal ref="clearTranscriptModal"></clear-transcript-modal>
    <welcome-modal ref="welcomeModal" />
    <incompatible-browser-modal ref="incompatibleBrowserModal" />
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
import IncompatibleBrowserModal from '../components/IncompatibleBrowserModal.vue'
import MicrophonePermissionNeededModal from '../components/MicrophonePermissionNeededModal.vue'
import MicrophonePermissionDeniedModal from '../components/MicrophonePermissionDeniedModal.vue'
import RemoteEventBus from '../components/RemoteEventBus'
import throttle from 'lodash.throttle'
import {getCurrentVersionNumber} from '../util/settingsNormalizer.js'
import versionSort from 'semver-compare'

export default {
  name: 'captioner-view',
  components: {
    navbar,
    SaveToFileModal,
    WelcomeModal,
    IncompatibleBrowserModal,
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
    this.$nextTick(() => {
      if (!this.socketConnected) {
          this.$watch('socketConnected', function(socketConnected) {
              this.initRoom();
          });
      }
      else {
          this.initRoom();
      }
    });

    setTimeout(() => {
      if (self.shouldShowWelcomeModal) {
        self.$refs.welcomeModal.showModal();
      }
    },0);

    if (!('webkitSpeechRecognition' in window)) {
        this.$store.commit('SET_INCOMPATIBLE_BROWSER_ON');
        this.$store.dispatch('SHOW_INCOMPATIBLE_BROWSER_MODAL');
    }

    this.$nextTick(() => {
      this.refreshVmixStatus();
    });

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
    refreshVmixStatus: function() {
      let self = this;
      if (this.vmixOn) {
        this.$store.dispatch('REFRESH_VMIX_SETUP_STATUS')
          .then(function() {
            if (!self.$store.state.integrations.vmix.cachedInputGUID) {
              self.$store.commit('SET_VMIX_SHOW_NOT_FULLY_SET_UP_MESSAGE', {on: true});
            }
          })
      }
    },
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
    captioningShouldBeOn: function(shouldBeOn) {
      if (shouldBeOn) {
        this.refreshVmixStatus();
      }
    },
    incompatibleBrowserModalVisible: function() {
      if (this.incompatibleBrowserModalVisible) {
        this.$refs.incompatibleBrowserModal.showModal();
      }
    },
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
    incompatibleBrowserModalVisible: function() {
      return this.$store.state.incompatibleBrowserModalVisible;
    },
    transcript: function() {
      return this.$store.state.captioner.transcript.final + ' ' + this.$store.state.captioner.transcript.interim;
    },
    captioningShouldBeOn: function() {
      return this.$store.state.captioner.shouldBeOn;
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
    shouldShowWelcomeModal: function() {
      const lastWhatsNewVersionSeen = this.$store.state.settings.lastWhatsNewVersionSeen;
      const currentVersion = getCurrentVersionNumber();
      const hasntSeenWelcomeModalForCurrentVersionYet = versionSort(lastWhatsNewVersionSeen || '0', currentVersion) < 0;
      if (hasntSeenWelcomeModalForCurrentVersionYet) {
        // Delay setting for the future in case they leave 
        // right away and come back. We could reasonably assume they didn't
        // really see this yet.
        let self = this;
        setTimeout(() => {
          self.$store.commit('SET_LAST_WHATS_NEW_VERSION_SEEN', { version: currentVersion });
        }, 10000);
      }
      
      return hasntSeenWelcomeModalForCurrentVersionYet;
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
