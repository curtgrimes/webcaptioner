<template>
  <div class="settings-vmix-view">
    <p><a href="https://vmix.com" target="_blank">vMix</a> is a popular software video mixer and switcher. You can send text directly to vMix and display it in a title input. You can then use vMix's font and color controls to style captioned text. <a href="/help/integrations/vmix/">Visit the Help Center</a> to learn more.</p>
    <transition name="fade">
      <b-alert :show="showStep3SuccessMessage" variant="success" dismissible>
        <fa icon="check-circle" fixed-width/> Successfully set up vMix.
      </b-alert>
    </transition>
    <b-alert class="py-3 mb-4" show variant="secondary">
      <div class="row">
        <div class="col-sm-6">
          <p class="lead mb-0 pt-1 position-relative" style="top:2px">Send Captions to vMix</p>
        </div>
        <div class="col-sm-6 text-right">
          <span v-if="!setupComplete && !loading && sendToVmixOn" class="small badge badge-danger p-2 rounded">
            <fa icon="exclamation-triangle" class="mr-1" />
            Finish Setup
          </span>
          <b-button @click="sendToVmixOn = false" :variant="sendToVmixOn ? 'link' : 'secondary'">Off</b-button>
          <b-button @click="sendToVmixOn = true" :variant="sendToVmixOn ? 'secondary' : 'link'">On</b-button>
        </div>
      </div>
    </b-alert>
    <div class="position-relative">
      <transition name="fade">
        <b-btn @click="showSettings = true" v-if="setupComplete && !showSettings && !loading" variant="outline-secondary" class="position-absolute" style="top:0">Show Setup Instructions</b-btn>
      </transition>
      <b-btn v-if="loading" variant="default" disabled class="position-absolute text-muted" style="top:0">
        <!-- Haven't decided yet if settings will show or not -->
        <fa icon="spinner" spin /> Loading
      </b-btn>
      <transition name="fade">
        <div v-show="showSettings">
          <b-card no-body class="fade" :class="{'show' : showSettings, 'invisible': !showSettings}">
            <b-tabs small pills card class="nav-fill" v-model="vmixStepsTabIndex">
              <b-tab active>
                <template slot="title">
                  <div class="text-md-left">
                    <fa icon="check-circle" v-if="chromeExtensionInstalled" /> Step 1
                    <div class="small d-none d-md-block"><span class="d-none d-xl-inline">Install </span>Chrome Extension</div>
                  </div>
                </template>
                <h4 class="mt-0">Install the Chrome Extension</h4>
                <p class="mb-2">The Web Captioner Connector extension for Google Chrome lets Web Captioner connect to vMix.</p>
                <div class="mt-3 mb-4">
                  <b-button v-if="!chromeExtensionInstalled" @click="initChromeExtensionInstall" variant="outline-info"><fa :icon="['fab','chrome']" class="mr-2"/> Add to Chrome</b-button>
                  <b-button v-else variant="outline-info" disabled><fa icon="check-circle" class="mr-2" /> Extension Installed</b-button>
                </div>
                <hr class="my-3" />
                <div class="text-right">
                  <b-button @click="vmixStepsTabIndex = 1" size="sm" :variant="chromeExtensionInstalled ? 'secondary' : 'default'" :disabled="!chromeExtensionInstalled">Next <fa icon="chevron-right" /></b-button>
                </div>
              </b-tab>
              <b-tab :disabled="!chromeExtensionInstalled">
                <template slot="title">
                  <div class="text-md-left" id="vmixStep2Tab">
                    <fa icon="check-circle" v-if="webControllerConnected" /> Step 2
                    <div class="small d-none d-md-block">vMix Web Controller</div>
                  </div>
                  <b-tooltip v-if="!chromeExtensionInstalled" target="vmixStep2Tab">
                    Complete step 1 first
                  </b-tooltip>
                </template>
                <h4 class="mt-0">Enable the vMix Web Controller</h4>
                <p>In vMix, go to <strong>Settings > Web Controller</strong>. Check the box to enable the <a href="http://www.vmix.com/knowledgebase/article.aspx/69/how-to-control-vmix-from-a-web-browser-using-vmix-web-controller" target="_blank">web controller</a>. Specify a port number or accept the default.</p>
                <p>Provide the address that appears in vMix:</p>
                <b-input-group :class="{'append-embedded-in-input': webControllerConnected}">
                  <input @keydown="resetWebControllerConnectedStatus()" v-model="webControllerAddress" type="url" class="form-control" placeholder="vMix Web Controller Address" required="true" />
                  <template slot="append" v-if="webControllerConnected">
                    <div class="input-group-text text-success">
                      <fa icon="check-circle" fixed-width class="mr-3" style="position:relative;top:-1px"/> Connected
                    </div>
                  </template>
                </b-input-group>
                <p class="mt-2"><small class="form-text text-muted">Example: http://192.168.1.1:8080</small></p>
                <b-alert :show="showConnectionFailureMessage" dismissible variant="danger">Cannot connect to vMix at "{{webControllerAddress}}". Make sure Web Controller is enabled in vMix and that you've copied over the website address correctly. It should look something like this: http://192.168.1.1:8080</b-alert>
                <hr class="my-3" />
                <div class="text-right">
                  <b-button @click="step2NextClick()" size="sm" :variant="webControllerAddress == '' ? 'default' : 'secondary'" :disabled="!webControllerAddress || attemptingWebControllerConnect">
                    <div v-if="!attemptingWebControllerConnect">
                      Next <fa icon="chevron-right" />
                    </div>
                    <div v-else aria-label="Loading">
                      <fa icon="spinner" spin />
                    </div>
                  </b-button>
                </div>
              </b-tab>
              <b-tab :disabled="!webControllerConnected">
                <template slot="title">
                  <div class="text-md-left" id="vmixStep3Tab">
                    <fa icon="check-circle" v-if="foundTemplateInVmix" /> Step 3
                    <div class="small d-none d-md-block"><span class="d-none d-xl-inline">Import </span>Title Template</div>
                  </div>
                  <b-tooltip v-if="!webControllerConnected" target="vmixStep3Tab">
                    <span v-if="!chromeExtensionInstalled">Complete steps 1 and 2 first</span>
                    <span v-else>Complete step 2 first</span>
                  </b-tooltip>
                </template>
                <h4 class="mt-0">Import the Web Captioner Title Template into vMix</h4>
                <ol class="ml-0 mb-2">
                  <li>Download the <strong><a href="/public/web-captioner-title.xaml">Web Captioner vMix title template<fa icon="external-link-alt" fixed-width class="ml-1" /></a></strong>.</li>
                  <li>In vMix, go to <strong>Add Input > Title/XAML</strong>.</li>
                  <li>In the Input Select window, click <strong>Browse...</strong> in the upper right and open the Web Captioner title template you downloaded.</li>
                  <li>The title will appear in the <strong>Recent</strong> tab. Double-click it.</li>
                  <li>In the Title Editor that appears, optionally customize font and text size. Close it when you are finished.</li>
                </ol>
                <b-alert :show="showCantFindTemplateMessage" dismissible variant="danger">Web Captioner can connect to vMix, but it can't find the Web Captioner title template in an input.</b-alert>
                <hr class="my-3" />
                <div class="text-right">
                  <b-button v-if="!foundTemplateInVmix" @click="step3NextClick" size="sm" :variant="webControllerAddress == '' ? 'default' : 'secondary'" :disabled="webControllerAddress == '' || testingVmixTemplate">
                    <div v-if="!testingVmixTemplate">
                      Test and Finish Setup
                    </div>
                    <div v-else aria-label="Loading">
                      <fa icon="spinner" spin />
                    </div>
                  </b-button>
                  <b-button v-else disabled variant="outline-secondary">
                    <fa icon="check-circle" /> Setup Complete
                  </b-button>
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
    color:#aaa!important;
    cursor:default;
  }
  .nav-link.disabled:hover {
    background:#eee;
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

export default {
  name: 'settings-vmix-view',
  data: function() {
    return {
      loading: true,
      vmixStepsTabIndex: 0,
      showSettings: false,
      attemptingWebControllerConnect: false,
      testingVmixTemplate: false,
      testedVmixTemplateManually: false,
      showStep3SuccessMessage: false,
    };
  },
  mounted: function() {
    let self = this;
    this.refreshVmixSetupStatus()
      .then(function() {
        self.loading = false;
        if (self.setupComplete) {
          // Step 3 was completed.
          self.showSettings = false;
        }
        else if (self.webControllerConnected) {
          // Step 2 completed. Go to step 3.
          self.vmixStepsTabIndex = 2;
          self.showSettings = true;
        }
        else if (self.chromeExtensionInstalled) {
          // Step 1 completed. Go to step 2.
          self.vmixStepsTabIndex = 1;
          self.showSettings = true;
        }
        else {
          self.showSettings = true;
        }
      });
  },
  methods: {
    initChromeExtensionInstall: function () {
      let self = this;
      chrome.webstore.install(null, function() {
        // Successful
        self.refreshVmixSetupStatus();
      }, function() {
        // Unsuccessful
      });
    },
    refreshVmixSetupStatus: function () {
      return this.$store.dispatch('REFRESH_VMIX_SETUP_STATUS');
    },
    resetWebControllerConnectedStatus: function () {
      this.$store.commit('RESET_WEB_CONTROLLER_CONNECTED_STATUS');
    },
    step2NextClick: function() {
      this.attemptingWebControllerConnect = true;
      this.resetWebControllerConnectedStatus();

      let self = this;
      this.refreshVmixSetupStatus()
        .then(function() {
          self.attemptingWebControllerConnect = false;

          if (self.webControllerConnected) {
            // Go to step 3
            self.vmixStepsTabIndex = 2;
          }
        });
    },
    step3NextClick: function() {
      this.testingVmixTemplate = true;
      this.$store.commit('SET_VMIX_CACHED_INPUT_GUID', {guid: null});

      let self = this;
      this.refreshVmixSetupStatus()
        .then(function() {
          self.testingVmixTemplate = false;
          self.testedVmixTemplateManually = true;

          if (self.foundTemplateInVmix) {
            self.showSettings = false;
            self.showStep3SuccessMessage = true;
          }
        });
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
      get () {
        return this.$store.state.settings.integrations.vmix.webControllerAddress;
      },
      set (webControllerAddress) {
        this.$store.commit('SET_VMIX_WEB_CONTROLLER_ADDRESS', {webControllerAddress});
      }
    },
    showConnectionFailureMessage: function () {
      // Show the message if an address is set but we can't connect
      return Boolean(this.webControllerAddress) && this.webControllerConnected === false;
    },
    showCantFindTemplateMessage: function () {
      return !this.showConnectionFailureMessage
        && this.testedVmixTemplateManually
        && !this.foundTemplateInVmix
        && !this.testingVmixTemplate;
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
        this.$store.commit('SET_SEND_TO_VMIX', {on});
      }
    },
  },
}
</script>
