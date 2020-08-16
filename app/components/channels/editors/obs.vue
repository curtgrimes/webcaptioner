<template>
  <div>
    <img
      :src="channel.iconPath"
      class="w-100 col-6 d-block mx-auto mt-2 mb-3"
      alt="OBS Studio"
      style="max-height:4rem"
    />
    <p class="lead text-center">
      OBS Studio
    </p>
    <hr />
    <ol>
      <li>
        Make sure you are using
        <a href="https://obsproject.com/">OBS Studio</a> version 25 or later.
      </li>
      <li>
        Download and install the
        <a href="https://github.com/Palakis/obs-websocket/releases/latest"
          >OBS Websocket plugin</a
        >
        for your platform.
        <div class="alert alert-warning small p-3 my-1">
          <strong>MacOS users:</strong> Due to
          <a href="https://github.com/Palakis/obs-websocket/pull/546"
            >this issue</a
          >, you must use
          <a href="/static/obs-websocket-macos-74c1856.pkg"
            >this MacOS installer</a
          >
          until OBS Websocket releases a new version after 4.8.0.
        </div>
      </li>
      <li>Restart OBS if it's open.</li>
      <li>Go to Tools > WebSockets Server Settings.</li>
      <li>
        Enable the WebSockets server and set the port number and password
        (optional).
      </li>
      <li>Update the port number and password (optional) below.</li>
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
      <label for="obsServerPort" class="small">Server Port</label>
      <input
        id="obsServerPort"
        name="obsServerPort"
        v-model="obsServerPort"
        autofocus
        class="form-control mb-3"
        type="text"
        placeholder="Server Port"
      />

      <label for="password" class="small">Password</label>
      <input
        id="password"
        name="password"
        v-model="obsPassword"
        autofocus
        class="form-control"
        type="password"
        placeholder="Server Port"
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
      obsServerPort: 4444,
      obsPassword: null,
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
