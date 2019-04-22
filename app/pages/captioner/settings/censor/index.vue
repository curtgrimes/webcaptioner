<template>
  <div>
    <div class="custom-control custom-checkbox mb-2">
      <input
        v-model="censor"
        class="custom-control-input"
        name="word-replacements-censor-profanity"
        type="checkbox"
        id="word-replacements-censor-profanity"
      >
      <label
        class="custom-control-label"
        for="word-replacements-censor-profanity"
      >{{$t('settings.censor.censorProfaneLanguage')}}</label>
    </div>
    <div v-if="censor" class="card card-body">
      <p>
        {{$t('settings.censor.usEnglishOnly')}}
        <i18n path="settings.censor.censorProfaneLanguageDescription.text" tag="span">
          <a
            place="seeThisList"
            href="https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words"
            target="_blank"
          >{{$t('settings.censor.censorProfaneLanguageDescription.seeThisList')}}</a>
          <router-link
            place="useWordReplacements"
            to="word-replacements"
          >{{$t('settings.censor.censorProfaneLanguageDescription.useWordReplacements')}}</router-link>
        </i18n>
      </p>
      <label class="col-form-label pt-0">{{$t('settings.censor.replaceCensoredWordsWith')}}</label>
      <div class="custom-control custom-radio">
        <input
          type="radio"
          id="customRadio1"
          v-model="censorReplaceWith"
          value="nothing"
          name="censorReplaceWith"
          class="custom-control-input"
        >
        <label class="custom-control-label" for="customRadio1">{{$t('settings.censor.nothing')}}</label>
      </div>
      <div class="custom-control custom-radio">
        <input
          type="radio"
          id="customRadio2"
          v-model="censorReplaceWith"
          value="asterisks"
          name="censorReplaceWith"
          class="custom-control-input"
        >
        <label
          class="custom-control-label"
          for="customRadio2"
        >{{$t('settings.censor.asterisks')}} (*****)</label>
      </div>
    </div>
    <div v-else class="card card-body">
      <p>Censorship is off. However, the speech-to-text service that Web Captioner runs on currently does not give an option to completely disable censorship. Web Captioner applies a heuristic to uncensor words that are returned from this service that still appear to be censored.</p>
      <p class="mb-0">
        If you are running into issues with words being censored even when censorship is off,
        <a href="https://feedback.webcaptioner.com/">leave feedback</a> or
        <a href="https://m.me/webcaptioner">contact Web Captioner</a>.
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  middleware: ['settings-meta'],
  meta: {
    settingsPageTitleKey: 'settings.censor.censor',
  },
  watch: {
    censor: function() {
      if (this.$store.state.captioner.on) {
        this.$store.dispatch('captioner/loadWordReplacements');
      }
    },
  },
  computed: {
    censor: {
      get() {
        return this.$store.state.settings.censor.on;
      },
      set(censor) {
        this.$store.commit('SET_CENSOR', { censor });
      },
    },
    censorReplaceWith: {
      get() {
        return this.$store.state.settings.censor.replaceWith;
      },
      set(replaceWith) {
        this.$store.commit('SET_CENSOR_REPLACE_WITH', { replaceWith });
      },
    },
  },
};
</script>
