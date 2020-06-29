const youtube = require('express').Router();
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const rateLimitWindowMinutes = 5;
const requestsAllowedPerSecond = 1; // Frontend limits to one request per second
const rateLimitLeeway = 10;
const rateLimiter = rateLimit({
  windowMs: rateLimitWindowMinutes * 60 * 1000,
  max: rateLimitWindowMinutes * requestsAllowedPerSecond * 60 + rateLimitLeeway,
});

youtube.use('/', rateLimiter);

youtube.post('/', async (req, res) => {
  const { apiPath, transcript } = req.body;
  if (!apiPath || !transcript) {
    return res.sendStatus(400);
  }

  try {
    // Verify this is actually a URL and a YouTube closed caption URL
    const url = new URL(apiPath);
    if (
      url.origin !== 'http://upload.youtube.com' ||
      url.pathname !== '/closedcaption'
    ) {
      throw new Error();
    }
  } catch (e) {
    return res.sendStatus(400);
  }

  // At one point I thought doing this might improve caption delay
  // in YouTube but I don't think so
  const offsetTimestampSeconds = 0;

  const body = `${
    new Date(new Date().getTime() - 1000 * offsetTimestampSeconds)
      .toISOString()
      .split('Z')[0]
  }\n${transcript}\n`;

  axios
    .post(apiPath, body, {
      headers: {
        'Content-Type': 'text/plain',
      },
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

module.exports = youtube;
