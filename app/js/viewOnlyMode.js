$(function(){
    $('#viewOnlyZoom').on('click', function(){
        if (parseFloat($('.captions').css('font-size').split('px')[0]) > 130) {
            return;
        }

        $('.captions')
            .css(
                'font-size',
                parseFloat($('.captions').css('font-size').split('px')[0]) * 1.1
            )
            .css('line-height','normal');
    });
    $('#viewOnlyShrink').on('click', function(){
        if (parseFloat($('.captions').css('font-size').split('px')[0]) < 20) {
            return;
        }

        $('.captions')
            .css(
                'font-size',
                parseFloat($('.captions').css('font-size').split('px')[0]) * 0.9090909090909091
            )
            .css('line-height','normal');
    });

    if ($('body[data-view-only-mode]').length) {
        // var permalink = $(body[data-view-only-mode]).length;
        var webSocketPath;
        if (window.location.protocol === "https:") {
            webSocketPath = "wss:";
        } else {
            webSocketPath = "ws:";
        }
        webSocketPath += "//" + window.location.host;

        var socket = new WebSocket(webSocketPath);

        socket.addEventListener('message', function (event) {
            var message = JSON.parse(event.data);
            if (message.final) {
                final_span.insertAdjacentHTML('beforeend', ' ' + message.final);
                interim_span.innerHTML = '';
            }
            if (message.interim) {
                interim_span.innerHTML = message.interim;
            }
        });
    }
});