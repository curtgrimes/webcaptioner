<template>
  <div class="settings-appearance-view">
    <h3 class="mt-0 mt-sm-3">Text</h3>
    <div class="form-group row">
      <label for="text-color" class="col-sm-6 col-form-label">Font Family</label>
      <div class="col-sm-6">
        <b-dropdown class="d-block w-100" toggle-class="w-100">
          <template slot="button-content">
            <span :style="{fontFamily: fontFamilyDisplayName}">
              {{fontFamilyDisplayName}}
            </span>
          </template>
          <b-dropdown-item
            v-for="fontChoice in getFontChoices()"
            :key="fontChoice.googleFontNameKey"
            :style="{fontFamily: fontChoice.googleFontNameKey }"
            @click="fontFamily = fontChoice.googleFontNameKey"
          >{{fontChoice.displayName}}</b-dropdown-item>
        </b-dropdown>
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

    <div class="form-group row">
      <label for="capitalization-uppercase" class="col-sm-6 col-form-label pt-0">Capitalization</label>
      <div class="col-sm-6">
        <div class="custom-control custom-radio mt-1">
          <input v-model="textTransform" class="custom-control-input" type="radio" name="capitalization" id="capitalization-uppercase" value="uppercase">
          <label class="custom-control-label" for="capitalization-uppercase">UPPERCASE</label>
        </div>
        <div class="custom-control custom-radio">
          <input v-model="textTransform" class="custom-control-input" type="radio" name="capitalization" id="capitalization-first-letter-only" value="capitalize">
          <label class="custom-control-label" for="capitalization-first-letter-only">First Letter Of Each Word</label>
        </div>
        <div class="custom-control custom-radio">
          <input v-model="textTransform" class="custom-control-input" type="radio" name="capitalization" id="capitalization-initial" value="initial">
          <label class="custom-control-label" for="capitalization-initial">
            Proper nouns and the start of sentences<br/>
            <p class="small mb-0">Separate sentences are detected only when a puncuation mark like &#34;period&#34; or &#34;question mark&#34; is literally said.</p>
          </label>
        </div>
      </div>
    </div>


    <div class="row">
      <div class="col-6">
        <label class="col-form-label">Alignment</label>
        <div class="card bg-dark sticky-top" style="top:120px">
          <div class="card-header bg-dark text-white small px-2 py-1">
            Preview
          </div>
          <div class="text-preview-mockup-wrap main-preview w-100 d-flex" v-bind:style="{backgroundColor: backgroundColor, padding: (alignmentPadding/2)+'em'}" v-bind:class="previewWrapTextPositionClass">
            <div class="text-preview-mockup p-1 d-flex" style="cursor:default" v-bind:style="{color: textColor}" v-bind:class="previewTextPositionClass">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce est ligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fus Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligdiam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauriula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fus Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congue placerat.</div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <label for="horizontal-alignment-full" class="col-form-label">Horizontal Alignment</label>
        <div class="btn-group btn-group-toggle d-flex flex-wrap">
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentHorizontal == 'full' }">
            <input v-model="alignmentHorizontal" type="radio" name="horizontal-alignment" id="horizontal-alignment-full" value="full" autocomplete="off" checked> Full
            <div class="text-preview-mockup-wrap w-100 mt-2" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup w-100 p-1" v-bind:style="{color: textColor}">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce est ligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congue placerat.</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentHorizontal == 'left' }">
            <input v-model="alignmentHorizontal" type="radio" name="horizontal-alignment" id="horizontal-alignment-left" value="left" autocomplete="off"> Left
            <div class="text-preview-mockup-wrap w-100 mt-2" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup w-50 p-1" v-bind:style="{color: textColor}">Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentHorizontal == 'middle' }">
            <input v-model="alignmentHorizontal" type="radio" name="horizontal-alignment" id="horizontal-alignment-middle" value="middle" autocomplete="off"> Middle
            <div class="text-preview-mockup-wrap w-100 mt-2" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup w-50 mx-auto p-1" v-bind:style="{color: textColor}">Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et.</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentHorizontal == 'right' }">
            <input v-model="alignmentHorizontal" type="radio" name="horizontal-alignment" id="horizontal-alignment-right" value="right" autocomplete="off"> Right
            <div class="text-preview-mockup-wrap w-100 mt-2" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup w-50 ml-auto p-1" v-bind:style="{color: textColor}">Ut enim ad minima veniam, quis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi veniam, quis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi veniam, quis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</div>
            </div>
          </label>
        </div>
        <label for="vertical-alignment-full" class="mt-3 mb-0 col-form-label">Vertical Alignment</label>
        <div class="btn-group btn-group-toggle d-flex flex-wrap">
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentVertical == 'full' }">
            <input v-model="alignmentVertical" type="radio" name="vertical-alignment" id="vertical-alignment-full" value="full" autocomplete="off"> Full
            <div class="text-preview-mockup-wrap w-100 mt-2" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup w-100 p-1" v-bind:style="{color: textColor}">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce est ligula, tristique at lectus aliquet, pellentesque veniam, quis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi veniam, quis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congue placerat.</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentVertical == 'top' }">
            <input v-model="alignmentVertical" type="radio" name="vertical-alignment" id="vertical-alignment-top" value="top" autocomplete="off"> Top
            <div class="text-preview-mockup-wrap w-100 mt-2" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup h-50 p-1" style="overflow:hidden" v-bind:style="{color: textColor}">Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequaturiure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentVertical == 'middle' }">
            <input v-model="alignmentVertical" type="radio" name="vertical-alignment" id="horizontal-alignment-middle" value="middle" autocomplete="off"> Middle
            <div class="text-preview-mockup-wrap w-100 mt-2 d-flex align-items-center" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup h-50 my-auto p-1" v-bind:style="{color: textColor}">Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et.</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentVertical == 'bottom' }">
            <input v-model="alignmentVertical" type="radio" name="vertical-alignment" id="vertical-alignment-bottom" value="bottom" autocomplete="off"> Bottom
            <div class="text-preview-mockup-wrap w-100 mt-2 d-flex align-items-end" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup h-50 mt-auto p-1" v-bind:style="{color: textColor}">Ut enim ad minima veniam, qeligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimusuis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentVertical == 'lowerThird' }">
            <input v-model="alignmentVertical" type="radio" name="vertical-alignment" id="vertical-alignment-lower-third" value="lowerThird" autocomplete="off"> Lower<br class="d-lg-none"/> Third
            <div class="text-preview-mockup-wrap w-100 mt-2 d-flex align-items-end" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup h-25 ml-auto p-1" v-bind:style="{color: textColor}">Ut enim ad minima veniam, quis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</div>
            </div>
          </label>
        </div>


        <div class="form-group row mt-2">
          <label for="alignment-padding" class="col-12 col-form-label">Padding</label>
          <div class="col-12">
            <div class="input-group">
              <input class="form-control" name="alignment-padding" type="number" min="0" step="0.25" max="10" v-model="alignmentPadding">
              <span class="input-group-append">
                  <span class="input-group-text">em</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <hr class="my-4" />

    <h3>Background</h3>
    <div class="form-group row">
      <label for="background-color" class="col-sm-6 col-form-label">Background Color</label>
      <div class="col-sm-6">
        <input class="form-control" name="background-color" type="color" v-model="backgroundColor">
        <p class="small mb-0 mt-1">RGB ({{backgroundColorRGBValues.r}}, {{backgroundColorRGBValues.g}}, {{backgroundColorRGBValues.b}})</p>
      </div>
    </div>

    <hr class="my-4" />

    <h3>Text Shadow</h3>

    <div class="form-group row">
      <label for="text-shadow-color" class="col-sm-6 col-form-label">Shadow Color</label>
      <div class="col-sm-6">
        <input v-model="shadowColor" class="form-control" name="text-shadow-color" type="color" />
      </div>
    </div>
    <div class="form-group row">
      <label for="text-shadow-opacity" class="col-sm-6 col-form-label">Opacity</label>
      <div class="col-sm-6">
        <div class="input-group">
          <input v-model="shadowOpacity" class="form-control" name="text-shadow-opacity" type="number" min="0" max="100" step="5">
          <span class="input-group-append">
              <span class="input-group-text">%</span>
          </span>
        </div>
      </div>
    </div>
    <div class="form-group row">
      <label for="text-shadow-blur" class="col-sm-6 col-form-label">Blur</label>
      <div class="col-sm-6">
        <div class="input-group">
          <input v-model="shadowBlurRadius" class="form-control" name="text-shadow-blur" type="number" min="0" step="1">
          <span class="input-group-append">
              <span class="input-group-text">px</span>
          </span>
        </div>
      </div>
    </div>
    <div class="form-group row">
      <label for="text-shadow-x-position" class="col-sm-6 col-form-label">X Position</label>
      <div class="col-sm-6">
        <div class="input-group">
          <input v-model="shadowOffsetX" class="form-control" name="text-shadow-x-position" type="number" step="0.05">
          <span class="input-group-append">
              <span class="input-group-text">em</span>
          </span>
        </div>
      </div>
    </div>
    <div class="form-group row">
      <label for="text-shadow-y-position" class="col-sm-6 col-form-label">Y Position</label>
      <div class="col-sm-6">
        <div class="input-group">
          <input v-model="shadowOffsetY" class="form-control" name="text-shadow-y-position" type="number" step="0.05">
          <span class="input-group-append">
              <span class="input-group-text">em</span>
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import fontChoices from '../../util/fontChoices.js'
import hexToRgb from '../../util/hexToRGB'

