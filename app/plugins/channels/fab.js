export default async ({ $store, $axios, channelId, channelParameters }) => {
  // Register
  if (!channelParameters.port) {
    $store.commit('UPDATE_CHANNEL_ERROR', {
      channelId,
      error: 'TCP port number is missing.',
    });

    // Turn off the channel because it's not configured correctly
    $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff: false });
    // No need to unregister here because we haven't registered yet
    return;
  }
  let fabUrl;
  try {
    fabUrl = new URL(`http://localhost`);
    fabUrl.port = channelParameters.port;
    // await fetch(fabUrl.toString());
  } catch (e) {
    console.error('error', e);
    $store.commit('UPDATE_CHANNEL_ERROR', {
      channelId,
      error:
        'Cannot connect to FAB Subtitler. Make sure the port number is correct and try again.',
    });

    // Turn off the channel because it's not configured correctly
    $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff: false });
    // No need to unregister here because we haven't registered yet
    return;
  }

  // Can successfully connect. Send text to the /speechinterface path
  // from now on
  fabUrl.pathname = '/speechinterface';

  const sendToFab = async (text) => {
    fabUrl.searchParams.set('text', text);
    await fetch(fabUrl);
  };

  const unsubscribeFn = $store.subscribe((mutation) => {
    if (
      mutation.type === 'captioner/APPEND_TRANSCRIPT_STABILIZED' &&
      mutation.payload.transcript
    ) {
      sendToFab(mutation.payload.transcript);
    }
  });

  return () => {
    // Unregister function
    unsubscribeFn();
  };
};
