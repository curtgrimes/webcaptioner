import Vue from 'vue'
import internalWordReplacements from '~/mixins/data/internalWordReplacements'
import censoredProfanity from '~/mixins/data/profanity-en'
import profanityUncensor from '~/mixins/data/profanity-uncensor-en'
import escapeRegExp from 'lodash.escaperegexp'

const SILENT_RESTART_AFTER_NO_RESULTS_MS = (2 * 1000);
const SILENT_RESTART_WAIT_MS_AFTER_STARTING_CAPTIONING = (2.5 * 1000);

let speechRecognizer,
    keepAliveInterval,
    demoInterval,
    microphonePermissionNeededTimeout,
    lastManualStart,
    cursorInterval;

const state = {
    on: false,
    shouldBeOn: false,
    typingModeOn: false,
    microphonePermission: {
        needed: false,
        denied: false,
    },
    silentRestart: false,
    microphoneName: '',
    transcript: {
        interim: '',
        final: '',
        typed: '',
        waitingForInitial: false,
        delay: 0,
        cursorable: [],
        stabilized: '',
    },
    totalCaptioningSeconds: 0,
    lastStart: null,
    lastUpdate: null,
    volume: {
        tooLow: false,
        tooHigh: false,
    },
    wordReplacements: [],
}

function getTranscriptsFromRecognitionEvent(event) {
    let transcriptInterim = '', transcriptFinal = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            transcriptFinal += event.results[i][0].transcript;
        } else {
            transcriptInterim += event.results[i][0].transcript;
        }
    }

    return {transcriptInterim, transcriptFinal};
}

function makeWordReplacements(text, wordReplacements) {
    let replacedText = text;

    for (let i = 0; i < wordReplacements.length; i++) {
        // $1 and $3 are the leading and trailing whitespace, if any
        replacedText = replacedText.replace(wordReplacements[i].fromRegex, '$1' + wordReplacements[i].to + '$3');
    }
    
    return replacedText;
}

function getPhraseWithTimings({newPhrase = '', previousPhraseWithTimings}) {
    let newPhraseSplitByWord = newPhrase.trim().split(' ');
    let firstSeen = Date.now();
    let newPhraseWithTimings = previousPhraseWithTimings;

    for (let i = 0, length = newPhraseSplitByWord.length; i < length; i++) {
        if (
            // nothing exists at this index yet in our previous phrase with timings
            typeof newPhraseWithTimings[i] === 'undefined' 
            || (
                // or a word exists in previous phrase and it doesn't match this new incoming word
                newPhraseWithTimings[i].word
                && newPhraseWithTimings[i].word !== newPhraseSplitByWord[i]
                && !newPhraseWithTimings[i].stable // and the word wasn't already stable
            )
        ) {
            // Set the word in our stabilized array with new timing
            newPhraseWithTimings[i] = {
                word: newPhraseSplitByWord[i],
                firstSeen,
                stable: false,
            }
        }
    }

    if (previousPhraseWithTimings.length > newPhraseSplitByWord.length) {
        let lengthDifference = previousPhraseWithTimings.length - newPhraseSplitByWord.length;
        // Remove "lengthDifference" amount from the end of the array (by multiplying by -1)
        newPhraseWithTimings.splice(lengthDifference * -1);
    }

    return newPhraseWithTimings;
}

