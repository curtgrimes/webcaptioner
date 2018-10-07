const routes = require('express').Router();

routes.use('/rooms', require('./rooms'));

module.exports = routes;