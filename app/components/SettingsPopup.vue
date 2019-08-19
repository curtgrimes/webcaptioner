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
          <span v-if="$store.state.user.email || $store.state.user.displayName">as</span>
        </span>
        <div
          v-if="$store.state.user.email || $store.state.user.displayName"
        >{{$store.state.user.email || $store.state.user.displayName}}</div>
        <b-button
          size="sm"
          style="font-size:.8rem"
          class="py-0 px-2 mt-1"
          variant="light"
          @click="signOut()"
        >Sign Out</b-button>
      </div>
      <hr />
    </div>
    <b-button-group vertical class="d-flex">
      <b-button href="/" block variant="link" class="py-0" size="sm">{{$t('navbar.menu.about')}}</b-button>
      <b-button href="/blog" block variant="link" class="py-0" size="sm">{{$t('navbar.menu.blog')}}</b-button>
      <b-button
        href="/help"
        block
        variant="link"
        class="py-0"
        size="sm"
      >{{$t('navbar.menu.helpCenter')}}</b-button>
      <!-- <b-button
                href="/donate"
                block
                variant="link"
                class="py-0"
                size="sm"
      >{{$t('navbar.menu.donate')}}</b-button>-->
      <b-button
        href="/feedback"
        block
        variant="link"
        class="py-0"
        size="sm"
      >{{$t('navbar.menu.feedback')}}</b-button>
    </b-button-group>
    <hr />
    <b-button-group class="d-flex">
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
    <!-- <hr /> -->
    <b-card v-if="false" style="background:#F86753" body-class="text-white p-2">
      <p class="mb-1">
        <strong>
          <fa :icon="['fab', 'patreon']" class="mr-2" />Patreon
        </strong>
      </p>
      <p
        class="mb-1"
      >Support Web Captioner by becoming a patron and getting access to some cool stuff!</p>
      <b-button block variant="light" size="sm" :to="localePath('captioner-settings')">Learn More</b-button>
      <transition name="fade">
        <div v-if="patronCount === null" class="text-center">
          <!-- loading -->
          <!-- <b-spinner small></b-spinner> -->
        </div>
        <div v-else-if="patronCount === false">
          <!-- failed to load -->
        </div>
        <p v-else class="text-center mb-0 mt-1">{{patronCount}} patrons</p>
      </transition>
    </b-card>
    <hr />
    <b-button
      block
      variant="secondary"
      :to="localePath('captioner-settings')"
      @click="$emit('dismiss')"
    >
      <fa icon="cog" class="mr-1" />
      <!--
      -->
      {{$t('navbar.menu.settings')}}
    </b-button>
    <div v-if="$store.state.user.signedIn === false" class="pt-1" style="line-height:1.25rem">
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
  data: function() {
    return {
      patronCount: null,
    };
  },
  props: {
    shown: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    shown: function() {
      if (this.shown && this.patronCount === null) {
        this.$axios
          .get('/api/patreon/patron-count')
          .then(({ data }) => {
            if (data) {
              this.patronCount = data;
            }
          })
          .catch(() => {
            this.patronCount = false;
          });
      }
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