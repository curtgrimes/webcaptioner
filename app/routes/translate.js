var express = require('express');
var router = express.Router();

// Imports the Google Cloud client library
const Translate = require('@google-cloud/translate');

// Your Google Cloud Platform project ID
const projectId = 'webcaptioner';

// Instantiates a client
const translateClient = Translate({
  projectId: projectId
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  if (!req.param('text') || !req.param('target')) {
    res.status(400);
  }

  translateClient.translate(req.param('text'), req.param('target'))
    .then((results) => {
      const translation = results[0];
      res.json({translation: translation});
    })
    .catch((error) => {
      res.status(400).json({error: error});
    });
});

module.exports = router;
