function clear_saved() {
    ga('send', 'event', 'user', 'clearButtonClick');
    if (confirm('Clear saved transcript?')) {
        $('#final_span').text('');
        final_transcript = '';
        //window.localStorage.setItem("transcript", final_transcript);
    }
}

var create_email = false;
//var final_transcript = window.localStorage.getItem("transcript") || '';
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var restartingDueToFailure = false;
var lastStartTimestamp;
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
        var now = (new Date()).getTime() / 1000;

        if (restartingDueToFailure && now - lastStartTimestamp > 4) {
            $('#startButton')
                .removeClass('btn-primary')
                .addClass('btn-secondary disabled')
                .text('Please Wait...');

            ga('send', 'event', 'recognition', 'restartingDueToPossibleFailure');

            recognition.start();
            restartingDueToFailure = false;

            setTimeout(function(){
                $('#startButton')
                    .removeClass('btn-secondary disabled')
                    .addClass('btn-primary')
                    .text('Stop');
            },1500);
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
                var shouldAppendSpace = final_transcript.slice(-1) !== ' ';

                final_transcript += (shouldAppendSpace ? ' ' : '') + event.results[i][0].transcript;

                var wordCount = event.results[i][0].transcript.split(' ').length;
                ga('send', 'event', 'recognition', 'recognizingSpeech', 'recognizeWordCount', wordCount);
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_transcript = capitalize(final_transcript);
        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
        //window.localStorage.setItem("transcript", final_transcript);
        window.scrollTo(0, document.body.scrollHeight);
        window.getSelection().removeAllRanges(); // remove any current text selection
    };
}

// Temp fix for issue where recognition stops when on another tab
document.addEventListener('visibilitychange', function(){
    if ($('#startButton').text() == 'Stop') {
        $('#audioLevelWrap').attr('hidden','true');
        // It should be running right now
        try {
            recognition.start();
        }
        catch (e) {
            // If the service was already running it throws an error.
            // Can't figure out a way to check if the service is running
            // before calling start().
        }
    }
})

setInterval(function () {
    var now = (new Date()).getTime() / 1000;
    if (recognizing && now - lastResultTime >= 5 && now - lastStartTimestamp > 8 && !showLowLevelmessage && !showClippingMessage) {
        restartingDueToFailure = true;
        recognition.stop();
    }
}, 1000);

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
        $('#audioLevelWrap').attr('hidden','true'); // hide any error messages
        clippingReadings = [];
        lowLevelReadings = [];
        clearInterval(levelCheckLoopInterval);
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
    lastStartTimestamp = (new Date()).getTime() / 1000;
    initMediaLevelMonitoring();
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

var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH=500;
var HEIGHT=50;
var rafID = null;
var meterWrapWidth;
var levelCheckLoopInterval;
function initMediaLevelMonitoring() {

    // grab our canvas
    $canvasContext = $('#meter');
    
    // monkeypatch Web Audio
    if (!audioContext) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
    
        // grab an audio context
        audioContext = new AudioContext();
    }

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia = 
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

    clearInterval(levelCheckLoopInterval);
    levelCheckLoopInterval = setInterval(levelCheckLoop, 700);
}


function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext, 1);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    drawLoop();
}

function drawLoop( time ) {
    // clear the background
    $canvasContext.width('0');

    // check if we're currently clipping
    if (meter.checkClipping()) {
        $canvasContext
            .addClass('bg-danger')
            .removeClass('bg-success');
        window.audioIsClipping = true;
    }
    else if (meter.checkLowLevel()) {
        $canvasContext
            .addClass('bg-danger')
            .removeClass('bg-success');
        window.audioLevelIsLow = true;
    }
    else {
        $canvasContext
            .addClass('bg-success')
            .removeClass('bg-danger');
        window.audioIsClipping = false;
        window.audioLevelIsLow = false;
    }

    // draw a bar based on the current volume
    $canvasContext.width(meterWrapWidth * Math.min(meter.volume * 4, 1) + 'px');
    //canvasContext.fillRect(0, 0, meter.volume*WIDTH*1.4, HEIGHT);

    // set up the next visual callback
    rafID = window.requestAnimationFrame(drawLoop);
}

// level check loop
var clippingReadings = [], lowLevelReadings = [],
    showClippingMessage = false, showLowLevelmessage = false;
    
function levelCheckLoop() {
    clippingReadings.push(meter.checkClipping());
    lowLevelReadings.push(meter.checkLowLevel());

    // save just the past x readings
    clippingReadings = clippingReadings.slice(-10);
    lowLevelReadings = lowLevelReadings.slice(-10);

    if ((clippingReadings.length > 0) && clippingReadings.filter(function (isClipping) {return isClipping;}).length / clippingReadings.length > .7) {
        $('#clippingMessage,#audioLevelWrap').removeAttr('hidden');
        meterWrapWidth = $('#meterWrap').width();
        showClippingMessage = true;
    }
    else {
        $('#clippingMessage').attr('hidden','true');
        showClippingMessage = false;
    }

    if ((lowLevelReadings.length > 0) && lowLevelReadings.filter(function(isLowLevel){return isLowLevel;}).length / lowLevelReadings.length > .7) {
        $('#lowLevelMessage,#audioLevelWrap').removeAttr('hidden');
        meterWrapWidth = $('#meterWrap').width();
        showLowLevelmessage = true;

        // Don't show both messages at once
        $('#clippingMessage').attr('hidden','true');
    }
    else {
        $('#lowLevelMessage').attr('hidden','true');
        showLowLevelmessage = false;
    }

    if (!showClippingMessage && !showLowLevelmessage) {
        $('#audioLevelWrap').attr('hidden','true');
    }

}


$(function () {
    $('#onboardingModal').modal();

    showInfo('info_start');


    //document.getElementById('final_span').innerHTML = window.localStorage.getItem("transcript");
    window.scrollTo(0, document.body.scrollHeight);


    $('#final_span').on('keyup', function (event) {
        final_transcript = $('#final_span').text();
        //window.localStorage.setItem("transcript", final_transcript);
    });

    setInterval(function() {
        // Clean up transcript, limit to 1000 characters
        $('#final_span').text($('#final_span').text().slice(-1000));
    },10000);
});
