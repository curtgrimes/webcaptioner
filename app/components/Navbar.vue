<template>
    <div>
        <!-- id # is used in util/appHeightAdjuster -->
        <nav id="navbar" class="navbar fixed-bottom navbar-expand navbar-inverse bg-dark d-flex flex-column" :class="largerLayout ? 'pt-3 pb-4' : 'pr-2'">
            <div class="w-100 pb-3" :class="{'d-flex' : largerLayout, 'd-none': !largerLayout}">
                <div class="mr-auto">
                    <b-button @click="clearTranscript" size="lg" variant="danger" class="px-4 py-3">Clear <kbd class="small ml-3">p</kbd></b-button>
                </div>
                <b-button @click="startSaveToTextFile" variant="info" size="lg" class="px-4 py-3">Save to File <kbd class="small ml-3">f</kbd></b-button>
            </div>
            <div class="d-flex w-100">
                <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="navbar-brand mr-auto" :class="{'mt-3' : largerLayout}">
                    <a href="/">
                        <img src="/static/img/logo.svg" width="20" height="20" class="d-inline-block align-top mr-2" alt="Web Captioner" />
                        <span class="d-none d-md-inline">Web Captioner</span>
                    </a>
                </div>
            
                <!-- Do not remove this from the DOM with v-if. Currently the volume meter needs to exist in order to populate microphoneName. -->
                <volume-meter v-bind:hidden="!captioningOn || waitingForInitialTranscript"></volume-meter>

                <div v-if="waitingForInitialTranscript" class="navbar-text small text-primary mr-3">
                    Listening<span v-if="microphoneName"> to "{{microphoneName}}"</span>
                </div>
                <transition name="fade">
                    <cast-button></cast-button>
                </transition>
                <div v-if="showVmixNotFullySetUpMessage && !vmixNotFullySetUpMessageDismissed" class="mr-4">
                    <span class="navbar-text text-white pr-3 text-primary">
                        <fa icon="exclamation-triangle" /> vMix Not Connected
                    </span>
                    <b-button-group size="sm">
                        <b-btn to="/captioner/settings/vmix" @click="vmixNotFullySetUpMessageDismissed = true" variant="secondary" v-if="showVmixNotFullySetUpMessage" class="btn-sm">
                            Set Up
                        </b-btn>
                        <b-button @click="sendToVmix = false" aria-label="Dismiss"><fa icon="times"/></b-button>
                    </b-button-group>
                </div>

                <transition name="fade">
                    <b-dropdown v-if="remoteDisplays.length > 0" variant="secondary" dropup no-caret right class="mr-2" toggle-class="rounded">
                        <template slot="button-content">
                            <fa icon="desktop" /> {{remoteDisplays.length}} <span class="sr-only">Screens</span>
                        </template>
                        <b-dropdown-item disabled class="text-white" style="cursor:default" v-for="remoteDisplay in remoteDisplays" v-bind:key="remoteDisplay.remoteDisplayId">
                            <span v-if="remoteDisplay.device.isAndroid">
                                <fa :icon="['fab', 'android']" /> Android
                            </span>
                            <span v-else-if="remoteDisplay.device.isIosPhone">
                                <fa :icon="['fab', 'apple']" /> iPhone
                            </span>
                            <span v-else-if="remoteDisplay.device.isIosTablet">
                                <fa :icon="['fab', 'apple']" /> iPad
                            </span>
                            <span v-else-if="remoteDisplay.device.isMac">
                                <fa :icon="['fab', 'apple']" /> Mac
                            </span>
                            <span v-else-if="remoteDisplay.device.isLinux">
                                Linux Device
                            </span>
                            <span v-else-if="remoteDisplay.device.isWindows">
                                <fa :icon="['fab', 'windows']" /> Windows Device
                            </span>
                            <span v-else>
                                Device
                            </span>
                        </b-dropdown-item>
                    </b-dropdown>
                </transition>
                <b-button-group :size="largerLayout ? 'lg' : ''">
                    <b-button id="startCaptioningDropdown" :class="incompatibleBrowser ? 'button-only-disabled' : ''" :variant="captioningToggleButtonVariant" @click="captioningToggleButtonClick">
                        <div :class="{'px-4 py-2' : largerLayout}">
                            <span v-if="!this.captioningOn">
                                <fa icon="microphone" /> <span v-show="!typingModeOn"> Start Captioning</span>
                            </span>
                            <span v-else>Stop Captioning</span> <kbd v-show="largerLayout" class="small ml-3">c</kbd>
                        </div>
                    </b-button>
                    <b-button v-show="experiments.includes('typingMode') && !typingModeOn" variant="primary" v-b-tooltip.top title="Start Typing (t)" @click="startTypingMode">
                        <fa icon="keyboard"/>
                    </b-button>
                    <b-btn v-if="typingModeOn" variant="danger" @click="stopTypingMode">
                        <fa icon="keyboard"/> Done Typing <kbd>ESC</kbd>
                    </b-btn>
                    <b-dropdown dropup right :variant="captioningToggleButtonVariant">
                        <b-dropdown-item href="/" target="_blank">About</b-dropdown-item>
                        <b-dropdown-item href="/blog" target="_blank">Blog</b-dropdown-item>
                        <b-dropdown-item href="/help" target="_blank">Help Center</b-dropdown-item>
                        <b-dropdown-item href="/community" target="_blank">Community</b-dropdown-item>
                        <b-dropdown-item href="/donate" target="_blank">Donate</b-dropdown-item>
                        <div class="dropdown-divider"></div>
                        <b-dropdown-item href="/feedback" target="_blank">Feedback</b-dropdown-item>
                        <div class="dropdown-divider"></div>
                        <b-dropdown-item @click="startDetachedMode" class="dropdown-item" v-b-tooltip.left title="Show captions in a new window"><fa icon="external-link-alt" fixed-width class="mr-1" /> New Window</b-dropdown-item>
                        <div class="dropdown-divider"></div>
                        <b-dropdown-item to="/captioner/save-to-file" replace><fa icon="save" class="mr-1" fixed-width /> Save to File</b-dropdown-item>
                        <b-dropdown-item to="/captioner/clear" replace><fa icon="trash-alt" class="mr-1" fixed-width /> Clear...</b-dropdown-item>
                        <div class="dropdown-divider"></div>
                        <b-dropdown-item to="/captioner/settings" class="dropdown-item"><fa icon="cog" class="mr-1" fixed-width /> Settings</b-dropdown-item>
                    </b-dropdown>
                </b-button-group>
            </div> <!-- bottom row in big UI mode -->
        </nav>
    </div>
