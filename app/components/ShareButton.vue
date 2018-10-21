<template>
  <div>
    <b-button
      v-b-tooltip.hover
      :title="tooltip"
      :variant="hasValidShareLink ? 'secondary' : 'info'"
      class="mr-2"
      @click="showShareSettings()"
    >
      <fa icon="broadcast-tower"/>
      <span v-if="!expired && hasValidShareLink && subscriberCount > 0" class="ml-2">{{subscriberCount}}</span>
      <b-badge v-if="expired" variant="danger" class="ml-2"><fa icon="exclamation-triangle"></fa></b-badge>
    </b-button>
  </div>
</template>

<script>
export default {
  methods: {
    showShareSettings() {
      this.$router.push('/captioner');
      this.$store.commit('share/SET_SHOW_SETTINGS', { on: true });
    },
  },
  computed: {
    tooltip: function() {
      if (this.expired) {
        return 'Share Captions (Link Expired)';
      }
      else if (this.hasValidShareLink && this.subscriberCount > 0) {
        return 'Sharing captions with ' + this.subscriberCount + ' viewer' + (this.subscriberCount != 1 ? 's' : '');
      }
      else {
        return 'Share Captions';
      }
    },
    shareLink: function() {
        return this.$store.state.settings.share.url;
    },
    subscriberCount: function() {
        return this.$store.state.receivers.share.subscriberCount;
    },
    roomId: function() {
        return this.$store.state.settings.share.roomId;
    },
    expireDate: function() {
        return this.$store.state.settings.share.expireDate;
    },
    expired: function() {
      return this.$store.state.share.expired;
    },
    hasValidShareLink() {
        return this.shareLink && this.roomId && this.expireDate;
    },
  },
}
</script>
