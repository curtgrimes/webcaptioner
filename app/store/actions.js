import userLocale from 'locale2';
import supportedLocales from '~/mixins/data/locales';
import RemoteEventBus from '~/mixins/RemoteEventBus';
import ChromelessWindowManager from '~/mixins/ChromelessWindowManager';
import get from 'lodash.get';
import throttle from 'lodash.throttle';
import { normalizeSettings } from '~/mixins/settingsNormalizer';

var saveSettingsToFirestore = throttle((state, db) => {
  let settings = state.settings;

  // Make channels a plain array
  settings.channels = [...(settings.channels || [])];

  db.collection('users')
    .doc(state.user.uid)
    .collection('settings')
    .doc('user')
    .set({
      ...settings,
      ...{
        version: state.version,
      },
    })
    .then(function() {
      // console.log('Document successfully written!');
    })
    .catch(function(error) {
      // console.error('Error writing document: ', error);
    });
}, 5000);

function eventLogger(commit, state, { action, payload }) {
  if (Date.now() < state.eventLog.onUntilStopTime) {
    commit('APPEND_EVENT_LOG', {
      event: {
        event: 'action',
        action,
        payload,
      },
      omitFromGoogleAnalytics: true,
    });
  }
}

export default {
  SET_LOCALE_FROM_USER_DEFAULT: ({ commit, dispatch, state }) => {
    return new Promise((resolve, reject) => {
      eventLogger(commit, state, {
        action: 'SET_LOCALE_FROM_USER_DEFAULT',
      });

      commit('SET_LOCALE_USER_DEFAULT', {
        locale: userLocale,
      });

      if (!state.settings.locale.from) {
        // 'from' locale hasn't been set yet
        // Find closest match for locale from supported locales
        const matchingSupportedLocale = supportedLocales.find((l) => {
          return l.code.toUpperCase() == userLocale.toUpperCase();
        });

        commit('SET_LOCALE_FROM', {
          locale: matchingSupportedLocale
            ? matchingSupportedLocale.code
            : 'en-US',
        });
      }

      resolve();
    });
  },

  INIT_CHECK_AUTH_STATUS_WATCHER: function({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      this.$firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
          const { displayName, email, photoURL, uid } = user;
          commit('SET_USER', {
            displayName,
            email,
            photoURL,
            uid,
            signedIn: true,
          });

          if (state.user.shouldSaveSettingsOnNextSignIn) {
            // This will happen if this is the first time they're signing in.
            commit('SAVE_SETTINGS_TO_FIRESTORE_ON_NEXT_LOGIN', false);
            commit('SHOW_FIRST_SIGN_IN_MESSAGE', true);
            dispatch('SAVE_SETTINGS_TO_FIRESTORE');
          } else {
            // Not their first sign in.
          }
        } else {
          // User is signed out/not signed in
          commit('SET_USER', {
            displayName: null,
            email: null,
            photoURL: null,
            uid: null,
            signedIn: false,
          });
        }

        resolve(user);
      });
    });
  },

  SAVE_SETTINGS_TO_FIRESTORE: function({ state }) {
    saveSettingsToFirestore(state, this.$firebase.firestore());
  },

  START_DETACHED_MODE: ({ commit, state }) => {
    eventLogger(commit, state, {
      action: 'START_DETACHED_MODE',
    });

    ChromelessWindowManager.methods.start(
      RemoteEventBus,
      {
        settings: state.settings,
        transcriptInterim: state.captioner.transcript.interim,
        transcriptFinal: state.captioner.transcript.final,
        transcriptTyped: state.captioner.transcript.typed,
        windowDimensions: {
          left: state.settings.chromelessWindow.left,
          top: state.settings.chromelessWindow.top,
          width: state.settings.chromelessWindow.width,
          height: state.settings.chromelessWindow.height,
        },
      },
      () => {
        // On close
        commit('SET_DETACHED_MODE_OFF');
      },
      throttle(({ left, top, width, height }) => {
        // onWindowSizePositionChange

        if (
          state.settings.chromelessWindow.left !== left ||
          state.settings.chromelessWindow.top !== top ||
          state.settings.chromelessWindow.width !== width ||
          state.settings.chromelessWindow.height !== height
        )
          // Only commit if one of these values changed from what we already
          // have saved in settings

          commit('SAVE_CHROMELESS_WINDOW_DIMENSIONS', {
            left,
            top,
            width,
            height,
          });
      }, 1000)
    );
    commit('SET_DETACHED_MODE_ON');
  },

  RESTORE_SETTINGS_OBJECT: ({ commit }, { settings }) => {
    return new Promise((resolve, reject) => {
      commit('SET_SETTINGS_LOADED', false);

      function commitPropertySetting(
        mutationName,
        mutationDataPropertyName,
        settingsKey
      ) {
        let value = get(settings, settingsKey);
        if (typeof value !== 'undefined') {
          commit(mutationName, {
            [mutationDataPropertyName]: value,

            // because otherwise we have a huge amount of events on every initial load
            omitFromGoogleAnalytics: true,
          });
        } else {
          // It's already set to the default in the store, so just leave that
        }
      }

      commitPropertySetting(
        'SET_TEXT_COLOR',
        'textColor',
        'appearance.text.textColor'
      );
      commitPropertySetting(
        'SET_TEXT_COLOR_INTERIM',
        'textColorInterim',
        'appearance.text.textColorInterim'
      );
      commitPropertySetting(
        'SET_FONT_FAMILY',
        'fontFamily',
        'appearance.text.fontFamily'
      );
      commitPropertySetting(
        'SET_FONT_VARIANT',
        'fontVariant',
        'appearance.text.fontVariant'
      );
      commitPropertySetting(
        'SET_TEXT_SIZE',
        'textSize',
        'appearance.text.textSize'
      );
      commitPropertySetting(
        'SET_LINE_HEIGHT',
        'lineHeight',
        'appearance.text.lineHeight'
      );
      commitPropertySetting(
        'SET_LETTER_SPACING',
        'letterSpacing',
        'appearance.text.letterSpacing'
      );
      commitPropertySetting(
        'SET_TEXT_TRANSFORM',
        'textTransform',
        'appearance.text.textTransform'
      );

      commitPropertySetting(
        'SET_SHADOW_COLOR',
        'shadowColor',
        'appearance.shadow.color'
      );
      commitPropertySetting(
        'SET_SHADOW_OPACITY',
        'shadowOpacity',
        'appearance.shadow.opacity'
      );
      commitPropertySetting(
        'SET_SHADOW_BLUR_RADIUS',
        'shadowBlurRadius',
        'appearance.shadow.blurRadius'
      );
      commitPropertySetting(
        'SET_SHADOW_OFFSET_X',
        'shadowOffsetX',
        'appearance.shadow.offsetX'
      );
      commitPropertySetting(
        'SET_SHADOW_OFFSET_Y',
        'shadowOffsetY',
        'appearance.shadow.offsetY'
      );

      commitPropertySetting(
        'SET_BACKGROUND_COLOR',
        'backgroundColor',
        'appearance.background.color'
      );
      commitPropertySetting(
        'SET_BACKGROUND_OPACITY',
        'backgroundOpacity',
        'appearance.background.opacity'
      );

      commitPropertySetting(
        'SET_ALIGNMENT_HORIZONTAL',
        'alignmentHorizontal',
        'appearance.text.alignment.horizontal'
      );
      commitPropertySetting(
        'SET_ALIGNMENT_VERTICAL',
        'alignmentVertical',
        'appearance.text.alignment.vertical'
      );
      commitPropertySetting(
        'SET_ALIGNMENT_PADDING',
        'alignmentPadding',
        'appearance.text.alignment.padding'
      );

      commit('SAVE_CHROMELESS_WINDOW_DIMENSIONS', {
        left: get(settings, 'chromelessWindow.left'),
        top: get(settings, 'chromelessWindow.top'),
        width: get(settings, 'chromelessWindow.width'),
        height: get(settings, 'chromelessWindow.height'),
        omitFromGoogleAnalytics: true,
      });

      commitPropertySetting('SET_CENSOR', 'censor', 'censor.on');

      commitPropertySetting(
        'SET_STABILIZED_THRESHOLD_MS',
        'stabilizedThresholdMs',
        'stabilizedThresholdMs'
      );

      commitPropertySetting(
        'SET_CENSOR_REPLACE_WITH',
        'replaceWith',
        'censor.replaceWith'
      );

      commitPropertySetting(
        'SET_AFTER_NO_AUDIO_SECONDS',
        'seconds',
        'afterNoAudio.seconds'
      );
      commitPropertySetting(
        'SET_AFTER_NO_AUDIO_ACTION',
        'action',
        'afterNoAudio.action'
      );

      commitPropertySetting(
        'SET_ALWAYS_AUTOSTART_ON_LOAD',
        'on',
        'alwaysAutostartOnLoad'
      );

      commitPropertySetting(
        'SET_LAYOUT_LARGER',
        'on',
        'controls.layout.larger'
      );
      commitPropertySetting(
        'SET_VOLUME_METER_SHOW',
        'on',
        'controls.volumeMeter.show'
      );
      commitPropertySetting(
        'SET_VOLUME_METER_SENSITIVITY',
        'sensitivity',
        'controls.volumeMeter.sensitivity'
      );

      commitPropertySetting(
        'SET_LOCALE_USER_DEFAULT',
        'locale',
        'locale.userDefault'
      );
      commitPropertySetting('SET_LOCALE_FROM', 'locale', 'locale.from');

      commitPropertySetting('SET_SHARE_ON', 'on', 'share.on');
      commitPropertySetting('SET_SHARE_ROOM_ID', 'roomId', 'share.roomId');
      commitPropertySetting(
        'SET_SHARE_OWNER_KEY',
        'ownerKey',
        'share.ownerKey'
      );
      commitPropertySetting('SET_SHARE_URL', 'url', 'share.url');
      commitPropertySetting('SET_SHARE_EXPIRES', 'expires', 'share.expires');
      commitPropertySetting(
        'SET_SHARE_EXPIRE_DATE',
        'expireDate',
        'share.expireDate'
      );
      commitPropertySetting('SET_SHARE_URL_TYPE', 'urlType', 'share.urlType');
      commitPropertySetting('SET_SHARE_VANITY', 'vanity', 'share.vanity');

      commitPropertySetting(
        'SET_ROOM_LEADER_TOKEN',
        'roomLeaderToken',
        'roomLeaderToken'
      );
      commitPropertySetting(
        'SET_ROOM_MEMBERSHIP_ID',
        'roomMembershipId',
        'roomMembershipId'
      );

      commitPropertySetting('SET_CHANNELS', 'channels', 'channels');

      commitPropertySetting(
        'SET_DONATION_DATE',
        'donationDate',
        'donationDate'
      );

      (get(settings, 'exp') || []).forEach((experiment) => {
        commit('ADD_EXPERIMENT', {
          experiment,
          omitFromGoogleAnalytics: true,
        });
      });

      commit('REMOVE_WORD_REPLACEMENTS');
      (get(settings, 'wordReplacements') || []).forEach((wordReplacement) => {
        if (wordReplacement.from) {
          commit('ADD_WORD_REPLACEMENT', {
            wordReplacement,
            omitFromGoogleAnalytics: true,
          });
        }
      });

      setTimeout(function() {
        commit('SET_SETTINGS_LOADED', true);
      }, 0);

      resolve();
    });
  },

  RESTORE_SETTINGS_FROM_FIRESTORE: function({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      let db = this.$firebase.firestore();
      db.collection('users')
        .doc(state.user.uid)
        .collection('settings')
        .doc('user')
        .get()
        .then(function(document) {
          if (document.exists) {
            const data = document.data();
            const settings = normalizeSettings({
              localStorageData: {
                settings: data,
              },
              fromVersionNumber: data.version,
            });

            if (!settings) {
              commit('SET_SETTINGS_LOADED', true);
              resolve();
              return;
            }

            dispatch('RESTORE_SETTINGS_OBJECT', {
              settings,
            }).then(resolve);
          } else {
            commit('SET_SETTINGS_LOADED', true);
          }
        })
        .catch(function(error) {
          console.error('Error getting document: ', error);
        });
    });
  },

  RESTORE_SETTINGS_FROM_LOCALSTORAGE: ({ commit, state, dispatch }) => {
    return new Promise((resolve, reject) => {
      eventLogger(commit, state, {
        action: 'RESTORE_SETTINGS_FROM_LOCALSTORAGE',
      });

      if (!localStorage) {
        commit('SET_SETTINGS_LOADED', true);
        resolve();
        return;
      }

      const localStorageParsed = JSON.parse(
        localStorage.getItem('webcaptioner-settings')
      );

      if (!localStorageParsed || !localStorageParsed.version) {
        commit('SET_SETTINGS_LOADED', true);
        resolve();
        return;
      }

      const settings = normalizeSettings({
        localStorageData: localStorageParsed,
      });

      if (!settings) {
        commit('SET_SETTINGS_LOADED', true);
        resolve();
        return;
      }

      dispatch('RESTORE_SETTINGS_OBJECT', {
        settings,
      }).then(resolve);
    });
  },

  SAVE_SETTINGS: function({ state, commit, dispatch }) {
    eventLogger(commit, state, {
      action: 'SAVE_SETTINGS',
    });

    if (localStorage) {
      localStorage.setItem(
        'webcaptioner-settings',
        JSON.stringify({
          settings: state.settings,
          version: state.version,
        })
      );
    }

    if (state.user.uid) {
      dispatch('SAVE_SETTINGS_TO_FIRESTORE');
    }
  },

  SHOW_INCOMPATIBLE_BROWSER_MODAL: ({ commit, state }) => {
    eventLogger(commit, state, {
      action: 'SHOW_INCOMPATIBLE_BROWSER_MODAL',
    });

    // Just need to toggle it on for a second for the modal to appear
    commit('SET_INCOMPATIBLE_BROWSER_MODAL_VISIBLE');
    setTimeout(function() {
      commit('SET_INCOMPATIBLE_BROWSER_MODAL_INVISIBLE');
    }, 1000);
  },

  START_SUPPORT_POPUP: ({ rootState }) => {
    // Beacon should be defined in script in end of app.html

    // @ts-ignore
    if (window.Beacon) {
      // @ts-ignore
      Beacon('identify', {
        name: rootState.user.displayName || '',
        email: rootState.user.email || '',
      });
      // @ts-ignore
      Beacon('open');
    }
  },
};
