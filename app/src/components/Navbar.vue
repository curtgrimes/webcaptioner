<template>
    <nav class="navbar fixed-bottom navbar-expand navbar-inverse bg-dark pr-2">
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
        <cast-button></cast-button>
        <!--
        <b-dropdown variant="secondary" dropup no-caret right class="mr-2" toggle-class="rounded">
        <template slot="button-content">
            <i class="fa fa-desktop" aria-hidden="true"></i> 1 <span class="sr-only">Screens</span>
        </template>
        <b-dropdown-item href="/" target="_blank" onclick="ga('send', 'event', 'settings', 'aboutButton')">About</b-dropdown-item>
        </b-dropdown>
        -->
        <b-dropdown variant="primary" dropup right split :text="!captioningOn ? 'Start Captioning' : 'Stop'" @click="!captioningOn ? startCaptioning() : stopCaptioning()">
            <b-dropdown-item href="/" target="_blank" onclick="ga('send', 'event', 'settings', 'aboutButton')">About</b-dropdown-item>
            <b-dropdown-item href="/help" target="_blank" onclick="ga('send', 'event', 'settings', 'helpCenterButton')">Help Center</b-dropdown-item>
            <b-dropdown-item href="/feedback" target="_blank" onclick="ga('send', 'event', 'settings', 'reportAProblemButton')">Report a Problem</b-dropdown-item>
            <b-dropdown-item href="/donate" target="_blank" onclick="ga('send', 'event', 'settings', 'donateButton')">Donate</b-dropdown-item>
            <div class="dropdown-divider"></div>
            <b-dropdown-item to="/captioner/save-to-file" replace onclick="ga('send', 'event', 'settings', 'saveToFile')"><i class="fa fa-floppy-o mr-1" aria-hidden="true"></i> Save to File</b-dropdown-item>
            <b-dropdown-item to="/captioner/clear" replace><i class="fa fa-trash-o mr-1" aria-hidden="true"></i> Clear...</b-dropdown-item>
            <div class="dropdown-divider"></div>
            <b-dropdown-item to="/captioner/settings" class="dropdown-item"><i class="fa fa-cog mr-1" aria-hidden="true"></i> Settings</b-dropdown-item>
        </b-dropdown>
    </nav>
</template>

<script>
import VolumeMeter from './VolumeMeter.vue'
import CastButton from '../components/CastButton.vue'

export default {
  name: 'navbar',
  components: {
    VolumeMeter,
    CastButton,
  },
  computed: {
    captioningOn: function() {
      return this.$store.state.captioner.on; 
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
        this.$router.push('/captioner/save-to-file');
    //   this.$refs.saveToFileModal.showModal();
    },
    startClearTranscriptModal: function() {
        this.$router.push('/captioner/clear');
    //   this.$refs.clearTranscriptModal.showModal();
    },
  }
}
</script>