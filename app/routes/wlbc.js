// View only mode
var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    return;
    res.render('index', {
        title: 'Web Captioner',
        viewOnlyMode: 'asdf',
        defaultFromLanguage: 'en-US',
        defaultToLanguage: 'en-US',
        fromLanguages: [],
        toLanguages: [],
        randomJuliaChildQuote: '',
        captionTypefaceChoices: [
            { // This list must have at least one and the default must be first
              'googleFontName': 'Cousine',
              'fontFamily': 'Cousine',
              'displayName': 'Cousine',
            },
        ]
    });
});

module.exports = router;