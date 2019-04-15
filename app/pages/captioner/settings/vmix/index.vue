<template>
  <div class="settings-vmix-view">
    <i18n path="settings.vmix.description.text" tag="p">
      <a place="vMix" href="https://vmix.com" target="_blank">{{$t('settings.vmix.vmix')}}</a>
      <a
        place="visitTheHelpCenter"
        href="/help/integrations/vmix/"
      >{{$t('settings.vmix.description.visitTheHelpCenter')}}</a>
    </i18n>
    <transition name="fade">
      <b-alert :show="showStep3SuccessMessage" variant="success">
        <fa icon="check-circle" fixed-width/>
        {{$t('settings.vmix.connectedToVmix')}}
        <i18n path="settings.vmix.captionsWillAppear" tag="span">
          <router-link
            place="startCaptioning"
            to="/captioner"
            class="alert-link"
          >{{$t('settings.vmix.startCaptioning')}}</router-link>
        </i18n>
      </b-alert>
    </transition>
    <div v-if="setupComplete && !showSettings">
      <div class="row">
        <div class="col-6 pt-2">{{$t('settings.vmix.connectToVmix')}}</div>
        <div class="col-6 text-right">
          <b-btn
            @click="sendToVmixOn = false"
            :variant="sendToVmixOn ? 'link' : 'outline-secondary'"
            size="sm"
          >{{$t('common.off')}}</b-btn>
          <b-btn
            @click="sendToVmixOn = true"
            :variant="sendToVmixOn ? 'secondary' : 'link'"
            size="sm"
          >{{$t('common.on')}}</b-btn>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-4 col-sm-6 pt-sm-2">{{$t('settings.vmix.webControllerAddress')}}</div>
        <div class="col-8 col-sm-6 text-right">
          <b-input-group size="sm">
            <b-form-input type="text" v-model="webControllerAddressLocalCopy"></b-form-input>
            <b-input-group-append>
              <b-btn
                variant="outline-secondary"
                style="padding:.35rem 1rem .425rem 1rem"
                @click="updateWebControllerAddress()"
              >{{$t('common.update')}}</b-btn>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-4 col-sm-6 pt-sm-2">{{$t('settings.vmix.sendTestMessage')}}</div>
        <div class="col-8 col-sm-6 text-right">
          <b-input-group size="sm">
            <b-form-input type="text" v-model="testMessage"></b-form-input>
            <b-input-group-append>
              <b-btn
                variant="outline-secondary"
                style="padding:.35rem 1rem .425rem 1rem"
                @click="sendTestMessage()"
                :disabled="testMessageSent"
              >
                <span v-if="!testMessageSent">Send</span>
                <span v-else>{{$t('settings.vmix.sent')}}</span>
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <hr>
      <div class="row mb-2">
        <div class="col-6 pt-2">{{$t('common.setup')}}</div>
        <div class="col-6 text-right">
          <b-btn
            @click="showSettings = !showSettings; vmixStepsTabIndex = 2"
            :variant="showSettings ? 'secondary' : 'outline-secondary'"
            size="sm"
          >
            <span v-if="showSettings">{{$t('common.hideSetup')}}</span>
            <span v-else>{{$t('common.showSetup')}}</span>
          </b-btn>
        </div>
      </div>
    </div>

    <div class="position-relative">
      <b-btn
        v-if="loading"
        variant="default"
        disabled
        class="position-absolute text-muted"
        style="top:0"
      >
        <!-- Haven't decided yet if settings will show or not -->
        <fa icon="spinner" spin/>
        {{$t('common.loading')}}
      </b-btn>
      <transition name="fade">
        <div v-show="showSettings">
          <b-card no-body class="fade" :class="{'show' : showSettings, 'invisible': !showSettings}">
            <b-tabs small pills card class="nav-fill" v-model="vmixStepsTabIndex">
              <b-tab active>
                <template slot="title">
                  <div class="text-md-left">
                    <fa icon="check-circle" v-if="chromeExtensionInstalled"/>
                    {{$t('settings.vmix.step1')}}
                    <div class="small d-none d-md-block">
                      <span class="d-inline d-xl-none">{{$t('common.install')}}</span>
                      <span
                        class="d-none d-xl-inline"
                      >{{$t('settings.vmix.installChromeExtension')}}</span>
                    </div>
                  </div>
                </template>
                <h4 class="mt-0">{{$t('settings.vmix.installChromeExtension')}}</h4>
                <p class="mb-2">{{$t('settings.vmix.installChromeExtensionDescription')}}</p>
                <div class="mt-3 mb-4">
                  <a
                    href="https://chrome.google.com/webstore/detail/web-captioner-connector/fckappdcgnijafmmjkcmicdidflhelfe"
                    target="_blank"
                    v-if="!chromeExtensionInstalled"
                    class="btn btn-outline-info"
                  >
                    <fa :icon="['fab','chrome']" class="mr-2"/>
                    {{$t('settings.vmix.addToChrome')}}
                  </a>
                  <b-btn v-else variant="outline-success" disabled>
                    <fa icon="check-circle" class="mr-2"/>
                    {{$t('settings.vmix.extensionInstalled')}}
                  </b-btn>
                </div>
                <b-alert
                  :show="showExtensionNotInstalledMessage"
                  variant="danger"
                >{{$t('settings.vmix.extensionNotInstalled')}}</b-alert>
                <hr class="my-3">
                <div class="text-right">
                  <b-btn
                    @click="step1NextClick()"
                    size="sm"
                    :variant="chromeExtensionInstalled ? 'secondary' : 'default'"
                  >
                    {{$t('common.next')}}
                    <fa icon="chevron-right"/>
                  </b-btn>
                </div>
              </b-tab>
              <b-tab :disabled="!chromeExtensionInstalled">
                <template slot="title">
                  <div class="text-md-left" id="vmixStep2Tab">
                    <fa icon="check-circle" v-if="webControllerConnected"/>
                    {{$t('settings.vmix.step2')}}
                    <div class="small d-none d-md-block">{{$t('settings.vmix.vmixWebController')}}</div>
                  </div>
                  <b-tooltip
                    v-if="!chromeExtensionInstalled"
                    target="vmixStep2Tab"
                  >{{$t('settings.vmix.completeStep1First')}}</b-tooltip>
                </template>
                <h4 class="mt-0">{{$t('settings.vmix.enableVmixWebController')}}</h4>
                <i18n path="settings.vmix.enableVmixWebControllerInstructions" tag="p">
                  <strong
                    place="settingMenu"
                  >{{$t('settings.vmix.enableVmixWebControllerSettingMenu')}}</strong>
                  <a
                    place="webController"
                    href="http://www.vmix.com/knowledgebase/article.aspx/69/how-to-control-vmix-from-a-web-browser-using-vmix-web-controller"
                    target="_blank"
                  >{{$t('settings.vmix.webController')}}</a>
                </i18n>
                <p>{{$t('settings.vmix.provideAddress')}}</p>
                <b-input-group :class="{'append-embedded-in-input': webControllerConnected}">
                  <input
                    @keydown="resetWebControllerConnectedStatus()"
                    v-model="webControllerAddress"
                    type="url"
                    class="form-control"
                    :placeholder="$t('settings.vmix.webControllerAddress')"
                    required="true"
                  >
                  <template slot="append" v-if="webControllerConnected">
                    <div class="input-group-text text-success">
                      <fa
                        icon="check-circle"
                        fixed-width
                        class="mr-3"
                        style="position:relative;top:-1px"
                      />
                      {{$t('settings.vmix.connected')}}
                    </div>
                  </template>
                </b-input-group>
                <p class="mt-2">
                  <small
                    class="form-text text-muted"
                  >{{$t('settings.vmix.example')}} http://192.168.1.1:8080</small>
                </p>
                <b-alert :show="showConnectionFailureMessage" dismissible variant="danger">
                  <i18n path="settings.vmix.cannotConnect" tag="span">
                    <span place="webControllerAddress">{{webControllerAddress}}</span>
                  </i18n>
                </b-alert>
                <hr class="my-3">
                <div class="text-right">
                  <b-btn
                    @click="step2NextClick()"
                    size="sm"
                    :variant="webControllerAddress == '' ? 'default' : 'secondary'"
                    :disabled="!webControllerAddress || attemptingWebControllerConnect"
                  >
                    <div v-if="!attemptingWebControllerConnect">
                      {{$t('common.next')}}
                      <fa icon="chevron-right"/>
                    </div>
                    <div v-else aria-label="Loading">
                      <fa icon="spinner" spin/>
                    </div>
                  </b-btn>
                </div>
              </b-tab>
              <b-tab :disabled="!webControllerConnected">
                <template slot="title">
                  <div class="text-md-left" id="vmixStep3Tab">
                    <fa icon="check-circle" v-if="foundTemplateInVmix"/>
                    {{$t('settings.vmix.step3')}}
                    <div class="small d-none d-md-block">
                      <span class="d-inline d-xl-none">{{$t('settings.vmix.import')}}</span>
                      <span class="d-none d-xl-inline">{{$t('settings.vmix.importTitleTemplate')}}</span>
                    </div>
                  </div>
                  <b-tooltip v-if="!webControllerConnected" target="vmixStep3Tab">
                    <span
                      v-if="!chromeExtensionInstalled"
                    >{{$t('settings.vmix.completeSteps1And2First')}}</span>
                    <span v-else>{{$t('settings.vmix.completeStep2First')}}</span>
                  </b-tooltip>
                </template>
                <h4 class="mt-0">{{$t('settings.vmix.importTitleTemplateLonger')}}</h4>
                <ol class="ml-0 mb-2">
                  <li>
                    <i18n path="settings.vmix.importTitleTemplateInstructions.i0" tag="span">
                      <strong place="webCaptionerTitleTemplate">
                        <a href="/web-captioner-title.xaml">
                          {{$t('settings.vmix.webCaptionerTitleTemplate')}}
                          <span class="ml-1">
                            <fa icon="external-link-alt" fixed-width/>
                          </span>
                        </a>
                      </strong>
                    </i18n>
                  </li>
                  <li>
                    <i18n path="settings.vmix.importTitleTemplateInstructions.i1" tag="span">
                      <strong place="addInputSetting">Add Input > Title/XAML</strong>
                    </i18n>
                  </li>
                  <li>
                    <i18n path="settings.vmix.importTitleTemplateInstructions.i2" tag="span">
                      <strong place="inputSelect">Input Select</strong>
                      <strong place="browse">Browse...</strong>
                    </i18n>
                  </li>
                  <li>
                    <i18n path="settings.vmix.importTitleTemplateInstructions.i3" tag="span">
                      <strong place="recent">Recent</strong>
                    </i18n>
                  </li>
                  <li>{{$t('settings.vmix.importTitleTemplateInstructions.i4')}}</li>
                </ol>
                <b-alert
                  :show="showCantFindTemplateMessage"
                  dismissible
                  variant="danger"
                >{{$t('settings.vmix.cantFindTemplate')}}</b-alert>
                <hr class="my-3">
                <div class="text-right">
                  <b-btn
                    @click="step3NextClick"
                    size="sm"
                    :variant="webControllerAddress == '' ? 'default' : 'secondary'"
                    :disabled="webControllerAddress == '' || testingVmixTemplate"
                  >
                    <div v-if="!testingVmixTemplate">{{$t('settings.vmix.testAndFinishSetup')}}</div>
                    <div v-else aria-label="Loading">
                      <fa icon="spinner" spin/>
                    </div>
                  </b-btn>
                </div>
              </b-tab>
            </b-tabs>
          </b-card>
        </div>
      </transition>
    </div>
  </div>
