<template>
  <div class="settings-appearance-view">
    <h2>Appearance</h2>
    <div class="form-group row">
      <label for="text-color" class="col-sm-6 col-form-label">Font Family</label>
      <div class="col-sm-6">
        <div class="dropdown typeface-select">
          <button class="btn btn-white btn-block dropdown-toggle" type="button" id="typefaceDropdownButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-bind:style="{fontFamily: fontFamily}">{{fontFamilyDisplayName}}</button>
          <div class="dropdown-menu">
              <a class="dropdown-item" href="javascript:void(0)" v-for="fontChoice in getFontChoices()" v-bind:key="fontChoice.googleFontNameKey" v-bind:style="{fontFamily: fontChoice.googleFontNameKey }" v-on:click="fontFamily = fontChoice.googleFontNameKey">{{fontChoice.displayName}}</a>
          </div>
        </div>
      </div>
    </div>


    
    <div class="form-group row">
      <label for="text-color" class="col-sm-6 col-form-label">Text Color</label>
      <div class="col-sm-6">
        <input v-model="textColor" class="form-control" type="color" />
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-6">
        <label for="textColorInterim" class="col-form-label">Interim Text Color</label>
      </div>
      <div class="col-sm-6">
        <input name="textColorInterim" v-model="textColorInterim" class="form-control mb-1" type="color" />
        <button class="btn btn-link btn-sm ml-auto d-block pr-0" v-if="textColorInterim !== textColor" @click="textColorInterim = textColor">Use regular text color</button>
      </div>
      <div class="col-12 mt-1">
        <p class="small mb-0">During captioning, words that have just been recognized may change slightly while Web Captioner determines the context of the current phrase. Those words will be this color.</p>
      </div>
    </div>

    <hr class="my-4" />

    <div class="form-group row">
      <label for="text-size" class="col-sm-6 col-form-label">Text Size</label>
      <div class="col-sm-6">
        <div class="input-group">
          <input v-model="textSize" class="form-control" name="text-size" type="number" id="text-size" min="0.1" step="0.1">
          <span class="input-group-append">
              <span class="input-group-text">em</span>
          </span>
        </div>
      </div>
    </div>

    <div class="form-group row">
      <label for="text-size" class="col-sm-6 col-form-label">Line Height</label>
      <div class="col-sm-6">
        <div class="input-group">
          <input v-model="lineHeight" class="form-control" name="text-size" type="number" id="text-size" min="0.1" step="0.1" max="10">
          <span class="input-group-append">
              <span class="input-group-text">em</span>
          </span>
        </div>
      </div>
    </div>

    <div class="form-group row">
      <label for="text-size" class="col-sm-6 col-form-label">Letter Spacing</label>
      <div class="col-sm-6">
        <div class="input-group">
          <input v-model="letterSpacing" class="form-control" name="text-size" type="number" id="text-size" min="-10" step="0.025" max="20">
          <span class="input-group-append">
              <span class="input-group-text">em</span>
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {debounce} from 'lodash/lodash.js'
import fontChoices from '../../util/fontChoices.js'

// Add fonts dynamically
if (typeof window !== 'undefined') {
  var headID = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';

  //link.href = 'http://fonts.googleapis.com/css?family=Oswald&effect=neon';
  headID.appendChild(link);

  let fontChoicesString = fontChoices.map((choice) => { return choice.googleFontNameKey.replace(/ /g, '+'); }).join('|');;

  link.href = 'http://fonts.googleapis.com/css?family=' + fontChoicesString;
}


export default {
  name: 'settings-appearance-view',
  methods: {
    getFontChoices: () => {
      return fontChoices;
    }
  },
  computed: {
    textColor: {
      get () {
        return this.$store.state.appearance.textColor;
      },
      set: debounce(function(textColor) {
        // If the interim text color is currently the same, keep it matching.
        if (this.$store.state.appearance.textColor === this.$store.state.appearance.textColorInterim) {
          this.$store.commit('SET_TEXT_COLOR_INTERIM', {textColorInterim: textColor})
        }

        if (this.$store.state.appearance.textColor != textColor) {
          this.$store.commit('SET_TEXT_COLOR', {textColor})
        }
      }, 500, {leading: true})
    },
    textColorInterim: {
      get () {
        return this.$store.state.appearance.textColorInterim;
      },
      set: debounce(function(textColorInterim) {
        if (this.$store.state.appearance.textColorInterim != textColorInterim) {
          this.$store.commit('SET_TEXT_COLOR_INTERIM', {textColorInterim})
        }
      }, 500, {leading: true})
    },
    fontFamily: { // get/set the key from the store
      get () {
        return this.$store.state.appearance.fontFamily;
      },
      set (fontFamily) {
        this.$store.commit('SET_FONT_FAMILY', {fontFamily});
      },
    },
    fontFamilyDisplayName: { // get the displayName according to the store key
      get () {
        return fontChoices.find((choice) => {
          return choice.googleFontNameKey === this.$store.state.appearance.fontFamily
        }).displayName;
      },
    },
    textSize: {
      get () {
        return this.$store.state.appearance.textSize;
      },
      set (fontFamily) {
        this.$store.commit('SET_TEXT_SIZE', {textSize});
      },
    },
    lineHeight: {
      get () {
        return this.$store.state.appearance.lineHeight;
      },
      set (fontFamily) {
        this.$store.commit('SET_LINE_HEIGHT', {lineHeight});
      },
    },
    letterSpacing: {
      get () {
        return this.$store.state.appearance.letterSpacing;
      },
      set (fontFamily) {
        this.$store.commit('SET_LETTER_SPACING', {letterSpacing});
      },
    },
  }
}
</script>
