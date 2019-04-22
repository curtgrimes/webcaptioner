<template>
  <div>
    <p>Webhooks allows you to receive real-time HTTP notifications of captioning events in your application.</p>

    <div class="card bg-white">
      <div class="card-header">
        <div class="custom-control custom-checkbox">
          <input
            v-model="on"
            class="custom-control-input"
            name="word-replacements-censor-profanity"
            type="checkbox"
            id="word-replacements-censor-profanity"
          >
          <label class="custom-control-label" for="word-replacements-censor-profanity">Use Webhooks</label>
        </div>
      </div>
      <div class="p-3">
        <div class="row mb-2">
          <div class="col-md-9 col-lg-8">
            <div class="row">
              <label for="webhooksUrl" class="col-sm-4 col-md-3 col-form-label">URL</label>
              <div class="col-sm-8 col-md-9 mb-2 mb-md-0">
                <input
                  id="webhooksUrl"
                  :disabled="!on"
                  name="webhooksUrl"
                  v-model="url"
                  class="form-control"
                  type="url"
                  placeholder="URL"
                >
              </div>
            </div>
          </div>
          <div class="col-md-3 col-lg-4">
            <div class="row">
              <label
                for="webhooksMethod"
                class="d-md-none d-lg-flex col-sm-4 col-lg-5 col-form-label"
              >Method</label>
              <div class="col-sm-8 col-md-12 col-lg-7">
                <select
                  class="form-control"
                  id="webhooksMethod"
                  :disabled="!on"
                  name="webhooksMethod"
                  v-model="method"
                >
                  <option value="POST" selected>POST</option>
                  <option value="PUT">PUT</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-9 col-lg-8">
            <!--
            <div class="row">
              <label for="webhooksThrottleMs" class="col-sm-4 col-md-3 col-form-label">Throttle</label>
              <div class="col-sm-8 col-md-9">
                <div class="input-group">
                  <input id="webhooksThrottleMs" :disabled="!on" name="webhooksThrottleMs" v-model="throttleMs" type="number" min="0" max="60000" step="5" class="form-control" maxlength="5" />
                  <span class="input-group-append">
                    <span class="input-group-text">ms</span>
                  </span>
                </div>
                <p class="small mb-0 mt-1">
                  Call at most every 
                  <span v-if="throttleMs >= 1000">{{(throttleMs / 1000).toFixed(1)}} second<span v-if="(throttleMs / 1000).toFixed(1) !== '1.0'">s</span></span>
                  <span v-else>{{throttleMs}} millisecond<span v-if="throttleMs != 1">s</span></span>.</p>
              </div>
            </div>
            -->
          </div>
        </div>
        <hr class="my-3">
        <div
          ref="webhookLog"
          class="card bg-dark text-white small text-monospace"
          style="max-height:350px;overflow-y:auto"
        >
          <div class="card-header bg-info p-2">Log</div>
          <div class="p-2">
            <div
              v-if="!log.length"
              class="text-muted"
            >Empty. Turn on webhooks and start captioning to see requests.</div>
            <div
              v-for="(event, index) in log"
              :key="index"
              :class="event.type == 'receive' ? 'mb-2' : ''"
            >
              <span v-if="event.type === 'send'" class="font-weight-bold">{{event.title}}</span>
              <span v-else :class="event.error ? 'text-danger' : 'text-success'">--> {{event.title}}</span>

              <span v-if="event.body">
                <a
                  class="ml-2 btn btn-link text-primary btn-sm py-0 pl-0 pr-1"
                  href="javascript:void(0)"
                  @click="event.showBody = !event.showBody"
                >
                  <fa :icon="event.showBody ? 'caret-down' : 'caret-right'" fixed-width/>Payload
                </a>
                <span v-if="event.showBody">{{event.body}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h3 class="mt-4">Request Body</h3>
    <p>Your application should expect to receive this.</p>

    <div class="card bg-white p-3 mb-4">
      <pre class="m-0">
{
  "transcript": "This is a transcript"
}</pre>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';

export default {
  middleware: ['settings-meta'],
  meta: {
    settingsPageTitle: 'Webhooks',
  },
  data: function() {
    return {
      showLog: false,
    };
  },
  mounted: function() {
    this.$store.commit('ADD_EXPERIMENT', { experiment: 'webhooks' });
  },
  computed: {
    on: {
      get() {
        return this.$store.state.settings.integrations.webhooks.on;
      },
      set: function(onOrOff) {
        this.$store.commit('SET_WEBHOOKS_ON', { onOrOff });
      },
    },
    url: {
      get() {
        return this.$store.state.settings.integrations.webhooks.url;
      },
      set: debounce(
        function(url) {
          this.$store.commit('SET_WEBHOOKS_URL', { url });
        },
        500,
        { leading: true }
      ),
    },
    method: {
      get() {
        return this.$store.state.settings.integrations.webhooks.method;
      },
      set: function(method) {
        this.$store.commit('SET_WEBHOOKS_METHOD', { method });
      },
    },
    throttleMs: {
      get() {
        return this.$store.state.settings.integrations.webhooks.throttleMs;
      },
      set(throttleMs) {
        this.$store.commit('SET_WEBHOOKS_THROTTLE_MS', { throttleMs });
      },
    },
    log: {
      get() {
        return this.$store.state.integrations.webhooks.log;
      },
    },
  },
  watch: {
    log: function() {
      this.$refs.webhookLog.scrollTop = this.$refs.webhookLog.scrollHeight;
    },
  },
};
</script>
