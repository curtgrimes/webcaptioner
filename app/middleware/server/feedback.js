module.exports = function (req, res, next) {
    res.writeHead(301, { Location: 'https://feedback.webcaptioner.com' });
    res.end();
    return;
}