var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

  var randomJuliaChildQuote = (function(){
    var quotes = [
      'Find something you\'re passionate about and keep tremendously interested in it.',
      'In France, cooking is a serious art form and a national sport.',
      'You don\'t have to cook fancy or complicated masterpieces – just good food from fresh ingredients.',
      'I was 32 when I started cooking; up until then, I just ate.',
      'I enjoy cooking with wine. Sometimes I even put it in the food.',
      'The only time to eat diet food is while you’re waiting for the steak to cook.',
      'It is hard to imagine a civilization without onions.',
      'Always remember: If you\'re alone in the kitchen and you drop the lamb, you can always just pick it up. Who\'s going to know?',
    ];
    return quotes[Math.floor(Math.random()*quotes.length)];
  })();

  res.render('index', {
    title: 'Web Captioner',
    randomJuliaChildQuote: randomJuliaChildQuote,
  });
});

module.exports = router;
