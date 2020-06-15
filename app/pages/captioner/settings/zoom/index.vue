<template>
  <div>
    <p>
      Connect Web Captioner with
      <a href="https://zoom.us/">Zoom (video conferencing software)</a>.
    </p>

    <div class="card bg-white">
      <div class="card-header">
        <div class="custom-control custom-checkbox">
          <input
            v-model="on"
            class="custom-control-input"
            name="word-replacements-censor-profanity"
            type="checkbox"
            id="word-replacements-censor-profanity"
          />
          <label
            class="custom-control-label"
            for="word-replacements-censor-profanity"
            >Use Zoom</label
          >
        </div>
      </div>
      <div class="p-3">
        <div class="row">
          <label for="zoomUrl" class="col-sm-4 col-md-3 col-form-label"
            >Zoom API Token</label
          >
          <div class="col-sm-8 col-md-9 mb-2 mb-md-0">
            <input
              id="zoomUrl"
              :disabled="!on"
              name="zoomUrl"
              v-model="url"
              class="form-control"
              type="url"
              placeholder="URL"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';

export default {
  middleware: ['settings-meta'],
  meta: {
    settingsPageTitle: 'Zoom',
  },
  data: function() {
    return {};
  },
  mounted: function() {
    this.$store.commit('ADD_EXPERIMENT', { experiment: 'zoom' });
  },
  computed: {
    on: {
      get() {
        return this.$store.state.settings.integrations.zoom.on;
      },
      set: function(onOrOff) {
        this.$store.commit('SET_ZOOM_ON', { onOrOff });
      },
    },
    url: {
      get() {
        return this.$store.state.settings.integrations.zoom.url;
      },
      set: debounce(
        function(url) {
          this.$store.commit('SET_ZOOM_URL', { url });
        },
        500,
        { leading: true }
      ),
    },
  },
};
</script>
