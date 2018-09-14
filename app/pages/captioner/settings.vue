<template>
  <div class="settings-view" :style="{height}" style="overflow:auto" ref="settingsView">
    <router-link to="/captioner" class="btn btn-light d-none d-sm-block position-fixed py-md-3 px-3 px-md-4" style="z-index:2;right:0;top:0" role="tab" active-class=""><fa icon="times" size="2x" /></router-link>
    <!-- xs navbar -->
    <nav class="d-sm-none navbar sticky-top navbar-light bg-primary pr-2" :class="{'pl-2': showBackButton}" style="z-index:1025">
      <div class="mr-auto">
        <router-link to="/captioner/settings" class="btn btn-primary mr-2" v-if="showBackButton">
          <fa icon="arrow-left" />
        </router-link>
        <div class="navbar-text font-weight-bold" style="position: relative;top: 2px;">
          {{navbarTitle}}
        </div>
      </div>
      <router-link to="/captioner" class="btn btn-primary"><fa icon="times" aria-label="Close" /></router-link>
    </nav>
    <div class="row mx-0" style="min-height:100%">

      <!-- xs navigation -->
      <div :hidden="showBackButton" class="d-sm-none col p-0 bg-white pb-5 mb-3"> <!--  pb-5 mb-3 for bottom navbar space -->
        <b-list-group flush>
          <b-list-group-item to="/captioner/settings/about">{{$t('settings.about.about')}}</b-list-group-item>
          <b-list-group-item v-if="eventLog" to="/captioner/settings/event-log">
            {{$t('settings.eventLog.eventLog')}}
          </b-list-group-item>
          <b-list-group-item v-if="experiments.length || currentlyOnExperiments" to="/captioner/settings/experiments">{{$t('settings.experiments.experiments')}}</b-list-group-item>
        </b-list-group>
        <h3 class="text-muted pl-3 pt-2 small">{{$t('settings.general')}}</h3>
        <b-list-group flush>
          <b-list-group-item to="/captioner/settings/appearance">{{$t('settings.appearance.appearance')}}</b-list-group-item>
          <b-list-group-item to="/captioner/settings/censor">{{$t('settings.censor.censor')}}</b-list-group-item>
          <b-list-group-item to="/captioner/settings/controls">{{$t('settings.controls.controls')}}</b-list-group-item>
          <b-list-group-item to="/captioner/settings/language">{{$t('settings.language.language')}}</b-list-group-item>
          <b-list-group-item v-if="experiments.includes('remoteDisplays')" to="/captioner/settings/remote-displays">{{$t('settings.remoteDisplays.remoteDisplays')}}</b-list-group-item>
          <b-list-group-item to="/captioner/settings/word-replacements">{{$t('settings.wordReplacements.wordReplacements')}}</b-list-group-item>
          <!-- <b-list-group-item to="/captioner/settings/title-cards">Title Cards</b-list-group-item> -->
        </b-list-group>
        <h3 class="text-muted pl-3 pt-2 small">{{$t('settings.integrations')}}</h3>
        <b-list-group flush>
          <b-list-group-item to="/captioner/settings/vmix">{{$t('settings.vmix.vmix')}}</b-list-group-item>
          <b-list-group-item v-if="experiments.includes('webhooks')" to="/captioner/settings/webhooks">{{$t('settings.webhooks.webhooks')}}</b-list-group-item>
        </b-list-group>
        <h3 class="text-muted pl-3 pt-2 small">{{$t('settings.other')}}</h3>
        <b-list-group flush>
          <b-list-group-item to="/captioner/settings/export-restore">{{$t('settings.exportRestore.exportRestoreSettings')}}</b-list-group-item>
        </b-list-group>
      </div>

      <!-- non-xs navigation -->
      <div class="d-none d-sm-block col-sm-4 py-5 pr-md-4 pr-xl-5 bg-primary" style="min-height:100%">
        <div class="row h-100">
          <div class="col-lg-9 col-xl-7 ml-auto mb-5">
            <div class="position-sticky" style="top:20px">
              <h2 class="d-none d-sm-block lead pl-3 text-dark" style="padding-top:.6rem">{{$t('settings.settings')}}</h2>
              <nav>
                <b-nav vertical pills>
                  <b-nav-item to="/captioner/settings/about">{{$t('settings.about.about')}}</b-nav-item>
                  <b-nav-item v-if="eventLog" to="/captioner/settings/event-log">
                    {{$t('settings.eventLog.eventLog')}} <span v-if="eventLogStopTime">({{logTimeRemainingMinutes}}:{{logTimeRemainingSeconds}})</span>
                    <b-badge variant="light" class="nav-badge">
                      {{eventLogCount}} <span class="sr-only">events</span> 
                    </b-badge>
                  </b-nav-item>
                  <b-nav-item class="nav-item-rainbow" v-if="experiments.length || currentlyOnExperiments" to="/captioner/settings/experiments"><fa icon="flask" /> {{$t('settings.experiments.experiments')}}</b-nav-item>
                </b-nav>
                <hr/>
                <b-nav vertical pills>
                  <b-nav-item to="/captioner/settings/appearance">{{$t('settings.appearance.appearance')}}</b-nav-item>
                  <b-nav-item to="/captioner/settings/censor">{{$t('settings.censor.censor')}}</b-nav-item>
                  <b-nav-item to="/captioner/settings/controls">{{$t('settings.controls.controls')}}</b-nav-item>
                  <b-nav-item to="/captioner/settings/language">{{$t('settings.language.language')}}</b-nav-item>
                  <b-nav-item v-if="experiments.includes('remoteDisplays')" to="/captioner/settings/remote-displays">{{$t('settings.remoteDisplays.remoteDisplays')}}</b-nav-item>
                  <b-nav-item to="/captioner/settings/word-replacements">{{$t('settings.wordReplacements.wordReplacements')}}</b-nav-item>
                  <!-- <b-nav-item to="/captioner/settings/title-cards">Title Cards</b-nav-item> -->
                </b-nav>
                <hr/>
                <b-nav vertical pills>
                  <b-nav-item to="/captioner/settings/vmix">{{$t('settings.vmix.vmix')}}</b-nav-item>
                  <b-nav-item v-if="experiments.includes('webhooks')" to="/captioner/settings/webhooks">{{$t('settings.webhooks.webhooks')}}</b-nav-item>
                </b-nav>
                <hr/>
                <b-nav vertical pills>
                  <b-nav-item class="small" to="/captioner/settings/export-restore">{{$t('settings.exportRestore.exportRestoreSettings')}}</b-nav-item>
                </b-nav>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-8 pt-sm-5 pb-sm-5 pl-md-4 pl-xl-5 bg-light" :class="{'d-none d-sm-flex': !showBackButton}">
        <div class="row pb-5 pt-4 pt-sm-0"> <!-- pb-5 here adds bottom padding to clear the fixed navbar. pt-4 is extra for top navbar on xs. -->
          <div class="col-lg-10 col-xl-9 mr-auto">
            <h2 class="d-none" :class="{'d-sm-block': showBackButton}">{{navbarTitle}}</h2>
            <!-- <transition name="fade" mode="out-in"> -->
              <nuxt-child/>
            <!-- </transition> -->
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

  .nav-item-rainbow .nav-link.active {
    animation: rainbow 5s linear infinite alternate;
    text-shadow:0 1px 5px rgba(0,0,0,.3);
  }

  @keyframes rainbow {
    0% {
      background-color: hsl(0, 50%, 50%);
      box-shadow: 0 0 10px hsl(0, 50%, 50%);
    }
    20% {
      background-color: hsl(50, 70%, 50%);
      box-shadow: 0 0 10px hsl(50, 70%, 50%);
    }
    40% {
      background-color: hsl(100, 50%, 50%);
      box-shadow: 0 0 10px hsl(100, 50%, 50%);
    }
    60% {
      background-color: hsl(150, 50%, 50%);
      box-shadow: 0 0 10px hsl(150, 50%, 50%);
    }
    80% {
      background-color: hsl(200, 50%, 50%);
      box-shadow: 0 0 10px hsl(200, 50%, 50%);
    }
    100% {
      background-color: hsl(255, 50%, 50%);
      box-shadow: 0 0 10px hsl(255, 50%, 50%);
    }
  }
