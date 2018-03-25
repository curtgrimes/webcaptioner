<template>
  <div class="settings-view h-100 bg-primary">
    <div class="container py-5 h-100">
      <div class="row">
        <div class="col-6">
          <h2 class="mr-auto">Settings</h2>
        </div>
        <div class="col-6 text-right">
          <router-link to="/captioner" class="btn btn-primary" role="tab" active-class="">Close</router-link>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3">
          <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <router-link to="appearance" class="nav-link" role="tab" active-class="active">Appearance</router-link>
            <router-link to="word-replacements" class="nav-link" role="tab" active-class="active">Word Replacements</router-link>
            <router-link to="language" class="nav-link" role="tab" active-class="active">Language</router-link>
            <router-link to="vmix" class="nav-link" role="tab" active-class="active">vMix</router-link>
          </div>
        </div>
        <div class="col-md-9">
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
