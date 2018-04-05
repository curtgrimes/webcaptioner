<template>
  <div class="settings-view h-100 bg-primary">
    <router-link to="/captioner" class="btn btn-primary position-absolute py-md-4 px-4 px-md-5" style="right:0;top:0" role="tab" active-class=""><i class="fa fa-times fa-2x" aria-label="Close"></i></router-link>
    <div class="container pb-5 h-100">
      <div class="row h-100">
        <div class="col-md-3 pt-5" style="border-right:1px solid rgba(0,0,0,.1)">
          <h2 class="lead pl-3 text-dark" style="padding-top:.6rem">Settings</h2>
          <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <router-link to="about" class="nav-link" role="tab" active-class="active">About</router-link>
            <router-link to="appearance" class="nav-link" role="tab" active-class="active">Appearance</router-link>
            <router-link to="word-replacements" class="nav-link" role="tab" active-class="active">Word Replacements</router-link>
            <router-link to="censor" class="nav-link" role="tab" active-class="active">Censor</router-link>
            <router-link to="language" class="nav-link" role="tab" active-class="active">Language</router-link>
            <router-link to="vmix" class="nav-link" role="tab" active-class="active">vMix</router-link>
          </div>
        </div>
        <div class="col-md-9 mb-2 py-5" style="overflow-y:auto">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'settings-view',
}
</script>

<style>
  h3 {
    text-transform:uppercase;
    font-size:1.3rem;
    margin:1rem 0;
  }
</style>