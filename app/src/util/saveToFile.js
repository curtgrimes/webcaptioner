export function saveToTextFile({transcript, dateFormatter, onDone}) {
    var a = document.createElement('a');
    a.href = 'data:text/plain;base64,' + btoa(transcript);
    a.textContent = 'download';
    a.download = 'web-captioner-'+ dateFormatter(new Date(), 'YYYY-MM-DD-HH-mm-ss') +'.txt';
    a.click();

    onDone();
};

export function saveToWordFile({transcript, dateFormatter, onDone}) {
    var link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['\ufeff', transcript], {
        type: 'application/msword'
      }));
    link.textContent = 'download';
    link.download = 'web-captioner-'+ dateFormatter(new Date(), 'YYYY-MM-DD-HH-mm-ss') +'.doc';
    link.click();

    onDone();
};