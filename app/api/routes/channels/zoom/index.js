const zoom = require('express').Router();
const axios = require('axios');

zoom.post('/api', async (req, res) => {
  const { apiPath, transcript } = req.body;
  if (!apiPath || !transcript) {
    return res.sendStatus(400);
  }

  axios
    .post(apiPath, transcript, {
      headers: { 'Content-Type': 'text/plain' },
    })
    .then(() => {
      // We got a successful response
      res.sendStatus(200);
    })
    .catch((e) => {
      if (e.code === 'ENOTFOUND') {
        return res.sendStatus(404);
      } else {
        const errorCode =
          e && e.response && e.response.status ? e.response.status : undefined;
        switch (errorCode) {
          case 400:
            return res
              .status(400)
              .send(
                `Error: The Zoom meeting has not started yet or it has already ended.`
              );
          default:
            return res
              .status(520)
              .send(`Something went wrong. (${errorCode || 'Unknown error'})`);
        }
      }
    });
});

module.exports = zoom;
