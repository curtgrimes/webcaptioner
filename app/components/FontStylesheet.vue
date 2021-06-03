<template>
  <link v-if="font" v-bind:href="fontHref" rel="stylesheet" />
</template>

<script>
export default {
  props: {
    fontFamily: {
      type: String,
      required: true,
    },
    fontVariant: {
      type: String,
      required: false,
    },
  },
  data: function() {
    return {
      font: null,
    };
  },
  watch: {
    fontFamily: {
      handler() {
        this.initFont();
      },
      immediate: true,
    },
    fontVariant: {
      handler() {
        this.initFont();
      },
      immediate: true,
    },
  },
  methods: {
    async initFont() {
      try {
        this.font = await this.$axios.$get('/api/fonts/' + this.fontFamily);
      } catch (e) {
        // Default font
        this.font = await this.$axios.$get('/api/fonts/Cousine');
      }
    },
  },
  computed: {
    fontHref() {
      if (!this.font) {
        return null;
      }

      if (this.font.googleFont) {
        return `https://fonts.googleapis.com/css?family=${
          this.font.fontFamily
        }:${this.fontVariant || this.font.variants[0]}`;
      } else {
        // Local font (like OpenDyslexic)
        return `/static/fonts/${this.font.fontFamily}.css`;
      }
    },
  },
};
</script>