const actions = {
    startManual ({commit, dispatch, state, rootState}) {
        lastManualStart = Date.now();

        if (state.typingModeOn) {
            dispatch('stopTypingMode');
        }

        if (rootState.incompatibleBrowser) {
            dispatch('SHOW_INCOMPATIBLE_BROWSER_MODAL', {}, { root: true });
        }
        else if (rootState.settings.exp.includes('demo')) {
            commit('SET_SHOULD_BE_ON', { shouldBeOn: true });
            dispatch('startDemo');
        }
        else {
            commit('SET_SHOULD_BE_ON', { shouldBeOn: true });
            dispatch('start');
        }

        commit('INIT_STORAGE_SESSION_DATE', null, {root:true});
    },
    start ({commit, state, rootState, getters, dispatch}) {
        dispatch('loadWordReplacements');

        speechRecognizer = new webkitSpeechRecognition();
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.lang = rootState.settings.locale.from;
        try {
            speechRecognizer.start();
        }
        catch (e) {}
        commit('SET_WAITING_FOR_INITIAL_TRANSCRIPT', { waitingForInitial: true });
        microphonePermissionNeededTimeout = setTimeout(() => {
            // If we get here and this timeout hasn't been canceled yet,
            // then we probably need to be granted permission to use the
            // microphone.
            commit('SET_MICROPHONE_PERMISSION_NEEDED', { microphonePermissionNeeded: true });
        }, 200);

        let self = this;

        speechRecognizer.onstart = function () {
            commit('SET_CAPTIONER_ON', {omitFromGoogleAnalytics: true});

            clearTimeout(microphonePermissionNeededTimeout);
            
            if (state.microphonePermission.needed) {
                commit('SET_MICROPHONE_PERMISSION_NEEDED', { microphonePermissionNeeded: false });
            }

            if (!keepAliveInterval) {
                keepAliveInterval = setInterval(function() {
                    if (state.shouldBeOn) {
                        // Currently captioning
                        let now = Date.now();
                        
                        const timeSinceLastResult = now - state.lastUpdate;
                        const timeSinceLastStart = now - state.lastStart;
                        
                        if (timeSinceLastResult >= SILENT_RESTART_AFTER_NO_RESULTS_MS
                            && timeSinceLastStart > SILENT_RESTART_WAIT_MS_AFTER_STARTING_CAPTIONING
                            // && !state.transcript.waitingForInitial
                            && (!state.volume.tooLow || timeSinceLastResult > SILENT_RESTART_AFTER_NO_RESULTS_MS)
                            && (!state.volume.tooHigh || timeSinceLastResult > SILENT_RESTART_AFTER_NO_RESULTS_MS)
                        ) {
                            if (!state.silentRestart) {
                                commit('SET_SILENT_RESTART_ON');
                            }
                            dispatch('restart');
                        }
        
                    }
                },1000);
            }
        };

        speechRecognizer.onend = function (e) {
            commit('SET_CAPTIONER_OFF', {omitFromGoogleAnalytics: true});

            if (!state.shouldBeOn) {
                clearInterval(keepAliveInterval);
                keepAliveInterval = null;
            }
        };

        speechRecognizer.onresult = function(event) {
            if (state.transcript.waitingForInitial) {
                // Set flag false once we're receiving a transcript for the first time
                commit('SET_WAITING_FOR_INITIAL_TRANSCRIPT', { waitingForInitial: false });
            }

            let {transcriptInterim, transcriptFinal} = getTranscriptsFromRecognitionEvent(event);

            if (transcriptInterim) {
                transcriptInterim = makeWordReplacements(transcriptInterim, state.wordReplacements);
                commit('SET_TRANSCRIPT_INTERIM', { transcriptInterim, omitFromGoogleAnalytics: true, });
                commit('SET_TRANSCRIPT_CURSORABLE', {
                    transcript: transcriptInterim,
                    omitFromGoogleAnalytics: true,
                });

                dispatch('cursorThroughTranscript');
            }
            if (transcriptFinal) {
                transcriptFinal = makeWordReplacements(transcriptFinal, state.wordReplacements);

                // Clear the interim transcript because its content is now
                // returned in the final transcript
                commit('CLEAR_TRANSCRIPT_INTERIM', {omitFromGoogleAnalytics: true,});
                commit('APPEND_TRANSCRIPT_FINAL', { transcriptFinal, omitFromGoogleAnalytics: true, });
                commit('SET_TRANSCRIPT_CURSORABLE', {
                    transcript: transcriptFinal,
                    isFinal: true,
                    omitFromGoogleAnalytics: true,
                });

                // TODO: batch these
                dispatch('trackWordCount', { wordCount: transcriptFinal.split(' ').length });
            }
        };

        speechRecognizer.onerror = function(error) {
            clearTimeout(microphonePermissionNeededTimeout);

            if (event.error == 'not-allowed') {
                commit('SET_CAPTIONER_OFF', {omitFromGoogleAnalytics: true});
                commit('SET_SHOULD_BE_ON', { shouldBeOn: false });
                commit('SET_WAITING_FOR_INITIAL_TRANSCRIPT', { waitingForInitial: false });
                commit('SET_MICROPHONE_PERMISSION_DENIED', { microphonePermissionDenied: true });
                setTimeout(() => {
                    // Modal appears only by setting it true for a moment.
                    commit('SET_MICROPHONE_PERMISSION_DENIED', { microphonePermissionDenied: false });
                },1000);
            }
        };      
    },

    async startDemo ({}) {
        const demoTimings = await this.$axios.$get('/static/demo-transcript.json');

        let startPlaybackTime = Date.now();
        let lastPlayedIndex = 0;
        let playDemoTimings = () => {
            var currentPlaybackTime = Date.now() - startPlaybackTime;
            
            if (!demoTimings[lastPlayedIndex]) {
                // Demo finished. Restart it
                clearInterval(demoInterval);
                setTimeout(() => {
                    lastPlayedIndex = 0;
                    startPlaybackTime = Date.now() + 1000;
        
                    demoInterval = setInterval(playDemoTimings, 100);
                }, 700);
    
                return;
            }
    
            for (; demoTimings[lastPlayedIndex] && demoTimings[lastPlayedIndex].t < currentPlaybackTime; lastPlayedIndex++) {
                if (demoTimings[lastPlayedIndex].iText) {
                    this.commit('captioner/SET_TRANSCRIPT_INTERIM', {
                        transcriptInterim: demoTimings[lastPlayedIndex].iText,
                        omitFromGoogleAnalytics: true,
                    });
                }
                else if (demoTimings[lastPlayedIndex].fText) {
                    this.commit('captioner/CLEAR_TRANSCRIPT_INTERIM', {omitFromGoogleAnalytics: true,});
                    this.commit('captioner/APPEND_TRANSCRIPT_FINAL', {
                        transcriptFinal: demoTimings[lastPlayedIndex].fText,
                        omitFromGoogleAnalytics: true,
                    });
                }
            }
        }

        demoInterval = setInterval(playDemoTimings, 100);
    },

    stopManual ({commit, state, dispatch, rootState}) {
        commit('SET_SHOULD_BE_ON', { shouldBeOn: false });
        commit('SET_WAITING_FOR_INITIAL_TRANSCRIPT', { waitingForInitial: false });
        
        if (speechRecognizer) {
            speechRecognizer.stop();
        }
        else if (demoInterval) {
            // Demo was running
            clearInterval(demoInterval);
        }

        state.totalCaptioningSeconds += (Date.now() - lastManualStart)/1000;
        dispatch('donation/SHOW_DONATION_MESSAGE_IF_ELIGIBLE', null, {root:true});
    },


    // Fast restart if possible
    restart ({commit, state, rootState, dispatch}) {
        if (state.transcript.interim) {
            commit('APPEND_TRANSCRIPT_FINAL', { transcriptFinal: state.transcript.interim });
            commit('CLEAR_TRANSCRIPT_INTERIM');

            dispatch('trackWordCount', { wordCount: state.transcript.interim.split(' ').length });
        }

        if (speechRecognizer && state.on) {
            const restartSpeechRecognizer = function(event) {
                speechRecognizer.removeEventListener('end', restartSpeechRecognizer, false); // only do it once
                speechRecognizer.start();
            };
            speechRecognizer.addEventListener('end', restartSpeechRecognizer, false);
            speechRecognizer.abort();
        }
        else {
            // Need to init speechRecognizer again for some reason
            dispatch('start');
        }
    },

    cursorThroughTranscript({state, commit}) {
        // word must be unchaged for this many MS before being considered stable
        let stabilizedThresholdMs = 2500;
        
        if (!cursorInterval) {
            cursorInterval = setInterval(() => {
                const now = Date.now();

                phraseLoop:
                    for (let i = 0; i < state.transcript.cursorable.length; i++) {
                        for (let j = 0; j < state.transcript.cursorable[i].length; j++) {
                            if (state.transcript.cursorable[i][j].stable) {
                                continue;
                            }

                            if (now > (state.transcript.cursorable[i][j].firstSeen + stabilizedThresholdMs)) {
                                // This word is stable
                                Vue.set(state.transcript.cursorable[i][j], 'stable', true);
                                commit('APPEND_TRANSCRIPT_STABILIZED', {
                                    transcript: state.transcript.cursorable[i][j].word,
                                });
                            }
                            else {
                                // End checking. We only want to mark consecutive words as stabilized,
                                // and if this word isn't stable, none of the words after it should be deemed
                                // stable yet.
                                break phraseLoop;
                            }
                        }
                    }
            }, 300);
        }
    },

    loadWordReplacements({commit, state, rootState, dispatch}) {
        state.wordReplacements = [
            ...rootState.settings.wordReplacements,
            ...internalWordReplacements,

            ...(rootState.settings.on
                // Add profanity censor
                ? [{
                    from: censoredProfanity.join(','),
                    to: (rootState.settings.censor.replaceWith === 'nothing'
                        ? ''
                        : '******' // 'asterisks',
                    )
                }]
                // Apply a heuristic to attempt to fully uncensor speech
                : profanityUncensor
            ),
        ];

        // Generate regex
        state.wordReplacements = state.wordReplacements.map((replacement) => {
            let fromReplacementSplit = (replacement.from || '').split(',');
            fromReplacementSplit = fromReplacementSplit.map((fromString) => {
                return escapeRegExp(fromString);
            });
            
            replacement.fromRegex = new RegExp('(^|\\b|\\s)(' + fromReplacementSplit.join('|') + ')(\\b|\\s|$)', 'gi');
            return replacement;
        });
    },

    trackWordCount ({}, {wordCount}) {
        if (wordCount > 0) {
            Vue.$ga.event({
                eventCategory: 'recognition',
                eventAction: 'recognizingSpeech',
                eventLabel: 'wordCount:' + wordCount,
              });
        }
    },

    startTypingMode: ({state, commit, dispatch}) => {
      dispatch('stopManual');
      setTimeout(() => {
        commit('SET_TRANSCRIPT_TYPED', {transcriptTyped: state.transcript.final});
        commit('CLEAR_TRANSCRIPT_FINAL');
        commit('SET_TYPING_MODE_ON');
      },500);
    },

    stopTypingMode: ({state, commit, dispatch}) => {
        commit('APPEND_TRANSCRIPT_FINAL', {transcriptFinal: state.transcript.typed });
        commit('CLEAR_TRANSCRIPT_TYPED');
        commit('SET_TYPING_MODE_OFF');
    },
}

