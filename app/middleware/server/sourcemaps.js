// Require a header with a token in order to display source maps.
// Sentry is configured to provide this token to gain access to
// the source maps on errors.
// https://docs.sentry.io/clients/javascript/sourcemaps/
import url from 'url'

export default function (req, res, next) {
  const requestUrl = url.parse(req.url);
  if (!requestUrl.pathname.endsWith('.map')) {
    // Not a .map file
    next();
  } else {
    // Only show .map files if the request is accompanied with Sentry's token
    if (
      process.env.SENTRY_SECURITY_TOKEN // token exists in this environment
      &&
      req.headers['x-sentry-token'] &&
      req.headers['x-sentry-token'] === process.env['SENTRY_SECURITY_TOKEN'] // request had this token
    ) {
      // Show the .map file
      next();
    } else {
      // Don't show it
      res.writeHead(403);
      res.end();
    }
  }
}
