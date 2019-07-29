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
            />
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
            <fa icon="exclamation-triangle" />
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
              <fa icon="times" />
            </b-btn>
          </b-btn-group>
        </div>
        <b-btn-group :size="largerLayout ? 'lg' : ''" class="captioning-split-button">
          <b-btn
            id="startCaptioningDropdown"
            :class="incompatibleBrowser ? 'button-only-disabled' : ''"
            :variant="captioningToggleButtonVariant"
            @click="captioningToggleButtonClick"
            :disabled="$store.state.user.signedIn === null"
          >
            <div :class="{'px-4 py-2' : largerLayout}">
              <span v-if="!this.captioningOn">
                <fa icon="microphone" />
                <span v-show="!typingModeOn">{{$t('navbar.captioner.startCaptioning')}}</span>
              </span>
              <span v-else>{{$t('navbar.captioner.stopCaptioning')}}</span>
              <kbd v-show="largerLayout" class="small ml-3">c</kbd>
            </div>
          </b-btn>
          <b-btn
            v-show="experiments.includes('typingMode') && !typingModeOn"
            variant="primary"
            v-b-tooltip.top
            title="Start Typing (t)"
            @click="startTypingMode"
          >
            <fa icon="keyboard" />
          </b-btn>
          <b-btn v-if="typingModeOn" variant="danger" @click="stopTypingMode">
            <fa icon="keyboard" />Done Typing
            <kbd>ESC</kbd>
          </b-btn>
          <b-popover
            target="navbar-settings-button"
            placement="top"
            :show.sync="showSettingsMenu"
            triggers="click blur"
            boundary="viewport"
          >
            <b-btn-group vertical class="d-flex">
              <b-btn
                href="/"
                block
                variant="link"
                class="py-1"
                size="sm"
              >{{$t('navbar.menu.about')}}</b-btn>
              <b-btn
                href="/blog"
                block
                variant="link"
                class="py-1"
                size="sm"
              >{{$t('navbar.menu.blog')}}</b-btn>
              <b-btn
                href="/help"
                block
                variant="link"
                class="py-1"
                size="sm"
              >{{$t('navbar.menu.helpCenter')}}</b-btn>
              <b-btn
                href="/donate"
                block
                variant="link"
                class="py-1"
                size="sm"
              >{{$t('navbar.menu.donate')}}</b-btn>
              <b-btn
                href="/feedback"
                block
                variant="link"
                class="py-1"
                size="sm"
              >{{$t('navbar.menu.feedback')}}</b-btn>
            </b-btn-group>
            <hr />
            <b-btn-group class="d-flex">
              <b-btn
                :to="localePath('captioner-save-to-file')"
                variant="outline-secondary"
                v-b-tooltip.hover.top
                title="Save transcript"
              >
                <fa icon="save" />
              </b-btn>
              <b-btn
                variant="outline-secondary"
                v-b-tooltip.hover.top
                :title="$t('navbar.menu.newWindow')"
                @click="startDetachedMode"
              >
                <fa icon="window-restore" />
              </b-btn>
              <b-btn
                variant="outline-danger"
                :to="localePath('captioner-clear')"
                v-b-tooltip.hover.top
                title="Clear transcript"
              >
                <fa icon="trash-alt" />
              </b-btn>
            </b-btn-group>
            <hr />
            <b-btn block variant="secondary" :to="localePath('captioner-settings')">
              <fa icon="cog" class="mr-2" />
              {{$t('navbar.menu.settings')}}
            </b-btn>
          </b-popover>
          <b-tooltip target="navbar-settings-button" :title="$t('navbar.menu.menu')"></b-tooltip>
          <b-btn
            id="navbar-settings-button"
            @click="showSettingsMenu = !showSettingsMenu"
            v-b-tooltip.top
            :variant="captioningToggleButtonVariant"
          >
            <fa icon="bars" />
          </b-btn>
        </b-btn-group>
        <b-popover
          target="navbar-profile-button-logged-in"
          placement="top"
          :show.sync="showProfileMenu"
          triggers="click blur"
          boundary="viewport"
          title
        >
          <div style="min-width:240px">
            <img
              :src="$store.state.user.photoURL"
              v-if="$store.state.user.photoURL"
              class="rounded-circle float-left p-1 pr-2"
              style="max-width:50px"
            />
            <fa
              v-else
              icon="user-circle"
              style="font-size:2.5em"
              class="float-left mt-2 mr-2 text-muted"
            />

            <div class="pt-1" style="line-height:1.25rem">
              <span class="text-muted">
                Signed in
                <span v-if="$store.state.user.email || $store.state.user.displayName">as</span>
              </span>
              <div
                v-if="$store.state.user.email || $store.state.user.displayName"
              >{{$store.state.user.email || $store.state.user.displayName}}</div>
            </div>
            <div class="clearfix"></div>
            <hr />
            <b-btn variant="light" block class="text-center" @click="signOut()">Sign out</b-btn>
          </div>
        </b-popover>

        <!-- if logged in -->
        <b-tooltip target="navbar-profile-button-logged-in" title="Profile"></b-tooltip>
        <b-btn
          id="navbar-profile-button-logged-in"
          v-show="$store.state.user.signedIn"
          @click="showProfileMenu = !showProfileMenu"
          v-b-tooltip.top
          class="ml-2 text-white px-2 profile-button"
          style="position:relative"
          variant="link"
        >
          <!-- If there's a photo URL, show it on top of the fallback user-circle button -->
          <transition name="fade">
            <img
              :src="$store.state.user.photoURL"
              v-if="$store.state.user.photoURL"
              class="rounded-circle"
              style="max-width: 30px;position: absolute;margin-left: -2px;margin-top: -2px;"
            />
          </transition>
          <fa icon="user-circle" class="text-primary" />
        </b-btn>

        <!-- not logged in -->
        <b-tooltip target="navbar-profile-button-logged-out" title="Sign in or sign up"></b-tooltip>
        <b-btn
          id="navbar-profile-button-logged-out"
          v-show="!$store.state.user.signedIn"
          v-b-tooltip.top
          class="ml-2 text-white px-2 profile-button"
          variant="link"
          :to="localePath('captioner-sign-in')"
          :disabled="$store.state.user.signedIn === null"
        >
          <fa icon="user-circle" />
        </b-btn>
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
  opacity: 0.7;
}
.profile-button:hover,
.profile-button:active,
.profile-button:focus {
  opacity: 1;
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
import bTooltipDirective from 'bootstrap-vue/es/directives/tooltip/tooltip';
import bTooltipComponent from 'bootstrap-vue/es/components/tooltip/tooltip';
import bPopover from 'bootstrap-vue/es/components/popover/popover';

export default {
  mixins: [saveToFile, dateFormat],
  components: {
    VolumeMeter,
    CastButton,
    ShareButton,
    bBtn,
    bBtnGroup,
    bPopover,
    bTooltip: bTooltipComponent,
  },
  directives: {
    bTooltip: bTooltipDirective,
  },
  data: function() {
    return {
      vmixNotFullySetUpMessageDismissed: false,
      showSettingsMenu: false,
      showProfileMenu: false,
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
    showProfileMenu: function() {
      this.hideAllTooltips();
    },
    showSettingsMenu: function() {
      this.hideAllTooltips();
    },
  },
  methods: {
    hideAllTooltips: function() {
      this.$root.$emit('bv::hide::tooltip');
    },
    signOut: function() {
      this.showProfileMenu = false;
      setTimeout(() => {
        this.$firebase
          .auth()
          .signOut()
          .then(() => {
            // Success signing out
            // INIT_CHECK_AUTH_STATUS_WATCHER handles
            // updating the store and removing the user
            this.$store.commit('SHOW_TOAST', { toastName: 'signedOut' });
          });
      }, 350); // let popover fade out first to get around positioning issue on close
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