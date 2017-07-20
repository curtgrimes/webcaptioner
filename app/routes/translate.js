var express = require('express');
var router = express.Router();

// Imports the Google Cloud client library
const Translate = require('@google-cloud/translate');

// Instantiates a client
const translateClient = Translate({
  projectId: 'webcaptioner'
});

router.post('/', function(req, res, next) {
  if (!req.body.text || !req.body.target) {
    res.status(400);
  }
console.log(typeof req.body.text.trim());
console.log(typeof req.body.target);
  translateClient.translate(req.body.text.trim(), req.body.target)
    .then((results) => {
      const translation = results[0];
      res.json({translation: translation});
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: error});
    });
});

module.exports = router;
