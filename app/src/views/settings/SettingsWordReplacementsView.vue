<template>
  <div class="settings-word-replacements-view">
    <p>Replace or hide specific words or phrases during captioning.</p>
    <div class="row">
      <div class="col-5">
        <div class="mb-1 font-weight-bold">Word or Phrase to Replace</div>
        <p class="small">Separate multiple words or phrases with commas. Not case sensitive.</p>
      </div>
      <div class="col-5">
        <div class="mb-1 font-weight-bold">Replace With</div>
      </div>
    </div>
    <div ref="wordReplacements">
      <div class="row mb-2" v-for="(wordReplacement, index) in wordReplacements" v-bind:key="index">
        <div class="col-5">
          <input type="text" v-model="wordReplacement.from" @keyup="updateWordReplacement(wordReplacement, index)" class="form-control" placeholder="Word or phrase to replace" v-bind:ref="index == wordReplacements.length - 1 ? 'lastWordReplacement' : ''"  />
        </div>
        <div class="col-5">
          <input type="text" v-model="wordReplacement.to" @keyup="updateWordReplacement(wordReplacement, index)" class="form-control" placeholder="Replace with" />
        </div>
        <div class="col-1">
          <button type="button" v-if="wordReplacements.length > 1" @click="removeWordReplacement(index)" class="btn btn-danger btn-sm" data-toggle="tooltip" data-animation="false" data-placement="top" title="Remove"><i class="fa fa-minus-circle" aria-hidden="true"></i></button>
        </div>
      </div>
    </div>
    <button type="button" @click="addWordReplacement({from:'',to:''})" class="btn btn-success btn-sm mt-3"><i class="fa fa-plus-circle" aria-hidden="true"></i> Add Another</button>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  name: 'settings-word-replacements-view',
  created: function () {
    if (!this.wordReplacements.length) {
      this.addWordReplacement({from:'', to: ''});
    }
  },
  computed: {
    wordReplacements: {
      get () {
        return this.$store.state.settings.wordReplacements;
      },
    },
  },

  methods: {
    addWordReplacement: function (wordReplacement) {
      this.$store.commit('ADD_WORD_REPLACEMENT', { wordReplacement });
      var self = this;
      setTimeout(function () {
        if (self.$refs.lastWordReplacement && self.$refs.lastWordReplacement.length) {
          self.$refs.lastWordReplacement[0].focus();
        }
      }, 0);
    },
    removeWordReplacement: function (index) {
      this.$store.commit('REMOVE_WORD_REPLACEMENT', { index });
    },
    updateWordReplacement: debounce(function (wordReplacement, index) {
      this.$store.commit('UPDATE_WORD_REPLACEMENT', { wordReplacement, index });
    }, 200),
  },
}
</script>
