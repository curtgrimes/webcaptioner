<template>
  <div
    class="settings-view"
    :style="{ height }"
    style="overflow: auto;"
    ref="settingsView"
  >
    <router-link
      aria-label="Close Settings"
      :to="localePath('captioner')"
      class="btn btn-light d-none d-sm-block position-fixed py-md-3 px-3 px-md-4"
      style="z-index: 2; right: 0; top: 0;"
      role="tab"
      active-class
    >
      <fa icon="times" size="2x" />
    </router-link>
    <!-- xs navbar -->
    <nav
      class="d-sm-none navbar sticky-top navbar-light bg-primary pr-2"
      :class="{ 'pl-2': showBackButton }"
      style="z-index: 1025;"
    >
      <div class="mr-auto">
        <router-link
          to="/captioner/settings"
          class="btn btn-primary mr-2"
          v-if="showBackButton"
        >
          <fa icon="arrow-left" />
        </router-link>
        <div
          class="navbar-text font-weight-bold"
          style="position: relative; top: 2px;"
        >
          {{ navbarTitle }}
        </div>
      </div>
      <router-link :to="localePath('captioner')" class="btn btn-primary">
        <fa icon="times" aria-label="Close" />
      </router-link>
    </nav>
    <div class="row mx-0" style="min-height: 100%;">
      <!-- xs navigation -->
      <div
        :hidden="showBackButton"
        class="d-sm-none col p-0 bg-white pb-5 mb-3"
      >
        <!--  pb-5 mb-3 for bottom navbar space -->
        <b-list-group flush>
          <b-list-group-item
            v-for="({ name, to, icon }, index) in settingsPages"
            :key="index"
            :to="to"
            ><fa :icon="icon" class="mr-1" fixed-width />
            {{ name }}</b-list-group-item
          >
        </b-list-group>
      </div>

      <!-- non-xs navigation -->
      <div
        class="d-none d-sm-block col-sm-4 py-5 pr-md-4 pr-xl-5 bg-primary"
        style="min-height: 100%;"
      >
        <div class="row h-100">
          <div class="col-lg-9 col-xl-7 ml-auto mb-5">
            <div class="position-sticky" style="top: 20px;">
              <h2 class="d-none d-sm-block pl-3 text-dark">
                Settings
              </h2>
              <nav>
                <b-nav vertical pills>
                  <b-nav-item
                    v-for="({ name, to, icon }, index) in settingsPages"
                    :key="index"
                    active-class="active"
                    :to="to"
                    link-classes="d-flex align-items-center"
                  >
                    <fa :icon="icon" class="mr-2" size="lg" fixed-width />
                    <span>{{ name }}</span>
                  </b-nav-item>
                </b-nav>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-sm-8 pt-sm-5 pb-sm-5 pl-md-4 pl-xl-5 bg-light"
        :class="{ 'd-none d-sm-flex': !showBackButton }"
      >
        <div class="row pb-5 pt-4 pt-sm-0">
          <!-- pb-5 here adds bottom padding to clear the fixed navbar. pt-4 is extra for top navbar on xs. -->
          <div class="col-lg-10 col-xl-9 mr-auto">
            <h2 class="d-none" :class="{ 'd-sm-block': showBackButton }">
              {{ navbarTitle }}
            </h2>
            <transition name="fade">
              <div
                class="form-inline alert alert-secondary"
                v-if="$store.state.user.signedIn === false"
              >
                Sign in to save your settings to your account.
                <div class="w-100 d-md-none"></div>
                <b-button
                  :to="localePath('captioner-sign-in')"
                  size="sm"
                  class="p-2 px-3 ml-md-auto mt-2 mt-md-0 d-block"
                  variant="secondary"
                >
                  <fa icon="user-circle" class="mr-2" />Sign In
                </b-button>
              </div>
            </transition>
            <nuxt-child />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-badge {
  position: relative;
  top: 2px;
  float: right;
}
</style>

<script>
import Combokeys from 'combokeys';

