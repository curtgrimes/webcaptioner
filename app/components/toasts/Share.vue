<template>
  <toast title="Share Captions" :show="show" :onShow="onShow" :onClose="onClose">
    <div v-if="!hasValidShareLink">
      <div
        v-if="expired"
        class="alert bg-danger small text-white p-2"
      >Your previous link expired, but you can get a new one.</div>
      <p class="mb-2">Get a link to share live captions with others.</p>
      <form ref="shareLinkForm" action="javascript:void(0)" onsubmit="return false">
        <b-form-checkbox v-model="showBacklink" switch>Show a link back to my stream or website</b-form-checkbox>
        <transition name="fade-in">
          <input
            ref="backlinkInput"
            required
            v-if="showBacklink"
            type="url"
            class="form-control mt-2 mb-4"
            v-model="backlink"
            placeholder="Stream or website URL"
          />
        </transition>
        <b-form-checkbox v-model="showCustomWelcomeMessageAuthorInput" switch>Custom welcome message</b-form-checkbox>
        <transition name="fade-in">
          <input
            ref="showCustomWelcomeMessageAuthorInput"
            required
            v-if="showCustomWelcomeMessageAuthorInput"
            type="text"
            class="form-control mt-2"
            v-model="customWelcomeMessageAuthor"
            placeholder="Your name or business"
            maxlength="50"
          />
        </transition>
        <transition name="fade-in">
          <p v-if="showCustomWelcomeMessageAuthorInput" class="mb-4 mt-2 text-muted">
            Before captioning starts, your viewers will see this message:
            <br />
            <span v-if="customWelcomeMessageAuthor">"{{customWelcomeMessageAuthor}} has invited you</span>
            <span v-else>"You've been invited</span> to watch live captions with Web Captioner."
          </p>
        </transition>

        <b-form-group label="Link Type" class="mt-3 mb-0">
          <b-form-radio-group v-model="urlType" stacked name="plain-stacked">
            <b-form-radio value="random">
              Random link
              <span class="small text-muted">(Expires in 48 hours)</span>
            </b-form-radio>
            <b-form-radio value="vanity">
              Custom vanity link
              <span class="small text-muted">(Never expires)</span>
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <transition name="fade-in">
          <div v-if="urlType === 'vanity'">
            <b-badge
              v-if="vanity"
              variant="success"
              class="ml-4 mt-1 px-2 py-1"
              style="font-size:.9rem"
            >
              <fa icon="star" />
              {{vanity}}
            </b-badge>
            <p
              v-else-if="vanity === false"
              class="small text-danger mb-0 mt-2"
            >Hang tight! Vanity links aren't available to everyone yet.</p>
            <b-spinner v-else small class="mt-2 ml-4" variant="muted"></b-spinner>
          </div>
        </transition>
      </form>
    </div>
    <div v-else style="width:500px; min-width:200px; max-width:100%">
      <p class="font-weight-bold">How will you share captions?</p>

      <a
        href="javascript:void(0)"
        @click="showViewerLink = !showViewerLink"
        class="d-block mb-2 font-weight-bold"
      >
        <fa :icon="showViewerLink ? 'caret-down' : 'caret-right'" fixed-width />Share with viewers
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
          />
          <div class="input-group-append">
            <b-button size="sm" class="pt-2" type="button" :href="shareLink" target="_blank">
              <fa icon="arrow-right" />
            </b-button>
          </div>
        </div>
        <div
          class="small mt-2"
        >This link lets other people watch your captions on their device in real time.</div>
        <div class="small mt-2 mb-3">
          <!--Viewers will be able to set their own appearance settings.-->
        </div>
      </b-collapse>

      <a
        href="javascript:void(0)"
        @click="showBroadcastLink = !showBroadcastLink"
        class="d-block font-weight-bold"
      >
        <fa :icon="showBroadcastLink ? 'caret-down' : 'caret-right'" fixed-width />Use in your broadcasting application
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
          />
          <div
            class="small mt-2"
          >Use this link in a browser source in Streamlabs OBS, OBS, or XSplit. Captions will match your current appearance settings. The splash screen, navigation bar, and extra buttons will be hidden. Since this hides Web Captioner branding, consider mentioning Web Captioner when you use this.</div>
        </div>
      </b-collapse>
      <hr class="my-3" />
      <div v-if="expireDate !== null">
        <p class="small text-muted mb-2">
          Link expires
          <timeago :datetime="expireDate"></timeago>
        </p>
        <hr class="my-3" />
      </div>
      <b-dropdown
        text="Options"
        variant="outline-secondary"
        size="sm"
        toggle-class="px-2 py-1"
        :disabled="expiringLink"
      >
        <template slot="button-content">
          <fa icon="cog" />
        </template>
        <!-- <b-dropdown-item :to="localePath('captioner-share')">Customize Link</b-dropdown-item>
        <b-dropdown-divider/>-->
        <b-dropdown-item @click="expireLink()">Expire Now</b-dropdown-item>
      </b-dropdown>
      <span class="pl-2 text-secondary">
        <fa v-if="expiringLink" icon="spinner" spin />
      </span>
      <b-button
        size="sm"
        variant="light"
        class="text-white px-2 py-1 float-right"
        style="background:#1b95e0;border-color:#1b95e0;font-family:'Source Sans Pro', sans-serif;text-transform:none"
        :href="twitterShareLink"
        target="_blank"
        v-b-tooltip.hover
        title="Share on Twitter"
      >
        <fa :icon="['fab', 'twitter']" />
      </b-button>
      <!-- <b-button size="sm" variant="light" class="text-white px-2 py-1 float-right mr-1" style="background:#3B5998;border-color:#3B5998;font-family:'Source Sans Pro', sans-serif;text-transform:none" :href="facebookShareLink" target="_blank" v-b-tooltip.hover title="Share on Facebook"><fa :icon="['fab', 'facebook']" /></b-button> -->
    </div>
    <div
      v-if="somethingWentWrong"
      class="alert bg-danger text-white mt-2 mb-0 p-2"
    >Something went wrong.</div>
    <template v-if="!hasValidShareLink" slot="footer">
      <b-button
        @click="getLink()"
        :disabled="gettingLink || (urlType === 'vanity' && !vanity)"
        :variant="(urlType === 'vanity' && !vanity) ? 'light' : 'secondary'"
      >
        Get Link
        <fa v-if="gettingLink" icon="spinner" spin />
      </b-button>
    </template>
  </toast>
