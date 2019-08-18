const patreon = require('express').Router();
const axios = require('axios');

patreon.get('/patron-count', async (req, res, next) => {
  axios
    .get('https://www.patreon.com/api/oauth2/api/current_user/campaigns', {
      headers: {
        Authorization: 'Bearer ' + process.env.PATREON_ACCESS_TOKEN,
      },
    })
    .then(({
      data
    }) => {
      const totalPatronCount = (data.included || []).reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.attributes ? (currentValue.attributes.patron_count || 0) : 0);
      }, 0);

      res.send(JSON.stringify(totalPatronCount));
    })
    .catch((e) => {
      res.sendStatus(500);
    });
});

module.exports = patreon;
