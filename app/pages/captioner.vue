<template>
  <div id="app" class="w-100" v-bind:style="{backgroundColor}" style="display: flex;flex-direction: column;height: 100vh;">
    <nuxt-child/>
    <welcome-modal ref="welcomeModal" />
    <incompatible-browser-modal ref="incompatibleBrowserModal" />
    <microphone-permission-needed-modal ref="microphonePermissionNeededModal" />
    <microphone-permission-denied-modal ref="microphonePermissionDeniedModal" />
    <navbar></navbar>
  </div>
</template>

<script>
import Combokeys from 'combokeys'
import screenfull from 'screenfull'
import saveToFile from '~/mixins/saveToFile.js'
import dateFormat from '~/mixins/dateFormat'
import navbar from '~/components/Navbar.vue'
import WelcomeModal from '~/components/WelcomeModal.vue'
import IncompatibleBrowserModal from '~/components/IncompatibleBrowserModal.vue'
import MicrophonePermissionNeededModal from '~/components/MicrophonePermissionNeededModal.vue'
import MicrophonePermissionDeniedModal from '~/components/MicrophonePermissionDeniedModal.vue'
import RemoteEventBus from '~/mixins/RemoteEventBus'
import throttle from 'lodash.throttle'
import {getCurrentVersionNumber} from '~/mixins/settingsNormalizer.js'
import versionSort from 'semver-compare'

