const routes = require('express').Router();

routes.use('/rooms', require('./rooms'));
routes.use('/charges', require('./charges'));

module.exports = routes;