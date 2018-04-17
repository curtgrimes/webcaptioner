import RecognitionResultParser from './RecognitionResultParser.js'
import internalWordReplacements from '../../../data/internalWordReplacements'
import censoredProfanity from '../../../data/profanity-en'
let speechRecognizer;

const state = {
    on: false,
    microphoneName: '',
    waitingForInitialTranscript: false,
    transcript: {
        interim: '',
        final: 'final:"work and in to memorize it but it so I just want to share some of us with you and just by telling you something about that book when its when fall starts off in that book he refers to himself as a server"        ',
    },
    volume: {
        tooLow: false,
        tooHigh: false,
    },
}

const actions = {
    start ({commit, state, rootState, getters}) {
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
        commit('SET_WAITING_FOR_INITIAL_TRANSCRIPT', { waitingForInitialTranscript: true });

        speechRecognizer.onstart = function () {
            commit('SET_CAPTIONER_ON');
        };

        speechRecognizer.onend = function () {
            commit('SET_CAPTIONER_OFF');
        };

        speechRecognizer.onresult = function(event) {
            let {transcriptInterim, transcriptFinal} = parser.getTranscript(event);
            
            // Set flag false once we're receiving a transcript
            // for the first time
            if (getters.waitingForInitialTranscript) {
                commit('SET_WAITING_FOR_INITIAL_TRANSCRIPT', { waitingForInitialTranscript: false });
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
    },

    stop ({commit, state, rootState}) {
        if (speechRecognizer) {
            speechRecognizer.stop();
        }
    },

    restart ({commit, state, rootState}) {
        if (speechRecognizer) {
            const restartSpeechRecognizer = function(event) {
                speechRecognizer.removeEventListener('end', restartSpeechRecognizer, false); // only do it once
                speechRecognizer.start();
            };
            speechRecognizer.addEventListener('end', restartSpeechRecognizer, false);
            speechRecognizer.abort();
        }
    },

  // The first argument is the vuex store, but we're using only the
  // dispatch function, which applies a mutation to the store,
  // and the current state of the store
//   checkout ({commit, state}, products) {
//     const savedCartItems = [...state.added]
//     commit('checkout_request')
//     shop.buyProducts(
//       products,
//       () => commit('checkout_successful'),
//       () => commit('checkout_failure', savedCartItems)
//     )
//   }
}

const mutations = {
    SET_CAPTIONER_ON (state) {
        state.on = true;
    },
    SET_CAPTIONER_OFF (state) {
        state.on = false;
    },
    SET_TRANSCRIPT_INTERIM (state, { transcriptInterim }) {
        state.transcript.interim = transcriptInterim;
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

    SET_WAITING_FOR_INITIAL_TRANSCRIPT (state, { waitingForInitialTranscript }) {
        state.waitingForInitialTranscript = waitingForInitialTranscript;
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
    waitingForInitialTranscript (state) {
    return state.waitingForInitialTranscript;
  }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}