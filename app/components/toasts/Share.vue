<template>
  <toast title="Share Captions" :show="show" :onShow="onShow" :onClose="onClose">
    <div v-if="!hasValidShareLink">
      <div
        v-if="expired"
        class="alert bg-danger small text-white p-2"
      >Your previous link expired, but you can get a new one.</div>
      <p class="mb-2">Get a link to share live captions with others.</p>
      <form ref="shareLinkForm" action="javascript:void(0)" onsubmit="return false">
        <div class="custom-control custom-checkbox">
          <input
            v-model="showBacklink"
            class="custom-control-input"
            name="showBacklink"
            type="checkbox"
            id="show-backlink"
          >
          <label
            class="custom-control-label"
            for="show-backlink"
          >Show a link back to my stream or website</label>
          <input
            ref="backlinkInput"
            required
            v-if="showBacklink"
            type="url"
            class="form-control mt-2"
            v-model="backlink"
            placeholder="Stream or website URL"
          >
        </div>
      </form>
    </div>
    <div v-else style="width:500px; min-width:200px; max-width:100%">
      <p class="font-weight-bold">How will you share captions?</p>

      <a
        href="javascript:void(0)"
        @click="showViewerLink = !showViewerLink"
        class="d-block mb-2 font-weight-bold"
      >
        <fa :icon="showViewerLink ? 'caret-down' : 'caret-right'" fixed-width/>Share with viewers
      </a>
      <b-collapse
        id="shareViewerLink"
        v-model="showViewerLink"
        accordion="shareLinksAccordion"
        class="ml-3"
      >
        <div class="input-group">
          <input
            @focus="shareLinkSelect()"
            @click="shareLinkSelect()"
            ref="shareLinkInput"
            type="text"
            class="form-control"
            readonly
            :value="shareLink"
            :disabled="expiringLink"
          >
          <div class="input-group-append">
            <b-btn size="sm" class="pt-2" type="button" :href="shareLink" target="_blank">
              <fa icon="arrow-right"/>
            </b-btn>
          </div>
        </div>
        <div class="small mt-2 mb-3">
          <!--Viewers will be able to set their own appearance settings.-->
        </div>
      </b-collapse>

      <a
        href="javascript:void(0)"
        @click="showBroadcastLink = !showBroadcastLink"
        class="d-block font-weight-bold"
      >
        <fa :icon="showBroadcastLink ? 'caret-down' : 'caret-right'" fixed-width/>Use in your broadcasting application
      </a>
      <b-collapse
        id="shareBroadcastLink"
        v-model="showBroadcastLink"
        accordion="shareLinksAccordion"
        class="ml-3"
      >
        <div class="mt-2">
          <input
            @focus="shareLinkSelect()"
            @click="shareLinkSelect()"
            ref="shareLinkInput"
            type="text"
            class="form-control"
            readonly
            :value="shareLinkBroadcast"
            :disabled="expiringLink"
          >
          <div
            class="small mt-2"
          >Use this link in a browser source in Streamlabs OBS, OBS, or XSplit. Captions will match your current appearance settings. The splash screen, navigation bar, and extra buttons will be hidden. Since this hides Web Captioner branding, consider mentioning Web Captioner when you use this.</div>
        </div>
      </b-collapse>
      <hr class="my-3">
      <p class="small text-muted mb-2">
        Link expires
        <timeago :datetime="expireDate"></timeago>
      </p>
      <!-- <div class="card p-2 bg-primary text-info mb-3">
                <p class="text-monospace text-uppercase font-weight-bold mb-1"><fa icon="info-circle"/> Enjoy this Preview!</p>
                <span class="small">I hope you enjoy the preview of this new feature! Please send me feedback on <a href="https://facebook.com/webcaptioner" target="_blank">Facebook</a> or <a href="https://twitter.com/webcaptioner" target="_blank">Twitter</a> about how well it works for you and your viewers.</span>
      </div>-->
      <hr class="my-3">
      <b-dropdown
        text="Options"
        variant="outline-secondary"
        size="sm"
        toggle-class="px-2 py-1"
        :disabled="expiringLink"
      >
        <template slot="button-content">
          <fa icon="cog"/>
        </template>
        <!-- <b-dropdown-item :to="localePath('captioner-share')">Customize Link</b-dropdown-item>
        <b-dropdown-divider/>-->
        <b-dropdown-item @click="expireLink()">Expire Now</b-dropdown-item>
      </b-dropdown>
      <span class="pl-2 text-secondary">
        <fa v-if="expiringLink" icon="spinner" spin/>
      </span>
      <b-btn
        size="sm"
        variant="light"
        class="text-white px-2 py-1 float-right"
        style="background:#1b95e0;border-color:#1b95e0;font-family:'Roboto', sans-serif;text-transform:none"
        :href="twitterShareLink"
        target="_blank"
        v-b-tooltip.hover
        title="Share on Twitter"
      >
        <fa :icon="['fab', 'twitter']"/>
      </b-btn>
      <!-- <b-btn size="sm" variant="light" class="text-white px-2 py-1 float-right mr-1" style="background:#3B5998;border-color:#3B5998;font-family:'Roboto', sans-serif;text-transform:none" :href="facebookShareLink" target="_blank" v-b-tooltip.hover title="Share on Facebook"><fa :icon="['fab', 'facebook']" /></b-btn> -->
    </div>
    <div
      v-if="somethingWentWrong"
      class="alert bg-danger text-white mt-2 mb-0 p-2"
    >Something went wrong.</div>
    <template v-if="!hasValidShareLink" slot="footer">
      <b-btn @click="getLink()" :disabled="gettingLink" variant="secondary">
        Get Link
        <fa v-if="gettingLink" icon="spinner" spin/>
      </b-btn>
    </template>
  </toast>
