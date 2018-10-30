const routes = require('express').Router();

routes.use('/rooms', require('./rooms'));
routes.use('/charges', require('./charges'));
routes.use('/storage', require('./storage'));

module.exports = routes;