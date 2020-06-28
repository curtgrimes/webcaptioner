import zoom from './zoom';

// Available channels
const channels = { zoom };

// Every time a channel is registered, it returns a function
// we need to run if we need to deregister it in the future
const deregisterFunctions = {};

const registerActiveChannels = ({ $store, $axios, $socket }) => {
  const activeChannels = $store.state.settings.channels.filter(
    (channel) => channel.on
  );

  activeChannels.forEach((activeChannel) => {
    const channelAlreadyRegistered = Boolean(
      deregisterFunctions[activeChannel.id]
    );

    if (channelAlreadyRegistered) {
      // Don't register it again
      return;
    }

    // Register the channel. Registration returns a deregister function,
    // so save that also for future use.
    deregisterFunctions[activeChannel.id] = channels[activeChannel.type]({
      $store,
      $axios,
      $socket,
      channelId: activeChannel.id,
      channelParameters: activeChannel.parameters || {},
    });
  });
};

const deregisterInactiveChannels = ({ $store }) => {
  const inactiveChannels = $store.state.settings.channels.filter(
    (channel) => !channel.on
  );

  // Deregister inactive channels
  inactiveChannels.forEach((inactiveChannel) => {
    const channelAlreadyDeregistered = !Boolean(
      deregisterFunctions[inactiveChannel.id]
    );

    if (channelAlreadyDeregistered) {
      // Don't deregister it again
      return;
    }

    // Deregister the channel
    deregisterFunctions[inactiveChannel.id]();
    delete deregisterFunctions[inactiveChannel.id];
  });
};

export default {
  updateRegistrations({ $store, $axios, $socket }) {
    registerActiveChannels({ $store, $axios, $socket });
    deregisterInactiveChannels({ $store });
  },
};
