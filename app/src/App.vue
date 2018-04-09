<template>
  <div id="app" class="w-100">
    <router-view class="view"></router-view>
    <save-to-file-modal ref="saveToFileModal"></save-to-file-modal>

    <nav id="main-navbar" class="navbar fixed-bottom navbar-expand navbar-inverse bg-dark pr-2">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <span class="navbar-brand mr-auto">
        <a href="/">
          <img src="/public/logo.svg" width="20" height="20" class="d-inline-block align-top mr-2" alt="Web Captioner" />
          <span class="d-none d-md-inline">Web Captioner</span>
        </a>
      </span>
      <volume-meter></volume-meter>
      <li id="now_listening" class="navbar-text text-white px-3" hidden>
        Now listening...
      </li>
      <b-dropdown variant="primary" dropup right split :text="!captioningOn ? 'Start Captioning' : 'Stop'" @click="!captioningOn ? startCaptioning() : stopCaptioning()">
        <b-dropdown-item href="/" target="_blank" onclick="ga('send', 'event', 'settings', 'aboutButton')">About</b-dropdown-item>
        <b-dropdown-item href="/help" target="_blank" onclick="ga('send', 'event', 'settings', 'helpCenterButton')">Help Center</b-dropdown-item>
        <b-dropdown-item href="/feedback" target="_blank" onclick="ga('send', 'event', 'settings', 'reportAProblemButton')">Report a Problem</b-dropdown-item>
        <b-dropdown-item href="/donate" target="_blank" onclick="ga('send', 'event', 'settings', 'donateButton')">Donate</b-dropdown-item>
        <div class="dropdown-divider"></div>
        <b-dropdown-item @click="startSaveToFileModal()" href="javascript:void(0)" id="saveTranscriptToFileButton" onclick="ga('send', 'event', 'settings', 'saveToFile')"><i class="fa fa-floppy-o mr-1" aria-hidden="true"></i> Save to File</b-dropdown-item>
        <b-dropdown-item disabled hidden href="javascript:void(0)" id="saveTranscriptToFileDisabledButton" data-toggle="tooltip" data-trigger="hover" data-placement="left" title="Nothing to save right now"><i class="fa fa-floppy-o mr-1" aria-hidden="true"></i> Save to File</b-dropdown-item>
        <b-dropdown-item href="javascript:void(0)" id="clearTranscriptButton"><i class="fa fa-trash-o mr-1" aria-hidden="true"></i> Clear...</b-dropdown-item>
        <div class="dropdown-divider"></div>
        <b-dropdown-item to="/captioner/settings" class="dropdown-item"><i class="fa fa-cog mr-1" aria-hidden="true"></i> Settings</b-dropdown-item>
      </b-dropdown>
    </nav>
  </div>
</template>

<style lang="scss">
  @import 'scss/app.scss';
</style>

<style lang="css">
  @import '../node_modules/font-awesome/css/font-awesome.css';
</style>

<script>
import VolumeMeter from './components/VolumeMeter.vue'
import SaveToFileModal from './components/SaveToFileModal.vue'
import Combokeys from 'combokeys'

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
        self.$refs.saveToFileModal.hideModal();
      })
      .bind('w f', function() {
        self.$router.push('/captioner');
        self.startSaveToFileModal();
      })
      .bind('?', function() {
        self.$router.push('/captioner/settings/keyboard-shortcuts');
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
  beforeDestroy: function() {
    this.combokeysDocument.detach();
  },
  components: {
    VolumeMeter,
    SaveToFileModal,
  },
  computed: {
    captioningOn: function() {
      return this.$store.state.captioner.on; 
    },
    transcriptExists () {
      return this.$store.state.captioner.transcript.interim || this.$store.state.captioner.transcript.final;
    },
  },
  methods: {
    startCaptioning: function() {
      this.$store.dispatch('captioner/start');
    },
    stopCaptioning: function() {
      this.$store.dispatch('captioner/stop');
    },
    startSaveToFileModal: function() {
      this.$refs.saveToFileModal.showModal();
    },
  }
}
</script>