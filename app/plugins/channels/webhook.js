export default ({ $store, $axios, channelId, channelParameters }) => {
  // Register
  if (!channelParameters.url) {
    $store.commit('UPDATE_CHANNEL_ERROR', {
      channelId,
      error: 'Webhook URL token is missing.',
    });

    // Turn off the channel because it's not configured correctly
    $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff: false });
    // No need to unregister here because we haven't registered yet
    return;
  }

  try {
    new URL(channelParameters.url);
  } catch (e) {
    $store.commit('UPDATE_CHANNEL_ERROR', {
      channelId,
      error:
        'This channel has been turned off because the webhook URL is not a valid URL. Make sure the webhook URL is correct and try again.',
    });

    // Turn off the channel because it's not configured correctly
    $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff: false });
    // No need to unregister here because we haven't registered yet
    return;
  }

  const webhookSendIntervalMs =
    channelParameters.origin === 'local' ? 200 : 1000;
  let transcriptBuffer = [];
  let transcriptCurrentlyDisplayed = [];
  const maxCharactersPerLine = 40;
  let lastSequenceNumber = 0;
  const sequenceNumberLocalStorageKey =
    'webcaptioner-channels-webhook-sequence-number';

  const unsubscribeFn = $store.subscribe((mutation, state) => {
    if (['captioner/APPEND_TRANSCRIPT_STABILIZED'].includes(mutation.type)) {
      if (mutation.type === 'captioner/APPEND_TRANSCRIPT_STABILIZED') {
        transcriptBuffer.push(mutation.payload.transcript);
      }
    }
  });

  const errorDates = [];

  const webhookSendInterval = setInterval(() => {
    if (!transcriptBuffer.length) {
      return;
    }

    try {
      let localStorageValues = JSON.parse(
        localStorage.getItem(sequenceNumberLocalStorageKey)
      );

      if (localStorageValues.url === channelParameters.url) {
        // The stored sequenceNumber is for the current API token and not
        // a previous one. Restore the value.
        lastSequenceNumber = Number(localStorageValues.lastSequenceNumber);
      }
    } catch (e) {
      // No local storage value found. Assume we're starting over.
      lastSequenceNumber = 0;
    }

    // Consume the buffer
    transcriptCurrentlyDisplayed.push(...transcriptBuffer);
    transcriptBuffer = [];

    let apiPath = new URL(channelParameters.url);

    const transcript = transcriptCurrentlyDisplayed
      .join(' ')
      .replace(' \n ', '\n') // remove spaces around line breaks
      .trim();

    const webhookErrorHandler = (e) => {
      errorDates.push(new Date());

      const errorPeriodSeconds = 30;
      const maxErrorsInPeriod = 10;
      const errorPeriodStartDate = new Date(
        Date.now() - 1000 * errorPeriodSeconds
      );

      if (
        errorDates.filter((date) => date > errorPeriodStartDate).length >
        maxErrorsInPeriod
      ) {
        $store.commit('UPDATE_CHANNEL_ERROR', {
          channelId,
          error: `This channel has been turned off because we received an error ${maxErrorsInPeriod} times in the last ${errorPeriodSeconds} seconds that this channel was on. Make sure your webhook URL is correct and your application is returning a 200-level status response code.`,
        });

        // Turn off the channel because it's not configured correctly
        $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', {
          channelId,
          onOrOff: false,
        });
        return;
      }
    };

    if (channelParameters.origin === 'remote') {
      // Proxy through server
      // Not implemented yet
      // $axios
      //   .$post('/api/channels/webhook/api', {
      //     apiPath,
      //     transcript,
      //   })
      //   .catch(webhookErrorHandler);
    } else {
      // Call locally from this browser
      fetch(apiPath.toString(), {
        method: channelParameters.method === 'post' ? 'post' : 'put',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
        },
        body: JSON.stringify({ transcript, sequence: lastSequenceNumber }),
      }).catch(webhookErrorHandler);
    }

    transcriptCurrentlyDisplayed = [];
    lastSequenceNumber++;
    localStorage.setItem(
      sequenceNumberLocalStorageKey,
      JSON.stringify({
        lastSequenceNumber,
        url: channelParameters.url,
      })
    );
  }, webhookSendIntervalMs);

  return () => {
    // Unregister function
    unsubscribeFn();
    clearInterval(webhookSendInterval);
  };
};
