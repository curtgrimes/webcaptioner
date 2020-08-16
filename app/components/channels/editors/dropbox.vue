<template>
  <div>
    <img
      :src="channel.iconPath"
      class="w-100 col-6 d-block mx-auto mt-2 mb-3"
      alt="Zoom"
    />
    <p class="lead text-center">
      Automatically save transcripts to Dropbox.
    </p>
    <hr />
    <p>
      When this channel is on, transcripts will be saved to the
      <strong>Apps &rsaquo; Web Captioner</strong> folder in your Dropbox. Web
      Captioner will not have access to any other folders in your Dropbox.
    </p>
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
      <b-alert
        variant="danger"
        dismissible
        :show="showHowToFinishDisconnectMessage"
      >
        To finish disconnecting your Dropbox account,
        <a href="https://www.dropbox.com/account/connected_apps" target="_blank"
          >visit your connected apps in Dropbox</a
        >
        and remove Web Captioner.
      </b-alert>
      <div v-if="revoking">
        <b-button variant="danger" block disabled size="sm">
          <b-spinner />
        </b-button>
      </div>
      <div v-else-if="authenticated">
        <div class="text-success text-center">
          <strong>Connected to Dropbox</strong><br />
          <b-spinner v-if="!profile.name || !profile.email" small />
          <span v-else class="small">
            <b-avatar
              v-if="profile.photoUrl"
              :src="profile.photoUrl"
              variant="info"
              size="sm"
              class="mr-1"
            ></b-avatar>
            {{ profile.name }} ({{ profile.email }})
          </span>
        </div>
        <hr />
        <b-button @click="revokeAuthToken()" variant="outline-danger" block>
          Disconnect from Dropbox
        </b-button>
      </div>
      <b-button v-else-if="willParseOauthResponse" disabled size="lg">
        <b-spinner />
      </b-button>
      <b-button v-else size="lg" href="/api/storage/dropbox/auth">
        Connect to Dropbox
      </b-button>
    </div>
  </div>
</template>

<script>
const queryString = require('query-string');

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
    // Hide these buttons -- the Dropbox connect/disconnect button
    // will take care of these actions
    this.$emit('hideAddButton');
    this.$emit('hideUpdateButton');

    // delay allows localStorage state to be restored
    // TODO figure out better way to handle this
    if (this.oauthResponseExists()) {
      this.willParseOauthResponse = true;
      setTimeout(() => {
        this.$nextTick(() => {
          this.parseOauthResponse();
        });
      }, 2000);
    }

    this.accessToken = this.savedChannel?.parameters?.accessToken;
    this.accountId = this.savedChannel?.parameters?.accountId;
  },
  data() {
    return {
      accessToken: null,
      accountId: null,
      profile: {
        email: null,
        name: null,
        photoUrl: null,
      },
      willParseOauthResponse: false,
      didParseOauthResponse: false,

      revoking: false,
      showHowToFinishDisconnectMessage: false,
    };
  },
  methods: {
    parseOauthResponse() {
      const { accessToken, accountId } = this.oauthResponse();
      if (accessToken && accountId) {
        this.accessToken = accessToken;
        this.accountId = accountId;
      }

      // Remove the hash
      window.history.replaceState(null, null, ' ');
      this.didParseOauthResponse = true;
      this.willParseOauthResponse = false;
    },
    oauthResponse() {
      const {
        access_token: accessToken,
        account_id: accountId,
      } = queryString.parse(location.hash);
      return { accessToken, accountId };
    },
    oauthResponseExists() {
      const oauthResponse = this.oauthResponse();
      return Boolean(oauthResponse.accessToken && oauthResponse.accountId);
    },
    async revokeAuthToken() {
      this.revoking = true;
      try {
        await this.$axios.$post('/api/storage/dropbox/auth-revoke', {
          accessToken: this.accessToken,
        });
      } catch (e) {
      } finally {
        this.accessToken = null;
        this.accountId = null;
        this.showHowToFinishDisconnectMessage = true;
        this.revoking = false;
        this.$emit('parametersUpdated', {
          accessToken: this.accessToken,
          accountId: this.accountId,
        });
        this.$emit('deleteChannel');
      }
    },
  },
  computed: {
    authenticated() {
      return Boolean(this.accessToken && this.accountId);
    },
  },
  watch: {
    accessToken: {
      immediate: true,
      async handler() {
        if (this.accessToken) {
          try {
            const {
              email,
              name,
              profile_photo_url,
              error,
            } = await this.$axios.$get('/api/storage/dropbox/profile', {
              params: {
                accessToken: this.accessToken,
                accountId: this.accountId,
              },
            });

            if (email) {
              this.profile.email = email;
            }

            if (name) {
              this.profile.name = name.display_name;
            }

            if (profile_photo_url) {
              this.profile.photoUrl = profile_photo_url;
            }

            this.$emit('hideRemoveButton');

            // accessToken and accountId are valid
            if (this.didParseOauthResponse) {
              this.$emit('parametersUpdated', {
                accessToken: this.accessToken,
                accountId: this.accountId,
              });
              this.$emit('addChannel');
            }
          } catch (e) {
            // Couldn't get the profile. Access token or account ID must be
            // invalid. Delete them.
            console.error(e);
            this.accessToken = null;
            this.accountId = null;
            this.$emit('showRemoveButton');
          }
        }
      },
    },
  },
};
</script>