import {
  BListGroup,
  BListGroupItem,
  BNav,
  BNavItem,
  BBadge,
  BButton,
} from 'bootstrap-vue';

export default {
  mixins: [],
  components: {
    BListGroup,
    BListGroupItem,
    BNav,
    BNavItem,
    BBadge,
    BButton,
  },
  data: function () {
    return {
      logTimeRemainingMinutes: '00',
      logTimeRemainingSeconds: '00',
      escShortcut: null,
      height: '100vh',
      tickInterval: null,

      settingsPages: [
        {
          name: 'General',
          to: '/captioner/settings/general',
          icon: 'cog',
        },
        {
          name: 'Appearance',
          to: '/captioner/settings/appearance',
          icon: 'paint-brush',
        },
        {
          name: 'Channels',
          to: '/captioner/settings/channels',
          icon: 'satellite-dish',
        },
        {
          name: 'Experiments',
          to: '/captioner/settings/experiments',
          icon: 'flask',
        },
        {
          name: 'Language',
          to: '/captioner/settings/language',
          icon: 'globe-asia',
        },
        {
          name: 'Word Replacements',
          to: '/captioner/settings/word-replacements',
          icon: 'sync-alt',
        },
        {
          name: 'Export and Restore',
          to: '/captioner/settings/export-restore',
          icon: 'file-download',
        },
      ],
    };
  },
  mounted: function () {
    let self = this;
    this.escShortcut = new Combokeys(document.documentElement);
    this.escShortcut.bind('esc', function () {
      self.$router.push('/captioner');
    });

    this.startLogTimer();
  },
  beforeDestroy: function () {
    if (this.escShortcut) {
      this.escShortcut.detach();
    }

    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
  },
  watch: {
    eventLogStopTime: function () {
      this.startLogTimer();
    },
    $route(to, from) {
      // Scroll to top of settings page
      if (this.$refs.settingsView) {
        this.$refs.settingsView.scrollTop = 0;
      }
    },
  },
  methods: {
    startLogTimer: function () {
      if (this.eventLogStopTime) {
        let logTick = () => {
          let now = Date.now();
          if (now < this.eventLogStopTime) {
            let minutesDecimal =
              (this.eventLogStopTime - Date.now()) / 1000 / 60;
            this.logTimeRemainingMinutes = (
              Math.floor(minutesDecimal) + ''
            ).padStart(2, '0');
            this.logTimeRemainingSeconds = (
              Math.floor((minutesDecimal - this.logTimeRemainingMinutes) * 60) +
              ''
            ).padStart(2, '0');
          } else {
            if (this.tickInterval) {
              clearInterval(this.tickInterval);
            }

            this.logTimeRemainingMinutes = this.logTimeRemainingSeconds = '00';
          }
        };

        if (this.tickInterval) {
          clearInterval(this.tickInterval);
        }

        logTick();
        this.tickInterval = setInterval(logTick, 100);
      }
    },
  },
  computed: {
    eventLog: function () {
      return (
        Boolean(this.$store.state.eventLog.onUntilStopTime) ||
        this.$store.state.eventLog.log.length > 0
      );
    },
    eventLogCount: function () {
      return this.$store.state.eventLog.log.length;
    },
    eventLogStopTime: function () {
      return this.$store.state.eventLog.onUntilStopTime;
    },
    currentlyOnExperiments: function () {
      return this.$route.path === '/captioner/settings/experiments';
    },
    experiments: function () {
      return this.$store.state.settings.exp;
    },
    showBackButton: function () {
      return this.$route.path !== '/captioner/settings';
    },
    navbarTitle: function () {
      return this.$store.state.settingsPageTitle || '';
    },
    largerLayout: function () {
      return this.$store.state.settings.controls.layout.larger;
    },
  },
};
</script>

<style scoped>
h3 {
  text-transform: uppercase;
  margin: 1rem 0;
}

.nav-pills {
  font-size: 0.92rem;
}
</style>
