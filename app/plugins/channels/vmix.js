export default ({ $store, $axios, channelId, channelParameters }) => {
  // Register
  if (!channelParameters.vmixAddress) {
    $store.commit('UPDATE_CHANNEL_ERROR', {
      channelId,
      error: 'The vMix address is missing.',
    });

    // Turn off the channel because it's not configured correctly
    $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff: false });
    // No need to unregister here because we haven't registered yet
    return;
  }

  try {
    new URL(channelParameters.vmixAddress);
  } catch (e) {
    $store.commit('UPDATE_CHANNEL_ERROR', {
      channelId,
      error:
        'This channel has been turned off because the vMix address is not a valid URL. Make sure the vMix address is correct and try again.',
    });

    // Turn off the channel because it's not configured correctly
    $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff: false });
    // No need to unregister here because we haven't registered yet
    return;
  }

  let transcriptBuffer = [];
  let transcriptCurrentlyDisplayed = [];

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
      } else if (mutation.type === 'captioner/CLEAR_TRANSCRIPT') {
        transcriptBuffer = ['\n', '\n'];
      }
    }
  });

  const errorDates = [];
  const MAX_LINE_LENGTH = 40;

  const vmixSendInterval = setInterval(async () => {
    if (!transcriptBuffer.length) {
      return;
    }

    // Consume the buffer
    transcriptCurrentlyDisplayed.push(...transcriptBuffer);
    transcriptBuffer = [];

    let apiPath = new URL(channelParameters.vmixAddress);
    apiPath.searchParams.append(
      'lang',
      $store.state.settings.locale.from || 'en-US'
    );

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

      if (someWordsAfterLastLineBreak.join(' ').length > MAX_LINE_LENGTH) {
        // Add a line break before the `i`th word
        transcriptCurrentlyDisplayed.splice(i, 0, '\n');
        break;
      }
    }

    // Enforce two lines max by removing content before the
    // first line break if we now have two line breaks
    if (
      transcriptCurrentlyDisplayed.filter((word) => word === '\n').length >= 2
    ) {
      const firstLineBreakIndex = transcriptCurrentlyDisplayed.findIndex(
        (word) => word === '\n'
      );

      transcriptCurrentlyDisplayed.splice(0, firstLineBreakIndex + 1);
    }

    const transcript = transcriptCurrentlyDisplayed
      .join(' ')
      .replace(' \n ', '\n') // remove spaces around line breaks
      .trim();

    // This is a vMix API call
    let url = new URL(channelParameters.vmixAddress);
    url.searchParams.set('Function', 'SetText');
    url.searchParams.set('Input', channelParameters.captionElementGuid);
    url.searchParams.set('SelectedName', 'WebCaptionerCaptions');
    url.searchParams.set('Value', transcript);

    if (channelParameters.silentlyUseLocalhostInsteadOfGivenHost) {
      url.hostname = 'localhost';
      url.protocol = 'http:';
    }

    try {
      await Promise.race([
        $axios.$get(url), // not really a get, more like a post; vMix's API only accepts get

        // if it doesn't respond quickly enough, reject any
        // future response and assume we can't connect
        new Promise((resolve, reject) => setTimeout(reject, 3000)),
      ]);
    } catch (e) {
      console.error('vMix error', e);
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
          error: `This channel has been turned off because we received an error back from vMix ${maxErrorsInPeriod} times in the last ${errorPeriodSeconds} seconds that this channel was on. Make sure your vMix address is correct and that you've added the given title template.`,
        });

        // Turn off the channel because it's not configured correctly
        $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', {
          channelId,
          onOrOff: false,
        });
        return;
      }
    }
  }, 100); // This is a lot lower than the webhook interval because we're assuming vMix is on the local network, so we're more comfortable with making frequent updates

  return () => {
    // Unregister function
    unsubscribeFn();
    clearInterval(vmixSendInterval);
  };
};
