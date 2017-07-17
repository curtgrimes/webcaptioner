function clear_saved() {
    ga('send', 'event', 'user', 'clearButtonClick');
    if (confirm('Clear saved transcript?')) {
        $('#final_span').text('');
        // final_transcript = '';
        //window.localStorage.setItem("transcript", final_transcript);
    }
}

var create_email = false;
var recognizing = false;
var ignore_onend;
var restartingDueToFailure = false;
var lastStartTimestamp;
var wordCount = 0;
var shouldStartOnStop = false;
var final_span = document.getElementById('final_span');
var interim_span = document.getElementById('interim_span');
var recognition;
var lastResultTime = (new Date()).getTime() / 1000;
var startStopButtonLastPressedTime;
if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    recognition = initRecognition();
}

function initRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = function () {
        lastStartTimestamp = (new Date()).getTime() / 1000;
        recognizing = true;
        showInfo('info_speak_now');
        
        // Warn before leaving
        window.onbeforeunload = function() { return true; }

        $('.caption-wrap-real').scrollTop($('.caption-wrap-real')[0].scrollHeight);
        initMediaLevelMonitoring();

        // If the current final text doesn't end in a space, add one. Every time this starts we can't guarantee
        // that the last transcription ended with a space.
        if (final_span.innerHTML.slice(-1) !== ' ') {
            final_span.insertAdjacentHTML('beforeend', ' ');
        }
    };

    recognition.onerror = function (event) {
        // And recognition has stopped

        if (event.error == 'no-speech') {
            shouldStartOnStop = true;
            // recognition.stop();
            // recognition.start();
            ga('send', 'event', 'recognition', 'errorNoSpeech');
            window.onbeforeunload = null; // Don't show warning on leave
            return;
        }
        if (event.error == 'audio-capture') {
            showInfo('info_no_microphone');
            ignore_onend = true;

            ga('send', 'event', 'recognition', 'errorNoMicrophone');
            $('#startButton').text('Start Captioning');
            $('#audioLevelWrap').attr('hidden','true'); // hide any error messages
            clippingReadings = [];
            lowLevelReadings = [];
            clearInterval(levelCheckLoopInterval);
            window.onbeforeunload = null; // Don't show warning on leave
            return;
        }
        if (event.error == 'not-allowed') {
            showInfo('info_blocked');
            
            ignore_onend = true;
            ga('send', 'event', 'recognition', 'errorNotAllowed');
            $('#startButton').text('Start Captioning');
            $('#audioLevelWrap').attr('hidden','true'); // hide any error messages
            clippingReadings = [];
            lowLevelReadings = [];
            clearInterval(levelCheckLoopInterval);
            window.onbeforeunload = null; // Don't show warning on leave
            return;
        }
    };

    recognition.onend = function () {
        recognizing = false;
        var now = (new Date()).getTime() / 1000;
        
        if (restartingDueToFailure || now - startStopButtonLastPressedTime > 1) {
            // Button wasn't pressed in the last second, so recognition
            // must have stopped on its own
            ga('send', 'event', 'recognition', 'restartingDueToPossibleFailure');

            recognition.start();
            restartingDueToFailure = false;
            startStopButtonPressed = false;

            return;
        }
        else {
            // Button was pressed and it really should stop
            recognition = null;
            clearInterval(levelCheckLoopInterval);
            if (mediaStream) {
                (mediaStream.getAudioTracks() || []).forEach(function(audioTrack) {
                    audioTrack.stop();
                });
            }

            if (final_span.innerHTML.length <= 1) {
                // No transcription; don't show warning on leave
                window.onbeforeunload = null;
            }
        }
        
        if (!ignore_onend) {
            showInfo('');
        }
    };

    recognition.onresult = function (event) {
        lastResultTime = (new Date()).getTime() / 1000;
        var interim_transcript = '';
        var final_transcript = '';

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

        final_transcript = makeReplacements(final_transcript);
        interim_transcript = makeReplacements(interim_transcript);

        if (final_transcript) {
            final_span.insertAdjacentHTML('beforeend', final_transcript);

            ga(
                'send',
                'event',
                'recognition',
                'recognizingSpeech',
                'wordCount:' + final_transcript.split(' ').length
            );

            // Clear interim span
            while (interim_span.firstChild) {
                interim_span.removeChild(interim_span.firstChild);
            }
            interim_transcript = '';
        }

        if (interim_transcript) {
            interim_span.innerHTML = interim_transcript;
        }

        if (interim_transcript || final_transcript) {
            // Scroll to the bottom of the div
            var captionWrapReal = document.getElementsByClassName('caption-wrap-real')[0];
            captionWrapReal.scrollTop = captionWrapReal.scrollHeight;

            // remove any current text selection
            window.getSelection().removeAllRanges();
        }
    };

    return recognition;
}

