<template>
  <div>
    <img
      :src="channel.iconPath"
      class="w-100 col-6 d-block mx-auto mt-2 mb-3"
      alt="OBS Studio"
      style="max-height: 4rem;"
    />
    <h3 class="text-center">
      OBS Studio
    </h3>
    <p class="lead text-center">
      Set up closed captioning with OBS.
    </p>
    <hr />
    <ol>
      <li>
        Make sure you are using
        <a href="https://obsproject.com/">OBS Studio</a> version 26.1 or later.
      </li>
      <li>
        Download and install the
        <a href="https://github.com/Palakis/obs-websocket/releases/latest"
          >OBS Websocket plugin</a
        >
        version 4.9.0 or later.
      </li>
      <li>Restart OBS if you currently have it open.</li>
      <li>In OBS, go to Tools > WebSockets Server Settings.</li>
      <li>
        Enable the WebSockets server and set the port number and password. The
        password is optional but recommended. If you are unsure of what port to
        use, try 8080.
      </li>
      <li>
        Update the port number and password below with the same port number and
        password (if you have one) that you set in the OBS WebSockets server
        settings above.
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
      <div class="d-flex">
        <label for="port" class="small mr-auto"
          >Server <span v-if="showHostField">Host and</span> Port</label
        >
        <a
          href="javascript:void(0)"
          class="small"
          @click="showHostField = !showHostField"
          >{{ showHostField ? 'Hide' : '' }} Advanced Settings</a
        >
      </div>
      <input
        v-if="showHostField"
        id="host"
        name="host"
        v-model="host"
        autofocus
        class="form-control mb-3"
        type="text"
        placeholder="Server Host"
      />
      <input
        id="port"
        name="port"
        v-model="port"
        autofocus
        class="form-control mb-3"
        type="text"
        placeholder="Server Port"
      />

      <label for="password" class="small">Password</label>
      <b-input-group>
        <b-form-input
          id="password"
          name="password"
          v-model="password"
          class="form-control"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
        ></b-form-input>
        <b-input-group-append>
          <b-button variant="light" @click="showPassword = !showPassword">
            <fa :icon="showPassword ? 'eye' : 'eye-slash'" />
          </b-button>
        </b-input-group-append>
      </b-input-group>
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
    this.host = this.savedChannel?.parameters?.host || 'localhost';
    this.port = this.savedChannel?.parameters?.port;
    this.password = this.savedChannel?.parameters?.password;

    this.showHostField = this.host && this.host !== 'localhost';
  },
  data() {
    return {
      host: null,
      port: 4444,
      password: null,
      showPassword: false,
      showHostField: false,
    };
  },
  methods: {
    handleParameterChange() {
      this.$emit('parametersUpdated', {
        host: this.host,
        port: this.port,
        ...(this.password ? { password: this.password } : {}),
      });

      if (this.port) {
        this.$emit('formValid');
      } else {
        this.$emit('formInvalid');
      }
    },
  },
  watch: {
    showHostField() {
      if (!this.showHostField) {
        this.host = null;
      }
    },
    host: {
      immediate: true,
      handler() {
        this.handleParameterChange();
      },
    },
    port: {
      immediate: true,
      handler() {
        this.handleParameterChange();
      },
    },
    password: {
      immediate: true,
      handler() {
        this.handleParameterChange();
      },
    },
  },
};
</script>
