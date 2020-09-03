<template>
  <div>
    <img
      :src="channel.iconPath"
      class="w-100 col-6 d-block mx-auto mt-2 mb-3"
      alt="YouTube"
    />
    <p class="lead text-center">
      Send real-time captions to a YouTube live stream.
    </p>
    <hr />
    <ol>
      <li>
        In YouTube Studio, set up a live stream. Go to stream settings and
        enable closed captions.
      </li>
      <li>
        Select "Post captions to URL."
      </li>
      <li>
        Copy the captions ingestion URL and paste it here.
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
      <label for="url" class="small">
        YouTube captions ingestion URL
      </label>
      <input
        id="url"
        name="url"
        v-model="url"
        autofocus
        class="form-control"
        type="url"
        placeholder="YouTube captions ingestion URL"
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
    this.url = this.savedChannel?.parameters?.url;
  },
  data() {
    return {
      url: null,
    };
  },
  watch: {
    url: {
      immediate: true,
      handler(url) {
        this.$emit('parametersUpdated', {
          url,
        });

        if (this.url) {
          this.$emit('formValid');
        } else {
          this.$emit('formInvalid');
        }
      },
    },
  },
};
</script>
