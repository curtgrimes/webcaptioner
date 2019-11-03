const axios = require('axios');
const nodeCache = require('node-cache');
const cache = new nodeCache();

module.exports.getFonts = async function() {
  const cachedFonts = cache.get('fonts');
  if (cachedFonts) {
    return cachedFonts;
  }

  let {
    data: { items },
  } = await axios.get(
    'https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=' +
      process.env.GOOGLE_FONTS_API_KEY
  );

  items = items.map((font) => {
    // only return the font family name and variants in response
    return {
      fontFamily: font.family,
      variants: font.variants,
      googleFont: true,
    };
  });

  const fontsToReturn = [
    // Add OpenDyslexic
    {
      fontFamily: 'OpenDyslexic',
      variants: ['regular', 'italic', '700', '700 italic'],
      googleFont: false,
    },
    {
      fontFamily: 'OpenDyslexic Alta',
      variants: ['regular', 'italic', '700', '700 italic'],
      googleFont: false,
      excludeFromPopular: true,
    },
    {
      fontFamily: 'OpenDyslexic Mono',
      variants: ['regular'],
      googleFont: false,
      excludeFromPopular: true,
    },
    ...items,
  ];

  cache.set(
    'fonts',
    fontsToReturn,
    60 * 60 * 6 // TTL - Google fonts don't change that often
  );
  return fontsToReturn;
};
