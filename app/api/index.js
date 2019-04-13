require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");

// app.enable("trust proxy"); // behind AWS ELB

app.use(bodyParser.json());
app.use((error, request, response, next) => {
  if (error !== null) {
    return response.sendStatus(400);
  }
  return next();
});


//   app.use(rateLimit({
//     windowMs: 1 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
//   }));

// app.use(function(req,res,next){setTimeout(next,1000)}); // Simulate latency

if (process.env.DEBUG_API_ONLY === 'true') {
  require('dotenv').config();
  app.use('/api', routes);
  app.listen(8080);
} else {
  app.use('/', routes);
}

module.exports = {
  path: '/api',
  handler: app,
}
