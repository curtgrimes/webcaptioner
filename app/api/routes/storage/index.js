const routes = require('express').Router();

routes.use('/dropbox', require('./dropbox'));

module.exports = routes;