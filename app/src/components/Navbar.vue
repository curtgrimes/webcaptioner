<template>
    <div>
        <nav class="navbar fixed-bottom navbar-expand navbar-inverse bg-dark d-flex flex-column" :class="detached ? 'pt-3 pb-4' : 'pr-2'">
            <div v-if="detached" class="d-flex w-100 pb-3">
                <div class="mr-auto">
                    <b-button @click="clearTranscript" size="lg" variant="danger" class="px-4 py-3">Clear <kbd class="small ml-3">p</kbd></b-button>
                </div>
                <b-button @click="saveToTextFile" variant="info" size="lg" class="px-4 py-3">Save to File <kbd class="small ml-3">f</kbd></b-button>
            </div>
            <div class="d-flex w-100">
                <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="navbar-brand mr-auto" :class="{'mt-3' : detached}">
                    <a href="/">
                        <img src="/public/logo.svg" width="20" height="20" class="d-inline-block align-top mr-2" alt="Web Captioner" />
                        <span class="d-none d-md-inline">Web Captioner</span>
                    </a>
                </div>
            
                <!-- Do not remove this from the DOM with v-if. Currently the volume meter needs to exist in order to populate microphoneName. -->
                <volume-meter v-bind:hidden="!captioningOn || waitingForInitialTranscript"></volume-meter>

                <div v-if="waitingForInitialTranscript" class="navbar-text small text-primary mr-3">
                    Listening<span v-if="microphoneName"> to "{{microphoneName}}"</span>
                </div>
                <cast-button></cast-button>

                <transition name="fade">
                    <b-dropdown v-if="remoteDisplays.length > 0" variant="secondary" dropup no-caret right class="mr-2" toggle-class="rounded">
                        <template slot="button-content">
                            <i class="fa fa-desktop" aria-hidden="true"></i> {{remoteDisplays.length}} <span class="sr-only">Screens</span>
                        </template>
                        <b-dropdown-item disabled class="text-white" style="cursor:default" v-for="remoteDisplay in remoteDisplays" v-bind:key="remoteDisplay.remoteDisplayId">
                            <span v-if="remoteDisplay.device.isAndroid">
                                <i class="fa fa-android" aria-hidden="true"></i> Android
                            </span>
                            <span v-else-if="remoteDisplay.device.isIosPhone">
                                <i class="fa fa-apple" aria-hidden="true"></i> iPhone
                            </span>
                            <span v-else-if="remoteDisplay.device.isIosTablet">
                                <i class="fa fa-apple" aria-hidden="true"></i> iPad
                            </span>
                            <span v-else-if="remoteDisplay.device.isMac">
                                <i class="fa fa-apple" aria-hidden="true"></i> Mac
                            </span>
                            <span v-else-if="remoteDisplay.device.isLinux">
                                Linux Device
                            </span>
                            <span v-else-if="remoteDisplay.device.isWindows">
                                <i class="fa fa-windows" aria-hidden="true"></i> Windows Device
                            </span>
                            <span v-else>
                                Device
                            </span>
                        </b-dropdown-item>
                    </b-dropdown>
                </transition>
                <!-- <b-button variant="primary" class="mr-3" v-b-tooltip.top title="Manual Text Entry"><i class="fa fa-i-cursor" aria-hidden="true"></i></b-button> -->
                <b-dropdown :size="detached ? 'lg' : ''" :variant="captioningToggleButtonVariant" dropup right split @click="captioningToggleButtonClick">
                    <template slot="button-content">
                        <div :class="{'px-4 py-2' : detached}">
                            <span v-html="captionToggleButtonText"></span> <kbd v-if="detached" class="small ml-3">c</kbd>
                        </div>
                    </template>
                    <b-dropdown-item href="/" target="_blank" onclick="ga('send', 'event', 'settings', 'aboutButton')">About</b-dropdown-item>
                    <b-dropdown-item href="/help" target="_blank" onclick="ga('send', 'event', 'settings', 'helpCenterButton')">Help Center</b-dropdown-item>
                    <b-dropdown-item href="/feedback" target="_blank" onclick="ga('send', 'event', 'settings', 'reportAProblemButton')">Report a Problem</b-dropdown-item>
                    <b-dropdown-item href="/donate" target="_blank" onclick="ga('send', 'event', 'settings', 'donateButton')">Donate</b-dropdown-item>
                    <div class="dropdown-divider"></div>
                    <b-dropdown-item @click="startDetachedMode" class="dropdown-item" v-b-tooltip.left title="Show captions in a new window"><i class="fa fa-external-link fa-fw mr-1" aria-hidden="true"></i> New Window</b-dropdown-item>
                    <b-dropdown-item to="/captioner/remote-displays">Remote Displays</b-dropdown-item>
                    <div class="dropdown-divider"></div>
                    <b-dropdown-item to="/captioner/save-to-file" replace onclick="ga('send', 'event', 'settings', 'saveToFile')"><i class="fa fa-floppy-o mr-1" aria-hidden="true"></i> Save to File</b-dropdown-item>
                    <b-dropdown-item to="/captioner/clear" replace><i class="fa fa-trash-o mr-1" aria-hidden="true"></i> Clear...</b-dropdown-item>
                    <div class="dropdown-divider"></div>
                    <b-dropdown-item to="/captioner/settings" class="dropdown-item"><i class="fa fa-cog mr-1" aria-hidden="true"></i> Settings</b-dropdown-item>
                </b-dropdown>
            </div> <!-- bottom row in big UI mode -->
        </nav>
    </div>