</template>

<script>
import toast from '~/components/Toast.vue';
import bBtn from 'bootstrap-vue/es/components/button/button';
import bCollapse from 'bootstrap-vue/es/components/collapse/collapse';
import bDropdown from 'bootstrap-vue/es/components/dropdown/dropdown';
import bDropdownItem from 'bootstrap-vue/es/components/dropdown/dropdown-item';
import bTooltip from 'bootstrap-vue/es/directives/tooltip/tooltip';

export default {
  components: {
    toast,
    bBtn,
    bCollapse,
    bDropdown,
    bDropdownItem,
  },
  directives: {
    bTooltip,
  },
  data: () => {
    return {
      somethingWentWrong: false,
      gettingLink: false,
      expiringLink: false,
      showPopover: false,
      shareStyle: 'current',
      showBacklink: false,
      backlink: '',
      showViewerLink: false,
      showBroadcastLink: false,
    };
  },
  mounted: function() {},
  methods: {
    onShow() {
      // Called just after popover is shown
      // Hide any tooltips that may be open on the cast button
      this.$root.$emit('bv::hide::tooltip');
      if (this.$refs.shareLinkInput) {
        this.$refs.shareLinkInput.focus();
        this.$refs.shareLinkInput.select();
      }

      // Check if the link is expired
      if (this.expired) {
        this.nullLinkProperties();
      }
    },
    onClose() {
      this.$store.commit('share/SET_SHOW_SETTINGS', { on: false });
      this.somethingWentWrong = false;
    },
    async getLink() {
      this.somethingWentWrong = false;
      this.gettingLink = true;

      if (!this.$refs.shareLinkForm.reportValidity()) {
        // Form is invalid
        this.gettingLink = false;
        return;
      }

      try {
        const { roomId, ownerKey, url, expireDate } = await this.$axios.$post(
          '/api/rooms',
          {
            backlink: this.backlink,
            appearance: JSON.stringify(this.$store.state.settings.appearance),
          }
        );

        this.$store.commit('SET_SHARE_ROOM_ID', { roomId });
        this.$store.commit('SET_SHARE_OWNER_KEY', { ownerKey });
        this.$store.commit('SET_SHARE_URL', { url });
        this.$store.commit('SET_SHARE_EXPIRE_DATE', { expireDate });
        this.$store.commit('SET_SHARE_SUBSCRIBER_COUNT', {
          subscriberCount: 0,
        });
        this.$store.commit('share/SET_EXPIRED', { expired: false });

        this.$socket.sendObj({
          action: 'authenticateRoomOwner',
          roomId: this.$store.state.settings.share.roomId,
          ownerKey: this.$store.state.settings.share.ownerKey,
        });
      } catch (e) {
        this.somethingWentWrong = true;
      } finally {
        this.gettingLink = false;
      }
    },
    async expireLink() {
      this.expiringLink = true;
      const ownerKey = this.$store.state.settings.share.ownerKey;

      try {
        (await this.$axios.$delete(
          '/api/rooms/' + this.roomId + '?ownerKey=' + ownerKey
        )) === 'OK';
        this.nullLinkProperties();
      } catch (e) {
        // We might get a 403 if the wrong ownerKey is provided or 404 if the given roomKey doesn't
        // exist for some reason. We won't invalidate the link server-side, but as far as this client
        // is concerned, we'll remove our references to that link so they
        // can generate a new one.
        this.nullLinkProperties();
      } finally {
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
      this.$nextTick(function() {
        if (this.$refs.shareLinkInput) {
          this.$refs.shareLinkInput.focus();
          this.$refs.shareLinkInput.select();
        }
      });
    },
  },
  watch: {
    show: function(show) {
      if (show && this.hasValidShareLink) {
        setTimeout(() => {
          this.showViewerLink = true;
        }, 250); // after toast animation
      }

      if (!show) {
        this.showViewerLink = false;
      }
    },
    hasValidShareLink: function() {
      this.shareLinkSelect();
      setTimeout(() => {
        // this.showViewerLink = true;
      }, 100);
    },
    showBacklink: function(showBacklink) {
      if (!showBacklink) {
        this.backlink = '';
      }
    },
    subscriberCount: function() {
      // Hide any tooltips that may be open
      this.$root.$emit('bv::hide::tooltip');
    },
    showBacklink: function(showBacklink) {
      this.$nextTick(function() {
        if (showBacklink && this.$refs.backlinkInput) {
          this.$refs.backlinkInput.focus();
        }
      });
    },
  },
  computed: {
    show: function() {
      return this.$store.state.share.settings.show;
    },
    subscriberCount: function() {
      return this.$store.state.receivers.share.subscriberCount;
    },
    shareLink: function() {
      return this.$store.state.settings.share.url;
    },
    shareLinkBroadcast: function() {
      return this.$store.state.settings.share.url + '?broadcast';
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
    // facebookShareLink() {
    // return 'https://www.facebook.com/dialog/share?app_id=1339681726086659&amp;display=popup&amp;href=' + encodeURIComponent(this.shareLink);

    // return 'https://twitter.com/intent/tweet?' + 'text=' + encodeURIComponent('I\'m now captioning live with @WebCaptioner') + '&url='+ this.shareLink;
    // },
    twitterShareLink() {
      return (
        'https://twitter.com/intent/tweet?' +
        'text=' +
        encodeURIComponent("I'm now captioning live with @WebCaptioner") +
        '&url=' +
        this.shareLink
      );
    },
    expired: function() {
      return this.$store.state.share.expired;
    },
  },
};
</script>