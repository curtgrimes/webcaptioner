<template>
  <div style="min-width:240px;max-height:80vh;overflow-y:auto">
    <div v-if="$store.state.user.signedIn">
      <img
        :src="$store.state.user.photoURL"
        v-if="$store.state.user.photoURL"
        class="rounded-circle float-left p-1 pr-2"
        style="max-width:50px"
      />
      <fa
        v-else
        icon="user-circle"
        style="font-size:2.5em"
        class="float-left mt-2 mr-2 text-muted"
      />

      <div class="pt-1" style="line-height:1.25rem">
        <span class="text-muted">
          Signed in
          <span v-if="$store.state.user.email || $store.state.user.displayName"
            >as</span
          >
        </span>
        <div v-if="$store.state.user.email || $store.state.user.displayName">
          {{ $store.state.user.email || $store.state.user.displayName }}
        </div>
        <b-button
          size="sm"
          style="font-size:.8rem"
          class="py-0 px-2 mt-1"
          variant="light"
          @click="signOut()"
          >Sign Out</b-button
        >
      </div>
      <hr />
    </div>
    <a
      href="/"
      :target="
        this.$store.state.captioner.transcript.interim ||
        this.$store.state.captioner.transcript.final
          ? '_blank'
          : '_self'
      "
      class="btn btn-light btn-sm btn-block mb-2 text-left"
      ><fa icon="info-circle" fixed-width class="mr-1" />
      {{ $t('navbar.menu.about') }}
    </a>
    <nuxt-link
      to="/donate"
      :target="
        this.$store.state.captioner.transcript.interim ||
        this.$store.state.captioner.transcript.final
          ? '_blank'
          : '_self'
      "
      class="btn btn-light btn-sm btn-block mb-2 text-left"
    >
      <fa icon="heart" fixed-width class="mr-1" /> Donate
    </nuxt-link>
    <nuxt-link
      to="/help"
      :target="
        this.$store.state.captioner.transcript.interim ||
        this.$store.state.captioner.transcript.final
          ? '_blank'
          : '_self'
      "
      class="btn btn-light btn-sm btn-block mb-2 text-left"
    >
      <fa icon="info-circle" fixed-width /> Help Center
    </nuxt-link>
    <b-button
      @click="$emit('dismiss') && $store.dispatch('START_SUPPORT_POPUP')"
      block
      variant="light"
      size="sm"
      class="mb-2 text-left"
    >
      <fa icon="comment-alt" fixed-width class="mr-1" /> Instant Answers
    </b-button>
    <b-button
      v-if="$store.state.settings.exp.includes('srt')"
      :to="'/captioner/srt'"
      block
      variant="primary"
      size="sm"
      class="mb-2 text-left"
    >
      <fa icon="flask" fixed-width class="mr-1" /> Export SRT
    </b-button>
    <hr />
    <b-button-group class="d-flex mb-2">
      <b-button
        :to="localePath('captioner-save-to-file')"
        variant="outline-secondary"
        v-b-tooltip.hover.top
        title="Save transcript"
      >
        <fa icon="save" />
      </b-button>
      <b-button
        variant="outline-secondary"
        v-b-tooltip.hover.top
        :title="$t('navbar.menu.newWindow')"
        @click="$store.dispatch('START_DETACHED_MODE')"
      >
        <fa icon="window-restore" />
      </b-button>
      <b-button
        variant="outline-danger"
        :to="localePath('captioner-clear')"
        v-b-tooltip.hover.top
        title="Clear transcript"
      >
        <fa icon="trash-alt" />
      </b-button>
    </b-button-group>
    <b-button
      block
      size="sm"
      variant="secondary"
      :to="localePath('captioner-settings')"
      @click="$emit('dismiss')"
    >
      <fa icon="cog" class="mr-1" />
      <!--
      -->
      {{ $t('navbar.menu.settings') }}
    </b-button>
    <div
      v-if="$store.state.user.signedIn === false"
      class="pt-1"
      style="line-height:1.25rem"
    >
      <!-- Not signed in -->
      <hr />
      <b-button
        variant="light"
        block
        :to="localePath('captioner-sign-in')"
        @click="$emit('dismiss')"
      >
        <fa icon="user-circle" class="mr-1" />
        <!---->
        Sign in
      </b-button>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script>
import {
  BButton,
  BButtonGroup,
  BTooltip,
  VBTooltip,
  BPopover,
  BSpinner,
  BCard,
} from 'bootstrap-vue';

export default {
  components: {
    BButton,
    BButtonGroup,
    BPopover,
    BCard,
    BTooltip,
    BSpinner,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    shown: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    signOut: function() {
      this.showProfileMenu = false;
      setTimeout(() => {
        this.$firebase
          .auth()
          .signOut()
          .then(() => {
            // Success signing out
            // INIT_CHECK_AUTH_STATUS_WATCHER handles
            // updating the store and removing the user
            this.$store.commit('SHOW_TOAST', { toastName: 'signedOut' });
          });
      }, 350); // let popover fade out first to get around positioning issue on close
    },
  },
};
</script>
