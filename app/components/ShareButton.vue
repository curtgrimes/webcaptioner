<template>
  <div>
    <b-btn
      v-b-tooltip.hover
      :title="tooltip"
      :variant="hasValidShareLink ? 'secondary' : 'info'"
      class="mr-2"
      @click="showShareSettings()"
    >
      <fa icon="broadcast-tower"/>
      <span
        v-if="!expired && hasValidShareLink && subscriberCount > 0"
        class="ml-2"
      >{{subscriberCount}}</span>
      <b-badge v-if="expired" variant="danger" class="ml-2">
        <fa icon="exclamation-triangle"></fa>
      </b-badge>
    </b-btn>
  </div>
</template>

<script>
import bBtn from 'bootstrap-vue/es/components/button/button';
import bBadge from 'bootstrap-vue/es/components/badge/badge';
import bTooltip from 'bootstrap-vue/es/directives/tooltip/tooltip';

export default {
  components: {
    bBtn,
    bBadge,
  },
  directives: {
    bTooltip,
  },
  methods: {
    showShareSettings() {
      if (this.$router.currentRoute.name.startsWith('captioner___')) {
        // We're on the main captioner screen; toggle settings
        this.$store.commit('share/SET_SHOW_SETTINGS', { toggle: true });
      } else {
        // We're not. Go to that route and then force them to show.
        this.$router.push('/captioner');
        this.$store.commit('share/SET_SHOW_SETTINGS', { on: true });
      }
    },
  },
  computed: {
    tooltip: function() {
      if (this.expired) {
        return 'Share Captions (Link Expired)';
      } else if (this.hasValidShareLink && this.subscriberCount > 0) {
        return (
          'Sharing captions with ' +
          this.subscriberCount +
          ' viewer' +
          (this.subscriberCount != 1 ? 's' : '')
        );
      } else {
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
};
</script>
