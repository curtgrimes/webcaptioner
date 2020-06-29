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

  let zoomTranscriptBuffer = [];
  let zoomTranscriptCurrentlyDisplayed = [];
  const zoomMaxCharactersPerLine = 40;
  let lastSequenceNumber = 0;
  const zoomSequenceNumberLocalStorageKey =
    'webcaptioner-channels-zoom-sequence-number';

  const unsubscribeFn = $store.subscribe((mutation, state) => {
    if (
      [
        'captioner/APPEND_TRANSCRIPT_STABILIZED',
        'captioner/APPEND_TRANSCRIPT_FINAL',
        'captioner/CLEAR_TRANSCRIPT',
      ].includes(mutation.type)
    ) {
      if (mutation.type === 'captioner/APPEND_TRANSCRIPT_STABILIZED') {
        zoomTranscriptBuffer.push(mutation.payload.transcript);
      } else if (
        (mutation.type === 'captioner/APPEND_TRANSCRIPT_FINAL' &&
          mutation.payload.clearLimitedSpaceReceivers) ||
        mutation.type === 'captioner/CLEAR_TRANSCRIPT'
      ) {
        // Clear the output (this doesn't work completely yet)
        zoomTranscriptBuffer = ['\n', '\n'];
      }
    }
  });

  const errorDates = [];

  const zoomSendInterval = setInterval(() => {
    if (!zoomTranscriptBuffer.length) {
      return;
    }

    try {
      let localStorageValues = JSON.parse(
        localStorage.getItem(zoomSequenceNumberLocalStorageKey)
      );

      if (localStorageValues.zoomApiToken === channelParameters.zoomApiToken) {
        // The stored sequenceNumber is for the current API token and not
        // a previous one. Restore the value.
        lastSequenceNumber = Number(localStorageValues.lastSequenceNumber);
      }
    } catch (e) {
      // No local storage value found. Assume we're starting over.
      lastSequenceNumber = 0;
    }

    // Consume the buffer
    zoomTranscriptCurrentlyDisplayed.push(...zoomTranscriptBuffer);
    zoomTranscriptBuffer = [];

    let apiPath = new URL(channelParameters.zoomApiToken);
    apiPath.searchParams.append('seq', String(lastSequenceNumber));
    apiPath.searchParams.append(
      'lang',
      $store.state.settings.locale.from || 'en-US'
    );

    // Add line breaks if necessary
    const firstWordAfterLastLineBreakIndex =
      zoomTranscriptCurrentlyDisplayed.lastIndexOf('\n') + 1; // or this may be '0' if there are no line breaks yet
    for (
      let i = firstWordAfterLastLineBreakIndex;
      i < zoomTranscriptCurrentlyDisplayed.length;
      i++
    ) {
      // Check the length by adding one more word at a time
      // up to but not including last
      const someWordsAfterLastLineBreak = zoomTranscriptCurrentlyDisplayed.slice(
        firstWordAfterLastLineBreakIndex,
        i + 1
      );

      if (
        someWordsAfterLastLineBreak.join(' ').length > zoomMaxCharactersPerLine
      ) {
        // Add a line break before the `i`th word
        zoomTranscriptCurrentlyDisplayed.splice(i, 0, '\n');
        break;
      }
    }

    // Enforce two lines max by removing content before the
    // first line break if we now have two line breaks
    if (
      zoomTranscriptCurrentlyDisplayed.filter((word) => word === '\n').length >=
      2
    ) {
      const firstLineBreakIndex = zoomTranscriptCurrentlyDisplayed.findIndex(
        (word) => word === '\n'
      );

      zoomTranscriptCurrentlyDisplayed.splice(0, firstLineBreakIndex + 1);
    }

    const transcript = zoomTranscriptCurrentlyDisplayed
      .join(' ')
      .replace(' \n ', '\n') // remove spaces around line breaks
      .trim();

    $axios
      .$post('/api/channels/zoom', {
        apiPath,
        transcript,
      })
      .catch((e) => {
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
            error: `This channel has been turned off because we received an error back from Zoom ${maxErrorsInPeriod} times in the last ${errorPeriodSeconds} seconds that this channel was on. Make sure your Zoom API token is correct and valid for an active meeting and try again. If your meeting is not started yet, wait until your meeting is started before activating this channel. Note that you will need a new Zoom API token for every meeting.`,
          });

          // Turn off the channel because it's not configured correctly
          $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', {
            channelId,
            onOrOff: false,
          });
          return;
        }
      });

    lastSequenceNumber++;
    localStorage.setItem(
      zoomSequenceNumberLocalStorageKey,
      JSON.stringify({
        lastSequenceNumber,
        zoomApiToken: channelParameters.zoomApiToken,
      })
    );
  }, 1000);

  return () => {
    // Unregister function
    unsubscribeFn();
    clearInterval(zoomSendInterval);
  };
};
