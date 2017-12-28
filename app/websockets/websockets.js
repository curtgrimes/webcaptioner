const WebSocket = require('ws');
const url = require('url');

module.exports = function(server) {
    var wss = new WebSocket.Server({
        server: server,
        clientTracking: true
    });

    wss.on('connection', (ws, req) => {
        return;
            // console.log(ws);
            // console.log(req);
            // You might use location.query.access_token to authenticate or share sessions
            // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
        
            ws.on('message', (message) => {
                try {
                    // Broadcast to everyone else
                    // console.log(wss.clients.size + ' clients');
                    wss.clients.forEach((client) => {
                        if (client !== ws && client.readyState === WebSocket.OPEN) {
                            client.send(message);
                        }
                    });

                }
                catch(e) {
                    // console.log(e);
                }
            });
        
            // setInterval(()=>{ws.send('something')},2000);
        });
};