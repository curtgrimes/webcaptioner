module.exports = function(req, res, next) {
  const host = req.headers.host;

  if (process.env.NODE_ENV === 'production' && host.includes('www.')) {
    res.writeHead(301, {
      Location: 'https://' + host.replace('www.', '') + req.url,
    });
    return res.end();
  }

  return next();
};
