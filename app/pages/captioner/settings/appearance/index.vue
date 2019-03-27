<template>
  <div class="settings-appearance-view">
    <h3 class="mt-0 mt-sm-3">{{$t('settings.appearance.text')}}</h3>
    <div class="form-group row">
      <label for="text-color" class="col-sm-6 col-form-label">{{$t('settings.appearance.fontFamily')}}</label>
      <div class="col-sm-6">
        <b-dropdown class="d-block w-100" toggle-class="w-100">
          <template slot="button-content">
            <span :style="{fontFamily: fontFamilyDisplayName, textTransform: 'none'}">
              {{fontFamilyDisplayName}}
            </span>
          </template>
          <b-dropdown-item
            v-for="fontChoice in getFontChoices()"
            :key="fontChoice.fontNameKey"
            :style="{fontFamily: fontChoice.fontNameKey }"
            @click="fontFamily = fontChoice.fontNameKey"
          >{{fontChoice.displayName}}</b-dropdown-item>
        </b-dropdown>
        <p class="mt-2 mb-0 small text-muted" v-if="fontFamily === 'OpenDyslexic'">Learn more about <a href="https://www.opendyslexic.org/" target="_blank">OpenDyslexic</a>.</p>
      </div>
    </div>

    <form-group-input :label="$t('settings.appearance.textColor')" v-model="textColor" type="color" />

    <form-group-input :label="$t('settings.appearance.textColorInterim')" v-model="textColorInterim" type="color" :hint="$t('settings.appearance.interimTextColorDescription')" />
    <div class="row">
      <div class="col-sm-6 offset-sm-6">
        <button class="btn btn-info btn-sm ml-auto d-block mb-4" v-if="textColorInterim !== textColor" @click="textColorInterim = textColor">{{$t('settings.appearance.useRegularTextColor')}}</button>
      </div>
    </div>

    <form-group-input :label="$t('settings.appearance.textSize')" v-model="textSize" type="number" min="0.1" step="0.1" append-input-text="em" />

    <form-group-input :label="$t('settings.appearance.lineHeight')" v-model="lineHeight" type="number" min="0.1" step="0.1" max="10" append-input-text="em" />

    <form-group-input :label="$t('settings.appearance.letterSpacing')" v-model="letterSpacing" type="number" min="-10" step="0.025" max="20" append-input-text="em" />

    <div class="form-group row">
      <label for="capitalization-uppercase" class="col-sm-6 col-form-label pt-0">{{$t('settings.appearance.capitalization')}}</label>
      <div class="col-sm-6">
        <div class="custom-control custom-radio mt-1">
          <input v-model="textTransform" class="custom-control-input" type="radio" name="capitalization" id="capitalization-uppercase" value="uppercase">
          <label class="custom-control-label" for="capitalization-uppercase">{{$t('settings.appearance.uppercase')}}</label>
        </div>
        <div class="custom-control custom-radio">
          <input v-model="textTransform" class="custom-control-input" type="radio" name="capitalization" id="capitalization-first-letter-only" value="capitalize">
          <label class="custom-control-label" for="capitalization-first-letter-only">{{$t('settings.appearance.firstLetterOfEachWord')}}</label>
        </div>
        <div class="custom-control custom-radio">
          <input v-model="textTransform" class="custom-control-input" type="radio" name="capitalization" id="capitalization-initial" value="initial">
          <label class="custom-control-label" for="capitalization-initial">
            {{$t('settings.appearance.properNouns')}}<br/>
            <p class="small mb-0">{{$t('settings.appearance.properNounsDescription')}}</p>
          </label>
        </div>
      </div>
    </div>


    <div class="row">
      <div class="col-6">
        <label class="col-form-label">{{$t('settings.appearance.alignment')}}</label>
        <div class="card bg-dark sticky-top" style="top:120px">
          <div class="card-header bg-dark text-white small px-2 py-1">
            {{$t('settings.appearance.preview')}}
          </div>
          <div class="text-preview-mockup-wrap main-preview w-100 d-flex" v-bind:style="{backgroundColor: backgroundColor, padding: (alignmentPadding/2)+'em'}" v-bind:class="previewWrapTextPositionClass">
            <div class="text-preview-mockup p-1 d-flex" style="cursor:default" v-bind:style="{color: textColor}" v-bind:class="previewTextPositionClass">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce est ligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fus Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligdiam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauriula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fus Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congue placerat.</div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <label for="horizontal-alignment-full" class="col-form-label">{{$t('settings.appearance.horizontalAlignment')}}</label>
        <div class="btn-group btn-group-toggle d-flex flex-wrap">
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentHorizontal == 'full' }">
            <input v-model="alignmentHorizontal" type="radio" name="horizontal-alignment" id="horizontal-alignment-full" value="full" autocomplete="off" checked> {{$t('settings.appearance.full')}}
            <div class="text-preview-mockup-wrap w-100 mt-2" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup w-100 p-1" v-bind:style="{color: textColor}">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce est ligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congue placerat.</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentHorizontal == 'left' }">
            <input v-model="alignmentHorizontal" type="radio" name="horizontal-alignment" id="horizontal-alignment-left" value="left" autocomplete="off"> {{$t('settings.appearance.left')}}
            <div class="text-preview-mockup-wrap w-100 mt-2" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup w-50 p-1" v-bind:style="{color: textColor}">Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentHorizontal == 'middle' }">
            <input v-model="alignmentHorizontal" type="radio" name="horizontal-alignment" id="horizontal-alignment-middle" value="middle" autocomplete="off"> {{$t('settings.appearance.middle')}}
            <div class="text-preview-mockup-wrap w-100 mt-2" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup w-50 mx-auto p-1" v-bind:style="{color: textColor}">Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et.</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentHorizontal == 'right' }">
            <input v-model="alignmentHorizontal" type="radio" name="horizontal-alignment" id="horizontal-alignment-right" value="right" autocomplete="off"> {{$t('settings.appearance.right')}}
            <div class="text-preview-mockup-wrap w-100 mt-2" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup w-50 ml-auto p-1" v-bind:style="{color: textColor}">Ut enim ad minima veniam, quis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi veniam, quis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi veniam, quis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</div>
            </div>
          </label>
        </div>
        <label for="vertical-alignment-full" class="mt-3 mb-0 col-form-label">{{$t('settings.appearance.verticalAlignment')}}</label>
        <div class="btn-group btn-group-toggle d-flex flex-wrap">
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentVertical == 'full' }">
            <input v-model="alignmentVertical" type="radio" name="vertical-alignment" id="vertical-alignment-full" value="full" autocomplete="off"> {{$t('settings.appearance.full')}}
            <div class="text-preview-mockup-wrap w-100 mt-2" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup w-100 p-1" v-bind:style="{color: textColor}">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce est ligula, tristique at lectus aliquet, pellentesque veniam, quis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi veniam, quis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congue placerat.</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentVertical == 'top' }">
            <input v-model="alignmentVertical" type="radio" name="vertical-alignment" id="vertical-alignment-top" value="top" autocomplete="off"> {{$t('settings.appearance.top')}}
            <div class="text-preview-mockup-wrap w-100 mt-2" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup h-50 p-1" style="overflow:hidden" v-bind:style="{color: textColor}">Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequaturiure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentVertical == 'middle' }">
            <input v-model="alignmentVertical" type="radio" name="vertical-alignment" id="horizontal-alignment-middle" value="middle" autocomplete="off"> {{$t('settings.appearance.middle')}}
            <div class="text-preview-mockup-wrap w-100 mt-2 d-flex align-items-center" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup h-50 my-auto p-1" v-bind:style="{color: textColor}">Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et.</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentVertical == 'bottom' }">
            <input v-model="alignmentVertical" type="radio" name="vertical-alignment" id="vertical-alignment-bottom" value="bottom" autocomplete="off"> {{$t('settings.appearance.bottom')}}
            <div class="text-preview-mockup-wrap w-100 mt-2 d-flex align-items-end" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup h-50 mt-auto p-1" v-bind:style="{color: textColor}">Ut enim ad minima veniam, qeligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimusuis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</div>
            </div>
          </label>
          <label class="btn btn-primary btn-block text-left p-2 m-0 w-50" v-bind:class="{ active: alignmentVertical == 'lowerThird' }" style="white-space:pre-line">
            <input v-model="alignmentVertical" type="radio" name="vertical-alignment" id="vertical-alignment-lower-third" value="lowerThird" autocomplete="off"> {{$t('settings.appearance.lowerThird')}}
            <div class="text-preview-mockup-wrap w-100 mt-2 d-flex align-items-end" v-bind:style="{backgroundColor: backgroundColor}">
              <div class="text-preview-mockup h-25 ml-auto p-1" v-bind:style="{color: textColor}">Ut enim ad minima veniam, quis nostrum ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</div>
            </div>
          </label>
        </div>


        <div class="form-group row mt-2">
          <label for="alignment-padding" class="col-12 col-form-label">{{$t('settings.appearance.padding')}}</label>
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

    <h3>{{$t('settings.appearance.background')}}</h3>


    <form-group-input :label="$t('settings.appearance.backgroundColor')" type="color" v-model="backgroundColor" :hint="'RGB ('+ backgroundColorRGBValues.r + ', '+ backgroundColorRGBValues.g +', '+ backgroundColorRGBValues.b +')'" />

    <form-group-input :label="$t('settings.appearance.backgroundOpacity')" v-model="backgroundOpacity" type="number" min="0" max="100" step="5" append-input-text="%" />

    <hr class="my-4" />

    <h3>{{$t('settings.appearance.textShadow')}}</h3>

    <form-group-input :label="$t('settings.appearance.shadowColor')" v-model="shadowColor" type="color" />

    <form-group-input :label="$t('settings.appearance.opacity')" v-model="shadowOpacity" type="number" min="0" max="100" step="5" append-input-text="%" />

    <form-group-input :label="$t('settings.appearance.blur')" v-model="shadowBlurRadius" type="number" min="0" step="1" append-input-text="px" />

    <form-group-input :label="$t('settings.appearance.xPosition')" v-model="shadowOffsetX" type="number" step="0.05" append-input-text="em" />

    <form-group-input :label="$t('settings.appearance.yPosition')" v-model="shadowOffsetY" type="number" step="0.05" append-input-text="em" />
  </div>
