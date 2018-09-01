module.exports = function (req, res, next) {
    console.log('hi');
    res.writeHead(301, { Location: 'https://feedback.webcaptioner.com' });
    res.end();
    return;
}