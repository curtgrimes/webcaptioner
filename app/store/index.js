import Vue from 'vue'
import Vuex from 'vuex'
import allActions from './actions'
import allMutations from './mutations'
import remoteMutationBlacklist from '~/mixins/data/remoteMutationBlacklist'
import RemoteEventBus from '~/mixins/RemoteEventBus'
import getSettingsState from './settingsState'

Vue.use(Vuex)

export const strict = false;

let mutationInterceptorPlugin = store => {
  store.subscribe(({type, payload}, state) => {
    if (remoteMutationBlacklist.indexOf(type) === -1) {
      // This mutation type is not in the blacklist. Send it to remotely listening devices.
      RemoteEventBus.$emit('sendMutationToReceivers', {mutation: type, payload});
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
      if (Date.now() < state.eventLog.onUntilStopTime) {
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
    }
  })
};

export const state = () => ({
  version: '2.0.0',
  settings: getSettingsState(),
  receivers: {
    share: {
      subscriberCount: 0,
    },
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
    storage: {
      sessionStartDate: null,
    },
    vmix: {
      showNotFullySetUpMessage: false,
      webControllerAddress: '',
      chromeExtensionInstalled: null,
      webControllerConnected: null,
      cachedInputGUID: null,
    },
    webhooks: {
      log: [],
    },
  },
  eventLog: {
    onUntilStopTime: null,
    log: [],
  },
  delayedEvents: [],
})

export const mutations = allMutations;
export const actions = allActions;
export const plugins = [mutationInterceptorPlugin];
