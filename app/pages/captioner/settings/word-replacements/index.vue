<template>
  <div class="settings-word-replacements-view">
    <p>{{$t('settings.wordReplacements.description')}}</p>
    <div class="row">
      <div :class="shouldShowDeleteButtons ? 'col-5' : 'col-6'">
        <div class="mb-1 font-weight-bold">{{$t('settings.wordReplacements.wordOrPhraseToReplace')}}</div>
        <p class="small">{{$t('settings.wordReplacements.wordOrPhraseToReplaceDescription')}}</p>
      </div>
      <div :class="shouldShowDeleteButtons ? 'col-5' : 'col-6'">
        <div class="mb-1 font-weight-bold">{{$t('settings.wordReplacements.replaceWith')}}</div>
      </div>
    </div>
    <div ref="wordReplacements">
      <div class="row mb-2" v-for="(wordReplacement, index) in wordReplacements" v-bind:key="index">
        <div :class="shouldShowDeleteButtons ? 'col-5' : 'col-6'">
          <input type="text" v-model="wordReplacement.from" @keyup="updateWordReplacement(wordReplacement, index)" class="form-control" :placeholder="$t('settings.wordReplacements.wordOrPhraseToReplaceSentenceCase')" v-bind:ref="index == wordReplacements.length - 1 ? 'lastWordReplacement' : ''"  />
        </div>
        <div :class="shouldShowDeleteButtons ? 'col-5' : 'col-6'">
          <input type="text" v-model="wordReplacement.to" @keyup="updateWordReplacement(wordReplacement, index)" class="form-control"  :placeholder="$t('settings.wordReplacements.replaceWithSentenceCase')" />
        </div>
        <div class="col-1" v-if="shouldShowDeleteButtons">
          <button type="button" @click="removeWordReplacement(index)" class="btn btn-danger btn-sm" data-toggle="tooltip" data-animation="false" data-placement="top" :title="$t('common.remove')"><fa icon="minus-circle" /></button>
        </div>
      </div>
    </div>
    <button type="button" @click="addWordReplacement({from:'',to:''})" class="btn btn-success btn-sm mt-3"><fa icon="plus-circle"/> {{$t('settings.wordReplacements.addAnother')}}</button>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  name: 'settings-word-replacements-view',
  transition: 'fade',
  scrollToTop: true,
  middleware: [
    'settings-meta',
  ],
  meta: {
    settingsPageTitleKey: 'settings.wordReplacements.wordReplacements',
  },
  mounted: function () {
    let self = this;
    setTimeout(() => {
      if (!self.wordReplacements.length) {
        self.addWordReplacement({from:'', to: ''});
      }
    },200); // hack
  },
  beforeDestroy: function() {
    this.removeEmptyReplacements();
  },
  computed: {
    wordReplacements: {
      get () {
        return this.$store.state.settings.wordReplacements;
      },
    },
    shouldShowDeleteButtons: function() {
      return this.wordReplacements.length > 1;
    },
  },
  methods: {
    addWordReplacement: function (wordReplacement) {
      this.$store.commit('ADD_WORD_REPLACEMENT', { wordReplacement });
      this.restartCaptioning();

      setTimeout(() => {
        if (this.$refs.lastWordReplacement && this.$refs.lastWordReplacement.length) {
          this.$refs.lastWordReplacement[0].focus();
        }
      }, 0);
    },
    removeWordReplacement: function (index) {
      this.$store.commit('REMOVE_WORD_REPLACEMENT', { index });
      this.restartCaptioning();
    },
    updateWordReplacement: debounce(function (wordReplacement, index) {
      this.$store.commit('UPDATE_WORD_REPLACEMENT', { wordReplacement, index });
      this.restartCaptioning();
    }, 200),
    removeEmptyReplacements: function() {
      this.wordReplacements.forEach((replacement, index) => {
        if (replacement.from === '') {
          this.removeWordReplacement(index);
        }
      });
    },
    restartCaptioning: debounce(function () {
      if (this.$store.state.captioner.on) {
        this.$store.dispatch('captioner/loadWordReplacements');
      }
    }, 1500),
  },
}
</script>
