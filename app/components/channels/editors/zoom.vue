<template>
  <div>
    <img
      :src="channel.iconPath"
      class="w-100 col-6 d-block mx-auto mt-2 mb-3"
      alt="Zoom"
    />
    <p class="lead text-center">
      Send real-time captions to a Zoom meeting.
    </p>
    <hr />
    <ol>
      <li>
        <a
          href="https://support.zoom.us/hc/en-us/articles/207279736-closed-captioning#h_4cb4e874-d574-4e40-ab12-7d8fae1f71cc"
          target="_blank"
          >Enable closed captioning</a
        >
        in your Zoom account.
      </li>
      <li>
        In a Zoom meeting or webinar that you are hosting, click the Closed
        Caption button.
      </li>
      <li>
        <a
          href="https://support.zoom.us/hc/en-us/articles/207279736-closed-captioning#h_45f95867-9c71-4acd-888f-5a1475b4cd8e"
          target="_blank"
          >Choose the "Copy API token" option</a
        >
        and paste the token here.
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
      <label for="zoomApiToken" class="small">Zoom API Token</label>
      <input
        id="zoomApiToken"
        name="zoomApiToken"
        v-model="zoomApiToken"
        autofocus
        class="form-control"
        type="url"
        placeholder="Zoom API Token"
      />
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
    this.zoomApiToken = this.savedChannel?.parameters?.zoomApiToken;
  },
  data() {
    return {
      zoomApiToken: null,
    };
  },
  watch: {
    zoomApiToken: {
      immediate: true,
      handler(zoomApiToken) {
        this.$emit('parametersUpdated', {
          zoomApiToken,
        });

        if (this.zoomApiToken) {
          this.$emit('formValid');
        } else {
          this.$emit('formInvalid');
        }
      },
    },
  },
};
</script>
