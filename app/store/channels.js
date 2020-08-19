export const actions = {
  async GET_CHANNELS({ state, rootState }) {
    const experiments = rootState.settings.exp;
    let channelsPath = '/api/channels';
    if (experiments.length) {
      channelsPath += `?experiments=${experiments.join(',')}`;
    }

    const channels = await this.$axios.$get(channelsPath);
    return channels;
  },
};

export const state = () => {
  return {
    unseenErrorExists: false,
    channelsPageMessage: null,
  };
};
