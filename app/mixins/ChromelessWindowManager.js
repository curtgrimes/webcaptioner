import throttle from 'lodash.throttle';

function commitToWindow(windowInstance, type, payload) {
  windowInstance.dispatchEvent(
    new CustomEvent('processVuexMutation', {
      detail: {
        type,
        payload,
      },
    })
  );
}

function actionToWindow(windowInstance, type, payload) {
  windowInstance.dispatchEvent(
    new CustomEvent('processVuexAction', {
      detail: {
        type,
        payload,
      },
    })
  );
}

export default {
  methods: {
    start(
      RemoteEventBus,
      {
        settings,
        transcriptInterim,
        transcriptFinal,
        transcriptTyped,
        windowDimensions: { left = 0, top = 0, width = 900, height = 700 },
      },
      onClose,
      onWindowSizePositionChange
    ) {
      let chromelessWindow = window.open(
        '/receivers/chromeless',
        'WebCaptionerChild',
        `left=${left},top=${top},width=${width},height=${height},toolbar=0,location=0,menubar=0`
      );

      if (!chromelessWindow) {
        alert('Unable to open a new window.');
        return;
      }

      RemoteEventBus.$on('sendMutationToReceivers', ({ mutation, payload }) => {
        commitToWindow(chromelessWindow, mutation, payload);
      });

      function restoreSettings() {
        actionToWindow(chromelessWindow, 'RESTORE_SETTINGS_OBJECT', {
          settings,
        });
        commitToWindow(chromelessWindow, 'captioner/SET_TRANSCRIPT_INTERIM', {
          transcriptInterim,
        });
        commitToWindow(chromelessWindow, 'captioner/SET_TRANSCRIPT_FINAL', {
          transcriptFinal,
        });
        commitToWindow(chromelessWindow, 'captioner/SET_TRANSCRIPT_TYPED', {
          transcriptTyped,
        });

        // Only do it once for this window
        window.removeEventListener(
          'receiverIsReadyToReceiveMutations',
          restoreSettings
        );
      }
      window.addEventListener(
        'receiverIsReadyToReceiveMutations',
        restoreSettings
      );

      // I wanted to check for the unload event here, but it also fires on reload
      // and the load event didn't fire reliably when refreshing. So for now this interval
      // seemed more reliable.
      let checkOpenInterval = setInterval(function() {
        if (!chromelessWindow || chromelessWindow.closed) {
          onClose();
          clearInterval(checkOpenInterval);
        }
      }, 500);

      // Save window size and position
      let previousScreenLeft,
        previousScreenTop,
        previousInnerWidth,
        previousInnerHeight;
      let checkWindowSizePositionInterval = setInterval(function() {
        if (!chromelessWindow || chromelessWindow.closed) {
          clearInterval(checkWindowSizePositionInterval);
          return;
        }

        if (
          chromelessWindow.screenLeft !== previousScreenLeft ||
          chromelessWindow.screenTop !== previousScreenTop ||
          chromelessWindow.innerWidth !== previousInnerWidth ||
          chromelessWindow.innerHeight !== previousInnerHeight
        ) {
          onWindowSizePositionChange({
            left: chromelessWindow.screenLeft,
            top: chromelessWindow.screenTop,
            width: chromelessWindow.innerWidth,
            height: chromelessWindow.innerHeight,
          });

          previousScreenLeft = chromelessWindow.screenLeft;
          previousScreenTop = chromelessWindow.screenTop;
          previousInnerWidth = chromelessWindow.innerWidth;
          previousInnerHeight = chromelessWindow.innerHeight;
        }
      }, 1000 * 5);

      chromelessWindow.addEventListener('resize', function() {
        onWindowSizePositionChange({
          left: chromelessWindow.screenLeft,
          top: chromelessWindow.screenTop,
          width: chromelessWindow.innerWidth,
          height: chromelessWindow.innerHeight,
        });
      });

      chromelessWindow.addEventListener('beforeunload', function() {
        // Save window size and position one last time
        onWindowSizePositionChange({
          left: chromelessWindow.screenLeft,
          top: chromelessWindow.screenTop,
          width: chromelessWindow.innerWidth,
          height: chromelessWindow.innerHeight,
        });
      });
    },
  },
};