</template>

<style>
@font-face {
    font-family: 'OpenDyslexic';
    src: url('/fonts/OpenDyslexic/OpenDyslexic-regular-webfont.woff2') format('woff2'),
         url('/fonts/OpenDyslexic/OpenDyslexic-regular-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
</style>


<script>
import debounce from 'lodash.debounce'
import fontChoices from '~/mixins/data/fontChoices.js'
import hexToRGB from '~/mixins/hexToRGB'

// Add fonts dynamically
if (typeof window !== 'undefined') {
  var headID = document.getElementsByTagName('head')[0];

  // Add Google fonts
  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  headID.appendChild(link);

  let fontChoicesString = fontChoices.filter(f => { return f.googleFont; }).map(function (choice) { return choice.fontNameKey.replace(/ /g, '+'); }).join('|');;

  link.href = 'https://fonts.googleapis.com/css?family=' + fontChoicesString;


  // Add non-Google fonts
  // fontChoices.filter(f => { return !f.googleFont; }).forEach(f => {
  //   var link = document.createElement('link');
  //   link.type = 'text/css';
  //   link.rel = 'stylesheet';
  //   headID.appendChild(link);
  //   link.href = 'https://fonts.googleapis.com/css?family=' + fontChoicesString;
  // });
}

export default {
  name: 'settings-appearance-view',
  transition: 'fade',
  mixins: [
    hexToRGB,
  ],
  middleware: [
    'settings-meta',
  ],
  meta: {
    settingsPageTitleKey: 'settings.appearance.appearance',
  },
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
          return choice.fontNameKey === this.$store.state.settings.appearance.text.fontFamily
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
    backgroundOpacity: {
      get () {
        return this.$store.state.settings.appearance.background.opacity;
      },
      set (backgroundOpacity) {
        this.$store.commit('SET_BACKGROUND_OPACITY', {backgroundOpacity});
      },
    },
    backgroundColorRGBValues: function() {
      return this.hexToRGB(this.$store.state.settings.appearance.background.color);
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