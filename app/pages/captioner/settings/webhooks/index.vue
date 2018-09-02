<template>
  <div>
    <p>Webhooks allows you to receive real-time HTTP notifications of captioning events in your application. Events are sent client-side from this browser.</p>

    <div class="form-group">
        <div class="custom-control custom-checkbox mb-2">
          <input v-model="on" class="custom-control-input" name="word-replacements-censor-profanity" type="checkbox" id="word-replacements-censor-profanity">
          <label class="custom-control-label" for="word-replacements-censor-profanity">Use Webhook</label>
        </div>
    </div>

    <div class="form-group row">
      <label for="webhooksUrl" class="col-sm-4 col-md-3 col-form-label">URL</label>
      <div class="col-sm-8 col-md-9">
        <input id="webhooksUrl" :disabled="!on" name="webhooksUrl" v-model="url" class="form-control" type="url" placeholder="URL" />
      </div>
    </div>

    <div class="form-group row">
      <label for="webhooksMethod" class="col-sm-4 col-md-3 col-form-label">Method</label>
      <div class="col-sm-8 col-md-9">
        <select class="form-control" id="webhooksMethod" :disabled="!on" name="webhooksMethod" v-model="method">
          <option value="POST" selected>POST</option>
          <option value="PUT">PUT</option>
        </select>
      </div>
    </div>

    <div class="form-group row">
      <label for="webhooksThrottleMs" class="col-sm-4 col-md-3 col-form-label">Throttle Interim Transcript Events</label>
      <div class="col-sm-8 col-md-9">
        <div class="input-group">
          <input id="webhooksThrottleMs" :disabled="!on" name="webhooksThrottleMs" v-model="throttleMs" type="number" min="0" max="60000" step="5" class="form-control" maxlength="5" />
          <span class="input-group-append">
            <span class="input-group-text">ms</span>
          </span>
        </div>
        <p class="small mb-0 mt-1">
          Send an interim transcript event, at most, every 
          <span v-if="throttleMs >= 1000">{{(throttleMs / 1000).toFixed(1)}} second<span v-if="(throttleMs / 1000).toFixed(1) !== '1.0'">s</span></span>
          <span v-else>{{throttleMs}} millisecond<span v-if="throttleMs != 1">s</span></span>.</p>
      </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-4 col-md-3 col-form-label">Log</label>
      <div class="col-sm-8 col-md-9">
        <button v-if="!showLog" class="btn btn-outline-secondary btn-sm" @click="showLog = true">Show Log</button>
        <transition name="fade">
          <div v-show="showLog" ref="webhookLog" class="card bg-white small p-2 text-monospace" style="max-height:350px;overflow-y:auto">
            <div v-for="(event, index) in log" :key="index" :class="event.type == 'receive' ? 'mb-2' : ''">
              <span v-if="event.type === 'send'" class="font-weight-bold">{{event.title}}</span>
              <span v-else :class="event.error ? 'text-danger' : 'text-success'">--> {{event.title}}</span>

              <span v-if="event.body">
                <a class="ml-2 btn btn-link btn-sm py-0 pl-0 pr-1" href="javascript:void(0)" @click="event.showBody = !event.showBody"><fa :icon="event.showBody ? 'caret-down' : 'caret-right'" fixed-width />Payload</a>
                <span v-if="event.showBody">{{event.body}}</span>
              </span>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <h3 class="mt-4">Definitions</h3>
    <p>The <strong>interim transcript</strong> is a phrase or partial phrase that represents what is currently being spoken. Each interim transcript you receive should invalidate and replace any past interim transcript you have.</p>
    <p>The interim transcript becomes the <strong>final transcript</strong> after a pause in speech. Whenever you receive a final transcript, any interim transcript you currently have should be discarded, and you should append that final transcript to any past final transcript you have.</p>
    
    <h3 class="mt-4">Events</h3>
    <p>These are the JSON payloads your application should expect to receive.</p>

    <h4>Interim Transcript Event</h4>
    <p>Triggered when speech is recognized and an interim transcript is created or updated. When you receive this even, invalidate any past interim transcript you have.</p>
    <div class="card bg-white p-3 mb-4">
      <h5 class="card-title text-muted">Request Body</h5>
      <pre class="m-0">
{
  "type":"SET_TRANSCRIPT_INTERIM",
  "payload": {
    "transcriptInterim": "This is a transcript"
  }
}</pre>
    </div>

    <h4>Final Transcript Event</h4>
    <p>Triggered when there is a pause in speech and a final transcript is created. When you receive this even, invalidate any past interim transcript you have and append this final transcript to any past final transcript you have.</p>
    <div class="card bg-white p-3">
      <h5 class="card-title text-muted">Request Body</h5>
      <pre class="m-0">
{
  "type":"APPEND_TRANSCRIPT_FINAL",
  "payload": {
    "transcriptFinal": "This is a transcript"
  }
}</pre>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  name: 'settings-webhooks-view',
  transition: 'fade',
  middleware: [
    'settings-meta',
  ],
  meta: {
    settingsPageTitle: 'Webhooks',
  },
  data: function() {
    return {
      showLog: false,
    };
  },
  computed: {
    on: {
      get () {
        return this.$store.state.settings.integrations.webhooks.on;
      },
      set: function (onOrOff) {
        this.$store.commit('SET_WEBHOOKS_ON', { onOrOff });
      },
    },
    url: {
      get () {
        return this.$store.state.settings.integrations.webhooks.url;
      },
      set: debounce(function(url) {
        this.$store.commit('SET_WEBHOOKS_URL', { url });
      }, 500, {leading: true})
    },
    method: {
      get () {
        return this.$store.state.settings.integrations.webhooks.method;
      },
      set: function(method) {
        this.$store.commit('SET_WEBHOOKS_METHOD', { method });
      },
    },
    throttleMs: {
      get () {
        return this.$store.state.settings.integrations.webhooks.throttleMs;
      },
      set (throttleMs) {
        this.$store.commit('SET_WEBHOOKS_THROTTLE_MS', { throttleMs });
      },
    },
    log: {
      get () {
        return this.$store.state.integrations.webhooks.log;
      },
    },
  },
  watch: {
    log: function() {
      this.$refs.webhookLog.scrollTop = this.$refs.webhookLog.scrollHeight;
    }
  },
}
</script>
