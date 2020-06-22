<template>
  <div>
    <nav
      class="navbar navbar-expand navbar-inverse bg-dark d-flex flex-column"
      :class="largerLayout ? 'pt-3 pb-4' : 'pr-2'"
    >
      <div
        class="w-100 pb-3"
        :class="{ 'd-flex': largerLayout, 'd-none': !largerLayout }"
      >
        <div class="mr-auto">
          <b-button
            @click="clearTranscript"
            size="lg"
            variant="danger"
            class="px-4 py-3"
          >
            Clear
            <kbd class="small ml-3">p</kbd>
          </b-button>
        </div>
        <b-button
          @click="startSaveToTextFile"
          variant="info"
          size="lg"
          class="px-4 py-3"
        >
          Save to File
          <kbd class="small ml-3">f</kbd>
        </b-button>
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
        <div
          class="navbar-brand mr-auto"
          :class="{ 'mt-3': largerLayout }"
          style="padding-top:.75rem"
        >
          <a href="/">
            <img
              src="/logo-solid-bg.svg"
              width="20"
              height="20"
              class="d-inline-block align-top mr-2 rounded-circle"
              :alt="$t('app.webCaptioner')"
            />
            <span class="d-none d-md-inline">{{ $t('app.webCaptioner') }}</span>
          </a>
        </div>

        <!-- Do not remove this from the DOM with v-if. Currently the volume meter needs to exist in order to populate microphoneName. -->
        <volume-meter
          v-bind:hidden="!captioningOn || waitingForInitialTranscript"
        ></volume-meter>

        <div
          v-if="waitingForInitialTranscript"
          class="navbar-text small text-primary mr-3"
          style="padding-top:.75rem"
        >
          <b-spinner small type="grow" />
          <strong>{{ $t('navbar.captioner.listening') }}</strong>
          <transition name="fade">
            <span v-if="microphoneName">&middot; {{ microphoneName }}</span>
          </transition>
        </div>
        <cast-button></cast-button>
        <transition name="fade">
          <share-button v-if="experiments.includes('share')"></share-button>
        </transition>
        <div
          v-if="
            showVmixNotFullySetUpMessage && !vmixNotFullySetUpMessageDismissed
          "
          class="mr-4"
        >
          <span class="navbar-text text-white pr-3 text-primary">
            <fa icon="exclamation-triangle" />
            {{ $t('navbar.vmixNotConnected') }}
          </span>
          <b-button-group size="sm">
            <b-button
              :to="localePath('captioner-settings-vmix')"
              @click="vmixNotFullySetUpMessageDismissed = true"
              variant="secondary"
              v-if="showVmixNotFullySetUpMessage"
              class="btn-sm"
              >{{ $t('common.setUpVerb') }}</b-button
            >
            <b-button
              @click="sendToVmix = false"
              :aria-label="$t('common.dismiss')"
            >
              <fa icon="times" />
            </b-button>
          </b-button-group>
        </div>
        <b-button-group
          :size="largerLayout ? 'lg' : ''"
          class="captioning-split-button"
        >
          <b-button
            id="startCaptioningDropdown"
            :class="incompatibleBrowser ? 'button-only-disabled' : ''"
            :variant="captioningToggleButtonVariant"
            @click="captioningToggleButtonClick"
            :disabled="$store.state.user.signedIn === null"
          >
            <div :class="{ 'px-4 py-2': largerLayout }">
              <span v-if="!this.captioningOn">
                <fa icon="microphone" fixed-width />
                <span v-show="!typingModeOn">{{
                  $t('navbar.captioner.startCaptioning')
                }}</span>
              </span>
              <span v-else>{{ $t('navbar.captioner.stopCaptioning') }}</span>
              <kbd v-show="largerLayout" class="small ml-3">c</kbd>
            </div>
          </b-button>
          <b-button
            v-if="experiments.includes('typingMode') && !typingModeOn"
            variant="primary"
            v-b-tooltip.top
            title="Start Typing (t)"
            @click="startTypingMode"
          >
            <fa icon="keyboard" />
          </b-button>
          <b-button
            v-if="typingModeOn"
            variant="danger"
            @click="stopTypingMode"
          >
            <fa icon="keyboard" />Done Typing
            <kbd>ESC</kbd>
          </b-button>
        </b-button-group>
        <b-popover
          target="navbar-settings-button"
          placement="top"
          :show.sync="showSettingsMenu"
          triggers="click blur"
          boundary="viewport"
          title
        >
          <settings-popup
            :shown="showSettingsMenu"
            @dismiss="showSettingsMenu = false"
          />
        </b-popover>

        <b-button
          id="navbar-settings-button"
          @click="showSettingsMenu = !showSettingsMenu"
          v-b-tooltip.top
          :title="showSettingsMenu ? ' ' : $t('navbar.menu.settings')"
          class="ml-2 text-white px-2 profile-button"
          style="position:relative"
          variant="info"
        >
          <!-- If there's a photo URL, show it on top of the fallback user-circle button -->
          <transition name="fade">
            <img
              :src="$store.state.user.photoURL"
              v-if="$store.state.user.signedIn && $store.state.user.photoURL"
              class="rounded-circle"
              style="max-width: 30px;position: absolute;margin-left: -2px;margin-top: -2px;"
            />
          </transition>
          <fa icon="user-circle" />
          <fa icon="ellipsis-v" size="xs" />
        </b-button>
      </div>
    </nav>
  </div>
</template>

<style>
.firebaseui-title {
  text-align: center !important;
}
</style>

<style scoped>
.button-only-disabled > .btn-primary:first-child {
  opacity: 0.6;
  cursor: default;
}
.profile-button {
  font-size: 1.5rem;
  line-height: 1.5rem;
}
</style>

<script>
import VolumeMeter from './VolumeMeter.vue';
import CastButton from '../components/CastButton.vue';
import ShareButton from '../components/ShareButton.vue';
import SettingsPopup from '../components/SettingsPopup.vue';
import saveToFile from '~/mixins/saveToFile';
import dateFormat from '~/mixins/dateFormat';
import {
  BButton,
  BButtonGroup,
  BTooltip,
  VBTooltip,
  BPopover,
  BSpinner,
} from 'bootstrap-vue';

export default {
  mixins: [saveToFile, dateFormat],
  components: {
    VolumeMeter,
    CastButton,
    SettingsPopup,
    ShareButton,
    BButton,
    BButtonGroup,
    BPopover,
    BSpinner,
    BTooltip,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data: function() {
    return {
      vmixNotFullySetUpMessageDismissed: false,
      showSettingsMenu: false,
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
    showSettingsMenu: function() {
      this.hideAllTooltips();
    },
  },
  methods: {
    hideAllTooltips: function() {
      this.$root.$emit('bv::hide::tooltip');
    },
    captioningToggleButtonClick: function() {
      if (this.captioningOn) {
        this.stopCaptioning();
      } else {
        this.startCaptioning();
      }
    },
    startCaptioning: function() {
      this.$store.dispatch('captioner/startManual');
      this.$router.push('/captioner');
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
