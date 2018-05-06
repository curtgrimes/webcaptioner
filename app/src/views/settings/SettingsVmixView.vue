<template>
  <div class="settings-vmix-view">
    <p><a href="https://vmix.com" target="_blank">vMix</a> is a popular software video mixer and switcher. You can send text directly to vMix and display it in a title input. You can then use vMix's font and color controls to style captioned text. <a href="/help/integrations/vmix/">Visit the Help Center</a> to learn more.</p>
    <b-card no-body>
      <b-tabs small pills card class="nav-fill" v-model="vmixStepsTabIndex">
        <b-tab active>
          <template slot="title">
            <div class="text-md-left">
              <i class="fa fa-check" v-if="chromeExtensionInstalled" aria-hidden="true"></i> Step 1
              <div class="small d-none d-md-block"><span class="d-none d-xl-inline">Install </span>Chrome Extension</div>
            </div>
          </template>
          <h4 class="mt-0">Install the Chrome Extension</h4>
          <p class="mb-2">The Web Captioner Connector extension for Google Chrome lets Web Captioner connect to vMix.</p>
          <div class="mt-3 mb-4">
            <b-button v-if="!chromeExtensionInstalled" @click="initChromeExtensionInstall" variant="outline-info"><i class="fa fa-chrome mr-2"></i>Add to Chrome</b-button>
            <b-button v-else variant="outline-info" disabled><i class="fa fa-check mr-2"></i>Extension Installed</b-button>
          </div>
          <hr class="my-3" />
          <div class="text-right">
            <b-button @click="vmixStepsTabIndex = 1" size="sm" :variant="chromeExtensionInstalled ? 'secondary' : 'default'" :disabled="!chromeExtensionInstalled">Next <i class="fa fa-chevron-right" aria-hidden="true"></i></b-button>
          </div>
        </b-tab>
        <b-tab :disabled="!chromeExtensionInstalled">
          <template slot="title">
            <div class="text-md-left" id="vmixStep2Tab">
              Step 2
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
                <i class="fa fa-check fa-fw pr-3" style="position:relative;top:-1px" aria-hidden="true"></i> Connected
              </div>
            </template>
          </b-input-group>
          <p class="mt-2"><small class="form-text text-muted">Example: http://192.168.1.1:8080</small></p>
          <b-alert :show="showConnectionFailureMessage" dismissible variant="danger">Cannot connect to vMix. Make sure Web Controller is enabled in vMix and that you've copied over the website address correctly. It should look something like this: http://192.168.1.1:8080</b-alert>
          <hr class="my-3" />
          <div class="text-right">
            <b-button @click="refreshVmixSetupStatus()" size="sm" :variant="webControllerAddress == '' ? 'default' : 'secondary'" :disabled="webControllerAddress == ''">Next <i class="fa fa-chevron-right" aria-hidden="true"></i></b-button>
          </div>
        </b-tab>
        <b-tab>
          <template slot="title">
            <div class="text-md-left">
              Step 3
              <div class="small d-none d-md-block"><span class="d-none d-xl-inline">Import </span>Title Template</div>
            </div>
          </template>
          <h4 class="mt-0">Import the Web Captioner Title Template into vMix</h4>
          <ol class="ml-0 mb-2">
            <li>Download the Web Captioner vMix title template:<br/> <a href="/web-captioner-title.xaml" class="btn btn-outline-info mt-1 mb-2">Web Captioner vMix Title Template <i class="fa fa-external-link ml-1" aria-hidden="true"></i></a></li>
            <li>In vMix, go to <strong>Add Input > Title/XAML</strong>. In the upper right of the Input Select window, click <strong>Browse...</strong> and open the Web Captioner title template.</li>
            <li>The title will appear in the <strong>Recent</strong> tab. Double-click it.</li>
            <li>In the Title Editor that appears, optionally customize font and text size. Close it when you are finished.</li>
          </ol>
          <hr class="my-3" />
          <div class="text-right">
            <b-button size="sm" :variant="webControllerAddress == '' ? 'default' : 'secondary'" :disabled="webControllerAddress == ''">Test and Finish Setup</b-button>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>
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
      vmixStepsTabIndex: 0,
    };
  },
  mounted: function() {
    this.refreshVmixSetupStatus();
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
      this.$store.dispatch('REFRESH_VMIX_SETUP_STATUS');
    },
    resetWebControllerConnectedStatus: function () {
      this.$store.commit('RESET_WEB_CONTROLLER_CONNECTED_STATUS');
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
        return this.$store.state.integrations.vmix.webControllerAddress;
      },
      set (webControllerAddress) {
        this.$store.commit('SET_VMIX_WEB_CONTROLLER_ADDRESS', {webControllerAddress});
      }
    },
    showConnectionFailureMessage: function () {
      return this.webControllerAddress != '' && this.webControllerConnected === false;
    },
  },
}
</script>
