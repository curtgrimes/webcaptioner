const start = function start(RemoteEventBus) {
    let chromelessWindow = window.open('/receivers/chromeless', 'WebCaptionerChild', 'height=700,width=900,toolbar=0,location=0,menubar=0');

    RemoteEventBus.$on('sendMutationToReceivers', ({type, payload}) => {
        chromelessWindow.dispatchEvent(new CustomEvent('processMessage', {detail: {type, payload}}));
    });
};

export default {
    start
}