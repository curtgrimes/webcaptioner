<template>
  <div id="app" class="w-100">
    <router-view class="view"></router-view>

    <nav id="main-navbar" class="navbar fixed-bottom navbar-expand navbar-inverse bg-dark pr-2">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <span class="navbar-brand">
        <a href="/">
          <img src="/public/logo.svg" width="20" height="20" class="d-inline-block align-top mr-2" alt="Web Captioner" />
          <span class="d-none d-md-inline">Web Captioner</span>
        </a>
      </span>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li>
            <volume-meter></volume-meter>
          </li>
          <li id="now_listening" class="navbar-text text-white px-3" hidden>
            Now listening...
          </li>
          <li class="nav-item">
            <div id="settingsDropdownContainer" class="btn-group dropup">
              <button v-if="!captioningOn" @click="startCaptioning()" type="button" class="btn btn-primary">Start<span class="d-none d-sm-inline"> Captioning</span></button>
              <button v-if="captioningOn" @click="stopCaptioning()" type="button" class="btn btn-primary">Stop</button>
              <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onclick="ga('send', 'event', 'settings', 'expandDropdown')">
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="/" target="_blank" onclick="ga('send', 'event', 'settings', 'aboutButton')">About</a>
                <a class="dropdown-item" href="/help" target="_blank" onclick="ga('send', 'event', 'settings', 'helpCenterButton')">Help Center</a>
                <a class="dropdown-item" href="/feedback" target="_blank" onclick="ga('send', 'event', 'settings', 'reportAProblemButton')">Report a Problem</a>
                <a class="dropdown-item" href="/donate" target="_blank" onclick="ga('send', 'event', 'settings', 'donateButton')">Donate</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="javascript:void(0)" id="saveTranscriptToFileButton" onclick="ga('send', 'event', 'settings', 'saveToFile')"><i class="fa fa-floppy-o mr-1" aria-hidden="true"></i> Save to File</a>
                <a class="dropdown-item disabled" hidden href="javascript:void(0)" id="saveTranscriptToFileDisabledButton" data-toggle="tooltip" data-trigger="hover" data-placement="left" title="Nothing to save right now"><i class="fa fa-floppy-o mr-1" aria-hidden="true"></i> Save to File</a>
                <a class="dropdown-item" href="javascript:void(0)" id="clearTranscriptButton"><i class="fa fa-trash-o mr-1" aria-hidden="true"></i> Clear...</a>
                <div class="dropdown-divider"></div>
                <router-link to="/captioner/settings" class="dropdown-item"><i class="fa fa-cog mr-1" aria-hidden="true"></i> Settings</router-link>
              </div>
            </div>
          </li>
        </ul>
      </div>
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

export default {
  name: 'settings-view',
  components: {
    VolumeMeter,
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
  }
}
</script>