var playbackTimingsInterval;
(function(){
    var heroAudioPlaybackOffsetSeconds = 0.7;
    function hide(element) {
        element.setAttribute('hidden', true);
    }

    function show(element) {
        element.removeAttribute('hidden');
    }


    var videoCache = [];
    var loadLoopingVideo = function(options) {

        var buildBlobURL, loopBlobURL;

        if (getFromVideoCache(options.loopVideoPath)) {
            loopBlobURL = getFromVideoCache(options.loopVideoPath);
            runHeroSequence();
        }
        else {
            fetch(options.loopVideoPath).then(function(response) {
                return response.blob();
            })
            .then(function(blob) {
                loopBlobURL = URL.createObjectURL(blob);
                addToVideoCache(options.loopVideoPath, loopBlobURL);
                runHeroSequence();
            });
        }

        if (getFromVideoCache(options.buildVideoPath)) {
            buildBlobURL = getFromVideoCache(options.buildVideoPath);
            runHeroSequence();
        }
        else {
            fetch(options.buildVideoPath).then(function(response) {
                return response.blob();
            })
            .then(function(blob) {
                buildBlobURL = URL.createObjectURL(blob);
                addToVideoCache(options.buildVideoPath, buildBlobURL);
                runHeroSequence();
            });
        }

        function runHeroSequence() {
            if (buildBlobURL && loopBlobURL) {
                var heroBuildVideo = options.buildElement;
                var heroLoopVideo = options.loopElement;
    
                heroBuildVideo.src = buildBlobURL;
                heroLoopVideo.src = loopBlobURL;
    
                heroBuildVideo.removeAttribute('hidden');
                heroLoopVideo.setAttribute('hidden', true);
                heroBuildVideo.play();
                heroBuildVideo.onended = function(e) {
                    heroLoopVideo.play();
                    heroLoopVideo.removeAttribute('hidden');
                    heroBuildVideo.setAttribute('hidden', true);
                }
            }
        }

        function addToVideoCache(videoPath, cachePath) {
            videoCache[videoPath] = cachePath;
        }

        function getFromVideoCache(videoPath) {
            return videoCache[videoPath];
        }
    };

    // loadLoopingVideo({
    //     loopElement: document.getElementById('video-hero-loop'),
    //     buildElement: document.getElementById('video-hero-build'),
    //     loopVideoPath: "/static/hero-loop-xl.mp4",
    //     buildVideoPath: "/static/hero-build-xl.mp4"
    // });

    // Lazy load videos
    var imageObserver = new IntersectionObserver(function(intersections) {
            intersections.forEach(function(intersection) {
                if (intersection.isIntersecting) {
                    if (intersection.target.tagName === 'VIDEO') {
                        var video = intersection.target;
                        var sources = video.getElementsByTagName('source');
                        for (var i = 0; i < sources.length; i++) {
                            sources[i].setAttribute('src', sources[i].dataset.src);
                        }
                        video.load();
                    }
                    else if (intersection.target.classList.contains('video-with-build')) {
                        var buildVideo = intersection.target.getElementsByClassName('video-build')[0];
                        var loopVideo = intersection.target.getElementsByClassName('video-loop')[0];

                        loadLoopingVideo({
                            loopElement: loopVideo,
                            buildElement: buildVideo,
                            loopVideoPath: loopVideo.dataset.src,
                            buildVideoPath: buildVideo.dataset.src
                        });
                    }
                }
            });
        },
        {
            rootMargin: '50px 0px'
    });

    var images = document.querySelectorAll('.load-on-visibility');
    for (var i = 0; i < images.length; ++i) {
        imageObserver.observe(images[i]);
    }






    var timings;
    var heroAudio = document.createElement('audio');
    // Hero example timings
    fetch('/home/static/hero-transcript-price-is-right.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            timings = json;
            if (!waitingForAudioToLoad) {
                playbackTimingsInterval = setInterval(playbackTimings, 100);
            }
            heroAudio.src = '/static/hero-demo-audio-1.mp3';
            heroAudio.type = 'audio/mp3';
            heroAudio.preload = 'auto';
        });;

    var heroInterimCaptionPlaceholder = document.getElementById('hero-interim');
    var heroFinalCaptionPlaceholder = document.getElementById('hero-final');

    var startPlaybackTime = Date.now();
    var lastPlayedIndex = 0;
    window.currentPlaybackTimeSeconds = 0;
    function playbackTimings() {
        var currentPlaybackTime = Date.now() - startPlaybackTime;
        window.currentPlaybackTimeSeconds = currentPlaybackTime / 1000;
        
        if (!timings[lastPlayedIndex]) {
            // Demo finished. Restart it
            clearInterval(playbackTimingsInterval);
            setTimeout(function(){
                if (heroAudio.currentTime > 0) {
                    // Audio was already playing in a previous run. Restart it.
                    heroAudio.currentTime = 0;
                    heroAudio.play();
                }
                lastPlayedIndex = 0;
                startPlaybackTime = Date.now() + (1000 * heroAudioPlaybackOffsetSeconds);
    
                heroInterimCaptionPlaceholder.innerText = '';
                heroFinalCaptionPlaceholder.innerText = '';

                playbackTimingsInterval = setInterval(playbackTimings, 100);
            },700);

            return;
        }

        for (; timings[lastPlayedIndex] && timings[lastPlayedIndex].t < currentPlaybackTime; lastPlayedIndex++) {
            if (timings[lastPlayedIndex].iText) {
                // Interim text
                heroInterimCaptionPlaceholder.innerText = timings[lastPlayedIndex].iText;
            }
            else if (timings[lastPlayedIndex].fText) {
                // Final text
                heroInterimCaptionPlaceholder.innerText = '';
                heroFinalCaptionPlaceholder.insertAdjacentText('beforeend', timings[lastPlayedIndex].fText + ' ');
            }
        }

        var captionWrap = document.getElementById('hero-caption-demo');
        captionWrap.scrollTop = captionWrap.scrollHeight;
    }

    document.getElementById('stop-hero-demo-button').addEventListener('click', function() {
        heroAudio.pause();
        if (playbackTimingsInterval) {
            clearInterval(playbackTimingsInterval);
        }
        hide(document.getElementById('stop-hero-demo-button-wrap'));
        show(document.getElementById('start-hero-demo-button-wrap'));
    });

    document.getElementById('start-hero-demo-button').addEventListener('click', function() {
        heroAudio.play();
        startPlaybackTime = Date.now() - (heroAudio.currentTime * 1000) + (1000 * heroAudioPlaybackOffsetSeconds);

        playbackTimingsInterval = setInterval(playbackTimings, 100);
        
        hide(document.getElementById('start-hero-demo-button-wrap'));
        show(document.getElementById('stop-hero-demo-button-wrap'));
    });

    var waitingForAudioToLoad = false;
    var initialExpand = false;
    document.getElementById('expand-hero-demo-controls-wrap').addEventListener('click', function() {
        ga('send', 'event', 'main-page-hero-demo', 'start');
        document.getElementById('hero-caption-demo').classList.add('expanded');
        waitingForAudioToLoad = true;
        initialExpand = true;
        clearInterval(playbackTimingsInterval); // Stop text temporarily until audio is loaded at the correct position
        heroAudio.volume = 0.5; // default also set in HTML on range element
        heroAudio.play();

        heroAudio.addEventListener('playing', function() {
            if (initialExpand) {
                clearInterval(playbackTimingsInterval);
                heroInterimCaptionPlaceholder.innerText = '';
                heroFinalCaptionPlaceholder.innerText = '';
                startPlaybackTime = Date.now() + (1000 * heroAudioPlaybackOffsetSeconds);
                lastPlayedIndex = 0;
                window.currentPlaybackTimeSeconds = 0;
                playbackTimingsInterval = setInterval(playbackTimings, 100);
                initialExpand = false;
            }
        });

        show(document.getElementById('hero-demo-controls'));
        hide(document.getElementById('expand-hero-demo-controls-wrap'));
    });

    document.getElementById('toggle-mute-on-button').addEventListener('click', function() {
        toggleMute(true);
    });

    document.getElementById('toggle-mute-off-button').addEventListener('click', function() {
        toggleMute(false);
    });

    ['input', 'change'].forEach(function(e) {
        document.getElementById('hero-volume-control').addEventListener(e, function() {
            if (heroAudio.muted) {
                toggleMute(false, true);
            }
        
            heroAudio.volume = document.getElementById('hero-volume-control').value;
        });
    });


    function toggleMute(turnMuteOn, dontSetVolume) {
        var toggleOnButton = document.getElementById('hero-mute-toggle-on');
        var toggleOffButton = document.getElementById('hero-mute-toggle-off');
        var volumeControl = document.getElementById('hero-volume-control');
        heroAudio.muted = turnMuteOn;
    
        if (turnMuteOn) {
            hide(toggleOnButton);
            show(toggleOffButton);
            if (!dontSetVolume) {
                volumeControl.value = 0;
            }
        }
        else {
            hide(toggleOffButton);
            show(toggleOnButton);
            if (!dontSetVolume) {
                volumeControl.value = heroAudio.volume;
            }
        }
        
    }

})();
