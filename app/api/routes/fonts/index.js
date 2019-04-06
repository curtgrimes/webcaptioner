const fonts = require('express').Router();
const axios = require('axios');

let fontsList;

fonts.get('/', async (req, res, next) => {
    if (!fontsList) {
        // Get fonts for the first time
        let {data: {items: newFonts}} = await axios.get(
            'https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=' + process.env.GOOGLE_FONTS_API_KEY,
        );
        fontsList = newFonts;
    }

    if (typeof req.query.popular !== 'undefined') {
        res.send(
            fontsList.map((font) => { // only return the font family name in response
                return {
                    fontFamily: font.family,
                    variants: font.variants,
                };
            }).slice(0,30) // get first 30 results
        );
    }
    else if (typeof req.query.search !== 'undefined') {
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
                .slice(0,30) // get first 30 results
        );
    }
    
});

module.exports = fonts;