import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import captioner from './modules/captioner'
import fontChocies from '~/mixins/data/fontChoices'
import remoteMutationBlacklist from '~/mixins/data/remoteMutationBlacklist'
import RemoteEventBus from '~/mixins/remoteEventBus'

Vue.use(Vuex)

let mutationInterceptorPlugin = store => {
  store.subscribe(({type, payload}, state) => {
    if (remoteMutationBlacklist.indexOf(type) === -1) {
      // This mutation type is not in the blacklist. Send it to remotely listening devices.
      RemoteEventBus.$emit('sendMutationToReceivers', {type, payload});
    }

    function shouldTrackMutation(type, payload) {
      return ((payload && !payload.omitFromGoogleAnalytics) || !payload)
        && !type.includes('route/');
    }

    // Track mutations with Google Analytics
    if (shouldTrackMutation(type, payload)) {
      let eventLabel;

      if (payload) {
        // Use the first value of the payload
        eventLabel = payload[Object.keys(payload)[0]] ? payload[Object.keys(payload)[0]].toString() : null;
      }
      
      if (Vue.$ga && Vue.$ga.event) {
        Vue.$ga.event({
          eventCategory: 'captioner',
          eventAction: type,
          eventLabel,
        });
      }

    }

    if (type !== 'APPEND_EVENT_LOG') { // prevent loop
      store.commit('APPEND_EVENT_LOG', {
        event: {
          event: 'mutation',
          type,
          payload: type === 'route/ROUTE_CHANGED'
                    ? {
                      from: payload.from.path,
                      to: payload.to.path,
                    }
                    : payload,
        },
        omitFromGoogleAnalytics: true,
      });
    }
  })
};

const createStore = () => {
  return new Vuex.Store({
    modules: {
      captioner,
    },
    state: {
      version: '2.0.0',
      settings: {
        roomMembershipId: null,
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
        },
        integrations: {
          vmix: {
            on: false,
            webControllerAddress: '',
          },
        },
        lastWhatsNewVersionSeen: '',
        exp: [],
      },
      receivers: {
        chromecast: {
          connected: false,
          connecting: false,
          receiverName: null,
        },
      },
      incompatibleBrowser: false,
      incompatibleBrowserModalVisible: false,
      detached: false,
      remoteDisplays: [],
      remoteDisplayConnectIdNotFoundError: false,
      remoteDisplayConnectIdFoundMessage: false,
      connectId: null,
      memberOfRoomId: null,
      socket: {
        isConnected: false,
      },
      settingsPageTitle: '',
      integrations: {
        vmix: {
          showNotFullySetUpMessage: false,
          webControllerAddress: '',
          chromeExtensionInstalled: null,
          webControllerConnected: null,
          cachedInputGUID: null,
        },
      },
      eventLog: {
        onUntilStopTime: null,
        log: [],
      },
    },
    actions,
    mutations,
    getters,
    plugins: [mutationInterceptorPlugin],
  })
}

export default createStore
