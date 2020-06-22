<template>
  <div>
    <b-modal
      ref="modal"
      title="Add Channel"
      @hide="$router.replace('/captioner/settings/channels')"
      ok-variant="secondary"
      cancel-variant="link"
      ok-title="Add Channel"
      :ok-disabled="!zoomApiToken"
      @ok="addChannel()"
    >
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
    </b-modal>
  </div>
</template>

<script>
import { BModal } from 'bootstrap-vue';

export default {
  components: {
    BModal,
  },
  data() {
    return {
      channel: null,
      zoomApiToken: null,
    };
  },
  async asyncData({ $axios }) {
    const channel = await $axios.$get('/api/channels/zoom');
    return {
      channel,
    };
  },
  mounted() {
    this.$refs['modal'].show();
  },
  methods: {
    addChannel() {
      this.$store.commit('ADD_CHANNEL', {
        channelId: this.channel.id,
        parameters: {
          zoomApiToken: this.zoomApiToken,
        },
      });
    },
  },
};
</script>
