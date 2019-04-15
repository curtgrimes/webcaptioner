<template>
  <div>
    <b-btn-group class="d-flex">
      <b-btn
        variant="light"
        class="bg-white border fontPreviewButton"
        id="font-selector-popover-start"
        :disabled="!selectedFont"
        :style="{fontFamily: selectedFontFamily, fontWeight, fontStyle}"
        style="text-transform: none"
        v-b-tooltip.hover
        :title="selectedFontFamily"
      >{{selectedFontFamily}}</b-btn>
      <b-dropdown
        @show="showFontSelectorPopover = false"
        :disabled="!selectedFont"
        right
        :text="selectedFontVariant"
        size="sm"
        variant="dark"
      >
        <b-dropdown-item
          v-for="(variant, index) in (selectedFont ? selectedFont.variants : [])"
          :key="selectedFont.family + variant + index"
          @click="selectedFontVariant = variant"
          style="text-transform: capitalize"
        >{{variant}}</b-dropdown-item>
      </b-dropdown>
    </b-btn-group>
    <font-stylesheet v-if="selectedFont" :fontFamily="selectedFont.fontFamily"/>

    <b-popover
      target="font-selector-popover-start"
      placement="auto"
      trigger="focus"
      :show.sync="showFontSelectorPopover"
    >
      <template slot="title">
        <b-btn
          @click="showFontSelectorPopover = false"
          size="sm"
          variant="link"
          aria-label="Close"
          class="float-right p-0 text-dark"
        >
          <fa icon="times"/>
        </b-btn>Font
      </template>

      <b-form-input
        class="mb-3"
        ref="fontSearchInput"
        autofocus
        placeholder="Search all fonts"
        v-model="fontSearch"
        size="sm"
      ></b-form-input>

      <p
        v-show="!fontSearch && !searching"
        class="small font-weight-bold text-muted text-uppercase mb-1"
      >Popular</p>

      <div class="fontListGroupWrap">
        <div v-show="!fontResults.length && !loading" class="text-muted text-center">No results.</div>
        <b-spinner v-if="loading" small class="d-block mx-auto"></b-spinner>
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
                <span
                  class="d-block"
                  v-if="selectedFont && selectedFont.fontFamily === font.fontFamily"
                >
                  <fa icon="check-circle"/>
                </span>
              </span>
              <span class="col-9 pl-0">{{font.fontFamily}}</span>
            </span>
            <font-stylesheet v-if="selectedFont" :fontFamily="font.fontFamily"/>
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-popover>
  </div>
</template>

<script>
import throttle from 'lodash.throttle';
import fontStylesheet from '@/components/fontStylesheet';
import bBtn from 'bootstrap-vue/es/components/button/button';
import bBtnGroup from 'bootstrap-vue/es/components/button-group/button-group';
import bSpinner from 'bootstrap-vue/es/components/spinner/spinner';
import bListGroup from 'bootstrap-vue/es/components/list-group/list-group';
import bListGroupItem from 'bootstrap-vue/es/components/list-group/list-group-item';
import bPopover from 'bootstrap-vue/es/components/popover/popover';
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input';
import bDropdown from 'bootstrap-vue/es/components/dropdown/dropdown';
import bDropdownItem from 'bootstrap-vue/es/components/dropdown/dropdown-item';
import bTooltip from 'bootstrap-vue/es/directives/tooltip/tooltip';

export default {
  components: {
    fontStylesheet,
    bBtn,
    bBtnGroup,
    bSpinner,
    bListGroup,
    bListGroupItem,
    bPopover,
    bFormInput,
    bDropdown,
    bDropdownItem,
  },
  directives: {
    bTooltip,
  },
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
      loading: true,
    };
  },
  created: function() {
    this.selectedFontFamily = this.fontFamily;
    this.selectedFontVariant = this.fontVariant;
  },
  mounted: async function() {
    if (!this.selectedFont) {
      let fontLookup = await this.$axios.$get('/api/fonts/' + this.fontFamily);

      if (fontLookup) {
        this.selectedFont = fontLookup;
      }
    }
  },
  methods: {
    selectFont: function(font) {
      this.selectedFont = font;
      this.showFontSelectorPopover = false;
    },
    getDefaultOrSelectedVariant: function(font) {
      if (
        this.selectedFontVariant &&
        font.variants.includes(this.selectedFontVariant)
      ) {
        return this.selectedFontVariant;
      }
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
  computed: {
    fontWeight: function() {
      // If the font variant is something like 'bold 400 italic', return just
      // the '400'.  Some variants are just 'regular' literally, so replace that
      // with the 'normal' weight (equivalent to 400)
      return this.selectedFontVariant.replace(/\D+/g, '') || '400';
    },
    fontStyle: function() {
      return this.selectedFontVariant.includes('italic') ? 'italic' : 'normal';
    },
  },
  watch: {
    showFontSelectorPopover: async function() {
      this.$refs.fontSearchInput.focus();

      if (this.showFontSelectorPopover && !this.popularFonts.length) {
        // Hydrate popular fonts
        this.loading = true;
        this.popularFonts = await this.$axios.$get('/api/fonts?popular');
        this.loading = false;
      }

      if (!this.fontSearch) {
        // No search query; show popular fonts instead
        this.fontResults = this.popularFonts;
      }
    },
    selectedFont: function() {
      this.selectedFontFamily = this.selectedFont.fontFamily;
      this.selectedFontVariant = this.getDefaultOrSelectedVariant(
        this.selectedFont
      );
      this.$emit('update:fontFamily', this.selectedFont.fontFamily);
      this.$emit(
        'update:fontVariant',
        this.getDefaultOrSelectedVariant(this.selectedFont)
      );
    },
    selectedFontVariant: function() {
      this.$emit('update:fontVariant', this.selectedFontVariant);
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

<style scoped>
.fontListGroupWrap {
  height: 40vh;
  overflow: scroll;
}
.fontPreviewButton {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

