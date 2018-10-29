<template>
  <div>
    <p>Automatically save transcripts to Dropbox. Transcripts will be saved as text files in the folder <strong>Apps › Web Captioner</strong> in your Dropbox.</p>
    <div v-if="profileExists">
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-sm-2">
              <fa :icon="['fab', 'dropbox']" size="5x" style="color:#007ee5" />
            </div>
            <div class="col-sm-8">
              <h4>Connected to Dropbox</h4>
              <p class="mb-0">{{profile.name}}</p>
              <p class="mb-0">{{profile.email}}</p>
            </div>
          </div>
        </div>
        <div class="card-footer d-flex">
          <b-btn variant="danger" size="sm" class="ml-auto" @click="revokeAuthToken()" :disabled="revoking"><fa v-if="revoking" icon="spinner" spin/> Disconnect</b-btn>
        </div>
      </div>
      <h3>Recent</h3>
      <b-list-group v-if="transcripts">
        <b-list-group-item
          v-for="(transcript, index) in transcripts"
          :key="index"
          class="py-0 pr-2"
          :href="'https://www.dropbox.com/home/Apps/Web%20Captioner/Transcripts?preview=' + transcript.name"
        >
          <div class="row">
            <div class="col-6 col-md-6 py-3 font-weight-bold">{{transcript.name}}</div>
            <div class="d-none d-md-flex col-md-3 text-muted py-3">
              {{bytesToString(transcript.size)}}
            </div>
            <div class="col-6 col-md-3 d-flex">
              <b-btn class="ml-auto py-3 px-4 px-sm-3" variant="link" 
            :href="'/api/storage/dropbox/transcripts/' + transcript.name.replace('.txt', '') + '?accessToken=' + accessToken" v-b-tooltip.top title="Save to File"><fa icon="file-alt" /></b-btn>
              <b-btn class="py-3 px-4 px-sm-3" variant="link" :href="'https://www.dropbox.com/home/Apps/Web%20Captioner/Transcripts?preview=' + transcript.name" v-b-tooltip.top title="Open in Dropbox"><fa :icon="['fab', 'dropbox']" /></b-btn>
            </div>
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
    <div v-else>
      <b-btn size="lg" :disabled="loading" href="/api/storage/dropbox/auth" :variant="loading ? 'outline-secondary' : 'secondary'">
        <fa v-if="loading" spin icon="spinner" />
        <fa v-else :icon="['fab', 'dropbox']"/>
        Connect to Dropbox
      </b-btn>
    </div>
  </div>
</template>

<script>
const queryString = require('query-string');
const bytesUtility = require('bytes');

export default {
  transition: 'fade',
  middleware: [
    'settings-meta',
  ],
  meta: {
    settingsPageTitle: 'Dropbox',
  },
  data: function() {
    return {
      loading: true,
      revoking: false,
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
        if (this.oauthResponseExists()) {
          this.parseOauthResponse();
        }
        else if (this.accessToken && this.accountId) {
          this.updateProfile({
            accessToken: this.accessToken,
            accountId: this.accountId,
          });
          this.getTranscripts({
            accessToken: this.accessToken,
          });
        }
        else {
          this.loading = false;
        }
      });
    }, this.accountId ? 0 : 1000);
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
    profileExists: function() {
      return this.profile.name && this.profile.email;
    },
  },
  methods: {
    bytesToString: function(bytes) {
      return bytesUtility(bytes, {unitSeparator: ' '});
    },
    oauthResponseExists: function() {
      let {access_token: accessToken, account_id: accountId} = queryString.parse(location.hash);
      return accessToken && accountId;
    },
    parseOauthResponse: function() {
      // We might be returning from an oauth flow; parse incoming data
      let {access_token: accessToken, account_id: accountId} = queryString.parse(location.hash);
      if (accessToken && accountId) {
        this.accessToken = accessToken;
        this.accountId = accountId;
        this.updateProfile({accessToken, accountId});
        this.getTranscripts({accessToken});
      }

      // Remove hash
      window.history.replaceState(null, null, ' ');
    },
    revokeAuthToken: async function() {
      this.revoking = true;
      try {
        await this.$axios.$post('/api/storage/dropbox/auth-revoke', {
          accessToken: this.accessToken,
        });
        this.resetProfile();
        this.accessToken = null;
        this.accountId = null;
        this.revoking = false;
      }
      catch(e) {}
    },
    updateProfile: async function({accessToken, accountId}) {
      if (!accessToken || !accountId) {
        this.loading = false;
        return;
      }

      try {
        const dropboxProfile = await this.$axios.$get('/api/storage/dropbox/profile', {
          params: {accessToken, accountId},
        });

        if (dropboxProfile) {
          this.profile.email = dropboxProfile.email;
          this.profile.name = dropboxProfile.name.display_name;
          this.profile.photoUrl = dropboxProfile.profile_photo_url;
        }
        this.loading = false;
      }
      catch(e) {
        // Unable to get profile
        this.resetProfile();

        this.accessToken = null;
        this.accountId = null;
      }
    },
    getTranscripts: async function({accessToken, cursor}) {
      if (!this.accessToken) {
        return;
      }

      const {has_more, cursor: newCursor, files} = await this.$axios.$get('/api/storage/dropbox/transcripts', {params: {accessToken, cursor}});

      if (files) {
        this.transcripts = this.transcripts.concat(files);
      }

      if (has_more) {
        this.getTranscripts({accessToken, newCursor});
      }
    },
    resetProfile: function() {
      this.profile.email = null;
      this.profile.name = null;
      this.profile.photoUrl = null;
    },
  },
}
</script>
