
const state = {
    message: {
        show: false,
    },
}

const actions = {
    SHOW_DONATION_MESSAGE_IF_ELIGIBLE ({commit, dispatch, state, rootState}) {
        return; // disable temporarily
        if (rootState.captioner.totalCaptioningSeconds >= 1) {
            commit('SET_MESSAGE_SHOW', {on: true});
        }
    },
};

const mutations = {
    SET_MESSAGE_SHOW (state, { on }) {
        state.message.show = on;
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
}