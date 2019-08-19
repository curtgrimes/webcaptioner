<template>
  <b-button-group class="mr-2">
    <b-button
      v-b-tooltip.hover
      :title="tooltip"
      :variant="buttonVariant"
      @click="showShareSettings()"
    >
      <fa icon="broadcast-tower" :class="buttonTextClass" />
      <span
        v-if="!expired && hasValidShareLink && subscriberCount > 0"
        class="ml-2"
      >{{subscriberCount}}</span>
      <b-badge v-if="expired" variant="danger" class="ml-2">
        <fa icon="exclamation-triangle"></fa>
      </b-badge>
    </b-button>
    <b-button
      v-b-tooltip.hover
      :title="on ? 'Turn off sharing' : 'Turn on sharing'"
      :variant="on ? 'light' : 'light'"
      id="share-on-off-toggle"
      v-if="hasValidShareLink && !expired"
      class="px-3"
      @click="on = !on; $event.target.blur(); $event.target.parentElement.blur()"
    >
      <fa :icon="on ? 'toggle-on' : 'toggle-off'" style="font-size:1.3rem;margin-top:0.2rem" />
    </b-button>
  </b-button-group>
</template>


<style>
.pointerSwitch,
.pointerSwitch:hover,
.pointerSwitch.custom-switch .custom-control-label::before,
.pointerSwitch.custom-switch .custom-control-label::after {
  cursor: pointer;
}
</style>

<script>
import {
  BButton,
  BButtonGroup,
  BBadge,
  VBTooltip,
  BFormCheckbox,
} from 'bootstrap-vue';

export default {
  components: {
    BButton,
    BButtonGroup,
    BBadge,
    BFormCheckbox,
  },
  directives: {
    'b-tooltip': VBTooltip,
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
    hideAllTooltips: function() {
      this.$root.$emit('bv::hide::tooltip');
    },
  },
  computed: {
    tooltip: function() {
      if (this.expired) {
        return 'Share Captions (Link Expired)';
      } else if (this.hasValidShareLink && this.subscriberCount > 0) {
        return (
          this.subscriberCount +
          ' viewer' +
          (this.subscriberCount != 1 ? 's' : '')
        );
      } else {
        return 'Share Captions';
      }
    },
    on: {
      get() {
        return this.$store.state.settings.share.on;
      },
      set(on) {
        this.$store.commit('SET_SHARE_ON', { on });
        this.hideAllTooltips();
        this.$nextTick(function() {
          this.$root.$emit('bv::show::tooltip', 'share-on-off-toggle');
        });
      },
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
      return (
        this.shareLink && this.roomId && (this.expireDate || !this.expires)
      );
    },
    buttonVariant() {
      if (this.on) {
        return 'secondary';
      } else {
        if (this.$store.state.share.settings.show) {
          return 'light';
        } else {
          return 'link';
        }
      }
    },
    buttonTextClass() {
      if (!this.$store.state.share.settings.show) {
        return 'text-white';
      }
    },
  },
};
</script>
