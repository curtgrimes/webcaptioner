<template>
  <div>
    <b-modal
      ref="modal"
      :title="creatingNewChannel ? 'Add Channel' : 'Update Channel'"
      @hide="$router.replace('/captioner/settings/channels')"
      :hide-footer="channelLoading || channelLoadingError"
    >
      <b-spinner v-if="channelLoading" class="d-block mx-auto" />
      <div v-else-if="channelLoadingError">
        Unable to load channel. Please
        <a href="javascript:location.reload()">try again</a>.
      </div>
      <component
        v-else
        :is="editorComponent"
        :channel="channel"
        :saved-channel="savedChannel"
        @formValid="formValid = true"
        @formInvalid="formValid = false"
        @addChannel="addChannel()"
        @deleteChannel="deleteChannel()"
        @parametersUpdated="channelParameters = $event"
        @hideAddButton="showAddButton = false"
        @hideUpdateButton="showUpdateButton = false"
        @showRemoveButton="showRemoveButton = true"
        @hideRemoveButton="showRemoveButton = false"
      />
      <template v-slot:modal-footer="{ cancel }">
        <b-button
          v-if="updatingExistingChannel && showRemoveButton"
          variant="outline-danger"
          @click="deleteChannel()"
          class="mr-auto"
        >
          Remove Channel
        </b-button>
        <b-button size="sm" variant="link" @click="cancel()"> Cancel </b-button>
        <b-button
          variant="secondary"
          @click="creatingNewChannel ? addChannel() : updateChannel()"
          :disabled="!formValid"
          v-if="creatingNewChannel ? showAddButton : showUpdateButton"
        >
          {{ creatingNewChannel ? 'Add Channel' : 'Update Channel' }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { BModal, BButton, BSpinner } from 'bootstrap-vue';

export default {
  components: {
    BModal,
    BButton,
    BSpinner,
  },
  data() {
    return {
      channel: null,
      savedChannel: null,
      editorComponent: null,
      channelLoading: true,
      channelLoadingError: false,

      showAddButton: true,
      showUpdateButton: true,
      showRemoveButton: true,

      formValid: false,
      channelParameters: {},

      channels: null,
    };
  },
  async beforeCreate() {
    try {
      const channels = await this.$store.dispatch('channels/GET_CHANNELS');

      await this.settingsLoaded();

      let savedChannel;
      if (this.updatingExistingChannel) {
        savedChannel = this.$store.state.settings.channels.find(
          (channel) => channel.id === this.channelIdToUpdate
        );

        if (!savedChannel) {
          return reject();
        }
      }

      const channel = channels.find(
        (c) =>
          c.id === this.channelTypeToSave ||
          (savedChannel && c.id === savedChannel.type)
      );

      // Doing this twice because I was having trouble getting a catchable error
      // to throw inside this function, so the await will throw the error if possible,
      // and then the editorComponent creation below will actually create the component.
      // It seems to remain cached after the first import attempt so there isn't much
      // of a performance concern here.
      const component = await import(
        `~/components/channels/editors/${this.channelTypeToSave ||
          savedChannel.type}`
      );

      const editorComponent = () => ({
        component: import(
          `~/components/channels/editors/${this.channelTypeToSave ||
            savedChannel.type}`
        ),
      });

      this.channel = channel;
      this.savedChannel = savedChannel;
      this.editorComponent = editorComponent;
    } catch (e) {
      console.error(e);
      this.channelLoadingError = true;
    } finally {
      this.channelLoading = false;
    }
  },
  async mounted() {
    this.channels = await this.$store.dispatch('channels/GET_CHANNELS');

    await this.settingsLoaded();
    if (this.reachedLimitForChannelType && this.creatingNewChannel) {
      // Don't allow creating a channel
      this.$router.replace('/captioner/settings/channels');
    } else {
      this.$refs['modal'].show();
    }
  },
  computed: {
    channelIdToUpdate() {
      return this.$route.params.channelId !== 'new'
        ? this.$route.params.channelId
        : null;
    },
    channelTypeToSave() {
      return this.$route.params.channelId === 'new'
        ? this.$route.query.type
        : null;
    },
    creatingNewChannel() {
      return this.$route.params.channelId === 'new';
    },
    updatingExistingChannel() {
      return this.$route.params.channelId !== 'new';
    },
    reachedLimitForChannelType() {
      const existingChannelsOfThisType = this.$store.state.settings.channels.filter(
        (channel) => channel.type === this.$route.query.type
      );

      return existingChannelsOfThisType.length >= this.channel?.limit;
    },
  },
  methods: {
    addChannel() {
      try {
        this.$store.commit('ADD_CHANNEL', {
          type: this.channelTypeToSave,
          parameters: this.channelParameters,
        });

        this.$refs['modal'].hide();
      } catch (e) {
        this.$bvModal.msgBoxOk(e.message, { okVariant: 'secondary' });
      }
    },
    async updateChannel() {
      try {
        const channelId = this.$route.params.channelId;
        this.$store.commit('UPDATE_CHANNEL', {
          channelId,
          parameters: this.channelParameters,
        });

        if (this.savedChannel.on) {
          // We're updating a channel that is already on. Toggle it off and back on.
          await this.$nextTick();
          this.$store.commit('TURN_OFF_CHANNEL', { channelId });
          await this.$nextTick();
          this.$store.commit('TURN_ON_CHANNEL', { channelId });
        } else {
          // Assume that they want the channel on if they are updating it now.
          this.$store.commit('TURN_ON_CHANNEL', { channelId });
        }

        // Clear any errors
        this.$store.commit('UPDATE_CHANNEL_ERROR', {
          channelId,
          error: null,
        });

        this.$refs['modal'].hide();
      } catch (e) {
        this.$bvModal.msgBoxOk(e.message, { okVariant: 'secondary' });
      }
    },
    deleteChannel() {
      this.$store.commit('DELETE_CHANNEL', {
        channelId: this.$route.params.channelId,
      });
      this.$refs['modal'].hide();
    },
    settingsLoaded() {
      return new Promise((resolve) => {
        if (this.$store.state.settingsLoaded) {
          resolve();
        } else {
          this.$store.watch(
            (state) => state.settingsLoaded,
            async (settingsLoaded) => {
              if (settingsLoaded) {
                resolve();
              }
            }
          );
        }
      });
    },
    channelInfo(id) {
      return this.channels.find((channel) => channel.id === id);
    },
  },
};
</script>
