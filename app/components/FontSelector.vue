<template>
  <div>
    <b-button-group class="d-flex">
      <b-btn
        variant="light"
        class="bg-white border"
        id="font-selector-popover-start"
        :disabled="showFontSelectorPopover"
        :style="{fontFamily: selectedFontFamily}"
        style="text-transform: none"
      >{{selectedFontFamily}}</b-btn>
      <b-dropdown right :text="selectedFontVariant" size="sm" variant="dark">
        <b-dropdown-item
          v-for="(variant, index) in selectedFont.variants"
          :key="selectedFont.family + variant + index"
        >{{variant}}</b-dropdown-item>
      </b-dropdown>
    </b-button-group>

    <b-popover
      target="font-selector-popover-start"
      placement="auto"
      trigger="focus"
      :show.sync="showFontSelectorPopover"
    >
      <template slot="title">
        <b-button @click="showFontSelectorPopover = false" class="close" aria-label="Close">
          <span class="d-inline-block" aria-hidden="true">&times;</span>
        </b-button>Font
      </template>

      <b-form-input
        class="mb-3"
        autofocus
        placeholder="Search all fonts"
        v-model="fontSearch"
        size="sm"
      ></b-form-input>

      <p
        v-show="!fontSearch && !searching"
        class="small font-weight-bold text-muted text-uppercase mb-1 text-center"
      >Popular</p>

      <div :class="$style.fontListGroupWrap">
        <div v-show="!fontResults.length" class="text-muted text-center">No results.</div>
        <b-list-group>
          <b-list-group-item
            v-for="(font, index) in fontResults"
            :key="font.fontFamily + index"
            button
            :style="{fontFamily: font.fontFamily}"
            class="px-0"
            @click="selectFont(font)"
          >
            <span class="row m-0">
              <span class="col-3 text-center">
                <span class="d-block">
                  <fa icon="check-circle"/>
                </span>
              </span>
              <span class="col-9 pl-0">{{font.fontFamily}}</span>
            </span>
            <link :href="getFontHref(font)" rel="stylesheet">
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-popover>
  </div>
</template>

<script>
import throttle from 'lodash.throttle';

export default {
  props: {
    fontFamily: {
      type: String,
      required: true,
    },
    fontVariant: {
      type: String,
      required: true,
    },
  },
  data: function() {
    return {
      showFontSelectorPopover: false,
      fontSearch: '',
      fontResults: [],
      popularFonts: [],
      searching: false,
      selectedFont: null,
      selectedFontFamily: null,
      selectedFontVariant: null,
    };
  },
  mounted: function() {
    this.selectedFontFamily = this.fontFamily;
    this.selectedFontVariant = this.fontVariant;
  },
  methods: {
    selectFont: function(font) {
      this.selectedFont = font;
      this.showFontSelectorPopover = false;
    },
    getFontHref: function(font) {
      return (
        'https://fonts.googleapis.com/css?family=' +
        font.fontFamily +
        ':' +
        this.getDefaultVariant(font)
      );
    },
    getDefaultVariant: function(font) {
      if (font.variants.includes('regular')) {
        return 'regular';
      } else if (font.variants.includes('400')) {
        // 400 = regular
        return '400';
      } else {
        return font.variants[0];
      }
    },
  },
  watch: {
    showFontSelectorPopover: async function() {
      if (this.showFontSelectorPopover && !this.popularFonts.length) {
        // Hydrate popular fonts
        this.popularFonts = await this.$axios.$get('/api/fonts?popular');
      }

      if (!this.fontSearch) {
        // No search query; show popular fonts instead
        this.fontResults = this.popularFonts;
      }
    },
    selectedFont: function() {
      this.selectedFontFamily = this.selectedFont.fontFamily;
      this.selectedFontVariant = this.getDefaultVariant(this.selectedFont);
      this.$emit('update:fontFamily', this.selectedFont.fontFamily);
      this.$emit(
        'update:fontVariant',
        this.getDefaultVariant(this.selectedFont)
      );
    },
    fontSearch: throttle(async function() {
      this.searching = true;
      this.fontResults = await this.$axios.$get(
        '/api/fonts?search=' + this.fontSearch
      );
      this.searching = false;
    }, 500),
  },
};
</script>

<style module>
.fontListGroupWrap {
  height: 40vh;
  overflow: scroll;
}
</style>