</template>

<style>
.nav-link.disabled {
  color: #aaa !important;
  cursor: default;
}
.nav-link.disabled:hover {
  background: #eee;
}

.input-group.append-embedded-in-input input {
  border-right: 0px solid transparent;
}

.input-group.append-embedded-in-input .input-group-append .input-group-text {
  background-color: transparent;
  border-left: 0px solid transparent;
}
</style>


<script>
import bAlert from 'bootstrap-vue/es/components/alert/alert';
import bBtn from 'bootstrap-vue/es/components/button/button';
import bCard from 'bootstrap-vue/es/components/card/card';
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input';
import bInputGroup from 'bootstrap-vue/es/components/input-group/input-group';
import bInputGroupAppend from 'bootstrap-vue/es/components/input-group/input-group-append';
import bTabs from 'bootstrap-vue/es/components/tabs/tabs';
import bTab from 'bootstrap-vue/es/components/tabs/tab';
import bTooltip from 'bootstrap-vue/es/components/tooltip/tooltip';

export default {
  components: {
    bAlert,
    bBtn,
    bCard,
    bFormInput,
    bInputGroup,
    bInputGroupAppend,
    bTabs,
    bTab,
    bTooltip,
  },
  transition: 'fade',
  middleware: ['settings-meta'],
  meta: {
    settingsPageTitleKey: 'settings.vmix.vmix',
  },
  data: function() {
    return {
      loading: true,
      vmixStepsTabIndex: 0,
      showSettings: false,
      attemptingWebControllerConnect: false,
      showExtensionNotInstalledMessage: false,
      testingVmixTemplate: false,
      testedVmixTemplateManually: false,
      showStep3SuccessMessage: false,
      webControllerAddressLocalCopy: null,
      testMessage: '',
      testMessageSent: false,
    };
  },
  mounted: function() {
    let self = this;
    this.refreshVmixSetupStatus().then(() => {
      self.$nextTick(() => {
        setTimeout(() => {
          // Todo: Figure out how to avoid hacky timeout
          self.loading = false;
          if (self.setupComplete) {
            // Step 3 was completed.
            self.showSettings = false;
          } else if (self.webControllerConnected) {
            // Step 2 completed. Go to step 3.
            self.vmixStepsTabIndex = 2;
            self.showSettings = true;
          } else if (self.chromeExtensionInstalled) {
            // Step 1 completed. Go to step 2.
            self.vmixStepsTabIndex = 1;
            self.showSettings = true;
          } else {
            // Step 1 hasn't been completed
            self.showSettings = true;
          }
        }, 500);
      });
    });

    this.webControllerAddressLocalCopy = this.webControllerAddress;

    this.$watch('webControllerAddress', function() {
      this.webControllerAddressLocalCopy = this.webControllerAddress;
    });

    // Determine if Chrome extension was installed
    // setInterval(this.refreshVmixSetupStatus, 1000);
  },
  methods: {
    // No longer doing this because Chrome is now disallowing this kind of install
    // initChromeExtensionInstall: function () {
    //   let self = this;
    //   chrome.webstore.install(null, function() {
    //     // Successful
    //     self.refreshVmixSetupStatus();
    //     // Go to step 2
    //     self.vmixStepsTabIndex = 1;
    //   }, function() {
    //     // Unsuccessful
    //   });
    // },
    updateWebControllerAddress: function() {
      this.webControllerAddress = this.webControllerAddressLocalCopy;
      this.loading = true;

      let self = this;
      this.refreshVmixSetupStatus().then(function() {
        self.loading = false;

        if (!self.setupComplete) {
          self.showSettings = true;
          self.vmixStepsTabIndex = 1;
        } else {
          self.showStep3SuccessMessage = true;
        }
      });
    },
    refreshVmixSetupStatus: function() {
      return this.$store.dispatch('REFRESH_VMIX_SETUP_STATUS', {
        chromeExtensionId: this.$env.CHROME_EXTENSION_ID,
      });
    },
    resetWebControllerConnectedStatus: function() {
      this.$store.commit('RESET_WEB_CONTROLLER_CONNECTED_STATUS');
    },
    step1NextClick: function() {
      this.refreshVmixSetupStatus().then(() => {
        if (this.chromeExtensionInstalled) {
          this.showExtensionNotInstalledMessage = false;
          this.vmixStepsTabIndex = 1;
        } else {
          this.showExtensionNotInstalledMessage = true;
        }
      });
    },
    step2NextClick: function() {
      this.attemptingWebControllerConnect = true;
      this.resetWebControllerConnectedStatus();

      let self = this;
      this.refreshVmixSetupStatus().then(function() {
        self.attemptingWebControllerConnect = false;

        if (self.setupComplete) {
          self.showStep3SuccessMessage = true;
          self.showSettings = false;
          self.sendToVmixOn = true;
        } else if (self.webControllerConnected) {
          // Go to step 3
          self.vmixStepsTabIndex = 2;
        }
      });
    },
    step3NextClick: function() {
      this.testingVmixTemplate = true;
      this.$store.commit('SET_VMIX_CACHED_INPUT_GUID', { guid: null });

      let self = this;
      this.refreshVmixSetupStatus().then(function() {
        self.testingVmixTemplate = false;
        self.testedVmixTemplateManually = true;

        if (self.foundTemplateInVmix) {
          self.showSettings = false;
          self.showStep3SuccessMessage = true;
          self.sendToVmixOn = true;
        }
      });
    },
    sendTestMessage: function() {
      this.$store.dispatch('SEND_TO_VMIX', {
        text: this.testMessage,
        chromeExtensionId: this.$env.CHROME_EXTENSION_ID,
      });
      this.testMessageSent = true;
      let self = this;
      setTimeout(function() {
        self.testMessageSent = false;
      }, 1000);
    },
  },
  computed: {
    chromeExtensionInstalled: function() {
      return this.$store.state.integrations.vmix.chromeExtensionInstalled;
    },
    webControllerConnected: function() {
      return this.$store.state.integrations.vmix.webControllerConnected;
    },
    webControllerAddress: {
      get() {
        return this.$store.state.settings.integrations.vmix
          .webControllerAddress;
      },
      set(webControllerAddress) {
        this.$store.commit('SET_VMIX_WEB_CONTROLLER_ADDRESS', {
          webControllerAddress,
        });

        this.showStep3SuccessMessage = false;
      },
    },
    showConnectionFailureMessage: function() {
      // Show the message if an address is set but we can't connect
      return (
        Boolean(this.webControllerAddress) &&
        this.webControllerConnected === false
      );
    },
    showCantFindTemplateMessage: function() {
      return (
        !this.showConnectionFailureMessage &&
        this.testedVmixTemplateManually &&
        !this.foundTemplateInVmix &&
        !this.testingVmixTemplate
      );
    },
    foundTemplateInVmix: function() {
      return Boolean(this.$store.state.integrations.vmix.cachedInputGUID);
    },
    setupComplete: function() {
      // If this is null, setup isn't complete
      return Boolean(this.foundTemplateInVmix);
    },
    sendToVmixOn: {
      get() {
        return this.$store.state.settings.integrations.vmix.on;
      },
      set(on) {
        this.$store.commit('SET_SEND_TO_VMIX', { on });
      },
    },
  },
};
</script>