</style>


<script>
import Combokeys from 'combokeys'
import appHeightAdjuster from '~/mixins/appHeightAdjuster'

export default {
  name: 'settings-view',
  mixins: [
    appHeightAdjuster,
  ],
  data: function() {
    return {
      logTimeRemainingMinutes: '00',
      logTimeRemainingSeconds: '00',
      escShortcut: null,
      height: '100vh',
      tickInterval: null,
    };
  },
  mounted: function() {
    let self = this;
    this.escShortcut = new Combokeys(document.documentElement);
    this.escShortcut.bind('esc', function() {
      self.$router.push('/captioner');
    });

    this.$watch('largerLayout', function() {
      this.height = this.adjustAppHeight();
    });

    this.startLogTimer();
  },
  beforeDestroy: function() {
    if (this.escShortcut) {
      this.escShortcut.detach();
    }

    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
  },
  watch: {
    eventLogStopTime: function() {
      this.startLogTimer();
    },
    $route (to, from) {
      // Scroll to top of settings page
      if (this.$refs.settingsView) {
        this.$refs.settingsView.scrollTop = 0;
      }
    },
  },
  methods: {
    startLogTimer: function() {
      if (this.eventLogStopTime) {
        let logTick = () => {
          let now = Date.now();
          if (now < this.eventLogStopTime) {
            let minutesDecimal = (this.eventLogStopTime - Date.now()) / 1000 / 60;
            this.logTimeRemainingMinutes = (Math.floor(minutesDecimal) + '').padStart(2,'0');
            this.logTimeRemainingSeconds = (Math.floor((minutesDecimal - this.logTimeRemainingMinutes) * 60) + '').padStart(2,'0');
          }
          else {
            if (this.tickInterval) {
              clearInterval(this.tickInterval);
            }

            this.logTimeRemainingMinutes = this.logTimeRemainingSeconds = '00';
          }
        }

        if (this.tickInterval) {
          clearInterval(this.tickInterval);
        }
        
        logTick();
        this.tickInterval = setInterval(logTick,100);
      }
    },
  },
  computed: {
    eventLog: function() {
      return Boolean(this.$store.state.eventLog.onUntilStopTime) || this.$store.state.eventLog.log.length > 0;
    },
    eventLogCount: function() {
      return this.$store.state.eventLog.log.length;
    },
    eventLogStopTime: function() {
      return this.$store.state.eventLog.onUntilStopTime;
    },
    currentlyOnExperiments: function() {
      return this.$route.path === '/captioner/settings/experiments';
    },
    experiments: function() {
      return this.$store.state.settings.exp;
    },
    showBackButton: function() {
      return this.$route.path !== '/captioner/settings';
    },
    navbarTitle: function() {
      return this.$store.state.settingsPageTitle || '';
    },
    largerLayout: function() {
      return this.$store.state.settings.controls.layout.larger;
    },
  },
}
</script>




<style scoped>
  h3 {
    text-transform:uppercase;
    margin:1rem 0;
  }

  .nav-pills {
    font-size:0.92rem;
  }
</style>