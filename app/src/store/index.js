import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import captioner from './modules/captioner'
import fontChocies from '../util/fontChoices'
import vuexPersist from 'vuex-persist'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    modules: {
      captioner,
    },
    state: {
      version: '2.0.0',
      settings: {
        appearance: {
          text: {
            textColor: '#ffffff',
            textColorInterim: '#ffffff',
            fontFamily: fontChocies[0].displayName, // first is default
            textSize: "4", // em
            lineHeight: "1.2", // em
            letterSpacing: "0", // em
            textTransform: "uppercase", // or "capitalize" or "initial"
            alignment: {
              horizontal: 'full', // left, middle, right
              vertical: 'full', // top, middle, bottom, lowerThird
              padding: "0.25", // em
            }
          },
          shadow: {
            color: '#000000',
            opacity: '100',
            blurRadius: '0',
            offsetX: '0.25',
            offsetY: '0.25',
          },
          background: {
            color: '#000000',
          },
        },
        wordReplacements: [],
        censor: {
          on: true,
          replaceWith: 'nothing', // or 'asterisks'
        },
        locale: {
          from: null,
          userDefault: null,
        }
      },
      receivers: {
        chromecast: {
          connected: false,
          connecting: false,
          receiverName: null,
        },
      },
    },
    actions,
    mutations,
    getters,
    plugins: [new vuexPersist({
      key: 'webcaptioner:settings',
      reducer: (state) => {
        return {
          settings: state.settings,
          version: state.version,
        };
      },
    }).plugin],
  })
}
