import throttle from 'lodash.throttle';

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

  const webhookSequenceNumberLocalStorageKey =
    'webcaptioner-channels-webhook-sequence-number';
  let buffer = [];
  let automaticallySendAfterSilenceTimeout;
  let errorDates = [];
  let sequence = 0;

  const getSavedSequenceNumber = () => {
    // Get possibly saved sequence number from localStorage
    try {
      const localStorageValues = JSON.parse(
        localStorage.getItem(webhookSequenceNumberLocalStorageKey)
      );

      const isMoreThan24HoursAgo = (date) =>
        date.getTime() < new Date().getTime() - 1000 * 60 * 60 * 24;

      if (
        localStorageValues.webhookUrl === channelParameters.url &&
        localStorageValues.lastEvent &&
        !isMoreThan24HoursAgo(new Date(localStorageValues.lastEvent))
      ) {
        // The stored sequenceNumber is for the current webhook url and not
        // a previous one. And it's recent (within the last day) Restore the value.
        return Number(localStorageValues.sequence);
      }
    } catch (e) {
      // No local storage value found. Assume we're starting over.
      return 0;
    }

    return 0;
  };

  const unsubscribeFn = $store.subscribe((mutation) => {
    if (mutation.type === 'captioner/APPEND_TRANSCRIPT_STABILIZED') {
      clearTimeout(automaticallySendAfterSilenceTimeout);
      buffer.push(...mutation.payload.transcript.split(' '));

      decideIfShouldSend();

      automaticallySendAfterSilenceTimeout = setTimeout(() => {
        // We've waited long enough without getting new text.
        decideIfShouldSend({
          forceSend: true,
        });
      }, 2000);
    }

    if (mutation.type === 'captioner/SET_SHOULD_BE_ON') {
      if (mutation.payload.shouldBeOn) {
        // Captioning started
        sequence = getSavedSequenceNumber();
      } else {
        // Captioning ended
        updateSequenceNumberLocalStorage(sequence); // do it immediately instead of throttled
      }
    }
  });

  const decideIfShouldSend = ({ forceSend = false } = {}) => {
    if (
      buffer.length &&
      (buffer.length >= channelParameters.chunkingCount || forceSend)
    ) {
      send(buffer.splice(0).join(' '));
    }
  };

  const updateSequenceNumberLocalStorageThrottled = throttle((sequence) => {
    updateSequenceNumberLocalStorage(sequence);
  }, 1000 * 10);

  const updateSequenceNumberLocalStorage = (sequence) => {
    localStorage.setItem(
      webhookSequenceNumberLocalStorageKey,
      JSON.stringify({
        sequence,
        webhookUrl: channelParameters.url,
        lastEvent: new Date(),
      })
    );
  };

  const send = async (transcript) => {
    try {
      // Increment sequence number before
      // making the call because the call will take
      // time, and more calls may happen during this time
      sequence++;
      await fetch(channelParameters.url, {
        // method: channelParameters.method === 'post' ? 'post' : 'put', // put doesn't work with cors
        method: 'post',
        mode: 'no-cors',
        headers: {
          Accept: 'application/json',
        },
        body: JSON.stringify({
          transcript,
          sequence: sequence - 1, // -1 just because we already incremented it
        }),
      });
      updateSequenceNumberLocalStorageThrottled(sequence);
    } catch (e) {
      console.info('Webhook error:', e);
      errorDates.push(new Date());

      const errorPeriodSeconds = 60;
      const maxErrorsInPeriod = 20;
      const errorPeriodStartDate = new Date(
        Date.now() - 1000 * errorPeriodSeconds
      );

      if (
        errorDates.filter((date) => date > errorPeriodStartDate).length >
        maxErrorsInPeriod
      ) {
        $store.commit('UPDATE_CHANNEL_ERROR', {
          channelId,
          error: `This channel has been turned off because we received an error back from the webhook ${maxErrorsInPeriod} times in the last ${errorPeriodSeconds} seconds that this channel was on. Make sure your webhook URL is correct and the webhook responds with a 200-level code.`,
        });

        // Turn off the channel because it's not configured correctly
        $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', {
          channelId,
          onOrOff: false,
        });
        return;
      }
    }
  };

  return () => {
    // Unregister function
    unsubscribeFn();
    clearInterval(automaticallySendAfterSilenceTimeout);
  };
};
