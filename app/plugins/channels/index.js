import dropbox from './dropbox';
import obs from './obs';
import vmix from './vmix';
import webhook from './webhook';
import youtube from './youtube';
import zoom from './zoom';

// Available channels
const channels = { dropbox, obs, vmix, webhook, youtube, zoom };

// Every time a channel is registered, it returns a function
// we need to run if we need to deregister it in the future
const deregisterFunctions = {};

const registerActiveChannels = ({ $store, $axios, $socket }) => {
  const activeChannels = $store.state.settings.channels.filter(
    (channel) => channel.on
  );

  activeChannels.forEach(async (activeChannel) => {
    const channelAlreadyRegistered = Boolean(
      deregisterFunctions[activeChannel.id]
    );

    if (channelAlreadyRegistered) {
      // Don't register it again
      return;
    }

    // Register the channel. Registration returns a deregister function,
    // so save that also for future use.
    if (channels[activeChannel.type]) {
      deregisterFunctions[activeChannel.id] = await channels[
        activeChannel.type
      ]({
        $store,
        $axios,
        $socket,
        channelId: activeChannel.id,
        channelParameters: activeChannel.parameters || {},
      });
    } else {
      console.error(
        `No registration possible for channel type '${activeChannel.type}'`
      );
    }
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
