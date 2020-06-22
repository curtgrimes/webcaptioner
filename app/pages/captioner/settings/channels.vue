<template>
  <div>
    <div
      v-for="(addedChannel, channelIndex) in $store.state.settings.channels"
      :key="channelIndex"
    >
      <div
        class="card card-body bg-lighter"
        v-if="addedChannel && channelInfo(addedChannel.type)"
      >
        <div class="row no-gutters">
          <div class="col-2">
            <img :src="channelInfo(addedChannel.type).iconPath" class="w-100" />
          </div>
          <div class="col-10 d-flex align-items-center justify-content-center">
            <b-button
              size="sm"
              class="py-2 px-3 my-n2 ml-auto mr-4"
              variant="light"
              >Configure</b-button
            >
            <b-form-checkbox
              switch
              size="lg"
              class="mt-n1"
              @change="toggleChannel(channelIndex, $event)"
            />
          </div>
        </div>
      </div>
    </div>
    <hr class="my-4" />
    <h3 class="mt-3 mb-4">Add a Channel</h3>
    <div class="row">
      <div
        class="col-6 col-sm-12 col-md-4 d-flex mb-4"
        v-for="(channel, index) in channels"
        :key="index"
        style="height:7rem"
      >
        <b-button
          variant="lighter"
          class="w-100 d-flex align-items-center justify-content-center flex-column p-5 p-md-2 border"
          :to="channel.configPagePath"
        >
          <img
            v-if="channel.iconPath"
            :src="channel.iconPath"
            class="mw-100"
            :style="channel.showNameWithIcon ? 'max-height:50%' : ''"
          />
          <fa
            v-if="channel.iconName"
            :icon="channel.iconName"
            size="2x"
            class="mb-2"
          />
          <span v-if="channel.showNameWithIcon || channel.iconName">
            {{ channel.name }}
          </span>
        </b-button>
      </div>
    </div>
    <nuxt-child />
  </div>
</template>

<script>
import { BButton, BFormCheckbox } from 'bootstrap-vue';

export default {
  components: {
    BButton,
    BFormCheckbox,
  },
  scrollToTop: false,
  middleware: ['settings-meta'],
  meta: {
    settingsPageTitle: 'Channels',
  },
  data() {
    return {
      channels: [],
    };
  },
  async asyncData({ $axios }) {
    const channels = await $axios.$get('/api/channels');
    return {
      channels,
    };
  },
  methods: {
    channelInfo(channelId) {
      return this.channels.find((channel) => channel.id === channelId);
    },
    toggleChannel(channelIndex, onOrOff) {
      this.$store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelIndex, onOrOff });
    },
  },
};
</script>
