<template>
  <div class="bg-white">
    <h3>SRT test</h3>
    <pre>
      {{stabilizedTranscript}}
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

    let srtStartTime;

    for (let i = 0; i < linePairs.length; i++) {
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

      let startTime = linePairs[i].line1[0].time;
      let endTime = getLastWord(linePairs[i]).time;

      if (!srtStartTime) {
        srtStartTime = startTime;
      }

      let startTimestampString = getDurationString(startTime - srtStartTime);
      let endTimestampString = getDurationString(endTime - srtStartTime);

      console.log(i + 1);
      console.log(startTimestampString + ' --> ' + endTimestampString);
      console.log(linePairs[i].line1.map((t) => t.text).join(' '));
      console.log(linePairs[i].line2.map((t) => t.text).join(' '));
      console.log('');
    }
  },
  data: function() {
    return {
      stabilizedTranscript: [
        { time: 1556680498907, text: 'fluent' },
        { time: 1556680498907, text: 'is' },
        { time: 1556680498907, text: 'a' },
        { time: 1556680499906, text: 'family' },
        { time: 1556680499906, text: 'of' },
        { time: 1556680500908, text: 'localization' },
        { time: 1556680502904, text: 'specifications' },
        { time: 1556680503796, text: 'implementations' },
        { time: 1556680505905, text: 'and' },
        { time: 1556680505905, text: 'good' },
        { time: 1556680505905, text: 'practices' },
        { time: 1556680505905, text: 'developed' },
        { time: 1556680505905, text: 'by' },
        { time: 1556680506908, text: 'Mozilla' },
        { time: 1556680508906, text: 'with' },
        { time: 1556680508906, text: 'fluent' },
        { time: 1556680509907, text: 'translators' },
        { time: 1556680510906, text: 'can' },
        { time: 1556680510906, text: 'create' },
        { time: 1556680512192, text: 'expressive' },
        { time: 1556680513905, text: 'translations' },
        { time: 1556680513905, text: 'that' },
        { time: 1556680513905, text: 'sound' },
        { time: 1556680513905, text: 'great' },
        { time: 1556680514904, text: 'in' },
        { time: 1556680514904, text: 'their' },
        { time: 1556680514904, text: 'language' },
        { time: 1556680517904, text: 'today' },
        { time: 1556680517904, text: "we're" },
        { time: 1556680517904, text: 'announcing' },
        { time: 1556680517904, text: 'version' },
        { time: 1556680518907, text: '1.0' },
        { time: 1556680518907, text: 'of' },
        { time: 1556680519906, text: 'the' },
        { time: 1556680519906, text: 'fluid' },
        { time: 1556680519906, text: 'file' },
        { time: 1556680520904, text: 'format' },
        { time: 1556680520904, text: 'specification' },
        { time: 1556680522391, text: 'were' },
        { time: 1556680522391, text: 'inviting' },
        { time: 1556680522692, text: 'translation' },
        { time: 1556680522992, text: 'to' },
        { time: 1556680523291, text: 'authors' },
        { time: 1556680524492, text: 'to' },
        { time: 1556680524492, text: 'try' },
        { time: 1556680524492, text: 'it' },
        { time: 1556680524492, text: 'out' },
        { time: 1556680524492, text: 'and' },
        { time: 1556680524492, text: 'provide' },
        { time: 1556680525091, text: 'feedback' },
      ],
    };
  },
};
</script>
