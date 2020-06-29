export default ({ $store, $axios, channelId, channelParameters }) => {
  // Register
  if (!channelParameters.url) {
    $store.commit('UPDATE_CHANNEL_ERROR', {
      channelId,
      error: 'YouTube API path is missing.',
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
        'This channel has been turned off because the YouTube closed captions ingestion URL is not a valid URL. Make sure the YouTube closed captions ingestion URL is correct and try again.',
    });

    // Turn off the channel because it's not configured correctly
    $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff: false });
    // No need to unregister here because we haven't registered yet
    return;
  }

  let transcriptBuffer = [];
  let transcriptCurrentlyDisplayed = [];
  const maxCharactersPerLine = 40;
  let lastSequenceNumber = 0;
  const youtubeSequenceNumberLocalStorageKey =
    'webcaptioner-channels-youtube-sequence-number';

  const unsubscribeFn = $store.subscribe((mutation, state) => {
    if (
      [
        'captioner/APPEND_TRANSCRIPT_STABILIZED',
        'captioner/APPEND_TRANSCRIPT_FINAL',
        'captioner/CLEAR_TRANSCRIPT',
      ].includes(mutation.type)
    ) {
      if (mutation.type === 'captioner/APPEND_TRANSCRIPT_STABILIZED') {
        transcriptBuffer.push(mutation.payload.transcript);
      } else if (
        (mutation.type === 'captioner/APPEND_TRANSCRIPT_FINAL' &&
          mutation.payload.clearLimitedSpaceReceivers) ||
        mutation.type === 'captioner/CLEAR_TRANSCRIPT'
      ) {
        // Clear the output (this doesn't work completely yet)
        transcriptBuffer = ['\n', '\n'];
      }
    }
  });

  const errorDates = [];
  let intervalsWithoutBufferClear = 0;
  const youtubeSendInterval = setInterval(() => {
    if (!transcriptBuffer.length) {
      return;
    }

    try {
      let localStorageValues = JSON.parse(
        localStorage.getItem(youtubeSequenceNumberLocalStorageKey)
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

    // Consume the buffer ONLY WHEN IT IS FULL

    transcriptCurrentlyDisplayed.push(...transcriptBuffer);
    transcriptBuffer = [];

    // Add line breaks if necessary
    const firstWordAfterLastLineBreakIndex =
      transcriptCurrentlyDisplayed.lastIndexOf('\n') + 1; // or this may be '0' if there are no line breaks yet
    for (
      let i = firstWordAfterLastLineBreakIndex;
      i < transcriptCurrentlyDisplayed.length;
      i++
    ) {
      // Check the length by adding one more word at a time
      // up to but not including last
      const someWordsAfterLastLineBreak = transcriptCurrentlyDisplayed.slice(
        firstWordAfterLastLineBreakIndex,
        i + 1
      );

      if (someWordsAfterLastLineBreak.join(' ').length > maxCharactersPerLine) {
        // Add a line break before the `i`th word
        transcriptCurrentlyDisplayed.splice(i, 0, '\n');
        break;
      }
    }

    // Enforce two lines max by removing content before the
    // first line break if we now have two line breaks
    let transcriptRemovedFromBufferToSend = [];
    if (
      transcriptCurrentlyDisplayed.filter((word) => word === '\n').length >= 2
    ) {
      const firstLineBreakIndex = transcriptCurrentlyDisplayed.findIndex(
        (word) => word === '\n'
      );

      transcriptRemovedFromBufferToSend = transcriptCurrentlyDisplayed.splice(
        0,
        firstLineBreakIndex + 1
      );
    }

    if (intervalsWithoutBufferClear > 6) {
      transcriptRemovedFromBufferToSend = transcriptCurrentlyDisplayed;
      transcriptCurrentlyDisplayed = [];
    }

    if (transcriptRemovedFromBufferToSend.length > 0) {
      intervalsWithoutBufferClear = 0;
      const transcript = transcriptRemovedFromBufferToSend
        .join(' ')
        .replace(' \n ', '\n') // remove spaces around line breaks
        .trim();

      if (!transcript) {
        return;
      }

      let apiPath = new URL(channelParameters.url);
      apiPath.searchParams.append('seq', String(lastSequenceNumber));

      $axios
        .$post('/api/channels/youtube', {
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
              error: `This channel has been turned off because we received an error back from YouTube ${maxErrorsInPeriod} times in the last ${errorPeriodSeconds} seconds that this channel was on. Make sure your YouTube closed captions ingestion URL is correct. Note that you will need a new YouTube closed captions ingestion URL for every live stream.`,
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
        youtubeSequenceNumberLocalStorageKey,
        JSON.stringify({
          lastSequenceNumber,
          url: channelParameters.url,
        })
      );
    }
  }, 1000);

  return () => {
    // Unregister function
    unsubscribeFn();
    clearInterval(youtubeSendInterval);
  };
};