// Add fonts dynamically
if (typeof window !== 'undefined') {
  var headID = document.getElementsByTagName('head')[0];

  // Add Google fonts
  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  headID.appendChild(link);

  let fontChoicesString = fontChoices.map(function (choice) { return choice.googleFontNameKey.replace(/ /g, '+'); }).join('|');;

  link.href = 'https://fonts.googleapis.com/css?family=' + fontChoicesString;
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
        return this.$store.state.settings.appearance.text.textColor;
      },
      set: debounce(function(textColor) {
        // If the interim text color is currently the same, keep it matching.
        if (this.$store.state.settings.appearance.text.textColor === this.$store.state.settings.appearance.text.textColorInterim) {
          this.$store.commit('SET_TEXT_COLOR_INTERIM', {textColorInterim: textColor})
        }

        if (this.$store.state.settings.appearance.text.textColor != textColor) {
          this.$store.commit('SET_TEXT_COLOR', {textColor})
        }
      }, 500, {leading: true})
    },
    textColorInterim: {
      get () {
        return this.$store.state.settings.appearance.text.textColorInterim;
      },
      set: debounce(function(textColorInterim) {
        if (this.$store.state.settings.appearance.text.textColorInterim != textColorInterim) {
          this.$store.commit('SET_TEXT_COLOR_INTERIM', {textColorInterim})
        }
      }, 500, {leading: true})
    },
    fontFamily: { // get/set the key from the store
      get () {
        return this.$store.state.settings.appearance.text.fontFamily;
      },
      set (fontFamily) {
        this.$store.commit('SET_FONT_FAMILY', {fontFamily});
      },
    },
    fontFamilyDisplayName: { // get the displayName according to the store key
      get () {
        return fontChoices.find((choice) => {
          return choice.googleFontNameKey === this.$store.state.settings.appearance.text.fontFamily
        }).displayName;
      },
    },
    textSize: {
      get () {
        return this.$store.state.settings.appearance.text.textSize;
      },
      set (textSize) {
        this.$store.commit('SET_TEXT_SIZE', {textSize});
      },
    },
    lineHeight: {
      get () {
        return this.$store.state.settings.appearance.text.lineHeight;
      },
      set (lineHeight) {
        this.$store.commit('SET_LINE_HEIGHT', {lineHeight});
      },
    },
    letterSpacing: {
      get () {
        return this.$store.state.settings.appearance.text.letterSpacing;
      },
      set (letterSpacing) {
        this.$store.commit('SET_LETTER_SPACING', {letterSpacing});
      },
    },
    textTransform: {
      get () {
        return this.$store.state.settings.appearance.text.textTransform;
      },
      set (textTransform) {
        this.$store.commit('SET_TEXT_TRANSFORM', {textTransform});
      },
    },
    shadowColor: {
      get () {
        return this.$store.state.settings.appearance.shadow.color;
      },
      set: debounce(function(shadowColor) {
        if (this.$store.state.settings.appearance.shadow.color != shadowColor) {
          this.$store.commit('SET_SHADOW_COLOR', {shadowColor});
        }
      }, 500, {leading: true}),
    },
    shadowOpacity: {
      get () {
        return this.$store.state.settings.appearance.shadow.opacity;
      },
      set (shadowOpacity) {
        this.$store.commit('SET_SHADOW_OPACITY', {shadowOpacity});
      },
    },
    shadowBlurRadius: {
      get () {
        return this.$store.state.settings.appearance.shadow.blurRadius;
      },
      set (shadowBlurRadius) {
        this.$store.commit('SET_SHADOW_BLUR_RADIUS', {shadowBlurRadius});
      },
    },
    shadowOffsetX: {
      get () {
        return this.$store.state.settings.appearance.shadow.offsetX;
      },
      set (shadowOffsetX) {
        this.$store.commit('SET_SHADOW_OFFSET_X', {shadowOffsetX});
      },
    },
    shadowOffsetY: {
      get () {
        return this.$store.state.settings.appearance.shadow.offsetY;
      },
      set (shadowOffsetY) {
        this.$store.commit('SET_SHADOW_OFFSET_Y', {shadowOffsetY});
      },
    },
    backgroundColor: {
      get () {
        return this.$store.state.settings.appearance.background.color;
      },
      set: debounce(function(backgroundColor) {
        if (this.$store.state.settings.appearance.background.color != backgroundColor) {
          this.$store.commit('SET_BACKGROUND_COLOR', {backgroundColor});
        }
      }, 200, {leading: true}),
    },
    backgroundColorRGBValues: function() {
      return hexToRgb(this.$store.state.settings.appearance.background.color);
    },
    alignmentHorizontal: {
      get () {
        return this.$store.state.settings.appearance.text.alignment.horizontal;
      },
      set (alignmentHorizontal) {
        this.$store.commit('SET_ALIGNMENT_HORIZONTAL', {alignmentHorizontal});
      },
    },
    alignmentVertical: {
      get () {
        return this.$store.state.settings.appearance.text.alignment.vertical;
      },
      set (alignmentVertical) {
        this.$store.commit('SET_ALIGNMENT_VERTICAL', {alignmentVertical});
      },
    },
    alignmentPadding: {
      get () {
        return this.$store.state.settings.appearance.text.alignment.padding;
      },
      set (alignmentPadding) {
        this.$store.commit('SET_ALIGNMENT_PADDING', {alignmentPadding});
      },
    },

    previewTextPositionClass: function () {
      return {
        /* Horizontal alignments */
        'w-100 mx-0': this.alignmentHorizontal == 'full',
        'w-50 mr-auto': this.alignmentHorizontal == 'left',
        'w-50 mx-auto': this.alignmentHorizontal == 'middle',
        'w-50 ml-auto': this.alignmentHorizontal == 'right',

        /* Vertical alignments */
        'h-100': this.alignmentVertical == 'full',
        'h-50': ['top','middle','bottom'].includes(this.alignmentVertical),
        'h-25': this.alignmentVertical == 'lowerThird',
      }
    },
    previewWrapTextPositionClass: function () {
      return {
        /* Vertical alignments */
        'align-items-start': ['full','top'].includes(this.alignmentVertical),
        'align-items-center': this.alignmentVertical == 'middle',
        'align-items-end': ['bottom','lowerThird'].includes(this.alignmentVertical),
      }
    },
  }
}
</script>

<style>
  @font-face {
      font-family: "Redacted";
      src: url("/public/redacted-regular.ttf");
  }

  .text-preview-mockup-wrap {
    border:1px solid rgba(0,0,0,.2);
    height: 65px;
    overflow:hidden;
  }

  .text-preview-mockup-wrap.main-preview {
    height:200px;
  }

  .text-preview-mockup {
    font-family:'Redacted';
    white-space: normal;
    font-size: 5px;
    line-height:8px;
    overflow: hidden;
  }

  .text-preview-mockup-wrap.main-preview .text-preview-mockup {
    font-size:9px;
    line-height:14px;
  }
</style>