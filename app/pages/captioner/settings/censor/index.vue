<template>
  <div class="settings-about-view">
    <div class="custom-control custom-checkbox mb-2">
      <input v-model="censor" class="custom-control-input" name="word-replacements-censor-profanity" type="checkbox" id="word-replacements-censor-profanity">
      <label class="custom-control-label" for="word-replacements-censor-profanity">{{$t('settings.censor.censorProfaneLanguage')}} {{$t('settings.censor.usEnglishOnly')}}</label>
    </div>

    <i18n path="settings.censor.censorProfaneLanguageDescription.text" tag="p" class="small">
      <a place="seeThisList" href="https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words" target="_blank">{{$t('settings.censor.censorProfaneLanguageDescription.seeThisList')}}</a>
      <router-link place="useWordReplacements" to="word-replacements">{{$t('settings.censor.censorProfaneLanguageDescription.useWordReplacements')}}</router-link>
    </i18n>
    <label class="col-form-label">{{$t('settings.censor.replaceCensoredWordsWith')}}</label>
    <div class="custom-control custom-radio">
      <input type="radio" id="customRadio1" v-model="censorReplaceWith" value="nothing" name="censorReplaceWith" class="custom-control-input">
      <label class="custom-control-label" for="customRadio1">{{$t('settings.censor.nothing')}}</label>
    </div>
    <div class="custom-control custom-radio">
      <input type="radio" id="customRadio2" v-model="censorReplaceWith" value="asterisks" name="censorReplaceWith" class="custom-control-input">
      <label class="custom-control-label" for="customRadio2">{{$t('settings.censor.asterisks')}} (*****)</label>
    </div>

    <p class="mt-4"></p>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'settings-censor-view',
  transition: 'fade',
  middleware: [
    'settings-meta',
  ],
  meta: {
    settingsPageTitleKey: 'settings.censor.censor',
  },
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
