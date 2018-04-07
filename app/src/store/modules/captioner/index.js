import RecognitionResultParser from './RecognitionResultParser.js'
import internalWordReplacements from '../../../data/internalWordReplacements'
import censoredProfanity from '../../../data/profanity-en'
let speechRecognizer;

const state = {
    on: false,
    transcript: {
        interim: '',
        final: '',
    },
}

const actions = {
    start ({commit, state, rootState}) {
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

        speechRecognizer.onstart = function () {
            commit('SET_CAPTIONER_ON');
        };

        speechRecognizer.onend = function () {
            commit('SET_CAPTIONER_OFF');
        };

        speechRecognizer.onresult = function(event) {
            let {transcriptInterim, transcriptFinal} = parser.getTranscript(event);

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
        speechRecognizer.stop();
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
//   cartProducts (state, getters, rootState) {
//     return state.added.map(({ id, quantity }) => {
//       const product = rootState.products.all.find(p => p.id === id)
//       return {
//         title: product.title,
//         price: product.price,
//         id,
//         quantity
//       }
//     })
//   },
//   cartCount (state) {
//     var totalCount = 0
//     state.added.forEach(({ quantity }) => {
//       totalCount += quantity
//     })
//     return totalCount
//   }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}