function makeReplacements(transcript) {

    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    [
        {
            find: ['Kurt Grimes', 'Kirk Grimes'],
            replacement: 'Curt Grimes',
        },
        {
            find: ['web captioner', 'web caption or'],
            replacement: 'Web Captioner',
        },
        {
            find: [':-)'],
            replacement: '<i class="fa fa-smile-o" aria-hidden="true"></i>',
        },
        {
            find: [':-('],
            replacement: '<i class="fa fa-frown-o" aria-hidden="true"></i>',
        },
        {
            find: ['Star Trek'],
            replacement: '<i class="fa fa-hand-spock-o" aria-hidden="true"></i> Star Trek',
        },
    ].forEach(function(rewritePair) {
        rewritePair.find.forEach(function(findString) {
            transcript = transcript.replace(new RegExp(escapeRegExp(findString), 'gi'), rewritePair.replacement);
        })
    });

    return transcript;
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
    if (recognizing) {
        var now = (new Date()).getTime() / 1000;
        if (now - lastResultTime >= 1.5 && now - lastStartTimestamp > 3 && !showLowLevelmessage && !showClippingMessage) {
            restartingDueToFailure = true;
            recognition.stop();
        }        
    }
}, 1000);

function upgrade() {
    $('#onboardingModal .modal-footer').hide();
    $('#upgrade-alert').show();
}

function showInfo(s) {
    if (typeof info === 'undefined') {
        return;
    }

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
var WIDTH=500;
var HEIGHT=50;
var rafID = null;
var meterWrapWidth;
var levelCheckLoopInterval;
function initMediaLevelMonitoring() {
    
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
    levelCheckLoopInterval = setInterval(levelCheckLoop, 400);
}


function didntGetStream() {
    console.log('Stream generation failed.');
}

var mediaStreamSource = null;
var mediaStream = null;

function gotStream(stream) {
    mediaStream =  stream;
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext, 1);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    drawLoop();
}

function drawLoop( time ) {
    var canvas = document.getElementById('meter');

    // draw a bar based on the current volume
    canvas.style.width = meterWrapWidth * Math.min(meter.volume * 4, 1) + 'px';

    // check if we're currently clipping
    if (meter.checkClipping() || meter.checkLowLevel()) {
        canvas.classList.add('bg-danger');
        canvas.classList.remove('bg-success');

        if (meter.checkClipping()) window.audioIsClipping = true;
        if (meter.checkLowLevel()) window.audioLevelIsLow = true;
    }
    else {
        canvas.classList.add('bg-success');
        canvas.classList.remove('bg-danger');
        window.audioIsClipping = false;
        window.audioLevelIsLow = false;
    }

    // set up the next visual callback
    rafID = window.requestAnimationFrame(drawLoop);
}

// level check loop
var clippingReadings = [],
    lowLevelReadings = [],
    showClippingMessage = false,
    showLowLevelmessage = false,
    clippingMessage = document.getElementById('clippingMessage'),
    lowLevelMessage = document.getElementById('lowLevelMessage'),
    audioLevelWrap = document.getElementById('audioLevelWrap');

