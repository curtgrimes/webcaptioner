export function saveToTextFile({transcript, dateFormatter, onDone}) {
    var a = document.createElement('a');
    a.href = 'data:text/plain;base64,' + btoa(transcript);
    a.textContent = 'download';
    a.download = 'web-captioner-'+ dateFormatter(new Date(), 'YYYY-MM-DD-HH-mm-ss') +'.txt';
    a.click();

    onDone();
};

export function saveToWordFile({transcript, dateFormatter, onDone}) {
    var a = document.createElement('a');
    a.href = 'data:text/html;base64,' + btoa('<html><body>' + transcript + '</body></html>');
    a.textContent = 'download';
    a.download = 'web-captioner-'+ dateFormatter(new Date(), 'YYYY-MM-DD-HH-mm-ss') +'.doc';
    a.click();

    onDone();
};