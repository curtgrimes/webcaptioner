function clear_saved() {
    ga('send', 'event', 'user', 'clearButtonClick');
    if (confirm('Clear saved transcript?')) {
        $('#final_span').text('');
        final_transcript = '';
        window.localStorage.setItem("transcript", final_transcript);
    }
}

var create_email = false;
var final_transcript = window.localStorage.getItem("transcript") || '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var restartingDueToFailure = false;
if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        recognizing = true;
        showInfo('info_speak_now');
        window.scrollTo(0, document.body.scrollHeight);
    };

    recognition.onerror = function (event) {
        if (event.error == 'no-speech') {
            showInfo('info_no_speech');
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            showInfo('info_no_microphone');
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                showInfo('info_blocked');
            } else {
                showInfo('info_denied');
            }
            ignore_onend = true;
        }
    };

    recognition.onend = function () {
        if (restartingDueToFailure) {
            console.log("Restarting due to failure");
            ga('send', 'event', 'recognition', 'restartingDueToPossibleFailure');
            recognition.start();
            restartingDueToFailure = false;
            return;
        }

        recognizing = false;
        if (ignore_onend) {
            return;
        }

        if (!final_transcript) {
            showInfo('info_start');
            return;
        }
        showInfo('');
    };

    var lastResultTime = (new Date()).getTime() / 1000;
    recognition.onresult = function (event) {
        lastResultTime = (new Date()).getTime() / 1000;
        var interim_transcript = '';
        if (typeof (event.results) == 'undefined') {
            recognition.onend = null;
            recognition.stop();
            upgrade();
            return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_transcript = capitalize(final_transcript);
        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
        window.localStorage.setItem("transcript", final_transcript);
        window.scrollTo(0, document.body.scrollHeight);
        window.getSelection().removeAllRanges(); // remove any current text selection
    };
}

setInterval(function () {
    var now = (new Date()).getTime() / 1000;
    if (recognizing && now - lastResultTime > 3) {
        restartingDueToFailure = true;
        recognition.stop();
    }
}, 3000);

function upgrade() {
    $('#onboardingModal .modal-footer').hide();
    $('#upgrade-alert').show();
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function (m) { return m.toUpperCase(); });
}

function startButton(event) {

    if (recognizing) {
        ga('send', 'event', 'user', 'stopButtonClick');
        recognition.stop();
        $('#startButton').text('Start Captioning');
        document.webkitExitFullscreen();
        return;
    }
    ga('send', 'event', 'user', 'startButtonClick');
    $('#startButton').text('Stop');
    recognition.lang = 'en-US';
    recognition.start();
    ignore_onend = false;
    interim_span.innerHTML = '';
    showInfo('info_allow');
    start_timestamp = event.timeStamp;
    document.body.webkitRequestFullscreen();
}

function showInfo(s) {
    if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                child.style.display = child.id == s ? 'inline' : 'none';
            }
        }
        info.style.visibility = 'visible';
    } else {
        info.style.visibility = 'hidden';
    }
}

$(function () {
    $('#onboardingModal').modal();

    showInfo('info_start');


    document.getElementById('final_span').innerHTML = window.localStorage.getItem("transcript");
    window.scrollTo(0, document.body.scrollHeight);


    $('#final_span').on('keyup', function (event) {
        final_transcript = $('#final_span').text();
        window.localStorage.setItem("transcript", final_transcript);
    });
});