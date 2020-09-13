export default {
  methods: {
    saveToTextFile({ transcript, dateFormatter, onDone }) {
      transcript = transcript.replace('\n', '\r\n');
      var a = document.createElement('a');
      a.href = 'data:text/plain;base64,' + btoa(transcript);
      a.textContent = 'download';
      a.download =
        'web-captioner-' +
        dateFormatter(new Date(), 'yyyy-MM-dd-HH-mm-ss') +
        '.txt';
      a.click();

      onDone();
    },
    saveToWordFile({ transcript, dateFormatter, onDone }) {
      var link = document.createElement('a');
      link.href = URL.createObjectURL(
        new Blob(['\ufeff', transcript], {
          type: 'application/msword',
        })
      );
      link.textContent = 'download';
      link.download =
        'web-captioner-' +
        dateFormatter(new Date(), 'yyyy-MM-dd-HH-mm-ss') +
        '.doc';
      link.click();

      onDone();
    },
    saveToJSONFile({ settings, onDone }) {
      var a = document.createElement('a');
      a.href = 'data:text/plain;base64,' + btoa(settings);
      a.textContent = 'download';
      a.download = 'web-captioner-settings.json';
      a.click();
    },
  },
};
