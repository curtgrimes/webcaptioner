<template>
  <div>
    <b-button
      v-b-tooltip.hover
      title="Share"
      :disabled="showPopover"
      :variant="hasValidShareLink ? 'secondary' : 'info'"
      class="mr-2"
      ref="shareButton"
    >
      <fa icon="share-square"/>
    </b-button>
    <!-- Our popover title and content render container -->
    <!-- We use placement 'auto' so popover fits in the best spot on viewport -->
    <!-- We specify the same container as the trigger button, so that popover is close to button -->
    <b-popover v-if="mounted"
               :target="getShareButtonRef()"
               triggers="click"
               :show.sync="showPopover"
               placement="auto"
               container="myContainer"
               ref="popover"
               @show="onShow">
      <template slot="title">
        <b-btn @click="onClose" class="close" aria-label="Close" variant="link">
          <span class="d-inline-block" aria-hidden="true">&times;</span>
        </b-btn>
        Share
      </template>
      <div v-if="!hasValidShareLink">
        <p class="mb-2">Share live captions with others.</p>
        <p class="mb-1">
          <b-btn @click="getLink()" size="sm" class="px-2 py-1" :disabled="gettingLink">Get Link <fa v-if="gettingLink" icon="spinner" spin /></b-btn>
        </p>
      </div>
      <div v-else style="width:500px; min-width:200px; max-width:100%">
        <p class="mb-2">Use this link to share live captions with others.</p>
        <input @focus="shareLinkSelect()" @click="shareLinkSelect()" ref="shareLinkInput" type="text" class="form-control small mb-2" style="font-size:.7rem" readonly :value="shareLink"  :disabled="expiringLink"/>
        <p class="small text-muted mb-2">Link expires <timeago :datetime="expireDate"></timeago></p>
        <b-dropdown text="Options" variant="outline-secondary" size="sm" toggle-class="px-2 py-1" :disabled="expiringLink">
          <template slot="button-content">
            <fa icon="cog"/>
          </template>
          <b-dropdown-item :to="localePath('captioner-share')">Customize Link</b-dropdown-item>
          <b-dropdown-divider/>
          <b-dropdown-item @click="expireLink()">Expire Now</b-dropdown-item>
        </b-dropdown> <span class="pl-2 text-secondary"><fa v-if="expiringLink" icon="spinner" spin /></span>
        <b-btn size="sm" variant="light" class="text-white px-2 py-1 float-right" style="background:#1b95e0;border-color:#1b95e0;font-family:'Roboto', sans-serif;text-transform:none" :href="twitterShareLink"><fa :icon="['fab', 'twitter']" /> Tweet</b-btn>
      </div>
      <p v-if="somethingWentWrong" class="text-danger small mt-2 mb-1 font-weight-bold">Something went wrong.</p>
    </b-popover>




    <b-modal :title="$t('googleCast.castingFailed')" :hide-header="true" ref="castFailedModal" :ok-only="true" ok-variant="secondary" :hide-header-close="true">
      <div class="py-2">
        <div class="pb-2 h4"><fa icon="exclamation-triangle" size="3x" /></div>
        <h2>{{$t('googleCast.unableToCast')}}</h2>
        <p class="lead">{{$t('googleCast.pleaseTryAgain')}}</p>
      </div>
    </b-modal>
  </div>
</template>

<style scoped>
</style>


<script>
export default {
  name: 'shareButton',
  data: () => {
    return {
      somethingWentWrong: false,
      gettingLink: false,
      expiringLink: false,
      showPopover: false,
      mounted: false,
    };
  },
  mounted: function() {
    this.mounted = true;
  },
  computed: {
    shareLink: function() {
      return this.$store.state.settings.share.url;
    },
    roomId: function() {
      return this.$store.state.settings.share.roomId;
    },
    expireDate: function() {
      return this.$store.state.settings.share.expireDate;
    },
    hasValidShareLink() {
      return this.shareLink && this.roomId && this.expireDate;
    },
    twitterShareLink() {
      return 'https://twitter.com/intent/tweet?' + 'text=' + encodeURIComponent('I\'m now captioning live with @WebCaptioner') + '&url='+ this.shareLink;
    },
  },
  methods: {
    getShareButtonRef() {
      return this.$refs.shareButton;
    },
    async getLink() {
      this.somethingWentWrong = false;
      this.gettingLink = true;

      try {
        const {roomId, ownerKey, url, expireDate} = await this.$axios.$post('/api/rooms');

        this.$store.commit('SET_SHARE_ROOM_ID', { roomId });
        this.$store.commit('SET_SHARE_OWNER_KEY', { ownerKey });
        this.$store.commit('SET_SHARE_URL', { url });
        this.$store.commit('SET_SHARE_EXPIRE_DATE', { expireDate });


        this.$socket.sendObj({
          action: 'authenticateRoomOwner',
          roomId: this.$store.state.settings.share.roomId,
          ownerKey: this.$store.state.settings.share.ownerKey,
        });
      }
      catch (e) {
        this.somethingWentWrong = true;
      }
      finally {
        this.gettingLink = false;
      }
    },
    async expireLink() {
      this.expiringLink = true;
      const ownerKey = this.$store.state.settings.share.ownerKey;
      
      try {
        await this.$axios.$delete('/api/rooms/' + this.roomId + '?ownerKey=' + ownerKey) === 'OK';
        this.nullLinkProperties();
      }
      catch(e) {
        // We might get a 403 if the wrong ownerKey is provided or 404 if the given roomKey doesn't 
        // exist for some reason. We won't invalidate the link server-side, but as far as this client
        // is concerned, we'll remove our references to that link so they 
        // can generate a new one.
        this.nullLinkProperties();
      }
      finally {
        this.expiringLink = false;
      }
    },
    nullLinkProperties() {
        this.$store.commit('SET_SHARE_ROOM_ID', { roomId: null });
        this.$store.commit('SET_SHARE_OWNER_KEY', { ownerKey: null });
        this.$store.commit('SET_SHARE_URL', { url: null });
        this.$store.commit('SET_SHARE_EXPIRE_DATE', { expireDate: null });
    },
    shareLinkSelect() {
      this.$nextTick(function () {
        if (this.$refs.shareLinkInput) {
          this.$refs.shareLinkInput.focus();
          this.$refs.shareLinkInput.select();
        }
      });
    },

    onClose () {
      this.showPopover = false;
    },
    onOk () {

    },
    onShow () {
      // Called just before popover is shown
      // Hide any tooltips that may be open on the cast button
      this.$root.$emit('bv::hide::tooltip');
      if (this.$refs.shareLinkInput) {
        this.$refs.shareLinkInput.focus();
        this.$refs.shareLinkInput.select();
      }
    },
  },
  watch: {
    'hasValidShareLink': function () {
      this.shareLinkSelect();
    },
  },
}
</script>