</template>

<style>
    .button-only-disabled > .btn-primary:first-child {
        opacity:.6;
        cursor:default;
    }
</style>



<script>
import VolumeMeter from './VolumeMeter.vue'
import CastButton from '../components/CastButton.vue'
import saveToFile from '~/mixins/saveToFile'
import dateFormat from '~/mixins/dateFormat'

export default {
  name: 'navbar',
  mixins: [
    saveToFile,
    dateFormat,
  ],
  components: {
    VolumeMeter,
    CastButton,
  },
  data: function() {
      return {
          vmixNotFullySetUpMessageDismissed: false,
      };
  },
  computed: {
    captioningOn: function() {
        return this.$store.state.captioner.shouldBeOn;
    },
    typingModeOn: function() {
        return this.$store.state.captioner.typingModeOn;
    },
    microphoneName: function() {
        return this.$store.state.captioner.microphoneName;
    },
    waitingForInitialTranscript: function() {
        return this.$store.state.captioner.transcript.waitingForInitial;
    },
    largerLayout: function() {
        return this.$store.state.settings.controls.layout.larger;
    },
    experiments: function() {
        return this.$store.state.settings.exp;
    },
    captioningToggleButtonVariant: function() {
        return !this.captioningOn ? 'primary' : 'danger';
    },
    incompatibleBrowser: function() {
        return this.$store.state.incompatibleBrowser;
    },
    remoteDisplays: function() {
        return this.$store.state.remoteDisplays;
    },
    showVmixNotFullySetUpMessage: {
        // User wanted vMix to be on but it can't. Show a message in the navbar.
        get () {
            return this.sendToVmix
                    && this.$store.state.integrations.vmix.showNotFullySetUpMessage;
        },
        set (on) {
            this.$store.commit('SET_VMIX_SHOW_NOT_FULLY_SET_UP_MESSAGE', {on});
        },
    },
    sendToVmix: {
        get () {
            return this.$store.state.settings.integrations.vmix.on;
        },
        set () {
            this.$store.commit('SET_SEND_TO_VMIX', {on: false});
        },
    },
  },
  methods: {
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
    startTypingMode: function() {
        this.$store.dispatch('captioner/startTypingMode');
    },
    stopTypingMode: function() {
        this.$store.dispatch('captioner/stopTypingMode');
    },
    startSaveToFileModal: function() {
        this.$router.push('/captioner/save-to-file');
    },
    startClearTranscriptModal: function() {
        this.$router.push('/captioner/clear');
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
    startSaveToTextFile() {
      this.saveToTextFile({
        transcript: this.$store.state.captioner.transcript.final + this.$store.state.captioner.transcript.interim,
        dateFormatter: this.dateFormat,
        onDone: () => {},
      });
    },
  }
}
</script>