const mutations = {
    SET_CAPTIONER_ON (state) {
        state.on = true;
        state.lastStart = Date.now();
    },
    SET_SHOULD_BE_ON (state, { shouldBeOn }) {
        state.shouldBeOn = shouldBeOn;
    },
    SET_CAPTIONER_OFF (state) {
        state.on = false;
    },
    SET_SILENT_RESTART_ON (state) {
        state.silentRestart = true;
    },
    SET_SILENT_RESTART_OFF (state) {
        state.silentRestart = false;
    },
    SET_MICROPHONE_PERMISSION_NEEDED (state, { microphonePermissionNeeded }) {
        state.microphonePermission.needed = microphonePermissionNeeded;
    },
    SET_MICROPHONE_PERMISSION_DENIED (state, { microphonePermissionDenied }) {
        state.microphonePermission.denied = microphonePermissionDenied;
    },
    SET_TRANSCRIPT_INTERIM (state, { transcriptInterim }) {
        let shouldPrependSpace =
            state.transcript.final !== '' // final string isn't empty
            && [' ', '\n'].indexOf(state.transcript.final.substr(-1, 1)) === -1 // final doesn't end with a space or newline
            && [' ', '\n'].indexOf(transcriptInterim.substr(0, 1)) === -1; // interim didn't come in starting with its own space or newline
        
        state.transcript.interim = (shouldPrependSpace ? ' ' : '') + transcriptInterim;
        state.lastUpdate = Date.now();
    },
    SET_TRANSCRIPT_CURSORABLE (state, { transcript, isFinal = false }) {
        // let currentPhraseIndex = state.transcript.cursorable.find((phrase) => {
        //     return !phrase.complete
        // });
        
        // let previousPhraseWithTimings = state.transcript.cursorable[0];
        let previousPhraseWithTimings = state.transcript.cursorable[0] ? state.transcript.cursorable[0] : [];

        if (!state.transcript.cursorable.length) {
            // First run; init first phrase
            state.transcript.cursorable.push([]);
        }

        const lastIndex = state.transcript.cursorable.length - 1;
        
        state.transcript.cursorable[lastIndex] = getPhraseWithTimings({
            newPhrase: transcript,
            previousPhraseWithTimings: state.transcript.cursorable[lastIndex],
        });

        if (isFinal) {
            // Start a new phrase
            state.transcript.cursorable.push([]);

            function phraseIsCompletelyStable(phrase) {
                return phrase.length && !phrase.some((word) => { return !word.stable });
            }

            // Clean up any past phrases
            let lastCompletelyStablePhraseIndex = -1;

            for (let i = 0; i < state.transcript.cursorable.length; i++) {
                if (phraseIsCompletelyStable(state.transcript.cursorable[i])) {
                    lastCompletelyStablePhraseIndex = i;
                }
                else {
                    break;
                }
            }

            if (lastCompletelyStablePhraseIndex >= 0) {
                state.transcript.cursorable = state.transcript.cursorable.splice(lastCompletelyStablePhraseIndex + 1);
            }
        }
    },
    SET_TRANSCRIPT_FINAL (state, { transcriptFinal }) {
        state.transcript.final = transcriptFinal;
        state.lastUpdate = Date.now();
    },
    SET_TRANSCRIPT_TYPED (state, { transcriptTyped }) {
        // The contenteditable seems to always add a newline at the end. We don't want that.
        let removedLastNewline = transcriptTyped.substr(-1, 1) === '\n' ? transcriptTyped.substr(0, transcriptTyped.length -1) : transcriptTyped;
        state.transcript.typed = removedLastNewline;
    },
    SET_TRANSCRIPT_DELAY (state, { delay }) {
        state.transcript.delay = delay; // ms
    },
    CLEAR_TRANSCRIPT (state) {
        state.transcript.interim = '';
        state.transcript.final = '';
        state.transcript.typed = '';
    },
    CLEAR_TRANSCRIPT_INTERIM (state) {
        state.transcript.interim = '';
    },
    CLEAR_TRANSCRIPT_FINAL (state) {
        state.transcript.final = '';
    },
    CLEAR_TRANSCRIPT_TYPED (state) {
        state.transcript.typed = '';
    },
    APPEND_TRANSCRIPT_FINAL (state, { transcriptFinal }) {
        let shouldPrependSpace =
            state.transcript.final !== '' // Existing final string isn't empty
            && [' ', '\n'].indexOf(state.transcript.final.substr(-1, 1)) === -1 // Existing final string doesn't end with a space or newline
            && [' ', '\n'].indexOf(transcriptFinal.substr(0, 1)) === -1; // Incoming final string doesn't start with its own space or newline
        state.transcript.final += (shouldPrependSpace ? ' ' : '') + transcriptFinal;
        state.lastUpdate = Date.now();
    },
    APPEND_TRANSCRIPT_STABILIZED (state, { transcript }) {
        state.transcript.stabilized += transcript + ' ';
    },

    VOLUME_TOO_LOW (state, { volumeTooLow }) {
        state.volume.tooLow = volumeTooLow;
    },
    VOLUME_TOO_HIGH (state, { volumeTooHigh }) {
        state.volume.tooHigh = volumeTooHigh;
    },

    SET_MICROPHONE_NAME (state, { microphoneName }) {
        state.microphoneName = microphoneName;
    },

    SET_WAITING_FOR_INITIAL_TRANSCRIPT (state, { waitingForInitial }) {
        state.transcript.waitingForInitial = waitingForInitial;
    },

    SET_TYPING_MODE_ON (state) {
        state.typingModeOn = true;
    },

    SET_TYPING_MODE_OFF (state) {
        state.typingModeOn = false;
    },
}

const getters = {
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}