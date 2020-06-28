<template>
  <div>
    <div class="d-flex align-items-center justify-content-center">
      <img
        v-if="channel.iconPath"
        :src="channel.iconPath"
        class="w-100 col-6 d-block mx-auto mt-2 mb-3"
        alt="Zoom"
      />
      <span v-else-if="channel.iconName" class="d-flex align-items-center mb-2">
        <fa :icon="channel.iconName" size="3x" />
        <span class="pl-2 font-weight-bold h4 mb-0">{{ channel.name }}</span>
      </span>
    </div>
    <p class="lead text-center">
      Receive real-time HTTP notifications of captioning events in your own
      application.
    </p>
    <hr />
    <b-button
      v-b-toggle.webhook-documentation
      class="mb-2 ml-n3 text-secondary"
      variant="link"
    >
      <fa icon="chevron-right" class="when-closed" fixed-width /><fa
        icon="chevron-down"
        class="when-open"
        fixed-width
      /><span class="pl-1">Documentation</span>
    </b-button>
    <b-collapse id="webhook-documentation">
      <p class="font-weight-bold mb-0">Request Body</p>
      <p>Your application should expect to receive this.</p>

      <div class="card bg-lighter p-3 mb-2 small">
        <pre class="m-0">
{
  "transcript": "Hello",
  "sequence": 2
}</pre
        >
      </div>
      <ul>
        <li>
          <tt class="font-weight-bold">transcript</tt> &mdash; A string of the
          word or words that were spoken.
        </li>
        <li>
          <tt class="font-weight-bold">sequence</tt> &mdash; An integer that
          increments by 1 on every webhook call. Starts at 0. Resets back to 0
          every time the Web Captioner page is reloaded, but it does not start
          from 0 if captioning is manually stopped and started again by the
          user.
        </li>
      </ul>
    </b-collapse>
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
      <label for="url" class="small">URL</label>
      <input
        id="url"
        name="url"
        v-model="parameters.url"
        autofocus
        class="form-control mb-3"
        type="url"
        placeholder="URL"
      />

      <label for="method" class="small">Method</label>
      <select
        class="form-control"
        id="method"
        name="method"
        v-model="parameters.method"
      >
        <option value="post">POST</option>
        <option value="put">PUT</option>
      </select>
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
    if (this.savedChannel) {
      this.parameters.url = this.savedChannel.parameters?.url;
      this.parameters.method = this.savedChannel.parameters?.method;
    }
  },
  data() {
    return {
      parameters: {
        url: null,
        method: 'post',
      },
    };
  },
  watch: {
    parameters: {
      immediate: true,
      deep: true,
      handler({ url, method }) {
        this.$emit('parametersUpdated', {
          url,
          method,
        });

        if (url && method) {
          this.$emit('formValid');
        } else {
          this.$emit('formInvalid');
        }
      },
    },
  },
};
</script>
