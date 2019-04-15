<template>
  <div>
    <nav
      class="navbar navbar-expand navbar-inverse bg-dark d-flex flex-column"
      :class="largerLayout ? 'pt-3 pb-4' : 'pr-2'"
    >
      <div class="w-100 pb-3" :class="{'d-flex' : largerLayout, 'd-none': !largerLayout}">
        <div class="mr-auto">
          <b-btn @click="clearTranscript" size="lg" variant="danger" class="px-4 py-3">
            Clear
            <kbd class="small ml-3">p</kbd>
          </b-btn>
        </div>
        <b-btn @click="startSaveToTextFile" variant="info" size="lg" class="px-4 py-3">
          Save to File
          <kbd class="small ml-3">f</kbd>
        </b-btn>
      </div>
      <div class="d-flex w-100">
        <button
          class="navbar-toggler navbar-toggler-right"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-brand mr-auto" :class="{'mt-3' : largerLayout}">
          <a href="/">
            <img
              src="/static/img/logo.svg"
              width="20"
              height="20"
              class="d-inline-block align-top mr-2"
              :alt="$t('app.webCaptioner')"
            >
            <span class="d-none d-md-inline">{{$t('app.webCaptioner')}}</span>
          </a>
        </div>

        <!-- Do not remove this from the DOM with v-if. Currently the volume meter needs to exist in order to populate microphoneName. -->
        <volume-meter v-bind:hidden="!captioningOn || waitingForInitialTranscript"></volume-meter>

        <div v-if="waitingForInitialTranscript" class="navbar-text small text-primary mr-3">
          <span
            v-if="microphoneName"
          >{{$t('navbar.captioner.listeningToMicrophone', {microphoneName})}}</span>
          <span v-else>{{$t('navbar.captioner.listening')}}</span>
        </div>
        <cast-button></cast-button>
        <share-button v-if="experiments.includes('share')"></share-button>
        <div v-if="showVmixNotFullySetUpMessage && !vmixNotFullySetUpMessageDismissed" class="mr-4">
          <span class="navbar-text text-white pr-3 text-primary">
            <fa icon="exclamation-triangle"/>
            {{$t('navbar.vmixNotConnected')}}
          </span>
          <b-btn-group size="sm">
            <b-btn
              :to="localePath('captioner-settings-vmix')"
              @click="vmixNotFullySetUpMessageDismissed = true"
              variant="secondary"
              v-if="showVmixNotFullySetUpMessage"
              class="btn-sm"
            >{{$t('common.setUpVerb')}}</b-btn>
            <b-btn @click="sendToVmix = false" :aria-label="$t('common.dismiss')">
              <fa icon="times"/>
            </b-btn>
          </b-btn-group>
        </div>
        <b-btn-group :size="largerLayout ? 'lg' : ''" class="captioning-split-button">
          <b-btn
            id="startCaptioningDropdown"
            :class="incompatibleBrowser ? 'button-only-disabled' : ''"
            :variant="captioningToggleButtonVariant"
            @click="captioningToggleButtonClick"
          >
            <div :class="{'px-4 py-2' : largerLayout}">
              <span v-if="!this.captioningOn">
                <fa icon="microphone"/>
                <span v-show="!typingModeOn">{{$t('navbar.captioner.startCaptioning')}}</span>
              </span>
              <span v-else>{{$t('navbar.captioner.stopCaptioning')}}</span>
              <kbd v-show="largerLayout" class="small ml-3">c</kbd>
            </div>

            <!-- <b-popover
                            id="captioningPreviewPopover"
                            target="startCaptioningDropdown"
                            placement="top"
                        >
                            {{transcriptExcerpt}}
            </b-popover>-->
          </b-btn>
          <b-btn
            v-show="experiments.includes('typingMode') && !typingModeOn"
            variant="primary"
            v-b-tooltip.top
            title="Start Typing (t)"
            @click="startTypingMode"
          >
            <fa icon="keyboard"/>
          </b-btn>
          <b-btn v-if="typingModeOn" variant="danger" @click="stopTypingMode">
            <fa icon="keyboard"/>Done Typing
            <kbd>ESC</kbd>
          </b-btn>
          <b-dropdown dropup right :variant="captioningToggleButtonVariant">
            <b-dropdown-item href="/" target="_blank">{{$t('navbar.menu.about')}}</b-dropdown-item>
            <b-dropdown-item href="/blog" target="_blank">{{$t('navbar.menu.blog')}}</b-dropdown-item>
            <b-dropdown-item href="/help" target="_blank">{{$t('navbar.menu.helpCenter')}}</b-dropdown-item>
            <b-dropdown-item href="/community" target="_blank">{{$t('navbar.menu.community')}}</b-dropdown-item>
            <b-dropdown-item href="/donate" target="_blank">{{$t('navbar.menu.donate')}}</b-dropdown-item>
            <div class="dropdown-divider"></div>
            <b-dropdown-item href="/feedback" target="_blank">{{$t('navbar.menu.feedback')}}</b-dropdown-item>
            <div class="dropdown-divider"></div>
            <b-dropdown-item
              @click="startDetachedMode"
              class="dropdown-item"
              v-b-tooltip.left
              :title="$t('navbar.menu.newWindowDescription')"
            >
              <fa icon="external-link-alt" fixed-width class="mr-1"/>
              {{$t('navbar.menu.newWindow')}}
            </b-dropdown-item>
            <div class="dropdown-divider"></div>
            <b-dropdown-item :to="localePath('captioner-save-to-file')" replace>
              <fa icon="save" class="mr-1" fixed-width/>
              {{$t('navbar.menu.saveToFile')}}
            </b-dropdown-item>
            <b-dropdown-item :to="localePath('captioner-clear')" replace>
              <fa icon="trash-alt" class="mr-1" fixed-width/>
              {{$t('common.clear')}}...
            </b-dropdown-item>
            <div class="dropdown-divider"></div>
            <b-dropdown-item :to="localePath('captioner-settings')" class="dropdown-item">
              <fa icon="cog" class="mr-1" fixed-width/>
              {{$t('navbar.menu.settings')}}
            </b-dropdown-item>
          </b-dropdown>
        </b-btn-group>
      </div>
    </nav>
  </div>
