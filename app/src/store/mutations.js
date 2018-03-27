import Vue from 'vue'

export default {
  SET_TEXT_COLOR: (state, { textColor }) => {
    state.appearance.textColor = textColor
  },
  SET_TEXT_COLOR_INTERIM: (state, { textColorInterim }) => {
    state.appearance.textColorInterim = textColorInterim
  },
  SET_FONT_FAMILY: (state, { fontFamily }) => {
    state.appearance.fontFamily = fontFamily
  },
  SET_TEXT_SIZE: (state, { textSize }) => {
    state.appearance.textSize = textSize
  },
  SET_LINE_HEIGHT: (state, { lineHeight }) => {
    state.appearance.lineHeight = lineHeight
  },
  SET_LETTER_SPACING: (state, { letterSpacing }) => {
    state.appearance.letterSpacing = letterSpacing
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
