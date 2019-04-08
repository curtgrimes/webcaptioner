const axios = require('axios');

module.exports = async function () {
  let {
    data: items
  } = await axios.get(
    'https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=' + process.env.GOOGLE_FONTS_API_KEY,
  );

  return items;
}