</template>

<style>
.button-only-disabled > .btn-primary:first-child {
  opacity: 0.6;
  cursor: default;
}
</style>



<script>
import VolumeMeter from './VolumeMeter.vue';
import CastButton from '../components/CastButton.vue';
import ShareButton from '../components/ShareButton.vue';
import saveToFile from '~/mixins/saveToFile';
import dateFormat from '~/mixins/dateFormat';
import bBtn from 'bootstrap-vue/es/components/button/button';
import bBtnGroup from 'bootstrap-vue/es/components/button-group/button-group';
import bDropdown from 'bootstrap-vue/es/components/dropdown/dropdown';
import bDropdownItem from 'bootstrap-vue/es/components/dropdown/dropdown-item';
import bTooltip from 'bootstrap-vue/es/directives/tooltip/tooltip';

export default {
  mixins: [saveToFile, dateFormat],
  components: {
    VolumeMeter,
    CastButton,
    ShareButton,
    bBtn,
    bBtnGroup,
    bDropdown,
    bDropdownItem,
  },
  directives: {
    bTooltip,
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
    transcriptExcerpt: function() {
      return (
        this.$store.state.captioner.transcript.final +
        ' ' +
        this.$store.state.captioner.transcript.interim
      ).slice(-60);
    },
    showCaptioningPreviewPopover: function() {
      return this.transcriptExcerpt.length > 0;
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
      get() {
        return (
          this.sendToVmix &&
          this.$store.state.integrations.vmix.showNotFullySetUpMessage
        );
      },
      set(on) {
        this.$store.commit('SET_VMIX_SHOW_NOT_FULLY_SET_UP_MESSAGE', { on });
      },
    },
    sendToVmix: {
      get() {
        return this.$store.state.settings.integrations.vmix.on;
      },
      set() {
        this.$store.commit('SET_SEND_TO_VMIX', { on: false });
      },
    },
  },
  watch: {
    //   transcriptExcerpt: function(transcriptExcerpt) {
    //       if (this.$router.currentRoute.name.startsWith('captioner-settings')) {
    //         if (transcriptExcerpt) {
    //             this.$root.$emit('bv::show::popover', 'startCaptioningDropdown');
    //         }
    //         else {
    //             this.$root.$emit('bv::hide::popover', 'startCaptioningDropdown');
    //         }
    //       }
    //   },
  },
  methods: {
    captioningToggleButtonClick: function() {
      if (this.captioningOn) {
        this.stopCaptioning();
      } else {
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
        transcript:
          this.$store.state.captioner.transcript.final +
          this.$store.state.captioner.transcript.interim,
        dateFormatter: this.dateFormat,
        onDone: () => {},
      });
    },
  },
};
</script>