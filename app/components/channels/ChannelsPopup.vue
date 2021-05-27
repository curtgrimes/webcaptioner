<template>
  <div>
    <b-button
      variant="link"
      class="p-0 text-dark small font-weight-bold"
      size="sm"
      to="/captioner/settings/channels"
      @click="$root.$emit('bv::hide::popover')"
    >
      Channels
    </b-button>
    <hr />
    <div
      v-for="(channel, channelIndex) in addedChannels"
      :key="channel.id"
      class="d-flex align-items-center"
      style="width:200px"
      :class="{ 'mb-1': channelIndex < addedChannels.length - 1 }"
    >
      <b-button
        :to="`/captioner/settings/channels/${channel.id}`"
        class="p-0 mr-auto d-flex align-items-center"
        size="sm"
        variant="link"
        style="text-decoration:none"
      >
        <span
          class="d-flex align-items-center"
          v-if="channelIconPath(channel.type)"
        >
          <img
            :src="channelIconPath(channel.type)"
            style="max-width:5rem;max-height:2rem"
            :class="{ desaturated: !channel.on }"
          />
          <span
            v-if="channelShowNameWithIcon(channel.type)"
            class="pl-1"
            style="flex-shrink: 0;color:#000"
          >
            {{ channelName(channel.type) }}
          </span>
        </span>
        <span v-else class="text-dark">
          <fa
            v-if="channelIconName(channel.type)"
            :icon="channelIconName(channel.type)"
            class="mr-1"
          />{{ channelName(channel.type) }}
        </span>
      </b-button>

      <b-button
        :to="`/captioner/settings/channels/${channel.id}`"
        @click="$root.$emit('bv::hide::popover')"
        size="sm"
        variant="light"
        class="px-1 mr-2 d-flex align-items-center"
        v-b-tooltip.hover="'Configure'"
      >
        <fa
          icon="exclamation-triangle"
          class="text-danger small mr-2"
          v-if="channel.error"
        />
        <fa icon="cog" />
      </b-button>
      <b-form-checkbox
        switch
        style="margin-top:2px"
        size="sm"
        :checked="channel.on"
        @change="toggleChannel(channel.id, $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      channels: [],
    };
  },
  async created() {
    this.channels = await this.$store.dispatch('channels/GET_CHANNELS');
  },
  methods: {
    toggleChannel(channelId, onOrOff) {
      this.$store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff });
    },
    channelIconPath(channelType) {
      return this.channels.find((channel) => channel.id === channelType)
        ?.iconPath;
    },
    channelIconName(channelType) {
      return this.channels.find((channel) => channel.id === channelType)
        ?.iconName;
    },
    channelShowNameWithIcon(channelType) {
      return this.channels.find((channel) => channel.id === channelType)
        ?.showNameWithIcon;
    },
    channelName(channelType) {
      return this.channels.find((channel) => channel.id === channelType)?.name;
    },
  },
  computed: {
    addedChannels() {
      return this.$store.state.settings.channels;
    },
  },
};
</script>
