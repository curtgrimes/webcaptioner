<template>
  <div>
    <fa icon="spinner" spin size="3x" class="text-muted"/>
  </div>
</template>

<script>
const queryString = require('query-string');

export default {
  data: function() {
    return {
      loading: true,
      loadingTranscripts: false,
      reachedFileCountLimit: false,
      revoking: false,
      showHowToFinishDisconnectMessage: false,
      transcripts: [],
      profile: {
        email: null,
        name: null,
        photoUrl: null,
      }
    };
  },
  mounted: function() {
    // delay allows localStorage state to be restored
    // TODO figure out better way to handle this
    setTimeout(() => {
      this.$nextTick(() => {
        this.parseOauthResponse();
      });
    }, 1000);
  },
  computed: {
    accessToken: {
      get() {
        return this.$store.state.settings.integrations.dropbox.accessToken;
      },
      set(accessToken) {
        this.$store.commit("SET_DROPBOX_ACCESS_TOKEN", {accessToken});
      },
    },
    accountId: {
      get() {
        return this.$store.state.settings.integrations.dropbox.accountId;
      },
      set(accountId) {
        this.$store.commit("SET_DROPBOX_ACCOUNT_ID", {accountId});
      },
    },
  },
  methods: {
    parseOauthResponse: function() {
      // Returning from an oauth flow; parse incoming data
      let {access_token: accessToken, account_id: accountId} = queryString.parse(location.hash);
      if (accessToken && accountId) {
        this.accessToken = accessToken;
        this.accountId = accountId;
        this.redirectBackToSyncSettings({somethingWentWrong: false});
      }
      else {
        console.log('somethingWentWrong');
        this.redirectBackToSyncSettings({somethingWentWrong: true});
      }
    },
    redirectBackToSyncSettings: function({somethingWentWrong}) {
        this.$router.replace({
          path: this.localePath('captioner-settings-sync'),
          query: {
            ...(somethingWentWrong ? {somethingWentWrong} : {}),
          },
        });
    },
  },
}
</script>
