const fonts = require('express').Router();
let fontsList = require('./fontsList');



fonts.get('/', async (req, res, next) => {
  let fonts = await fontsList.getFonts();
  if (typeof req.query.popular !== 'undefined') {
    const popularFonts = fonts.slice(0, 25) // get first X results. They're already sorted by popularity.

    res.send([
      // Add Cousine to the top of the list
      {
        fontFamily: 'Cousine',
        variants: ['regular', 'italic', '700', '700italic'],
        googleFont: true,
      },
      ...popularFonts.filter((font) => {
        // remove Cousine if it's already included in the popular fonts
        return font.fontFamily !== 'Cousine' &&
          !font.excludeFromPopular;
      }),
    ]);
  } else if (typeof req.query.search !== 'undefined') {
    res.send(
      fonts
      .filter((font) => { // only get fonts matching name
        return font.fontFamily.toLowerCase().indexOf(req.query.search.toLowerCase()) !== -1;
      })
      .slice(0, 30) // get first 30 results
    );
  } else {
    res.send([]);
  }

});

fonts.get('/:fontFamily', async (req, res, next) => {
  let fonts = await fontsList.getFonts();
  if (!req.params.fontFamily) {
    res.send(422);
    return;
  }

  const fontToFind = fonts.find((font) => { // only get fonts matching name
    return font.fontFamily.toLowerCase() === req.params.fontFamily.toLowerCase();
  });

  if (fontToFind) {
    res.send({
      fontFamily: fontToFind.fontFamily,
      variants: fontToFind.variants,
      googleFont: fontToFind.googleFont,
    });
  } else {
    res.sendStatus(404);
  }
});


module.exports = fonts;
