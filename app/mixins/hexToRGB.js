import hexRGB from 'hex-rgb';

export default {
  methods: {
    hexToRGB(hex) {
      const { red: r, green: g, blue: b } = hexRGB(hex);
      return { r, g, b };
    },
  },
};
