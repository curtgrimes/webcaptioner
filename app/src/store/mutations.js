import Vue from 'vue'

export default {
  RESTORE_SETTINGS: (state, { settings, version }) => {
    state.settings = settings;
  },
  SET_TEXT_COLOR: (state, { textColor }) => {
    state.settings.appearance.text.textColor = textColor
  },
  SET_TEXT_COLOR_INTERIM: (state, { textColorInterim }) => {
    state.settings.appearance.text.textColorInterim = textColorInterim
  },
  SET_FONT_FAMILY: (state, { fontFamily }) => {
    state.settings.appearance.text.fontFamily = fontFamily
  },
  SET_TEXT_SIZE: (state, { textSize }) => {
    state.settings.appearance.text.textSize = textSize
  },
  SET_LINE_HEIGHT: (state, { lineHeight }) => {
    state.settings.appearance.text.lineHeight = lineHeight
  },
  SET_LETTER_SPACING: (state, { letterSpacing }) => {
    state.settings.appearance.text.letterSpacing = letterSpacing
  },
  SET_TEXT_TRANSFORM: (state, { textTransform }) => {
    state.settings.appearance.text.textTransform = textTransform
  },
  SET_SHADOW_COLOR: (state, { shadowColor }) => {
    state.settings.appearance.shadow.color = shadowColor
  },
  SET_SHADOW_OPACITY: (state, { shadowOpacity }) => {
    state.settings.appearance.shadow.opacity = shadowOpacity
  },
  SET_SHADOW_BLUR_RADIUS: (state, { shadowBlurRadius }) => {
    state.settings.appearance.shadow.blurRadius = shadowBlurRadius
  },
  SET_SHADOW_OFFSET_X: (state, { shadowOffsetX }) => {
    state.settings.appearance.shadow.offsetX = shadowOffsetX
  },
  SET_SHADOW_OFFSET_Y: (state, { shadowOffsetY }) => {
    state.settings.appearance.shadow.offsetY = shadowOffsetY
  },
  SET_BACKGROUND_COLOR: (state, { backgroundColor }) => {
    state.settings.appearance.background.color = backgroundColor
  },
  SET_ALIGNMENT_HORIZONTAL: (state, { alignmentHorizontal }) => {
    state.settings.appearance.text.alignment.horizontal = alignmentHorizontal
  },
  SET_ALIGNMENT_VERTICAL: (state, { alignmentVertical }) => {
    state.settings.appearance.text.alignment.vertical = alignmentVertical
  },
  SET_ALIGNMENT_PADDING: (state, { alignmentPadding }) => {
    state.settings.appearance.text.alignment.padding = alignmentPadding
  },


  ADD_WORD_REPLACEMENT (state, { wordReplacement }) {
    state.settings.wordReplacements.push(wordReplacement);
  },

  REMOVE_WORD_REPLACEMENT (state, { index }) {
      state.settings.wordReplacements.splice(index, 1);
  },

  UPDATE_WORD_REPLACEMENT (state, { wordReplacement, index }) {
      state.settings.wordReplacements[index] = wordReplacement;
  },
  

  SET_CENSOR: (state, { censor }) => {
    state.settings.censor.on = censor
  },
  SET_CENSOR_REPLACE_WITH: (state, { replaceWith }) => {
    state.settings.censor.replaceWith = replaceWith
  },


  SET_LOCALE_USER_DEFAULT: (state, { locale }) => {
    state.settings.locale.userDefault = locale
  },

  SET_LOCALE_FROM: (state, { locale }) => {
    state.settings.locale.from = locale
  },


  SET_CHROMECAST_CONNECTED: (state, { chromecastConnected }) => {
    state.receivers.chromecast.connected = chromecastConnected;
  },
  SET_CHROMECAST_CONNECTING: (state, { chromecastConnecting }) => {
    state.receivers.chromecast.connecting = chromecastConnecting;
  },
  SET_CHROMECAST_RECEIVER_NAME: (state, { receiverName }) => {
    state.receivers.chromecast.receiverName = receiverName;
  },



  SET_ACTIVE_TYPE: (state, { type }) => {
    state.activeType = type
  },

  SET_LIST: (state, { type, ids }) => {
    state.lists[type] = ids
  },

  SET_ITEMS: (state, { items }) => {
    items.forEach(item => {
      if (item) {
        Vue.set(state.items, item.id, item)
      }
    })
  },

  SET_USER: (state, { id, user }) => {
    Vue.set(state.users, id, user || false) /* false means user not found */
  }
}
