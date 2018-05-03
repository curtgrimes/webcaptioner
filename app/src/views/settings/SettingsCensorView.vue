<template>
  <div class="settings-about-view">
    <div class="custom-control custom-checkbox mb-2">
      <input v-model="censor" class="custom-control-input" name="word-replacements-censor-profanity" type="checkbox" id="word-replacements-censor-profanity">
      <label class="custom-control-label" for="word-replacements-censor-profanity">Censor profane language (US English only).</label>
    </div>

    <p class="small">What's considered profane? <a href="https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words" target="_blank">See this list</a> (note: profanity ahead!) If you need to censor additional words not included in this list, use <router-link to="word-replacements">word replacements</router-link>.</p>

    <label class="col-form-label">Replace censored words with:</label>
    <div class="custom-control custom-radio">
      <input type="radio" id="customRadio1" v-model="censorReplaceWith" value="nothing" name="censorReplaceWith" class="custom-control-input">
      <label class="custom-control-label" for="customRadio1">Nothing &mdash; just omit them.</label>
    </div>
    <div class="custom-control custom-radio">
      <input type="radio" id="customRadio2" v-model="censorReplaceWith" value="asterisks" name="censorReplaceWith" class="custom-control-input">
      <label class="custom-control-label" for="customRadio2">Asterisks (*****)</label>
    </div>

    <p class="mt-4"></p>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'settings-censor-view',
  computed: {
    censor: {
      get () {
        return this.$store.state.settings.censor.on;
      },
      set (censor) {
        this.$store.commit('SET_CENSOR', {censor});
      },
    },
    censorReplaceWith: {
      get () {
        return this.$store.state.settings.censor.replaceWith;
      },
      set (replaceWith) {
        this.$store.commit('SET_CENSOR_REPLACE_WITH', {replaceWith});
      },
    },
  },
}
</script>
