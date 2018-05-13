<template>
  <div id="app" class="w-100" v-bind:style="{backgroundColor}">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
  @import 'scss/app.scss';
</style>

<script>
import Combokeys from 'combokeys'
import screenfull from 'screenfull'
import {saveToTextFile} from './util/saveToFile'

export default {
  name: 'app-view',
  data: function() {
    return {
      combokeysDocument: null,
    };
  },
  mounted: function() {
    let self = this;

    if (!this.$route.meta.disableShortcutKeys) {
      this.combokeysDocument = new Combokeys(document.documentElement);
      this.combokeysDocument
        .bind('w s', function() {
          self.$router.push('/captioner/settings');
        })
        .bind('w f', function() {
          self.$router.push('/captioner');
          self.$router.replace('/captioner/save-to-file');
        })
        .bind('w p p', function() {
          if (self.captioningOn) {
            self.$store.dispatch('captioner/restart');
          }
          self.$store.commit('captioner/CLEAR_TRANSCRIPT');

          self.$router.replace('/captioner');
        })
        .bind('?', function() {
          self.$router.push('/captioner/settings/keyboard-shortcuts');
        })
        .bind('w x', function() {
          screenfull.toggle();
        })
        .bind('w n', function() {
          self.$store.dispatch('START_DETACHED_MODE');
        })
        .bind('w c', function() {
          self.$router.push('/captioner');
          if (!self.captioningOn) {
            self.startCaptioning();
          }
          else {
            self.stopCaptioning();
          }
        })
        .bind(['ctrl+shift+.', 'command+shift+.'], function() {
          self.$store.commit('TEXT_SIZE_INCREASE');
        })
        .bind(['ctrl+shift+,', 'command+shift+,'], function() {
          self.$store.commit('TEXT_SIZE_DECREASE');
        })


        // Larger layout mode
        .bind('c', function() {
          if (self.largerLayout) {
            self.$router.push('/captioner');
            if (!self.captioningOn) {
              self.startCaptioning();
            }
            else {
              self.stopCaptioning();
            }
          }
        })


        .bind('f', function() {
          if (self.largerLayout) {
            saveToTextFile({
              transcript: self.$store.state.captioner.transcript.final + self.$store.state.captioner.transcript.interim,
              dateFormatter: self.$helpers.dateFormat,
              onDone: function() {},
            });
          }
        })
        .bind('p', function() {
          if (self.largerLayout) {
            if (self.captioningOn) {
              self.$store.dispatch('captioner/restart');
            }
            self.$store.commit('captioner/CLEAR_TRANSCRIPT');

            self.$router.replace('/captioner');
          }
        })
      ;

      this.redirectSettingsRouteOnMobile(this.$route.path); // if navigating to settings page on load

      this.$on('navbarChangedHeight', function() {
        console.log('navbarChangedHeight');
      });
    }
  },
  watch: {
    transcript: function(transcript) {
      this.sendCastMessage(transcript);
    },
    '$route' (toRoute) {
      this.redirectSettingsRouteOnMobile(toRoute.path);
    },
  },
  beforeDestroy: function() {
    this.combokeysDocument.detach();
  },
  computed: {
    largerLayout: function() {
      return this.$store.state.settings.controls.layout.larger;
    },
    captioningOn: function() {
      return this.$store.state.captioner.on; 
    },
    backgroundColor: function() {
      return this.$store.state.settings.appearance.background.color;
    },
  },
  methods: {
    startCaptioning: function() {
      this.$store.dispatch('captioner/startManual');
    },
    stopCaptioning: function() {
      this.$store.dispatch('captioner/stopManual');
    },
    redirectSettingsRouteOnMobile(currentPath) {
      // This is a client-side method because we're
      // doing a redirection based on screen width.
      // xs screen size has a standalone settings menu.
      if (currentPath === '/captioner/settings' && window.outerWidth > 575) {
        this.$router.replace('/captioner/settings/about');
      }
    },
  }
}
</script>