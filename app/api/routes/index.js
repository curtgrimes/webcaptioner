const routes = require('express').Router();
console.log('routes here');
routes.use('/rooms', require('./rooms'));
routes.use('/channels', require('./channels'));
routes.use('/charges', require('./charges'));
routes.use('/storage', require('./storage'));
routes.use('/fonts', require('./fonts'));
routes.use('/patreon', require('./patreon'));
routes.use('/docs', require('./docs'));

module.exports = routes;
