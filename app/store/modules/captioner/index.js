import Vue from 'vue'
import RecognitionResultParser from './RecognitionResultParser.js'
import internalWordReplacements from '~/mixins/data/internalWordReplacements'
import censoredProfanity from '~/mixins/data/profanity-en'

const SILENT_RESTART_AFTER_NO_RESULTS_MS = (2 * 1000);
const SILENT_RESTART_WAIT_MS_AFTER_STARTING_CAPTIONING = (2.5 * 1000);

let speechRecognizer,
    keepAliveInterval,
    microphonePermissionNeededTimeout;

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
        lastStart: null,
        lastUpdate: null,
        waitingForInitial: false,
    },
    volume: {
        tooLow: false,
        tooHigh: false,
    },
}

const actions = {
    startManual ({commit, dispatch, state, rootState}) {
        if (state.typingModeOn) {
            dispatch('stopTypingMode');
        }

        if (rootState.incompatibleBrowser) {
            dispatch('SHOW_INCOMPATIBLE_BROWSER_MODAL', {}, { root: true });
        }
        else {
            commit('SET_SHOULD_BE_ON', { shouldBeOn: true });
            dispatch('start');
        }
    },
    start ({commit, state, rootState, getters, dispatch}) {
        let parser = new RecognitionResultParser({
            wordReplacements: [
                ...rootState.settings.wordReplacements,
                ...internalWordReplacements,

                // Add profanity
                {
                    from: censoredProfanity.join(','),
                    to: (rootState.settings.censor.replaceWith === 'nothing'
                        ? ''
                        : '******' // 'asterisks',
                    )
                },
            ],
        });

        speechRecognizer = new webkitSpeechRecognition();
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.lang = rootState.settings.locale.from;
        speechRecognizer.start();
        commit('SET_WAITING_FOR_INITIAL_TRANSCRIPT', { waitingForInitial: true });
        microphonePermissionNeededTimeout = setTimeout(() => {
            // If we get here and this timeout hasn't been canceled yet,
            // then we probably need to be granted permission to use the
            // microphone.
            commit('SET_MICROPHONE_PERMISSION_NEEDED', { microphonePermissionNeeded: true });
        }, 200);

        let self = this;

        speechRecognizer.onstart = function () {
            commit('SET_CAPTIONER_ON');

            clearTimeout(microphonePermissionNeededTimeout);
            
            if (state.microphonePermission.needed) {
                commit('SET_MICROPHONE_PERMISSION_NEEDED', { microphonePermissionNeeded: false });
            }

            if (!keepAliveInterval) {
                keepAliveInterval = setInterval(function() {
                    if (state.shouldBeOn) {
                        // Currently captioning
                        let now = Date.now();
                        
                        const timeSinceLastResult = now - state.transcript.lastUpdate;
                        const timeSinceLastStart = now - state.transcript.lastStart;
                        
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
            commit('SET_CAPTIONER_OFF');

            if (!state.shouldBeOn) {
                clearInterval(keepAliveInterval);
                keepAliveInterval = null;
            }
        };

        speechRecognizer.onresult = function(event) {
            let {transcriptInterim, transcriptFinal} = parser.getTranscript(event);
            
            // Set flag false once we're receiving a transcript
            // for the first time
            if (state.transcript.waitingForInitial) {
                commit('SET_WAITING_FOR_INITIAL_TRANSCRIPT', { waitingForInitial: false });
            }
            

            if (transcriptInterim) {
                commit('SET_TRANSCRIPT_INTERIM', { transcriptInterim, omitFromGoogleAnalytics: true, });
            }
            if (transcriptFinal) {
                // Clear the interim transcript because its content is now
                // returned in the final transcript
                commit('CLEAR_TRANSCRIPT_INTERIM', {omitFromGoogleAnalytics: true,});
                commit('APPEND_TRANSCRIPT_FINAL', { transcriptFinal, omitFromGoogleAnalytics: true, });
                
                dispatch('trackWordCount', { wordCount: transcriptFinal.split(' ').length });
            }
        };

        speechRecognizer.onerror = function(error) {
            clearTimeout(microphonePermissionNeededTimeout);
            // console.log('speechRecognizer error');
            // console.log(error);
            if (event.error == 'not-allowed') {
                commit('SET_CAPTIONER_OFF');
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

    stopManual ({commit, state, rootState}) {
        commit('SET_SHOULD_BE_ON', { shouldBeOn: false });
        commit('SET_WAITING_FOR_INITIAL_TRANSCRIPT', { waitingForInitial: false });

        if (speechRecognizer) {
            speechRecognizer.stop();
        }
    },

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
        state.transcript.lastStart = Date.now();
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
        state.transcript.interim = transcriptInterim;
        state.transcript.lastUpdate = Date.now();
    },
    SET_TRANSCRIPT_FINAL (state, { transcriptFinal }) {
        state.transcript.final = transcriptFinal;
        state.transcript.lastUpdate = Date.now();
    },
    SET_TRANSCRIPT_TYPED (state, { transcriptTyped }) {
        state.transcript.typed = transcriptTyped;
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
        if (state.transcript.final.length && state.transcript.final.charAt(state.transcript.final.length - 1) != ' ') {
            // Current final string is not empty and doesn't end in a 
            // space. Prepend a space to the incoming string.
            transcriptFinal = ' ' + transcriptFinal;
        }
        state.transcript.final += transcriptFinal;
        state.transcript.lastUpdate = Date.now();
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