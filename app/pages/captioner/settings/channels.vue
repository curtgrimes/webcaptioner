<template>
  <div>
    <p>Connect Web Captioner with other services.</p>
    <b-alert
      :show="Boolean($store.state.channels.channelsPageMessage)"
      dismissible
    >
      <span v-html="$store.state.channels.channelsPageMessage"></span>
    </b-alert>
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
        :class="{
          'mb-3': channelIndex < $store.state.settings.channels.length - 1,
        }"
      >
        <div
          class="card card-body transition-all"
          v-if="addedChannel && channelInfo(addedChannel.type)"
          :class="addedChannel.on ? 'shadow bg-white' : 'bg-light'"
          :style="{ opacity: addedChannel.on ? 1 : 0.75 }"
        >
          <div class="d-flex flex-wrap">
            <span
              v-if="channelInfo(addedChannel.type).iconPath"
              class="d-flex align-items-center col-12 col-md-auto p-0"
              style="flex-shrink: 0"
            >
              <img
                :src="channelInfo(addedChannel.type).iconPath"
                class="transition-all"
                style="max-height:2.5rem"
                :class="!addedChannel.on ? 'desaturated' : ''"
              />
              <span
                v-if="channelInfo(addedChannel.type).showNameWithIcon"
                class="pl-2"
                style="flex-shrink: 0"
              >
                {{ channelInfo(addedChannel.type).name }}
              </span>
            </span>
            <span v-else class="d-flex align-items-center flex-wrap">
              <fa
                v-if="channelInfo(addedChannel.type).iconName"
                :icon="channelInfo(addedChannel.type).iconName"
                size="lg"
                class="mr-2"
              />
              <span class="font-weight-bold">
                {{ channelInfo(addedChannel.type).name }}
              </span>
            </span>
            <div class="ml-auto d-flex align-items-center">
              <div
                class="text-muted small d-flex"
                style="flex-shrink: 0"
                v-if="!addedChannel.on"
              >
                <span>Channel off</span>
                <span v-if="addedChannel.error" class="text-danger pl-1">
                  (Error)
                </span>
              </div>
              <b-button
                size="sm"
                class="py-2 px-3 mr-4 ml-2 d-flex align-items-center"
                :variant="addedChannel.on ? 'light' : 'outline-dark'"
                :to="`/captioner/settings/channels/${addedChannel.id}`"
                :style="!addedChannel.on ? 'border-color: #ccc' : ''"
              >
                <fa icon="cog" class="mr-2" /> Configure
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
        style="min-height: 7rem"
      >
        <b-button
          variant="lighter"
          class="w-100 d-flex align-items-center justify-content-center flex-column p-3 p-md-2 border"
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
              class="mw-100"
              :class="{
                'py-3': !channel.showNameWithIcon,
                'pb-2': channel.showNameWithIcon,
              }"
              :style="channel.showNameWithIcon ? 'max-height:30%' : ''"
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
            <span
              class="small text-danger d-block"
              style="line-spacing: 0.4rem"
            >
              You can only add {{ channel.limit }}
              <span v-if="channel.limit != 1">instances</span
              ><span v-else>instance</span> of this channel at a time.
            </span>
          </span>
        </b-button>
      </div>
    </div>
    <nuxt-child @showChannelPageMessage="message = $event" />
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
      message: null,
    };
  },
  async created() {
    // Wait until settings are loaded
    if (!this.$store.state.settingsLoaded) {
      await new Promise((resolve) => {
        this.$store.watch(
          (state) => {
            return state.settingsLoaded;
          },
          (loaded) => {
            if (loaded) {
              resolve();
            }
          }
        );
      });
    }
    this.channels = await this.$store.dispatch('channels/GET_CHANNELS');
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

      return savedChannelsOfType.length >= channelLimit;
    },
  },
};
</script>
