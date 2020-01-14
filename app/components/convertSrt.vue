<template>
  <div class="bg-white">
    <h3>SRT test</h3>
    <textarea v-model="srt" style="width:100%;height:400px"></textarea>
    <pre>
      {{ stabilizedTranscript }}
    </pre>
  </div>
</template>

<script>
export default {
  mounted: function() {
    const MAX_LINE_LENGTH_CHARACTERS = 42;
    let line1 = [],
      line2 = [],
      line1CharacterCount = 0,
      line2CharacterCount = 0,
      linePairs = [];

    for (let i = 0; i < this.stabilizedTranscript.length; i++) {
      // Decide whether to start a new pair of lines
      if (
        // There hasn't been too much time since the last word
        // There is a previous item
        !this.stabilizedTranscript[i - 1] ||
        // It happened less than 2000 MS before the current item
        this.stabilizedTranscript[i].time -
          this.stabilizedTranscript[i - 1].time <=
          2000
      ) {
        // Figure out whether to put it on line 1, line 2, or on a new line 1
        if (
          // Adding this wouldn't make line 1 too long
          line1CharacterCount + this.stabilizedTranscript[i].text.length <=
            MAX_LINE_LENGTH_CHARACTERS &&
          // And we haven't already started adding to line 2
          line2CharacterCount === 0
        ) {
          line1.push(this.stabilizedTranscript[i]);
          line1CharacterCount += this.stabilizedTranscript[i].text.length;
        } else if (
          // Adding this wouldn't make line 2 too long
          line2CharacterCount + this.stabilizedTranscript[i].text.length <=
          MAX_LINE_LENGTH_CHARACTERS
        ) {
          line2.push(this.stabilizedTranscript[i]);
          line2CharacterCount += this.stabilizedTranscript[i].text.length;
        } else {
          // Start a new pair of lines
          linePairs.push({ line1, line2 });
          line1 = [];
          line2 = [];
          line1CharacterCount = 0;
          line2CharacterCount = 0;

          // Add to line 1
          line1.push(this.stabilizedTranscript[i]);
          line1CharacterCount += this.stabilizedTranscript[i].text.length;
        }
      } else {
        // Start a new pair of lines
        linePairs.push({ line1, line2 });
        line1 = [];
        line2 = [];
        line1CharacterCount = 0;
        line2CharacterCount = 0;

        // Add to line 1
        line1.push(this.stabilizedTranscript[i]);
        line1CharacterCount += this.stabilizedTranscript[i].text.length;
      }
    }

    if (line1.length || line2.length) {
      // One final push
      linePairs.push({ line1, line2 });
    }

    function getLastWord(linePairs) {
      if (linePairs.line2[linePairs.line2.length - 1]) {
        // Line 2 has a last item
        return linePairs.line2[linePairs.line2.length - 1];
      } else {
        // Return line 1's last item
        return linePairs.line1[linePairs.line1.length - 1];
      }
    }
    function getDurationString(ms) {
      // Given a count of milliseconds, get the duration back in the format
      // HH:MM:SS,mmm
      const secondDuration = 1000;
      const minuteDuration = secondDuration * 60;
      const hourDuration = minuteDuration * 60;

      // 7200000 = 2 hours

      let hours = Math.floor(ms / hourDuration);
      let minutes = Math.floor((ms % hourDuration) / minuteDuration);
      let seconds = Math.floor(
        ((ms % hourDuration) % minuteDuration) / secondDuration
      );
      let milliseconds =
        ((ms % hourDuration) % minuteDuration) % secondDuration;

      function zeroPadded(num, digits) {
        return ('0'.repeat(digits) + num).substr(digits * -1, digits);
      }

      return (
        zeroPadded(hours, 2) +
        ':' +
        zeroPadded(minutes, 2) +
        ':' +
        zeroPadded(seconds, 2) +
        ',' +
        zeroPadded(milliseconds, 3)
      );
    }

    let srtStartTime;

    for (let i = 0; i < linePairs.length; i++) {
      let startTime = linePairs[i].line1[0].time;
      let endTime = getLastWord(linePairs[i]).time;

      if (!srtStartTime) {
        // This is the first pairing
        srtStartTime = startTime;
      }

      if (startTime === endTime) {
        // This line pair has the same start and end time.
        // Adjust the end time to be closer to the next line pair, or
        // if that's too far into the future, estimate each word is a small
        // amount of time and adjust the endTime that amount into the future.
        // const nextLinePairStartTime = linePairs[i + 1]?.line1[0]?.time;

        const nextLinePairStartTime = linePairs[i + 1]
          ? linePairs[i + 1].line1[0]
            ? linePairs[i + 1].line1[0].time
            : null
          : null;

        // Estimate a short period of time for each word in this pair
        const maxDurationForThisLinePair =
          (linePairs[i].line1.length + linePairs[i].line2.length) * 500;

        if (
          !nextLinePairStartTime || // We are at the end
          nextLinePairStartTime - endTime > maxDurationForThisLinePair // The next pair start time exceeds the estimated length
        ) {
          // Add the estimated duration instead of using
          // a following pair duration (which doesn't exist or is too far into the future)
          endTime = startTime + maxDurationForThisLinePair;
        } else {
          // Next line pair starts sooner than estimate. Use that
          // start time minus a MS so times don't overlap.
          endTime = nextLinePairStartTime - 1;
        }
      }

      let startTimestampString = getDurationString(startTime - srtStartTime);
      let endTimestampString = getDurationString(endTime - srtStartTime);
      console.log(linePairs[i].line2.length > 0);
      this.srt += (i > 0 ? '\n' : '') + (i + 1);
      this.srt += '\n' + startTimestampString + ' --> ' + endTimestampString;
      this.srt += '\n' + linePairs[i].line1.map((t) => t.text).join(' ');
      this.srt +=
        linePairs[i].line2.length > 0
          ? '\n' + linePairs[i].line2.map((t) => t.text).join(' ')
          : '';
      this.srt += '\n';

      console.log(i + 1);
      console.log(startTimestampString + ' --> ' + endTimestampString);
      console.log(linePairs[i].line1.map((t) => t.text).join(' '));
      console.log(linePairs[i].line2.map((t) => t.text).join(' '));
      console.log('');
    }
  },
  data: function() {
    return {
      srt: '',
      stabilizedTranscript: [
        { time: 1572738126423, text: 'and' },
        { time: 1572738126423, text: 'even' },
        { time: 1572738126723, text: 'before' },
        { time: 1572738127022, text: 'God' },
        { time: 1572738127322, text: 'made' },
        { time: 1572738127921, text: 'anything' },
        { time: 1572738127922, text: 'he' },
        { time: 1572738128222, text: 'knew' },
        { time: 1572738128522, text: 'you' },
        { time: 1572738128822, text: 'and' },
        { time: 1572738129122, text: 'loved' },
      ],
    };
  },
};
</script>