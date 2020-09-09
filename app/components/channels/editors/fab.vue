<template>
  <div>
    <!-- <img
      :src="channel.iconPath"
      class="w-100 col-6 d-block mx-auto mt-2 mb-3"
      alt="Zoom"
    /> -->
    <p class="lead text-center">
      FAB Subtitler
    </p>
    <!-- <hr /> -->
    <!-- <ol>
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
    </ol> -->
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
      <label for="port" class="font-weight-bold">TCP Port</label>
      <input
        id="port"
        name="port"
        v-model="port"
        autofocus
        class="form-control"
        type="url"
        placeholder="TCP Port"
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
    this.port = this.savedChannel?.parameters?.port || this.port;
  },
  data() {
    return {
      port: null,
    };
  },
  methods: {
    updateParameters() {
      this.$emit('parametersUpdated', {
        port: this.port,
      });

      if (this.port) {
        this.$emit('formValid');
      } else {
        this.$emit('formInvalid');
      }
    },
  },
  watch: {
    port: {
      immediate: true,
      handler() {
        this.updateParameters();
      },
    },
  },
};
</script>
