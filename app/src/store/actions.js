import {
  fetchUser,
  fetchItems,
  fetchIdsByType
} from '../api'

import userLocale from 'locale2'
import supportedLocales from '../data/locales'
import RemoteEventBus from '../components/RemoteEventBus'
import ChromelessWindowManager from '../components/ChromelessWindowManager'
import get from 'lodash.get'

export default {
  SET_LOCALE_FROM_USER_DEFAULT: ({ commit, dispatch, state }) => {
    commit('SET_LOCALE_USER_DEFAULT', { locale: userLocale });

    // Find closest match for locale from supported locales
    const matchingSupportedLocale = supportedLocales.find((l) => {
      return l.code.toUpperCase() == userLocale.toUpperCase();
    });
    
    commit('SET_LOCALE_FROM', {
      locale: (matchingSupportedLocale ? matchingSupportedLocale.code : 'en-US')
    });

    return Promise.resolve();
  },

  START_DETACHED_MODE: ({commit}) => {
    ChromelessWindowManager.start(RemoteEventBus, function () {
      // On close
      commit('SET_DETACHED_MODE_OFF');  
    });
    commit('SET_DETACHED_MODE_ON');
  },


  RESTORE_SETTINGS: ({ commit }, { settings }) => {
    
    commit('SET_TEXT_COLOR', { textColor: get(settings, 'appearance.text.textColor') });
    commit('SET_TEXT_COLOR_INTERIM', { textColorInterim: get(settings, 'appearance.text.textColorInterim') });
    commit('SET_FONT_FAMILY', { fontFamily: get(settings, 'appearance.text.fontFamily') });
    commit('SET_TEXT_SIZE', { textSize: get(settings, 'appearance.text.textSize') });
    commit('SET_LINE_HEIGHT', { lineHeight: get(settings, 'appearance.text.lineHeight') });
    commit('SET_LETTER_SPACING', { letterSpacing: get(settings, 'appearance.text.letterSpacing') });
    commit('SET_TEXT_TRANSFORM', { textTransform: get(settings, 'appearance.text.textTransform') });

    commit('SET_SHADOW_COLOR', { shadowColor: get(settings, 'appearance.shadow.color') });
    commit('SET_SHADOW_OPACITY', { shadowOpacity: get(settings, 'appearance.shadow.opacity') });
    commit('SET_SHADOW_BLUR_RADIUS', { shadowBlurRadius: get(settings, 'appearance.shadow.blurRadius') });
    commit('SET_SHADOW_OFFSET_X', { shadowOffsetX: get(settings, 'appearance.shadow.offsetX') });
    commit('SET_SHADOW_OFFSET_Y', { shadowOffsetY: get(settings, 'appearance.shadow.offsetY') });

    commit('SET_BACKGROUND_COLOR', { backgroundColor: get(settings, 'appearance.background.color') });
    commit('SET_ALIGNMENT_HORIZONTAL', { alignmentHorizontal: get(settings, 'appearance.text.alignment.horizontal') });
    commit('SET_ALIGNMENT_VERTICAL', { alignmentVertical: get(settings, 'appearance.text.alignment.vertical') });
    commit('SET_ALIGNMENT_PADDING', { alignmentPadding: get(settings, 'appearance.text.alignment.padding') });

    commit('SET_CENSOR', { censor: get(settings, 'censor.on') });
    commit('SET_CENSOR_REPLACE_WITH', { replaceWith: get(settings, 'censor.replaceWith') });

    commit('SET_LAYOUT_LARGER', { on: get(settings, 'controls.layout.larger') });

    commit('SET_LOCALE_USER_DEFAULT', { locale: get(settings, 'locale.userDefault') });
    commit('SET_LOCALE_FROM', { locale: get(settings, 'locale.from') });

    commit('SET_ROOM_LEADER_TOKEN', { roomLeaderToken: get(settings, 'roomLeaderToken') });

    const wordReplacements = get(settings, 'wordReplacements');
    for (let i = 0; i < wordReplacements.length; i++) {
      commit('ADD_WORD_REPLACEMENT', { wordReplacement: wordReplacements[i] });
    }
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
