const fonts = require('express').Router();
let fontsList = require('./fontsList')();



fonts.get('/', async (req, res, next) => {
  console.log(process.env.GOOGLE_FONTS_API_KEY);
  if (typeof req.query.popular !== 'undefined') {

    res.send(
      fontsList.map((font) => { // only return the font family name in response
        return {
          fontFamily: font.family,
          variants: font.variants,
        };
      }).slice(0, 30) // get first 30 results. They're already sorted by popularity.
    );
  } else if (typeof req.query.search !== 'undefined') {
    console.log(fontsList);
    res.send(
      fontsList
      .filter((font) => { // only get fonts matching name
        return font.family.toLowerCase().indexOf(req.query.search.toLowerCase()) !== -1;
      })
      .map((font) => { // only return the font family name in response
        return {
          fontFamily: font.family,
          variants: font.variants,
        };
      })
      .slice(0, 30) // get first 30 results
    );
  } else {
    res.send([]);
  }

});

fonts.get('/:fontFamily', async (req, res, next) => {
  if (!req.params.fontFamily) {
    res.send(422);
    return;
  }

  res.send(
    fontsList
    .filter((font) => { // only get fonts matching name
      return font.family.toLowerCase() === req.params.fontFamily.toLowerCase();
    })
    .map((font) => { // only return the font family name in response
      return {
        fontFamily: font.family,
        variants: font.variants,
      };
    })
  );
});


module.exports = fonts;
