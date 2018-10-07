const url = require('url');

// Only allow access to /admin path if an admin token is present

module.exports = function (req, res, next) {
  const query = url.parse(req.url, true).query;

  if (
      process.env.ADMIN_TOKEN // token exists in this environment
      && query && query.token
      && query.token === process.env.ADMIN_TOKEN // request had this token
  ) {
    // Continue to the route
    next();
  }
  else {
    res.writeHead(404);
    res.end();
  }
}