</template>

<script>
import toast from '~/components/Toast.vue';

import {
  BButton,
  BCollapse,
  BDropdown,
  BDropdownItem,
  VBTooltip,
  BFormCheckbox,
  BFormGroup,
  BFormRadio,
  BFormRadioGroup,
  BSpinner,
  BBadge,
} from 'bootstrap-vue';

export default {
  components: {
    toast,
    BButton,
    BCollapse,
    BDropdown,
    BDropdownItem,
    BFormCheckbox,
    BFormGroup,
    BFormRadio,
    BFormRadioGroup,
    BSpinner,
    BBadge,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data: () => {
    return {
      somethingWentWrong: false,
      gettingLink: false,
      expiringLink: false,
      showPopover: false,
      shareStyle: 'current',
      showBacklink: false,
      showCustomWelcomeMessageAuthorInput: false,
      customWelcomeMessageAuthor: null,
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

      let idToken;
      if (this.$store.state.user.uid && this.$firebase.auth().currentUser) {
        // Person is currently logged in. Get their ID token for authentication.
        idToken = await this.$firebase.auth().currentUser.getIdToken();
      }

      try {
        const {
          roomId,
          ownerKey,
          url,
          expires,
          expireDate,
        } = await this.$axios.$post('/api/rooms', {
          backlink: this.backlink,
          appearance: JSON.stringify(this.$store.state.settings.appearance),
          urlType: this.urlType,
          idToken: idToken,
          customWelcomeMessageAuthor: this.customWelcomeMessageAuthor,
        });

        this.$store.commit('SET_SHARE_ON', { on: true });
        this.$store.commit('SET_SHARE_ROOM_ID', { roomId });
        this.$store.commit('SET_SHARE_OWNER_KEY', { ownerKey });
        this.$store.commit('SET_SHARE_URL', { url });
        this.$store.commit('SET_SHARE_EXPIRES', { expires });
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
      this.$store.commit('SET_SHARE_ON', { on: false });
      this.$store.commit('SET_SHARE_ROOM_ID', { roomId: null });
      this.$store.commit('SET_SHARE_OWNER_KEY', { ownerKey: null });
      this.$store.commit('SET_SHARE_URL', { url: null });
      this.$store.commit('SET_SHARE_EXPIRE_DATE', { expireDate: null });
      this.$store.commit('SET_SHARE_URL_TYPE', { urlType: 'random' });
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
    showCustomWelcomeMessageAuthorInput: function(
      showCustomWelcomeMessageAuthorInput
    ) {
      this.$nextTick(function() {
        if (
          showCustomWelcomeMessageAuthorInput &&
          this.$refs.showCustomWelcomeMessageAuthorInput
        ) {
          this.$refs.showCustomWelcomeMessageAuthorInput.focus();
        }
      });
    },
    urlType: function(urlType) {
      if (urlType === 'vanity' && this.$store.state.user.uid) {
        let db = this.$firebase.firestore();
        db.collection('users')
          .doc(this.$store.state.user.uid)
          .collection('privileges')
          .doc('share')
          .get()
          .then((document) => {
            if (document.exists) {
              const { vanity } = document.data();
              this.$store.commit('SET_SHARE_VANITY', {
                vanity: vanity || false,
              });
            }
          });
      } else {
        this.$store.commit('SET_SHARE_VANITY', {
          vanity: false,
        });
      }
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
    urlType: {
      get() {
        return this.$store.state.settings.share.urlType;
      },
      set(urlType) {
        this.$store.commit('SET_SHARE_URL_TYPE', { urlType });
      },
    },
    vanity: function() {
      return this.$store.state.settings.share.vanity;
    },
    hasValidShareLink() {
      return (
        this.shareLink && this.roomId && (this.expireDate || !this.expires)
      );
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