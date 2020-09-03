const parseDomain = require('parse-domain');
const firebaseAdmin = require('./../../api/firebaseAdmin.js');
const url = require('url');

export default async function(req, res, next) {
  // Redirect to share URL if arriving here from a nonstandard different host
  let host = req.headers.host;
  let { subdomain } = parseDomain(host) || {};
  if (
    !subdomain ||
    [
      'feedback.webcaptioner.com',
      'signin.webcaptioner.com',
      'staging.webcaptioner.com',
      'demo4591891495012598120529813.webcaptioner.com',
      'webcaptioner.com',
    ].includes(host)
  ) {
    // Don't redirect
    next();
    return;
  } else {
    // There's a nonstandard host
    // Find the room that it belongs to, if any.
    let db = firebaseAdmin().firestore();

    let querySnapshot = await db
      .collectionGroup('privileges')
      .where('customDomain', '==', host)
      .get();

    if (querySnapshot.size) {
      querySnapshot.forEach(function(doc) {
        let { vanity } = doc.data();

        if (vanity) {
          const urlParsed = url.parse(req.url);
          if (!req.url || urlParsed.pathname === '/') {
            // only if requesting the base path (filters out any requests for assets)

            // ?d will cause replaceState to be triggered to clear out the URL client-side
            let redirectPath = '/s/' + vanity + '?d';

            res.writeHead(301, {
              Location: redirectPath,
            });
            res.end();
            return;
          } else {
            // We already redirected to the /s/ URL, or this is a request for an asset
            next();
            return;
          }
        } else {
          // No vanity found
          next();
          return;
        }
      });
    } else {
      // No vanity URL found if we arrive here
      res.writeHead(404);
      res.end();
    }
  }
}
