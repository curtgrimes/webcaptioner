import RecognitionResultParser from './RecognitionResultParser.js'
import internalWordReplacements from '../../../data/internalWordReplacements'
import censoredProfanity from '../../../data/profanity-en'

const SILENT_RESTART_AFTER_NO_RESULTS_MS = (2 * 1000);
const SILENT_RESTART_WAIT_MS_AFTER_STARTING_CAPTIONING = (2.5 * 1000);

let speechRecognizer,
    keepAliveInterval;

const state = {
    on: false,
    shouldBeOn: false,
    silentRestart: false,
    microphoneName: '',
    transcript: {
        interim: '',
        final: 'final:"work and in to memorize it but it so I just want to share some of us with you and just by telling you something about that book when its when fall starts off in that book he refers to himself as a server"        ',
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
    startManual ({commit, dispatch}) {
        commit('SET_SHOULD_BE_ON', { shouldBeOn: true });
        dispatch('start');
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

        let self = this;

        speechRecognizer.onstart = function () {
            commit('SET_CAPTIONER_ON');

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
                commit('SET_TRANSCRIPT_INTERIM', { transcriptInterim });
            }
            if (transcriptFinal) {
                // Clear the interim transcript because its content is now
                // returned in the final transcript
                commit('CLEAR_TRANSCRIPT_INTERIM');
                commit('APPEND_TRANSCRIPT_FINAL', { transcriptFinal });
            }
        };

        speechRecognizer.onerror = function(error) {
            // console.log('speechRecognizer error');
            // console.log(error);
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
    SET_TRANSCRIPT_INTERIM (state, { transcriptInterim }) {
        state.transcript.interim = transcriptInterim;
        state.transcript.lastUpdate = Date.now();
    },
    CLEAR_TRANSCRIPT (state) {
        state.transcript.interim = '';
        state.transcript.final = '';
    },
    CLEAR_TRANSCRIPT_INTERIM (state) {
        state.transcript.interim = '';
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
    
//   add_to_cart (state, productId) {
//     state.lastCheckout = null
//     const record = state.added.find(p => p.id === productId)
//     if (!record) {
//       state.added.push({
//         id: productId,
//         quantity: 1
//       })
//     } else {
//       record.quantity++
//     }
//   },
//   checkout_request (state) {
//     // clear cart
//     state.added = []
//     state.lastCheckout = null
//   },
//   checkout_successful (state) {
//     state.lastCheckout = 'successful'
//   },
//   checkout_failure (state, savedCartItems) {
//     // rollback to the cart saved before sending the request
//     state.added = savedCartItems
//     state.lastCheckout = 'failed'
//   }
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