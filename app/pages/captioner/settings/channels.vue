<template>
  <div>
    <p>Channels let you connect Web Captioner with other services.</p>
    <b-spinner v-if="!$store.state.settingsLoaded" />
    <div
      v-else-if="$store.state.settings.channels.length === 0"
      class="text-muted"
    >
      You don't have any channels set up. Add a channel below to get started.
    </div>
    <div v-else>
      <div
        v-for="(addedChannel, channelIndex) in $store.state.settings.channels"
        :key="channelIndex"
      >
        <div
          class="card card-body transition-all"
          v-if="addedChannel && channelInfo(addedChannel.type)"
          :class="addedChannel.on ? 'shadow bg-white' : 'bg-light'"
        >
          <div class="row no-gutters">
            <div class="col-2">
              <img
                :src="channelInfo(addedChannel.type).iconPath"
                class="w-100 transition-all"
                :class="!addedChannel.on ? 'desaturated' : ''"
              />
            </div>
            <div
              class="col-10 d-flex align-items-center justify-content-center"
            >
              <transition name="fade">
                <span class="text-muted small ml-4" v-if="!addedChannel.on">
                  Channel off
                  <span v-if="addedChannel.error" class="text-danger">
                    (Error)
                  </span>
                </span>
              </transition>
              <b-button
                size="sm"
                class="py-2 px-3 my-n2 ml-auto mr-4"
                :variant="addedChannel.on ? 'light' : 'outline-dark'"
                :to="`/captioner/settings/channels/${addedChannel.id}`"
              >
                <fa icon="cog" /> Configure
              </b-button>
              <b-form-checkbox
                switch
                size="lg"
                class="mt-n1"
                :checked="addedChannel.on"
                @change="toggleChannel(addedChannel.id, $event)"
              />
            </div>
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
        style="min-height:7rem"
      >
        <b-button
          variant="lighter"
          class="w-100 d-flex align-items-center justify-content-center flex-column p-5 p-md-2 border"
          :to="channel.configPagePath"
          :disabled="reachedLimitForChannel(channel.id)"
        >
          <span
            class="d-flex align-items-center justify-content-center flex-column"
            :class="{ desaturated: reachedLimitForChannel(channel.id) }"
          >
            <img
              v-if="channel.iconPath"
              :src="channel.iconPath"
              class="mw-100 py-3"
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
          </span>
          <span v-if="reachedLimitForChannel(channel.id)">
            <hr class="w-100" />
            <span class="small text-danger">
              You can only add {{ channel.limit }}
              <span v-if="channel.limit != 1">instances</span
              ><span v-else>instance</span> of this channel at a time.
            </span>
          </span>
        </b-button>
      </div>
    </div>
    <nuxt-child />
  </div>
</template>

<script>
import { BButton, BFormCheckbox, BSpinner } from 'bootstrap-vue';

export default {
  components: {
    BButton,
    BFormCheckbox,
    BSpinner,
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
    channelInfo(id) {
      return this.channels.find((channel) => channel.id === id);
    },
    toggleChannel(channelId, onOrOff) {
      this.$store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff });
    },
    reachedLimitForChannel(channelId) {
      const channelLimit = this.channelInfo(channelId).limit;
      const channelType = this.channelInfo(channelId).id;
      const savedChannelsOfType = this.$store.state.settings.channels.filter(
        (channel) => channel.type === channelType
      );

      if (savedChannelsOfType.length >= channelLimit) {
        return true;
      }
    },
  },
};
</script>
