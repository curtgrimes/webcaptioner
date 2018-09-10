function commitToWindow(windowInstance, type, payload) {
    windowInstance.dispatchEvent(new CustomEvent('processVuexMutation', {detail: {type, payload}}));
}
function actionToWindow(windowInstance, type, payload) {
    windowInstance.dispatchEvent(new CustomEvent('processVuexAction', {detail: {type, payload}}));
}

export default {
    methods: {
        start(RemoteEventBus, settings, onClose) {
            let chromelessWindow = window.open('/receivers/chromeless', 'WebCaptionerChild', 'height=700,width=900,toolbar=0,location=0,menubar=0');
        
            if (!chromelessWindow) {
                alert('Unable to open a new window.');
                return;
            }
        
            RemoteEventBus.$on('sendMutationToReceivers', ({type, payload}) => {
                commitToWindow(chromelessWindow, type, payload);
            });

            function restoreSettings() {
                actionToWindow(chromelessWindow, 'RESTORE_SETTINGS', { settings });

                // Only do it once for this window
                window.removeEventListener('receiverIsReadyToReceiveMutations', restoreSettings);
            }
            window.addEventListener('receiverIsReadyToReceiveMutations', restoreSettings);
        
            // I wanted to check for the unload event here, but it also fires on reload
            // and the load event didn't fire reliably when refreshing. So for now this interval
            // seemed more reliable.
            let checkOpenInterval;
        
            checkOpenInterval = setInterval(function(){
                if (!chromelessWindow || chromelessWindow.closed) {
                    onClose();
                    clearInterval(checkOpenInterval);
                }
            },500);
        },
    }
}