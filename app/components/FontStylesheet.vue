<template>
  <link v-if="font" :href="fontHref" rel="stylesheet">
</template>

<script>
export default {
  props: {
    fontFamily: {
      type: String,
      required: true,
    },
  },
  data: function() {
    return {
      font: null,
    };
  },
  created: async function() {
    try {
      this.font = await this.$axios.$get('/api/fonts/' + this.fontFamily);
    } catch (e) {
      // Default font
      this.font = await this.$axios.$get('/api/fonts/Cousine');
    }
  },
  methods: {
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
    fontHref: function() {
      if (this.font) {
        if (this.font.googleFont) {
          return (
            'https://fonts.googleapis.com/css?family=' +
            this.font.fontFamily +
            ':' +
            this.getDefaultOrSelectedVariant(this.font)
          );
        } else {
          return '/static/fonts/' + this.font.fontFamily + '.css';
        }
      }
    },
  },
};
</script>
