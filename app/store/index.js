import Vue from 'vue';
import Vuex from 'vuex';
import allActions from './actions';
import allMutations from './mutations';
import remoteMutationBlacklist from '~/mixins/data/remoteMutationBlacklist';
import RemoteEventBus from '~/mixins/RemoteEventBus';
import getSettingsState from './settingsState';

Vue.use(Vuex);

export const strict = false;

let mutationInterceptorPlugin = (store) => {
  store.subscribe(({ type, payload }, state) => {
    if (remoteMutationBlacklist.indexOf(type) === -1) {
      // This mutation type is not in the blacklist. Send it to remotely listening devices.
      RemoteEventBus.$emit('sendMutationToReceivers', {
        mutation: type,
        payload,
      });
    }

    function shouldTrackMutation(type, payload) {
      const ignoredMutationTypes = [
        'SOCKET_ONOPEN',
        'SOCKET_ONCLOSE',
        'SOCKET_RECONNECT',
        'captioner/APPEND_TRANSCRIPT_STABILIZED',
        'captioner/APPEND_TRANSCRIPT_FINAL',
        'captioner/CLEAR_TRANSCRIPT_INTERIM',
        'captioner/SET_WAITING_FOR_INITIAL_TRANSCRIPT',
        'captioner/SET_MICROPHONE_NAME',
        'share/SET_EXPIRED',
      ];

      return (
        ((payload && !payload.omitFromGoogleAnalytics) || !payload) &&
        !type.includes('route/') &&
        !ignoredMutationTypes.includes(type)
      );
    }

    // Track mutations with Google Analytics
    if (shouldTrackMutation(type, payload)) {
      let eventLabel;

      if (payload) {
        // Use the first value of the payload
        eventLabel = payload[Object.keys(payload)[0]]
          ? payload[Object.keys(payload)[0]].toString()
          : null;
      }

      if (Vue.$ga && Vue.$ga.event) {
        Vue.$ga.event({
          eventCategory: 'captioner',
          eventAction: type,
          eventLabel,
        });
      }
    }
  });
};

export const state = () => ({
  version: '2.0.0',
  user: {
    signedIn: null, // If null, they are currently signing in
    displayName: null,
    email: null,
    photoURL: null,
    uid: null,
    shouldSaveSettingsOnNextSignIn: false,
  },
  settingsLoaded: false || !process.env.FIREBASE_API_KEY,
  settings: {
    ...getSettingsState(),
  },
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
      lastStabilizedTranscriptSyncDate: null,
    },
  },
  visibleToasts: {
    signedIn: false,
    signedOut: false,
  },
  notifications: {
    showFirstSignInMessage: false,
  },
  delayedEvents: [],
  help: {
    query: '',
  },
});

export const mutations = allMutations;
export const actions = allActions;
export const plugins = [mutationInterceptorPlugin];
