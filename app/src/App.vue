<template>
  <div id="app" class="w-100">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
  @import 'scss/app.scss';
</style>

<style lang="css">
  @import '../node_modules/font-awesome/css/font-awesome.css';
</style>

<script>
import Combokeys from 'combokeys'
import screenfull from 'screenfull'

export default {
  name: 'app-view',
  data: function() {
    return {
      combokeysDocument: null,
    };
  },
  mounted: function() {
    let self = this;
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
        self.$store.dispatch('captioner/restart');
        self.$store.commit('captioner/CLEAR_TRANSCRIPT');

        self.$router.replace('/captioner');
      })
      .bind('?', function() {
        self.$router.push('/captioner/settings/keyboard-shortcuts');
      })
      .bind('w x', function() {
        screenfull.toggle();
      })
      .bind('w c', function() {
        self.$router.push('/captioner');
        if (!self.captioningOn) {
          self.startCaptioning();
        }
        else {
          self.stopCaptioning();
        }
      });
    




  },
  watch: {
    transcript: function(transcript) {
      console.log(transcript);
      this.sendCastMessage(transcript);
    },
  },
  beforeDestroy: function() {
    this.combokeysDocument.detach();
  },
  computed: {
    captioningOn: function() {
      return this.$store.state.captioner.on; 
    },
  },
  methods: {
    startCaptioning: function() {
      this.$store.dispatch('captioner/startManual');
    },
    stopCaptioning: function() {
      this.$store.dispatch('captioner/stopManual');
    },
  }
}
</script>