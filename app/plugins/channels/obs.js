import OBSWebSocket from 'obs-websocket-js';
import throttle from 'lodash.throttle';

export default async ({ $store, $axios, channelId, channelParameters }) => {
  // Register

  const handleError = (e, maxErrorsInPeriod, errorPeriodSeconds) => {
    let isAuthenticationRelatedError = e.error
      ?.toLowerCase()
      .includes('authentic');

    let errorMessage;

    if (isAuthenticationRelatedError) {
      errorMessage = `OBS replied with "${e.error}" - Is the OBS WebSocket plugin using a password, and does it match the password in Web Captioner?`;
    } else if (maxErrorsInPeriod >= 0 && errorPeriodSeconds >= 0) {
      errorMessage = `This channel has been turned off because we received an error back from OBS ${maxErrorsInPeriod} times in the last ${errorPeriodSeconds} seconds that this channel was on. Make sure your port number and password (if you are using one) is correct, OBS is running with the OBS websocket plugin enabled, and try again.`;
    } else {
      errorMessage = `This channel has been turned off because we received an error back from OBS. Make sure your port number and password (if you are using one) is correct, OBS is running with the OBS websocket plugin enabled, and try again.`;
    }

    $store.commit('UPDATE_CHANNEL_ERROR', {
      channelId,
      error: errorMessage,
    });

    // Turn off the channel because it's not configured correctly
    $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', {
      channelId,
      onOrOff: false,
    });
  };

  if (!channelParameters.port) {
    $store.commit('UPDATE_CHANNEL_ERROR', {
      channelId,
      error: 'Port number is missing.',
    });

    // Turn off the channel because it's not configured correctly
    $store.commit('TOGGLE_CHANNEL_ON_OR_OFF', { channelId, onOrOff: false });
    // No need to unregister here because we haven't registered yet
    return;
  }

  let obs = new OBSWebSocket();
  try {
    await obs.connect({
      address: `localhost:${channelParameters.port}`,
      password: channelParameters.password,
    });
  } catch (e) {
    handleError(e);
  }

  const maxCharactersPerLine = 32;
  const frequentUpdates = false; // allow for channelParameters.frequentUpdates in the future

  let completeLines = []; // an array of arrays of words
  let lineInProgress = [];
  let automaticallyMarkLineCompleteAfterSilenceTimeout;

  const unsubscribeFn = $store.subscribe((mutation, state) => {
    if (mutation.type === 'captioner/APPEND_TRANSCRIPT_STABILIZED') {
      clearTimeout(automaticallyMarkLineCompleteAfterSilenceTimeout);
      lineInProgress.push(mutation.payload.transcript);

      if (lineInProgress.join(' ').length > maxCharactersPerLine) {
        // The line is now too long. Save to completeLines.
        if (lineInProgress.length === 1) {
          // Save the whole line because we only have one really long word.
          completeLines.push([...lineInProgress.splice(0)]);
        } else {
          // Save everything but the last word, because that last word was
          // what put us beyond maxCharactersPerLine
          completeLines.push([
            ...lineInProgress.splice(0, lineInProgress.length - 1),
          ]);
        }
      }
      decideIfShouldSendToOBS(completeLines, lineInProgress);

      automaticallyMarkLineCompleteAfterSilenceTimeout = setTimeout(() => {
        // We've waited long enough without getting new text.
        // Mark the lineInProgress we have now as complete, even
        // if it doesn't fill a line completely.
        completeLines.push([...lineInProgress.splice(0)]);
        decideIfShouldSendToOBS(completeLines, lineInProgress, {
          forceSend: true,
        });
      }, 2000);
    }
  });

  const decideIfShouldSendToOBS = (
    completeLines = [],
    lineInProgress = [],
    { forceSend = false } = {}
  ) => {
    let linesToSend = [];
    if (!frequentUpdates && (completeLines.length >= 2 || forceSend)) {
      // We have at least two complete lines.
      linesToSend = completeLines.splice(0, 2);
      send(lineFormatter(linesToSend));
    } else if (frequentUpdates) {
      // Send the last complete line plus the currently in-progress line
      linesToSend = [
        ...(completeLines?.[completeLines.length - 1]
          ? [completeLines[completeLines.length - 1]]
          : []),
        ...(lineInProgress.length ? [lineInProgress] : []),
      ];
      send(lineFormatter(linesToSend));

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

  const send = throttle(async (text) => {
    try {
      await obs.send('SendCaptions', { text });
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
        handleError(e);
      }
    }
  }, 1000);

  return () => {
    // Unregister function
    unsubscribeFn();
  };
};
