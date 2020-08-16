export default async ({ $store, $axios, channelId, channelParameters }) => {
  // Register
  if (!channelParameters.accessToken || !channelParameters.accountId) {
    $store.commit('UPDATE_CHANNEL_ERROR', {
      channelId,
      error: 'Could not connect to Dropbox: access token is missing.',
    });

    // Turn off the channel because it's not configured correctly
    $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff: false });
    // No need to unregister here because we haven't registered yet
    return;
  }

  // Test the access token and account ID to make sure they're valid
  try {
    const { error } = await $axios.$get('/api/storage/dropbox/profile', {
      params: {
        accessToken: channelParameters.accessToken,
        accountId: channelParameters.accountId,
      },
    });

    if (error) {
      $store.commit('UPDATE_CHANNEL_ERROR', {
        channelId,
        error:
          'This channel has been turned off because Web Captioner could not connect to your Dropbox. Try reconnecting to Dropbox.',
      });

      // Turn off the channel because it's not configured correctly
      $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff: false });
      // No need to unregister here because we haven't registered yet
      return;
    }
  } catch (e) {
    $store.commit('UPDATE_CHANNEL_ERROR', {
      channelId,
      error:
        'This channel has been turned off because Web Captioner could not connect to your Dropbox. Try reconnecting to Dropbox.',
    });

    // Turn off the channel because it's not configured correctly
    $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff: false });
    // No need to unregister here because we haven't registered yet
    return;
  }

  let text = '';
  let sessionStartDate;
  let lastTextSentToDropbox;
  let sendToDropboxImmediatelyAfterLastFinalText = false;

  const sendTextToDropbox = () => {
    if (!text || !sessionStartDate) {
      return;
    }

    if (text === lastTextSentToDropbox) {
      // We already sent this. Skip it.
      return;
    }

    $axios
      .post('/api/storage/dropbox/push', {
        accessToken: channelParameters.accessToken,
        sessionStartDate,
        contents: { text },
      })
      .catch((e) => {
        $store.commit('UPDATE_CHANNEL_ERROR', {
          channelId,
          error: `This channel has been turned off because we received an error when trying to save to Dropbox.`,
        });
      });
    lastTextSentToDropbox = text;
  };

  const unsubscribeFn = $store.subscribe((mutation) => {
    if (mutation.type === 'captioner/APPEND_TRANSCRIPT_FINAL') {
      text = $store.state.captioner.transcript.final;

      if (sendToDropboxImmediatelyAfterLastFinalText) {
        sendTextToDropbox();
        // This isn't necessary, but we won't need it anymore so do this for clarity
        sessionStartDate = null;
        sendToDropboxImmediatelyAfterLastFinalText = false;
      }
    } else if (
      mutation.type === 'captioner/SET_SHOULD_BE_ON' &&
      mutation.payload.shouldBeOn
    ) {
      // The user started captioning. Keep track of this date because this will
      // be the start of a new file in DRopbox.
      // Don't use captioner/SET_CAPTIONER_ON here because that gets fired
      // every time the speechRecognizer is restarted due to no speech, and
      // we only want to know when captioning was started due to user interaction
      // so we know how to split up Dropbox files (there should be one file per
      // "Start Captioning" button press).
      sessionStartDate = new Date();
    } else if (
      mutation.type === 'captioner/SET_SHOULD_BE_ON' &&
      !mutation.payload.shouldBeOn
    ) {
      // The user stopped captioning. 'Flush the cache' immediately and send the final
      // text we have now -- this will be the last push to this particular file.
      text = $store.state.captioner.transcript.final;

      // The user stopped captioning, but the last 'final' text will be sent
      // some time shortly in the future. So watch out for that.
      sendToDropboxImmediatelyAfterLastFinalText = true;
    }
  });

  // Send on an interval
  const dropboxSendInterval = setInterval(sendTextToDropbox, 1000 * 60);

  return () => {
    // Unregister function
    unsubscribeFn();
    clearInterval(dropboxSendInterval);
  };
};
