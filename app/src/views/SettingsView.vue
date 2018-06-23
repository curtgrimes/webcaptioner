<template>
  <div class="settings-view" :style="{height}" style="overflow:auto">
    <router-link to="/captioner" class="btn btn-light d-none d-sm-block position-fixed py-md-3 px-3 px-md-4" style="z-index:2;right:0;top:0" role="tab" active-class=""><fa icon="times" size="2x" /></router-link>
    <!-- xs navbar -->
    <nav class="d-sm-none navbar sticky-top navbar-light bg-primary pr-2" :class="{'pl-2': showBackButton}">
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
          <b-list-group-item to="/captioner/settings/about">About</b-list-group-item>
        </b-list-group>
        <h3 class="text-muted pl-3 pt-2 small">General</h3>
        <b-list-group flush>
          <b-list-group-item to="/captioner/settings/appearance">Appearance</b-list-group-item>
          <b-list-group-item to="/captioner/settings/censor">Censor</b-list-group-item>
          <b-list-group-item to="/captioner/settings/controls">Controls</b-list-group-item>
          <b-list-group-item v-show="experiments['experiments']" to="/captioner/settings/experiments">Experiments</b-list-group-item>
          <b-list-group-item to="/captioner/settings/language">Language</b-list-group-item>
          <b-list-group-item v-show="experiments['remoteDisplays']" to="/captioner/settings/remote-displays">Remote Displays</b-list-group-item>
          <b-list-group-item to="/captioner/settings/word-replacements">Word Replacements</b-list-group-item>
          <!-- <b-list-group-item to="/captioner/settings/title-cards">Title Cards</b-list-group-item> -->
        </b-list-group>
        <h3 class="text-muted pl-3 pt-2 small">Integrations</h3>
        <b-list-group flush>
          <b-list-group-item to="/captioner/settings/vmix">vMix</b-list-group-item>
        </b-list-group>
      </div>

      <!-- non-xs navigation -->
      <div class="d-none d-sm-block col-sm-4 py-5 pr-md-4 pr-xl-5 bg-primary" style="min-height:100%">
        <div class="row h-100">
          <div class="col-lg-9 col-xl-7 ml-auto mb-5">
            <div class="position-sticky" style="top:20px">
              <h2 class="d-none d-sm-block lead pl-3 text-dark" style="padding-top:.6rem">Settings</h2>
              <nav>
                <b-nav vertical pills>
                  <b-nav-item to="/captioner/settings/about">About</b-nav-item>
                  <b-nav-item class="nav-item-rainbow" v-if="experiments.includes('science')" to="/captioner/settings/experiments"><fa icon="flask" /> Experiments</b-nav-item>
                </b-nav>
                <hr/>
                <b-nav vertical pills>
                  <b-nav-item to="/captioner/settings/appearance">Appearance</b-nav-item>
                  <b-nav-item to="/captioner/settings/censor">Censor</b-nav-item>
                  <b-nav-item to="/captioner/settings/controls">Controls</b-nav-item>
                  <b-nav-item to="/captioner/settings/language">Language</b-nav-item>
                  <b-nav-item v-if="experiments.includes('remoteDisplays')" to="/captioner/settings/remote-displays">Remote Displays</b-nav-item>
                  <b-nav-item to="/captioner/settings/word-replacements">Word Replacements</b-nav-item>
                  <!-- <b-nav-item to="/captioner/settings/title-cards">Title Cards</b-nav-item> -->
                </b-nav>
                <hr/>
                <b-nav vertical pills>
                  <b-nav-item to="/captioner/settings/vmix">vMix</b-nav-item>
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
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .nav-item-rainbow .nav-link.active {
    animation: rainbow 10s infinite alternate;
  }
  @keyframes rainbow {
    0% {background-color: hsl(0, 50%, 50%);}
    20% {background-color: hsl(50, 50%, 50%);}
    40% {background-color: hsl(100, 50%, 50%);}
    60% {background-color: hsl(150, 50%, 50%);}
    80% {background-color: hsl(200, 50%, 50%);}
    100% {background-color: hsl(255, 50%, 50%);}
  }
</style>


<script>
import Combokeys from 'combokeys'
import appHeightAdjuster from '../util/appHeightAdjuster'

export default {
  name: 'settings-view',
  data: function() {
    return {
      escShortcut: null,
      height: '100vh',
    };
  },
  mounted: function() {
    let self = this;
    this.escShortcut = new Combokeys(document.documentElement);
    this.escShortcut.bind('esc', function() {
      self.$router.push('/captioner');
    });

    this.$nextTick(function () {
      let self = this;

      setTimeout(function() {
        // Hacky way to make sure settings view is correct
        // height after load where it is immediately active
        self.height = appHeightAdjuster();
      },1000);
    });
    

    this.$watch('largerLayout', function() {
      this.height = appHeightAdjuster();
    });
  },
  beforeDestroy: function() {
    this.escShortcut.detach();
  },
  computed: {
    experiments: function() {
      return this.$store.state.settings.exp;
    },
    showBackButton: function() {
      return this.$route.path !== '/captioner/settings';
    },
    navbarTitle: function() {
      return this.$route.meta ? this.$route.meta.navbarTitle : '';
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
    font-size:1.3rem;
    margin:1rem 0;
  }

  .nav-pills {
    font-size:0.92rem;
  }
</style>