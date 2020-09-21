<template>
  <div>
    <a href="https://www.vmix.com/" target="_blank">
      <img
        :src="channel.iconPath"
        class="w-100 col-6 d-block mx-auto mt-2 mb-3"
        alt="vMix"
      />
    </a>
    <p class="lead text-center">
      Send real-time captions to
      <a href="https://www.vmix.com/" _target="blank">vMix</a>.
    </p>
    <hr />
    <ol>
      <li>
        You must be running vMix on the same computer that Web Captioner is
        running on.
      </li>
      <li>
        Download
        <a href="/web-captioner-title.xaml" target="_blank"
          >this title template</a
        >
        that will display captions in vMix. Import this title template into vMix
        by going to Add Input > Title/XAML. In the upper right of the Input
        Select window, click Browse... and select the title template file you
        downloaded. Click OK.
      </li>
      <li>
        In vMix, go to Settings > Web Controller and check the box to enable web
        controller.
      </li>
      <li>
        Set the port or accept the default.
      </li>
      <li>
        Copy and paste the "vMix Web Site Address" below.
      </li>
    </ol>
    <div class="card card-body">
      <div
        v-if="savedChannel && savedChannel.error"
        class="alert alert-warning small"
      >
        <strong class="text-danger">
          <fa icon="exclamation-triangle" /> Error:
        </strong>
        {{ savedChannel.error }}
      </div>
      <div v-if="unsavedChannelError" class="alert alert-warning small">
        <strong class="text-danger">
          <fa icon="exclamation-triangle" /> Error:
        </strong>
        {{ unsavedChannelError }}
      </div>
      <label for="vmixAddress" class="small">vMix Web Site Address</label>
      <b-input-group>
        <b-form-input
          id="vmixAddress"
          name="vmixAddress"
          v-model="vmixAddressFromUser"
          autofocus
          class="form-control"
          type="url"
          placeholder="vMix Web Site Address"
          :disabled="checkingVmixAddress"
        ></b-form-input>
        <b-input-group-append>
          <b-button
            @click="checkVmixAddress()"
            :disabled="!vmixAddress || checkingVmixAddress"
          >
            {{ checkingVmixAddress ? 'Checking...' : 'Check' }}
          </b-button>
        </b-input-group-append>
      </b-input-group>
      <p
        v-if="checkingVmixAddressSuccess"
        class="mb-0 text-success small mt-2 font-weight-bold"
      >
        Successfully connected!
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    channel: {
      required: true,
      type: Object,
    },
    savedChannel: {
      required: false,
      type: Object,
    },
  },
  mounted() {
    this.vmixAddress = this.savedChannel?.parameters?.vmixAddress;
    this.captionElementGuid = this.savedChannel?.parameters?.captionElementGuid;
    this.silentlyUseLocalhostInsteadOfGivenHost = this.savedChannel?.parameters?.silentlyUseLocalhostInsteadOfGivenHost;

    if (this.vmixAddress && this.captionElementGuid) {
      // This channel was already set up and now we're updating it.
      // Run the check immediately.
      this.checkVmixAddress();
    }

    this.vmixAddressFromUser = this.vmixAddress?.replace('/API', '');
  },
  data() {
    return {
      vmixAddress: null,
      captionElementGuid: null,
      silentlyUseLocalhostInsteadOfGivenHost: null,

      vmixAddressFromUser: null, // the URL from the user, not cleaned up
      checkingVmixAddress: false,
      checkingVmixAddressSuccess: false,
      unsavedChannelError: null,
    };
  },
  methods: {
    async checkVmixAddress() {
      if (!this.vmixAddress) {
        return;
      }
      this.unsavedChannelError = null;
      this.checkingVmixAddress = true;
      this.checkingVmixAddressSuccess = false;

      this.silentlyUseLocalhostInsteadOfGivenHost = false;

      let localhostUrlAlternative = new URL(this.vmixAddress);
      localhostUrlAlternative.hostname = 'localhost';
      localhostUrlAlternative.protocol = 'http:';

      try {
        let vmixResponse;
        try {
          vmixResponse = await Promise.race([
            this.$axios.get(this.vmixAddress),
            // if it doesn't respond quickly enough, reject any future response and assume we can't connect
            new Promise((resolve) => setTimeout(resolve, 1500)),
          ]);
        } catch (e) {}

        if (!vmixResponse) {
          // Try localhost instead
          try {
            vmixResponse = await Promise.race([
              this.$axios.get(localhostUrlAlternative),

              // if it doesn't respond quickly enough, reject any future response and assume we can't connect
              new Promise((resolve) => setTimeout(resolve, 1500)),
            ]);
          } catch (e) {}

          if (vmixResponse) {
            // That worked -- use localhost instead (silently -- don't show any indiciation in the UI)
            this.silentlyUseLocalhostInsteadOfGivenHost = true;
          }
        }

        if (!vmixResponse) {
          throw new Error(
            `Web Captioner is unable to communicate with vMix, or vMix didn't respond quickly enough. Is the vMix address correct and vMix's Web Controller is turned on?`
          );
        }

        let vmixResponseXML = vmixResponse.data;
        // There is an <input></input> element in vMix's response that isn't a proper
        // <input> element. The browser automatically interprets it as a self-closing
        // <input> tag. We need to rename it to something unique so we can get its children.
        vmixResponseXML = vmixResponseXML
          .replace(/<input /gi, '<webcaptioner-vmix-input ')
          .replace(/\<\/input\>/gi, '</webcaptioner-vmix-input>');

        const xmlDOM = new DOMParser().parseFromString(
          vmixResponseXML,
          'application/xml'
        );

        const captionElementGuid = xmlDOM
          .querySelector('text[name="WebCaptionerCaptions"]')
          ?.parentElement?.getAttribute('key');

        if (!captionElementGuid) {
          throw new Error(
            "Web Captioner can successfully connect to vMix, but it can't find the Web Captioner title template in an input."
          );
        }

        // At this point, we've verified that the vMix address is valid
        // and we found an instance of the captioning template in an input
        this.captionElementGuid = captionElementGuid;
        this.$emit('parametersUpdated', {
          vmixAddress: this.vmixAddress.toString(),
          captionElementGuid: this.captionElementGuid,
          silentlyUseLocalhostInsteadOfGivenHost: this
            .silentlyUseLocalhostInsteadOfGivenHost,
        });
        this.checkingVmixAddressSuccess = true;
        this.$emit('formValid');
      } catch (e) {
        this.unsavedChannelError =
          e?.message || 'Something went wrong. Try again.';
        this.$emit('formInvalid');
      } finally {
        this.checkingVmixAddress = false;
      }
    },
  },
  watch: {
    vmixAddressFromUser: {
      immediate: true,
      handler(vmixAddressFromUser) {
        try {
          const url = new URL(vmixAddressFromUser);
          this.vmixAddress = url.origin + '/API';
        } catch (e) {
          // not a valid URL
          this.vmixAddress = null;
        }
      },
    },
  },
};
</script>
