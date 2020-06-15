const zoom = require('express').Router();
const axios = require('axios');

zoom.post('/api', async (req, res) => {
  const { apiPath, transcript } = req.body;
  if (!apiPath || !transcript) {
    return res.status(400).send('Incomplete request: ' + req.body);
  }

  axios
    .post(apiPath, transcript, {
      headers: { 'Content-Type': 'text/plain' },
    })
    .then((response) => {
      // Response
      res.sendStatus(200);
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

module.exports = zoom;
