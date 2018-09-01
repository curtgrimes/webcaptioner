import userLocale from 'locale2'
import supportedLocales from '~/mixins/data/locales'
import RemoteEventBus from '~/mixins/RemoteEventBus'
import ChromelessWindowManager from '~/mixins/ChromelessWindowManager'
import get from 'lodash.get'
import vmixSetup from '~/mixins/vmixSetup'
import {normalizeSettings} from '~/mixins/settingsNormalizer'

function getVmixPath(webControllerAddress) {
  return (webControllerAddress || '').trim().replace(/\/$/, "") + '/API';
}

function eventLogger(commit, {action, payload}) {
  commit('APPEND_EVENT_LOG', {
    event: {
      event: 'action',
      action,
      payload,
    },
    omitFromGoogleAnalytics: true,
  });
}

export default {
  SET_LOCALE_FROM_USER_DEFAULT: ({ commit, dispatch, state }) => {
    return new Promise((resolve, reject) => {
      eventLogger(commit, {action: 'SET_LOCALE_FROM_USER_DEFAULT'});
  
      commit('SET_LOCALE_USER_DEFAULT', { locale: userLocale });
  
      if (!state.settings.locale.from) {
        // 'from' locale hasn't been set yet
        // Find closest match for locale from supported locales
        const matchingSupportedLocale = supportedLocales.find((l) => {
          return l.code.toUpperCase() == userLocale.toUpperCase();
        });
        
        commit('SET_LOCALE_FROM', {
          locale: (matchingSupportedLocale ? matchingSupportedLocale.code : 'en-US')
        });
      }

      resolve();
    });
  },

  START_DETACHED_MODE: ({commit}) => {
    eventLogger(commit, {action: 'START_DETACHED_MODE'});

    ChromelessWindowManager.methods.start(RemoteEventBus, function () {
      // On close
      commit('SET_DETACHED_MODE_OFF');  
    });
    commit('SET_DETACHED_MODE_ON');
  },


  RESTORE_SETTINGS_FROM_LOCALSTORAGE: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      eventLogger(commit, {action: 'RESTORE_SETTINGS_FROM_LOCALSTORAGE'});

      function commitPropertySetting(mutationName, mutationDataPropertyName, settingsKey) {
        let value = get(settings, settingsKey);
        if (typeof value !== 'undefined') {
          commit(
            mutationName,
            {
              [mutationDataPropertyName]: value,

              // because otherwise we have a huge amount of events on every initial load
              omitFromGoogleAnalytics: true,
            }
          );
        }
        else {
          // It's already set to the default in the store, so just leave that
        }
      }

      if (!localStorage) {
        resolve();
        return;
      }

      const localStorageParsed = JSON.parse(localStorage.getItem('webcaptioner-settings'));
      
      if (!localStorageParsed || !localStorageParsed.version) {
        resolve();
        return;
      }

      const settings = normalizeSettings({
        localStorageData: localStorageParsed,
        fromVersionNumber: localStorageParsed.version,
      });

      if (!settings) {
        resolve();
        return;
      }

      commitPropertySetting('SET_TEXT_COLOR', 'textColor', 'appearance.text.textColor');
      commitPropertySetting('SET_TEXT_COLOR_INTERIM', 'textColorInterim', 'appearance.text.textColorInterim');
      commitPropertySetting('SET_FONT_FAMILY', 'fontFamily', 'appearance.text.fontFamily');
      commitPropertySetting('SET_TEXT_SIZE', 'textSize', 'appearance.text.textSize');
      commitPropertySetting('SET_LINE_HEIGHT', 'lineHeight', 'appearance.text.lineHeight');
      commitPropertySetting('SET_LETTER_SPACING', 'letterSpacing', 'appearance.text.letterSpacing');
      commitPropertySetting('SET_TEXT_TRANSFORM', 'textTransform', 'appearance.text.textTransform');

      commitPropertySetting('SET_SHADOW_COLOR', 'shadowColor', 'appearance.shadow.color');
      commitPropertySetting('SET_SHADOW_OPACITY', 'shadowOpacity', 'appearance.shadow.opacity');
      commitPropertySetting('SET_SHADOW_BLUR_RADIUS', 'shadowBlurRadius', 'appearance.shadow.blurRadius');
      commitPropertySetting('SET_SHADOW_OFFSET_X', 'shadowOffsetX', 'appearance.shadow.offsetX');
      commitPropertySetting('SET_SHADOW_OFFSET_Y', 'shadowOffsetY', 'appearance.shadow.offsetY');

      commitPropertySetting('SET_BACKGROUND_COLOR', 'backgroundColor', 'appearance.background.color');
      commitPropertySetting('SET_ALIGNMENT_HORIZONTAL', 'alignmentHorizontal', 'appearance.text.alignment.horizontal');
      commitPropertySetting('SET_ALIGNMENT_VERTICAL', 'alignmentVertical', 'appearance.text.alignment.vertical');
      commitPropertySetting('SET_ALIGNMENT_PADDING', 'alignmentPadding', 'appearance.text.alignment.padding');

      commitPropertySetting('SET_CENSOR', 'censor', 'censor.on');
      commitPropertySetting('SET_CENSOR_REPLACE_WITH', 'replaceWith', 'censor.replaceWith');

      commitPropertySetting('SET_LAYOUT_LARGER', 'on', 'controls.layout.larger');

      commitPropertySetting('SET_LOCALE_USER_DEFAULT', 'locale', 'locale.userDefault');
      commitPropertySetting('SET_LOCALE_FROM', 'locale', 'locale.from');

      commitPropertySetting('SET_ROOM_LEADER_TOKEN', 'roomLeaderToken', 'roomLeaderToken');

      commitPropertySetting('SET_ROOM_MEMBERSHIP_ID', 'roomMembershipId', 'roomMembershipId');

      commitPropertySetting('SET_SEND_TO_VMIX', 'on', 'integrations.vmix.on');
      commitPropertySetting('SET_VMIX_WEB_CONTROLLER_ADDRESS', 'webControllerAddress', 'integrations.vmix.webControllerAddress');
      
      commitPropertySetting('SET_LAST_WHATS_NEW_VERSION_SEEN', 'version', 'lastWhatsNewVersionSeen');

      (get(settings, 'exp') || []).forEach((experiment) => {
        commit('ADD_EXPERIMENT', { experiment, omitFromGoogleAnalytics: true });
      });

      (get(settings, 'wordReplacements') || []).forEach((wordReplacement) => {
        if (wordReplacement.from) {
          commit('ADD_WORD_REPLACEMENT', { wordReplacement, omitFromGoogleAnalytics: true });
        }
      });

      resolve();
    });
  },

  SAVE_SETTINGS_TO_LOCALSTORAGE: ({state, commit}) => {
    eventLogger(commit, {action: 'SAVE_SETTINGS_TO_LOCALSTORAGE'});

    if (localStorage) {
      localStorage.setItem('webcaptioner-settings', JSON.stringify({
        settings: state.settings,
        version: state.version,
      }));
    }
  },

  SHOW_INCOMPATIBLE_BROWSER_MODAL: ({commit}) => {
    eventLogger(commit, {action: 'SHOW_INCOMPATIBLE_BROWSER_MODAL'});

    // Just need to toggle it on for a second for the modal to appear
    commit('SET_INCOMPATIBLE_BROWSER_MODAL_VISIBLE');
    setTimeout(function(){
      commit('SET_INCOMPATIBLE_BROWSER_MODAL_INVISIBLE');
    },1000);
  },

  REFRESH_VMIX_SETUP_STATUS: ({commit, dispatch, state}) => {
    eventLogger(commit, {action: 'REFRESH_VMIX_SETUP_STATUS'});

    let {
      checkIfExtensionInstalled,
      testWebControllerConnectivity,
      sendMessage,
    } = vmixSetup;

    function getConnectionTimeoutPromise() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(false);
        }, 2000);
      });
    }


    
    let extensionCheck = checkIfExtensionInstalled()
      .then(function(installed) {
        commit('SET_VMIX_CHROME_EXTENSION_INSTALLED', {installed});
      });
    
    let testConnection = new Promise((resolve, reject) => {
      testWebControllerConnectivity(getVmixPath(state.settings.integrations.vmix.webControllerAddress))
        .then(function(connected) {
          resolve(connected);
        });
    });

    let testVmixTemplate = new Promise((resolve, reject) => {
      
      // Reset GUID
      commit('SET_VMIX_CACHED_INPUT_GUID', {guid: null});

      sendMessage(getVmixPath(state.settings.integrations.vmix.webControllerAddress))
        .then(function(response) {
          if (!response || (response && !response.text)) {
            return resolve(false);
          }

          let xml = response.text,
              textElement;
          
          // There is an <input></input> element in vMix's response that isn't a proper
          // <input> element. The browser automatically interprets it as a self-closing
          // <input> tag. We need to rename it to something unique so we can get its children.
          xml = xml.replace(/<input /gi,'<webcaptioner-vmix-input ').replace(/\<\/input\>/gi,'</webcaptioner-vmix-input>');

          try {
            const parser = new DOMParser();
            const xmlDOM = parser.parseFromString(xml, "application/xml");
            textElement = xmlDOM.querySelector('text[name="WebCaptionerCaptions"]');
          }
          catch (e) {
            // Unable to parse
            resolve(false);
          }
          
          // Timeout is totally unnecessary here. It usually resolves instantly, but that seems
          // to lead to some confusion on whether it really checked or not -- so introduce a short
          // artifical delay.
          setTimeout(function() {
            if (textElement) {
              let parent = textElement.parentElement;
              commit('SET_VMIX_SHOW_NOT_FULLY_SET_UP_MESSAGE', {on: false});
              resolve(parent.getAttribute('key'));
            }
            else {
              resolve(false);
            }
          },200);
        });
    });

    let testConnectionWithTimeout = Promise.race([testConnection, getConnectionTimeoutPromise()])
      .then((connected) => {
        commit('SET_VMIX_WEB_CONTROLLER_CONNECTED', {connected});
      });
    
    let testVmixTemplateWithTimeout = Promise.race([testVmixTemplate, getConnectionTimeoutPromise()])
      .then((guid) => {
        if (guid) {
          commit('SET_VMIX_CACHED_INPUT_GUID', {guid});
        }
      });
      
    return Promise.all([
      extensionCheck,
      testConnectionWithTimeout,
      testVmixTemplateWithTimeout,
    ]);
  },

  SEND_TO_VMIX: ({state, commit}, { text }) => {
    eventLogger(commit, {action: 'SEND_TO_VMIX', payload: {text}});

    let inputGUID = state.integrations.vmix.cachedInputGUID;
    
    if (!inputGUID) {
      commit('SET_VMIX_SHOW_NOT_FULLY_SET_UP_MESSAGE', {on: true});
      return;
    }
    
    let {sendMessage} = vmixSetup;
    sendMessage(
      getVmixPath(state.settings.integrations.vmix.webControllerAddress) +
        '/?Function=SetText&Input='+ inputGUID +'&SelectedName=WebCaptionerCaptions&Value='+encodeURIComponent(text.slice(-1000))
    )
      .then(function(response) {
        if (!response && !response.success) {
          commit('SET_VMIX_SHOW_NOT_FULLY_SET_UP_MESSAGE', {on: true});
        }
      });
  },

  // ensure data for rendering given list type
  FETCH_LIST_DATA: ({ commit, dispatch, state }, { type }) => {
    commit('SET_ACTIVE_TYPE', { type })
    return fetchIdsByType(type)
      .then(ids => commit('SET_LIST', { type, ids }))
      .then(() => dispatch('ENSURE_ACTIVE_ITEMS'))
  },

  // ensure all active items are fetched
  ENSURE_ACTIVE_ITEMS: ({ dispatch, getters }) => {
    return dispatch('FETCH_ITEMS', {
      ids: getters.activeIds
    })
  },

  FETCH_ITEMS: ({ commit, state }, { ids }) => {
    // on the client, the store itself serves as a cache.
    // only fetch items that we do not already have, or has expired (3 minutes)
    const now = Date.now()
    ids = ids.filter(id => {
      const item = state.items[id]
      if (!item) {
        return true
      }
      if (now - item.__lastUpdated > 1000 * 60 * 3) {
        return true
      }
      return false
    })
    if (ids.length) {
      return fetchItems(ids).then(items => commit('SET_ITEMS', { items }))
    } else {
      return Promise.resolve()
    }
  },

  FETCH_USER: ({ commit, state }, { id }) => {
    return state.users[id]
      ? Promise.resolve(state.users[id])
      : fetchUser(id).then(user => commit('SET_USER', { id, user }))
  }
}