function levelCheckLoop() {
    if (!meter) {
        return;
    }
    
    clippingReadings.push(meter.checkClipping());
    lowLevelReadings.push(meter.checkLowLevel());

    // save just the past x readings
    clippingReadings = clippingReadings.slice(-10);
    lowLevelReadings = lowLevelReadings.slice(-10);

    if ((clippingReadings.length > 0) && clippingReadings.filter(function (isClipping) {return isClipping;}).length / clippingReadings.length > .6) {
        [clippingMessage, audioLevelWrap].forEach(function(element) {
            element.removeAttribute('hidden');
        });

        if (!meterWrapWidth) {
            meterWrapWidth = document.getElementById('meterWrap').offsetWidth;
        }
        
        showClippingMessage = true;
    }
    else {
        clippingMessage.setAttribute('hidden','true');
        showClippingMessage = false;
    }

    if ((lowLevelReadings.length > 0) && lowLevelReadings.filter(function(isLowLevel){return isLowLevel;}).length / lowLevelReadings.length > .6) {
        [lowLevelMessage, audioLevelWrap].forEach(function(element) {
            element.removeAttribute('hidden');
        });

        if (!meterWrapWidth) {
            meterWrapWidth = document.getElementById('meterWrap').offsetWidth;
        }

        showLowLevelmessage = true;

        // Don't show both messages at once
        clippingMessage.setAttribute('hidden','true');
    }
    else {
        lowLevelMessage.setAttribute('hidden','true');
        showLowLevelmessage = false;
    }

    if (!showClippingMessage && !showLowLevelmessage) {
        audioLevelWrap.setAttribute('hidden','true');
    }

}


$(function () {
    if ($('#onboardingModal').length) {
        $('#onboardingModal').modal();
    }

    showInfo('info_start');

    //document.getElementById('final_span').innerHTML = window.localStorage.getItem("transcript");

    if ($('.caption-wrap-real').length) {
        $('.caption-wrap-real').scrollTop($('.caption-wrap-real')[0].scrollHeight);

        $('.caption-wrap-real').parents('.caption-wrap-row').css({'margin-bottom': $('#main-navbar').outerHeight()});
    }

    if ($('#final_span').length) {
        // $('#final_span').on('keyup', function (event) {
            // final_transcript = $('#final_span').text();
            //window.localStorage.setItem("transcript", final_transcript);
        // });
    }
});

$('#startButton').on('click', function(){
    // if recognition ends for some unknown reason (it likes to just stop)
    // and the button wasn't pressed, we will use this to check if that
    // happened and start it again
    startStopButtonLastPressedTime = (new Date()).getTime() / 1000;

    if (recognizing) {
        // Currently recognizing, so stop it.
        ga('send', 'event', 'user', 'stopButtonClick');
        recognition.stop();
        $('#startButton').text('Start Captioning');
        $('#audioLevelWrap').attr('hidden','true'); // hide any error messages
        clippingReadings = [];
        lowLevelReadings = [];
        return;
    }
    else {
        // Start recognition
        if (!recognition) {
            recognition = initRecognition();
        }

        ga('send', 'event', 'user', 'startButtonClick');
        $('#startButton').text('Stop');
        recognition.start();
        ignore_onend = false;
        interim_span.innerHTML = '';
        showInfo('info_allow');
    }
});

$('#saveTranscriptToFileButton').on('click', function() {
    ga('send', 'event', 'settings', 'saveTranscriptToFile');

    var a = document.createElement('a');
    a.href = 'data:text/plain;base64,' + btoa(document.getElementById('results').innerText);
    a.textContent = 'download';
    a.download = 'web-captioner-'+ moment().format('YYYY-MM-DD-HH-mm-ss') +'.txt';
    a.click();
});

// Init tooltips
$('[data-toggle="tooltip"]').tooltip();

$('#settingsDropdownContainer').on('show.bs.dropdown', function () {
    if (document.getElementById('results').innerText.length > 0) {
        // Transcription exists; show save option
        $('#saveTranscriptToFileButton').removeAttr('hidden');
        $('#saveTranscriptToFileDisabledButton').attr('hidden', true);
    }
    else {
        // No transcription yet; hide save option
        $('#saveTranscriptToFileButton').attr('hidden', true);
        $('#saveTranscriptToFileDisabledButton').removeAttr('hidden');
    }
});

$('#clearTranscriptButton').on('click', function() {
    ga('send', 'event', 'settings', 'clearTranscriptStart');
    $('#clearTranscriptModal').modal('show');
});

$('#clearTranscriptConfirmButton').on('click', function() {
    ga('send', 'event', 'settings', 'clearTranscriptConfirm');
    final_span.innerHTML = '';
});