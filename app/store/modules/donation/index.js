
function dateIsWithinPastXDays(date, days) {
    return new Date(date) > new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * days));
}

const state = {
    message: {
        show: false,
    },
}

const actions = {
    SHOW_DONATION_MESSAGE_IF_ELIGIBLE ({commit, dispatch, state, rootState}) {
        let pastDonationDate = rootState.settings.donationDate,
            hasRecentDonation = false;

        if (pastDonationDate) {
            // Don't show it again for this many days
            hasRecentDonation = dateIsWithinPastXDays(pastDonationDate, 14);
        }

        if (!hasRecentDonation && rootState.captioner.totalCaptioningSeconds >= 5) {
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