</template>

<script>
import VolumeMeter from './VolumeMeter.vue'
import CastButton from '../components/CastButton.vue'
import {saveToTextFile} from '../util/saveToFile'

export default {
  name: 'navbar',
  components: {
    VolumeMeter,
    CastButton,
  },
  computed: {
    captioningOn: function() {
        return this.$store.state.captioner.shouldBeOn;
    },
    microphoneName: function() {
        return this.$store.state.captioner.microphoneName;
    },
    waitingForInitialTranscript: function() {
        return this.$store.state.captioner.transcript.waitingForInitial;
    },
    detached: function() {
        return this.$store.state.detached;
    },
    captionToggleButtonText: function() {
        return !this.captioningOn
            ? '<i class="fa fa-microphone" aria-hidden="true"></i> Start Captioning'
            : 'Stop Captioning';
    },
    captioningToggleButtonVariant: function() {
        return !this.captioningOn ? 'primary' : 'danger';
    },
    remoteDisplays: function() {
        return this.$store.state.remoteDisplays;
    },
  },
  methods: {
      alerttest: function() { alert('hihih');},
    captioningToggleButtonClick: function() {
        if (this.captioningOn) {
            this.stopCaptioning();
        }
        else {
            this.startCaptioning();
        }
    },
    startCaptioning: function() {
      this.$store.dispatch('captioner/startManual');
    },
    stopCaptioning: function() {
      this.$store.dispatch('captioner/stopManual');
    },
    startTyping: function() {
      this.$store.dispatch('captioner/startTyping');
    },
    stopTyping: function() {
      this.$store.dispatch('captioner/stopTyping');
    },
    startSaveToFileModal: function() {
        this.$router.push('/captioner/save-to-file');
    //   this.$refs.saveToFileModal.showModal();
    },
    startClearTranscriptModal: function() {
        this.$router.push('/captioner/clear');
    //   this.$refs.clearTranscriptModal.showModal();
    },
    startDetachedMode: function() {
        this.$store.dispatch('START_DETACHED_MODE');
        // TODO: check for when child window closes here and unbind event
    },
    clearTranscript: function() {
        if (this.captioningOn) {
            this.$store.dispatch('captioner/restart');
        }
        this.$store.commit('captioner/CLEAR_TRANSCRIPT');

        this.$router.replace('/captioner');
    },
    saveToTextFile: function() {
        saveToTextFile({
            transcript: this.$store.state.captioner.transcript.final + this.$store.state.captioner.transcript.interim,
            dateFormatter: this.$helpers.dateFormat,
            onDone: function() {},
        });
    },
  }
}
</script>