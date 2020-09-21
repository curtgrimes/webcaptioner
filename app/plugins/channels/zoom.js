import throttle from 'lodash.throttle';

export default ({ $store, $axios, channelId, channelParameters }) => {
  // Register
  if (!channelParameters.zoomApiToken) {
    $store.commit('UPDATE_CHANNEL_ERROR', {
      channelId,
      error: 'Zoom API token is missing.',
    });

    // Turn off the channel because it's not configured correctly
    $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff: false });
    // No need to unregister here because we haven't registered yet
    return;
  }

  try {
    new URL(channelParameters.zoomApiToken);
  } catch (e) {
    $store.commit('UPDATE_CHANNEL_ERROR', {
      channelId,
      error:
        'This channel has been turned off because the Zoom API token is not a valid URL. Make sure the Zoom API token is correct and try again.',
    });

    // Turn off the channel because it's not configured correctly
    $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff: false });
    // No need to unregister here because we haven't registered yet
    return;
  }

  const zoomMaxCharactersPerLine = 32;
  const zoomSequenceNumberLocalStorageKey =
    'webcaptioner-channels-zoom-sequence-number';

  let completeLines = []; // an array of arrays of words
  let lineInProgress = [];
  let automaticallyMarkLineCompleteAfterSilenceTimeout;
  let sequence = 0;

  const getSavedSequenceNumber = () => {
    // Get possibly saved sequence number from localStorage
    try {
      const localStorageValues = JSON.parse(
        localStorage.getItem(zoomSequenceNumberLocalStorageKey)
      );

      if (localStorageValues.zoomApiToken === channelParameters.zoomApiToken) {
        // The stored sequenceNumber is for the current Zoom url (meeting) and not
        // a previous one.
        return Boolean(Number(localStorageValues.sequence))
          ? Number(localStorageValues.sequence)
          : 0;
      }
    } catch (e) {
      // No local storage value found. Assume we're starting over.
      return 0;
    }

    return 0;
  };

  const updateSequenceNumberLocalStorage = (sequence) => {
    localStorage.setItem(
      zoomSequenceNumberLocalStorageKey,
      JSON.stringify({
        sequence,
        zoomApiToken: channelParameters.zoomApiToken,
      })
    );
  };

  const sequenceNumberUpdater = () => {
    updateSequenceNumberLocalStorage(sequence);
  };

  window.addEventListener('beforeunload', sequenceNumberUpdater);

  if ($store.state.captioner.shouldBeOn) {
    // Captioning already in progress when this channel was turned on
    sequence = getSavedSequenceNumber();
  }

  const unsubscribeFn = $store.subscribe((mutation, state) => {
    if (mutation.type === 'captioner/APPEND_TRANSCRIPT_STABILIZED') {
      clearTimeout(automaticallyMarkLineCompleteAfterSilenceTimeout);
      lineInProgress.push(mutation.payload.transcript);

      if (lineInProgress.join(' ').length > zoomMaxCharactersPerLine) {
        // The line is now too long. Save to completeLines.
        if (lineInProgress.length === 1) {
          // Save the whole line because we only have one really long word.
          completeLines.push([...lineInProgress.splice(0)]);
        } else {
          // Save everything but the last word, because that last word was
          // what put us beyond zoomMaxCharactersPerLine
          completeLines.push([
            ...lineInProgress.splice(0, lineInProgress.length - 1),
          ]);
        }
      }
      decideIfShouldSendToZoom(completeLines, lineInProgress);

      automaticallyMarkLineCompleteAfterSilenceTimeout = setTimeout(() => {
        // We've waited long enough without getting new text.
        // Mark the lineInProgress we have now as complete, even
        // if it doesn't fill a line completely.
        completeLines.push([...lineInProgress.splice(0)]);
        decideIfShouldSendToZoom(completeLines, lineInProgress, {
          forceSend: true,
        });
      }, 2000);
    } else if (mutation.type === 'captioner/SET_SHOULD_BE_ON') {
      if (mutation.payload.shouldBeOn) {
        // Captioning started
        sequence = getSavedSequenceNumber();
      } else {
        // Captioning ended
        updateSequenceNumberLocalStorage(sequence);
      }
    }
  });

  const decideIfShouldSendToZoom = (
    completeLines = [],
    lineInProgress = [],
    { forceSend = false } = {}
  ) => {
    let linesToSendToZoom = [];
    if (
      !channelParameters.frequentUpdates &&
      (completeLines.length >= 2 || forceSend)
    ) {
      // We have at least two complete lines.
      linesToSendToZoom = completeLines.splice(0, 2);
      sendToZoom(lineFormatter(linesToSendToZoom));
    } else if (channelParameters.frequentUpdates) {
      // Send the last complete line plus the currently in-progress line
      linesToSendToZoom = [
        ...(completeLines?.[completeLines.length - 1]
          ? [completeLines[completeLines.length - 1]]
          : []),
        ...(lineInProgress.length ? [lineInProgress] : []),
      ];
      sendToZoom(lineFormatter(linesToSendToZoom));

      // Clean up lines we will no longer need
      if (completeLines.length > 2) {
        completeLines.splice(0, completeLines.length - 2);
      }
    }
  };

  const lineFormatter = (lines) => {
    return lines.map((line) => line.join(' ')).join('\n');
  };

  let errorDates = [];

  const sendToZoom = throttle(async (transcript) => {
    let apiPath = new URL(channelParameters.zoomApiToken);
    apiPath.searchParams.append('seq', String(sequence));
    apiPath.searchParams.append(
      'lang',
      $store.state.settings.locale.from || 'en-US'
    );

    try {
      // Increment sequence number before
      // making the call because the call will take
      // time, and more calls may happen during this time
      sequence++;
      updateSequenceNumberLocalStorage(sequence);
      await $axios.$post('/api/channels/zoom', {
        apiPath,
        transcript,
      });
    } catch (e) {
      errorDates.push(new Date());

      const errorPeriodSeconds = 30;
      const maxErrorsInPeriod = 4;
      const errorPeriodStartDate = new Date(
        Date.now() - 1000 * errorPeriodSeconds
      );

      if (
        errorDates.filter((date) => date > errorPeriodStartDate).length >
        maxErrorsInPeriod
      ) {
        $store.commit('UPDATE_CHANNEL_ERROR', {
          channelId,
          error: `This channel has been turned off because we received an error back from Zoom ${maxErrorsInPeriod} times in the last ${errorPeriodSeconds} seconds that this channel was on. Make sure your Zoom API token is correct and valid for an active meeting and try again. If your meeting is not started yet, wait until your meeting is started before activating this channel. Note that you will need a new Zoom API token for every meeting.`,
        });

        // Turn off the channel because it's not configured correctly
        $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', {
          channelId,
          onOrOff: false,
        });
        return;
      }
    }
  }, 2500);

  return () => {
    // Unregister function
    unsubscribeFn();
    clearInterval(automaticallyMarkLineCompleteAfterSilenceTimeout);
    window.removeEventListener('beforeunload', sequenceNumberUpdater);
  };
};
