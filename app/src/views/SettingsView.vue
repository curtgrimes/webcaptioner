<template>
  <div class="settings-view bg-primary" style="min-height:100%">
    <router-link to="/captioner" class="btn btn-primary position-fixed py-md-3 px-3 px-md-4" style="z-index:2;right:0;top:0" role="tab" active-class=""><i class="fa fa-times fa-2x" aria-label="Close"></i></router-link>
    <div class="container pb-5 h-100">
      <div class="row h-100">
        <div class="col-md-3 pt-5" style="border-right:1px solid rgba(0,0,0,.1);min-height:100%">
          <div class="position-sticky" style="top:20px">
            <h2 class="lead pl-3 text-dark" style="padding-top:.6rem">Settings</h2>
            <nav>
              <b-nav vertical pills>
                <b-nav-item to="about">About</b-nav-item>
                <b-nav-item to="appearance">Appearance</b-nav-item>
                <b-nav-item to="word-replacements">Word Replacements</b-nav-item>
                <b-nav-item to="censor">Censor</b-nav-item>
                <b-nav-item to="Language">Language</b-nav-item>
              </b-nav>
              <hr/>
              <b-nav vertical pills>
                <b-nav-item to="vmix">vMix</b-nav-item>
              </b-nav>
              <hr/>
              <b-nav vertical pills>
                <b-nav-item to="keyboard-shortcuts">Keyboard Shortcuts</b-nav-item>
              </b-nav>
            </nav>
          </div>
        </div>
        <div class="col-md-9 mb-2 py-5">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Combokeys from 'combokeys'

export default {
  name: 'settings-view',
  data: function() {
    return {
      escShortcut: null,
    };
  },
  mounted: function() {
    let self = this;
    this.escShortcut = new Combokeys(document.documentElement);
    this.escShortcut.bind('esc', function() {
      self.$router.push('/captioner');
    });
  },
  beforeDestroy: function() {
    this.escShortcut.detach();
  },
}
</script>

<style>
  h3 {
    text-transform:uppercase;
    font-size:1.3rem;
    margin:1rem 0;
  }

  .settings-view .nav-pills {
    font-size:0.92rem;
  }
</style>