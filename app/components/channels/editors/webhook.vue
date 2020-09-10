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
      <div class="form-group">
        <label for="url" class="font-weight-bold">URL</label>
        <input
          id="url"
          name="url"
          v-model="parameters.url"
          autofocus
          class="form-control"
          type="url"
          placeholder="URL"
        />
      </div>

      <!-- <div class="form-group">
        <label for="method" class="font-weight-bold">Method</label>
        <select
          class="form-control"
          id="method"
          name="method"
          v-model="parameters.method"
        >
          <option value="post">POST</option>
          <option value="put">PUT</option>
        </select>
      </div> -->

      <div class="form-group mb-0">
        <label for="chunkingCount" class="font-weight-bold">Chunking</label>

        <input
          id="chunkingCount"
          name="chunkingCount"
          v-model="parameters.chunkingCount"
          autofocus
          class="form-control"
          type="number"
          placeholder="Chunking"
          min="1"
          oninput="validity.valid || (value='');"
        />
        <p class="text-muted small mt-2 mb-0">
          <span v-if="parameters.chunkingCount == 1">
            Call the webhook immediately with each new word.
          </span>
          <span v-else>
            Only call the webhook when at least
            {{ parameters.chunkingCount || 'this number of' }}
            words are ready to send, or after a short delay with no new words
            spoken.
          </span>
        </p>
      </div>

      <div class="form-group mb-0" v-if="false">
        <div class="form-check mb-1">
          <input
            class="form-check-input"
            type="radio"
            name="origin"
            id="originLocal"
            value="local"
            v-model="parameters.origin"
          />
          <label class="form-check-label" for="originLocal">
            Make requests directly from browser
            <span class="d-block small">
              Reqeusts will be sent in near-real-time from this browser. Your
              application must allow
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
                target="_blank"
                >cross-origin resource sharing (CORS)</a
              >
              from
              <client-only placeholder="(loading...)">
                {{ locationOrigin }}</client-only
              >
              for this to work.</span
            >
          </label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="origin"
            id="originRemote"
            value="remote"
            v-model="parameters.origin"
            disabled
          />
          <label class="form-check-label" for="originRemote">
            Proxy requests through Web Captioner's servers
            <span class="badge badge-danger mb-1">Not available yet</span>
            <span class="d-block small">
              Requests will be slightly throttled and proxied through Web
              Captioner's servers. You won't need to change the CORS
              configuration in your application.
            </span>
          </label>
        </div>
      </div>
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
      this.parameters.chunkingCount = this.savedChannel.parameters?.chunkingCount;
      this.parameters.origin = this.savedChannel.parameters?.origin;
    }
  },
  data() {
    return {
      parameters: {
        url: null,
        method: 'post',
        chunkingCount: 1,
        origin: 'local',
      },
    };
  },
  computed: {
    locationOrigin() {
      return window?.location?.origin;
    },
  },
  watch: {
    parameters: {
      immediate: true,
      deep: true,
      handler({ url, method, origin, chunkingCount }) {
        this.$emit('parametersUpdated', {
          url,
          method,
          chunkingCount: Number(chunkingCount),
          origin,
        });

        if (
          url &&
          method &&
          Number.isInteger(Number(chunkingCount)) &&
          Number(chunkingCount) >= 1
        ) {
          this.$emit('formValid');
        } else {
          this.$emit('formInvalid');
        }
      },
    },
  },
};
</script>
