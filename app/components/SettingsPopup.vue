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
        <b-btn size="sm" class="py-1 px-2 mt-2" variant="light" @click="signOut()">Sign Out</b-btn>
      </div>
      <hr />
    </div>
    <b-btn-group vertical class="d-flex">
      <b-btn href="/" block variant="link" class="py-0" size="sm">{{$t('navbar.menu.about')}}</b-btn>
      <b-btn href="/blog" block variant="link" class="py-0" size="sm">{{$t('navbar.menu.blog')}}</b-btn>
      <b-btn
        href="/help"
        block
        variant="link"
        class="py-0"
        size="sm"
      >{{$t('navbar.menu.helpCenter')}}</b-btn>
      <!-- <b-btn
                href="/donate"
                block
                variant="link"
                class="py-0"
                size="sm"
      >{{$t('navbar.menu.donate')}}</b-btn>-->
      <b-btn
        href="/feedback"
        block
        variant="link"
        class="py-0"
        size="sm"
      >{{$t('navbar.menu.feedback')}}</b-btn>
    </b-btn-group>
    <hr />
    <b-btn-group class="d-flex">
      <b-btn
        :to="localePath('captioner-save-to-file')"
        variant="outline-secondary"
        v-b-tooltip.hover.top
        title="Save transcript"
      >
        <fa icon="save" />
      </b-btn>
      <b-btn
        variant="outline-secondary"
        v-b-tooltip.hover.top
        :title="$t('navbar.menu.newWindow')"
        @click="$store.dispatch('START_DETACHED_MODE')"
      >
        <fa icon="window-restore" />
      </b-btn>
      <b-btn
        variant="outline-danger"
        :to="localePath('captioner-clear')"
        v-b-tooltip.hover.top
        title="Clear transcript"
      >
        <fa icon="trash-alt" />
      </b-btn>
    </b-btn-group>
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
      <b-btn block variant="light" size="sm" :to="localePath('captioner-settings')">Learn More</b-btn>
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
    <b-btn block variant="secondary" :to="localePath('captioner-settings')">
      <fa icon="cog" class="mr-1" />
      <!--
      -->
      {{$t('navbar.menu.settings')}}
    </b-btn>
    <div v-if="$store.state.user.signedIn === false" class="pt-1" style="line-height:1.25rem">
      <!-- Not signed in -->
      <hr />
      <b-btn variant="light" block :to="localePath('captioner-sign-in')">
        <fa icon="user-circle" class="mr-1" />
        <!---->
        Sign in
      </b-btn>
      <div class="clearfix"></div>
    </div>
  </div>
</template>


<script>
import bBtn from 'bootstrap-vue/es/components/button/button';
import bBtnGroup from 'bootstrap-vue/es/components/button-group/button-group';
import bTooltipDirective from 'bootstrap-vue/es/directives/tooltip/tooltip';
import bTooltipComponent from 'bootstrap-vue/es/components/tooltip/tooltip';
import bPopover from 'bootstrap-vue/es/components/popover/popover';
import bSpinner from 'bootstrap-vue/es/components/spinner/spinner';
import bCard from 'bootstrap-vue/es/components/card/card';

export default {
  components: {
    bBtn,
    bBtnGroup,
    bPopover,
    bCard,
    bTooltip: bTooltipComponent,
    bSpinner,
  },
  directives: {
    bTooltip: bTooltipDirective,
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