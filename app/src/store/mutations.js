import Vue from 'vue'

export default {
  SET_TEXT_COLOR: (state, { textColor }) => {
    state.appearance.text.textColor = textColor
  },
  SET_TEXT_COLOR_INTERIM: (state, { textColorInterim }) => {
    state.appearance.text.textColorInterim = textColorInterim
  },
  SET_FONT_FAMILY: (state, { fontFamily }) => {
    state.appearance.text.fontFamily = fontFamily
  },
  SET_TEXT_SIZE: (state, { textSize }) => {
    state.appearance.text.textSize = textSize
  },
  SET_LINE_HEIGHT: (state, { lineHeight }) => {
    state.appearance.text.lineHeight = lineHeight
  },
  SET_LETTER_SPACING: (state, { letterSpacing }) => {
    state.appearance.text.letterSpacing = letterSpacing
  },
  SET_TEXT_TRANSFORM: (state, { textTransform }) => {
    state.appearance.text.textTransform = textTransform
  },
  SET_SHADOW_COLOR: (state, { shadowColor }) => {
    state.appearance.shadow.color = shadowColor
  },
  SET_SHADOW_OPACITY: (state, { shadowOpacity }) => {
    state.appearance.shadow.opacity = shadowOpacity
  },
  SET_SHADOW_BLUR: (state, { shadowBlur }) => {
    state.appearance.shadow.blur = shadowBlur
  },
  SET_SHADOW_X_POSITION: (state, { shadowXPosition }) => {
    state.appearance.shadow.xPosition = shadowXPosition
  },
  SET_SHADOW_Y_POSITION: (state, { shadowYPosition }) => {
    state.appearance.shadow.yPosition = shadowYPosition
  },
  SET_BACKGROUND_COLOR: (state, { backgroundColor }) => {
    state.appearance.background.color = backgroundColor
  },
  SET_ALIGNMENT_HORIZONTAL: (state, { alignmentHorizontal }) => {
    state.appearance.text.alignment.horizontal = alignmentHorizontal
  },
  SET_ALIGNMENT_VERTICAL: (state, { alignmentVertical }) => {
    state.appearance.text.alignment.vertical = alignmentVertical
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