export default {
  name: 'app-view',
  mixins: [
    saveToFile,
    dateFormat,
  ],
  components: {
    navbar,
    WelcomeModal,
    IncompatibleBrowserModal,
    MicrophonePermissionNeededModal,
    MicrophonePermissionDeniedModal,
  },
  data: function() {
    return {
      combokeysDocument: null,
    };
  },
  mounted: function() {
    this.$store.dispatch('RESTORE_SETTINGS_FROM_LOCALSTORAGE')
      .then(() => {
        return this.$store.dispatch('SET_LOCALE_FROM_USER_DEFAULT');
      })
      .then(()=> {
        this.hideLoadingScreen();

        // Watch for changes and save to localstorage
        this.$store.watch((state) => { return state.settings; },
          () => {
            this.$store.dispatch('SAVE_SETTINGS_TO_LOCALSTORAGE');
          },
          {deep: true}
        );
      
        if (this.hasntSeenWelcomeModalForCurrentVersionYet() && !this.shouldAutostart()) {
          this.$refs.welcomeModal.showModal();
          this.$store.commit('SET_LAST_WHATS_NEW_VERSION_SEEN', { version: getCurrentVersionNumber() });
        }
      });

    if (!this.$route.meta.disableShortcutKeys) {
      this.combokeysDocument = new Combokeys(document.documentElement);
      this.combokeysDocument
        .bind('w s', () => {
          if (!this.typingModeOn) {
            this.$router.push('/captioner/settings');
          }
        })
        .bind('w f', () => {
          if (!this.typingModeOn) {
            this.$router.push('/captioner');
            this.$router.replace('/captioner/save-to-file');
          }
        })
        .bind('w p p', () => {
          if (!this.typingModeOn) {
            if (this.captioningOn) {
              this.$store.dispatch('captioner/restart');
            }
            this.$store.commit('captioner/CLEAR_TRANSCRIPT');

            this.$router.replace('/captioner');
          }
        })
        .bind('?', () => {
          if (!this.typingModeOn) {
            this.$router.push('/captioner/settings/controls');
          }
        })
        .bind('w x', () => {
          if (!this.typingModeOn) {
            screenfull.toggle();
          }
        })
        .bind('w n', () => {
          if (!this.typingModeOn) {
            this.$store.dispatch('START_DETACHED_MODE');
          }
        })
        .bind('w c', () => {
          if (!this.typingModeOn) {
            this.$router.push('/captioner');
            if (!this.captioningOn) {
              this.startCaptioning();
            }
            else {
              this.stopCaptioning();
            }
          }
        })
        .bind(['ctrl+shift+.', 'command+shift+.'], () => {
          this.$store.commit('TEXT_SIZE_INCREASE');
        })
        .bind(['ctrl+shift+,', 'command+shift+,'], () => {
          this.$store.commit('TEXT_SIZE_DECREASE');
        })
        .bind('t', () => {
          if (!this.typingModeOn) {
            if (this.experiments.includes('typingMode')) {
              this.$store.dispatch('captioner/startTypingMode');
            }
          }
        })
        .bind('esc', () => {
          this.$store.dispatch('captioner/stopTypingMode');
        })


        // Larger layout mode
        .bind('c', () => {
          if (this.largerLayout) {
            this.$router.push('/captioner');
            if (!this.captioningOn) {
              this.startCaptioning();
            }
            else {
              this.stopCaptioning();
            }
          }
        })


        .bind('f', () => {
          if (this.largerLayout) {
            this.saveToTextFile({
              transcript: this.$store.state.captioner.transcript.final + this.$store.state.captioner.transcript.interim,
              dateFormatter: this.dateFormat,
              onDone: function() {},
            });
          }
        })
        .bind('p', () => {
          if (this.largerLayout) {
            if (this.captioningOn) {
              this.$store.dispatch('captioner/restart');
            }
            this.$store.commit('captioner/CLEAR_TRANSCRIPT');

            this.$router.replace('/captioner');
          }
        })
      ;
    }

    if (this.socketConnected) {
      this.initRoom();
    }

    this.redirectSettingsRouteOnMobile(this.$route.name); // if navigating to settings page on load

    function isChromium() { 
      for (var i = 0, u="Chromium", l =u.length; i < navigator.plugins.length; i++) {
        if (navigator.plugins[i].name != null && navigator.plugins[i].name.substr(0, l) === u) {
          return true;
        }
      }
      return false;
    }

    if (
      !('webkitSpeechRecognition' in window)
      || navigator.userAgent.indexOf("Opera") !== -1
      || isChromium()
    ) {
        this.$store.commit('SET_INCOMPATIBLE_BROWSER_ON');
        this.$store.dispatch('SHOW_INCOMPATIBLE_BROWSER_MODAL');
    }

    this.$nextTick(() => {
      this.refreshVmixStatus();
    });

    if (this.shouldAutostart()) {
      this.startCaptioning();
    }

    let lastWebhookInterimEventDate = 0;
    RemoteEventBus.$on('sendMutationToReceivers', ({mutation, payload}) => {
      let callWebhook = ({url, method, transcript}) => {
        let body = JSON.stringify({transcript});

        this.$store.commit('APPEND_WEBHOOK_LOG', {
          event: {
            type: 'send',
            title: method + ' ' + url,
            body,
            showBody: false,
          }
        });

        fetch(url, {
          method,
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          },
          body,
        })
        .then((response) => {
          response.text()
            .then(() => {
              this.$store.commit('APPEND_WEBHOOK_LOG', {
                event: {
                  type: 'receive',
                  title: response.status + ' ' + response.statusText,
                  error: response.status >= 300,
                }
              });
            });
        })
        .catch((error) => {
          this.$store.commit('APPEND_WEBHOOK_LOG', {
            event: {
              type: 'receive',
              title: error.message,
              error: true,
            }
          });
        });
      }
      
      if (
        mutation === 'captioner/SET_TRANSCRIPT_INTERIM'
        && (Date.now() - lastWebhookInterimEventDate) >= this.$store.state.settings.integrations.webhooks.interim.throttleMs
      ) {

        if (this.$store.state.settings.share.roomId) {
          this.$socket.sendObj({
            action: 'mutation',
            mutation,
            payload,
          });
          lastWebhookInterimEventDate = Date.now();
        }

        if (this.$store.state.settings.integrations.webhooks.on) {
          callWebhook({
            url: this.$store.state.settings.integrations.webhooks.interim.url,
            method: this.$store.state.settings.integrations.webhooks.interim.method,
            transcript: (payload ? payload.transcriptInterim : ''),
          });
          lastWebhookInterimEventDate = Date.now();
        }
      }

      if ([
        'captioner/APPEND_TRANSCRIPT_FINAL',
        'captioner/CLEAR_TRANSCRIPT_INTERIM'
      ].includes(mutation)) {
        if (this.$store.state.settings.integrations.webhooks.on) {
          callWebhook({
            url: this.$store.state.settings.integrations.webhooks.final.url,
            method: this.$store.state.settings.integrations.webhooks.final.method,
            transcript: (payload ? payload.transcriptFinal : ''),
          });
        }

        if (this.$store.state.settings.share.roomId) {
          this.$socket.sendObj({
            action: 'mutation',
            mutation,
            payload,
          });
        }
      }
    });
  },
  watch: {
    socketConnected: function(isConnected) {
      if (isConnected) {
        this.initRoom();
      }
    },
    '$route' (toRoute) {
      this.redirectSettingsRouteOnMobile(toRoute.name);
    },
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
        this.$store.dispatch('SEND_TO_VMIX', {
          text: this.transcript,
          chromeExtensionId: this.$env.CHROME_EXTENSION_ID,
        });
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
  beforeDestroy: function() {
    this.combokeysDocument.detach();
  },
  computed: {
    experiments: function() {
        return this.$store.state.settings.exp;
    },
    largerLayout: function() {
      return this.$store.state.settings.controls.layout.larger;
    },
    captioningOn: function() {
      return this.$store.state.captioner.on; 
    },
    typingModeOn () {
      return this.$store.state.captioner.typingModeOn;
    },
    backgroundColor: function() {
      return this.$store.state.settings.appearance.background.color;
    },
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
  },
  methods: {
    hasntSeenWelcomeModalForCurrentVersionYet: function() {
      const lastWhatsNewVersionSeen = this.$store.state.settings.lastWhatsNewVersionSeen;
      const currentVersion = getCurrentVersionNumber();
      return versionSort(lastWhatsNewVersionSeen || '0', currentVersion) < 0;
    },
    hideLoadingScreen: function() {
      let loadingScreen = document.getElementById('full-screen-loading');
      if (loadingScreen) {
        loadingScreen.classList.add('fadeOut');
        setTimeout(() => {
          loadingScreen.remove();
        }, 500);
      }
    },
    startCaptioning: function() {
      this.$store.dispatch('captioner/startManual');
    },
    stopCaptioning: function() {
      this.$store.dispatch('captioner/stopManual');
    },
    redirectSettingsRouteOnMobile(currentName) {
      // This is a client-side method because we're
      // doing a redirection based on screen width.
      // xs screen size has a standalone settings menu.
      if (
        currentName.indexOf('captioner-settings___') === 0 // Route name starts with that
        && window.outerWidth > 575
      ) {
        this.$router.replace(this.localePath('captioner-settings-about'));
      }
    },
    refreshVmixStatus: function() {
      if (this.vmixOn) {
        this.$store.dispatch('REFRESH_VMIX_SETUP_STATUS', {
          chromeExtensionId: this.$env.CHROME_EXTENSION_ID,
        })
          .then(() => {
            if (!this.$store.state.integrations.vmix.cachedInputGUID) {
              this.$store.commit('SET_VMIX_SHOW_NOT_FULLY_SET_UP_MESSAGE', {on: true});
            }
          })
      }
    },
    initRoom: function() {
      this.$socket.sendObj({
        action: 'authenticateRoomOwner',
        roomId: this.$store.state.settings.share.roomId,
        ownerKey: this.$store.state.settings.share.ownerKey,
      });
    },
    shouldAutostart: function() {
      return this.$route && this.$route.query && Object.keys(this.$route.query).includes('autostart');
    },
  }
}
</script>