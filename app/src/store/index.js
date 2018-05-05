import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import captioner from './modules/captioner'
import fontChocies from '../util/fontChoices'
import vuexPersist from 'vuex-persist'
import remoteMutationBlacklist from '../data/remoteMutationBlacklist'
import RemoteEventBus from '../components/RemoteEventBus'

Vue.use(Vuex)

let vuePersistPlugin = new vuexPersist({
  key: 'webcaptioner:settings',
  reducer: (state) => {
    return {
      settings: state.settings,
      version: state.version,
    };
  },
}).plugin;

let mutationInterceptorPlugin = store => {
  store.subscribe(({type, payload}, state) => {
    if (remoteMutationBlacklist.indexOf(type) === -1) {
      // This mutation type is not in the blacklist. Send it to remotely listening devices.
      RemoteEventBus.$emit('sendMutationToReceivers', {type, payload});
    }
  })
};

export function createStore () {
  return new Vuex.Store({
    modules: {
      captioner,
    },
    state: {
      version: '2.0.0',
      settings: {
        roomLeaderToken: null,
        controls: {
          layout: {
            larger: false,
          },
        },
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
      detached: false,
      remoteDisplays: [],
      remoteDisplayConnectIdNotFoundError: false,
      remoteDisplayConnectIdFoundMessage: false,
      connectId: null,
      memberOfRoomId: null,
      socket: {
        isConnected: false,
      },
    },
    actions,
    mutations,
    getters,
    plugins: [vuePersistPlugin, mutationInterceptorPlugin],
  })
}
