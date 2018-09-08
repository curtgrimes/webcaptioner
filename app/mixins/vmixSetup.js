const checkIfExtensionInstalled = function (chromeExtensionId) {
    return new Promise(function(resolve, reject) {
        chrome.runtime.sendMessage(
            chromeExtensionId,
            {
                getExtensionVersion: true,
            },
            function(version) {
                resolve(Boolean(version));
            }
        );
    });
}

const testWebControllerConnectivity = function (path, chromeExtensionId) {
   return new Promise(function(resolve, reject) {
        chrome.runtime.sendMessage(
            chromeExtensionId,
            {path},
            function(response) {
                resolve(response && response.success && response.code && response.code == 200);
                    // reject('Cannot connect to vMix. Make sure Web Controller is enabled in vMix and that you\'ve copied over the website address correctly.');
            }
        );
    })
};

const sendMessage = function (path, chromeExtensionId) {
    return new Promise(function(resolve, reject) {
        chrome.runtime.sendMessage(
            chromeExtensionId,
            {path},
            function(response) {
                if (response && response.success && response.code && response.code == 200) {
                    // Success!
                    resolve(response);
                }
                else {
                    resolve(false);
                }
            }
        );
    })
};

export default {checkIfExtensionInstalled, testWebControllerConnectivity, sendMessage};