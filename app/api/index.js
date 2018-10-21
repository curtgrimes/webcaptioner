const express = require('express');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use((error, request, response, next) => {
    if (error !== null) {
      return response.sendStatus(400);
    }
    return next();
  });
  
// app.use(function(req,res,next){setTimeout(next,1000)}); // Simulate latency

if (process.env.DEBUG_API_ONLY === 'true') {
    require('dotenv').config();
    app.use('/api', routes);
    app.listen(8080);
}
else {
    app.use('/', routes);
}

module.exports = {
    path: '/api',
    handler: app,
}
