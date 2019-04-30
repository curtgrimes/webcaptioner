export const state = () => ({
  expired: false,
  settings: {
    show: false,
  },
})

export const actions = {
  SHOW_SHARE_SETTINGS({
    commit,
    dispatch,
    state,
    rootState
  }) {
    if (rootState.captioner.totalCaptioningSeconds >= 1) {
      commit('SET_MESSAGE_SHOW', {
        on: true
      });
    }
  },
  CHECK_LINK_EXPIRY({
    commit,
    rootState
  }) {
    if (
      rootState.settings.share.expires === true &&
      rootState.settings.share.expireDate &&
      new Date() > new Date(rootState.settings.share.expireDate)) {
      commit('SET_EXPIRED', {
        expired: true,
      });
      commit('SET_SHARE_ON', {
        on: false,
      }, {
        root: true
      });
    }
  },
};

export const mutations = {
  SET_SHOW_SETTINGS(state, {
    on,
    toggle
  }) {
    if (toggle) {
      state.settings.show = !state.settings.show;
    } else {
      state.settings.show = on;
    }
  },
  SET_EXPIRED(state, {
    expired
  }) {
    state.expired = expired;
  },
};
