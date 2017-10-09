$(function(){
    if (!$('#vmixModal').length) {
        return;
    }

    loadVmixSettings();
    updateVmixOnOffBadge();
    
    $('#vmixModal').on('show.bs.modal', function() {
        updateVmixSteps();
    });

    $('#vmixModal').on('hide.bs.modal', function() {
        // Check if vMix is setup properly on exit;
        // if not, turn off the vMix toggle
        checkIfExtensionInstalled()
            .then(function() {
                return sendVmixMessage('').catch(function(){});
            })
            .catch(function(){
                saveVmixOnOrOff(false);
            });
        
    });

    $('#vmixWebControllerAddress').val(window._wc.vmix.address);

    $('#saveVmixButton').on('click', function() {
        window._wc.vmix.address = $('#vmixWebControllerAddress').val().trim();

        var settings = JSON.parse(window.localStorage.getItem("webcaptioner-settings")) || {};
        settings.vmix = window._wc.vmix;

        window.localStorage.setItem("webcaptioner-settings", JSON.stringify(settings));

        $('#vmixModal').modal('hide');
        
        ga('send', 'event', 'settings', 'setVmixOn', (window._wc.vmix.on ? 'true' : 'false'));
    });

    $('#cancelVmixButton').on('click', function() {
        $('#vmixWebControllerAddress').val(window._wc.vmix.address);

        $('#vmixModal').modal('hide');
        ga('send', 'event', 'settings', 'cancelVmix');
    });

    $('#addExtensionToChromeButton').on('click', function() {
        chrome.webstore.install(null, updateVmixSteps);
    });

    $('#testConnectionButton').on('click', function(){
        testVmixConnectionAndUpdateDialogUI(false);
    });
    $('#testVmixTitleButton').on('click', function(){
        testVmixTitleExistsAndUpdateDialogUI(false);
    });
});

function vmixTimeout() {
    return new Promise(function(resolve, reject) {
        var id = setTimeout(function() {
            clearTimeout(id);
            reject('Could not connect to vMix in time.')
        }, 3000);
    })
};

function updateVmixSteps() { 
    // Step 1 - Check if extension is installed
    checkIfExtensionInstalled()
        .then(function() {
            // Success. Show "Extension added" button
            $('#addExtensionToChromeButton').attr('hidden', true);
            $('#extensionIsAddedToChromeButton').removeAttr('hidden');
            updateVmixStepHeading(1, true, true);
        })
        .catch(function() { // Error
            $('#addExtensionToChromeButton').removeAttr('hidden');
            $('#extensionIsAddedToChromeButton').attr('hidden', true);
            updateVmixStepHeading(1, false, true);
        });

    // Step 2
    testVmixConnectionAndUpdateDialogUI(true);

    // Step 3
    testVmixTitleExistsAndUpdateDialogUI(true);
}

function checkIfExtensionInstalled() {
    return new Promise(function(resolve, reject) {
        chrome.runtime.sendMessage(
            chromeExtensionId,
            {
                getExtensionVersion: true,
            },
            function(version) {
                if (version) {
                    resolve();
                }
                else {
                    reject();
                }
            }
        );
    });
}

function updateVmixStepHeading(stepNumber, complete, initialCheck) {
    var $step = $('.vmixStep[data-vmix-step="'+ stepNumber +'"]');
    if (complete) {
        $step.find('.badge.badge-danger').attr('hidden', true);
        $step.find('.badge.badge-success').removeAttr('hidden');
        if (initialCheck) {
            // Collapse only on the initial check
            $step.find('.collapse').removeClass('show');
        }
        $step.attr('data-error-state', 'false');
    }
    else {
        $step.find('.badge.badge-danger').removeAttr('hidden');
        $step.find('.badge.badge-success').attr('hidden', true);
        $step.parent('.vmixStep').find('.collapse').addClass('show');
        $step.attr('data-error-state', 'true');
    }

    if ($('.vmixStep[data-error-state="true"]').length > 0) {
        // There are errors
        $('#vmixStepHasErrorStateIndicator').removeAttr('hidden');
        window._wc.vmix.on = false;
    }
    else {
        $('#vmixStepHasErrorStateIndicator').attr('hidden', true);
    }
}

function testVmixConnection(initialCheck) {
    return Promise.race([
        vmixTimeout(),
        new Promise(function(resolve, reject) {
            chrome.runtime.sendMessage(
                chromeExtensionId,
                {
                    path: $('#vmixWebControllerAddress').val().trim() + '/API',
                },
                function(response) {
                    if (response && response.success && response.code && response.code == 200) {
                        // Success!
                        resolve(response);
                    }
                    else {
                        reject('Cannot connect to vMix. Make sure Web Controller is enabled in vMix and that you\'ve copied over the website address correctly.');
                    }
                }
            );
        })
    ]);
}

function testVmixConnectionAndUpdateDialogUI(initialCheck) {
    $('#testConnectionButton')
        .attr('disabled', true)
        .removeClass('btn-success')
        .addClass('btn-info')
        .find('i').attr('hidden',true);
    $('#vmixWebControllerAddress').attr('disabled', true);
    $('#testConnectionSpinner').removeAttr('hidden');
    $('#couldNotConnectMessage, #connectionSuccessMessage').attr('hidden', true);
    
    testVmixConnection(initialCheck)
        .then(function(){
            // Success
            updateVmixStepHeading(2, true, initialCheck);
            $('#testConnectionButton')
                .removeAttr('disabled')
                .addClass('btn-success')
                .removeClass('btn-info')
                .find('i').removeAttr('hidden');
            $('#testConnectionSpinner, #couldNotConnectMessage').attr('hidden',true);
            $('#connectionSuccessMessage').removeAttr('hidden');
            $('#vmixWebControllerAddress').removeAttr('disabled');
        })
        .catch(function(error){
            // Failure
            updateVmixStepHeading(2, false, true);
            $('#testConnectionButton').removeAttr('disabled');
            $('#testConnectionSpinner, #connectionSuccessMessage').attr('hidden',true);
            if (!initialCheck) {
                // Don't show an error message on the iniital check
                $('#couldNotConnectMessage').removeAttr('hidden');
            }
            $('#vmixWebControllerAddress').removeAttr('disabled');
        });
}

function sendVmixMessage(message, initialCheckTest) {
    return Promise.race([
        vmixTimeout(),
        new Promise(function(resolve, reject) {
            chrome.runtime.sendMessage(
                chromeExtensionId,
                {
                    path: $('#vmixWebControllerAddress').val().trim() + '/API/?Function=SetText&Input='+ window._wc_cached_vmix_guid +'&SelectedName=WebCaptionerCaptions&Value='+encodeURIComponent(message),
                },
                function(response) {
                    if (response && response.success) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                }
            );
        })
    ]);
}

function testVmixTitleExistsAndUpdateDialogUI(initialCheck) {
    $('#testVmixTitleButton')
        .attr('disabled', true)
        .removeClass('btn-success')
        .addClass('btn-info')
        .find('i').attr('hidden',true);
    $('#testVmixTitleSpinner').removeAttr('hidden');
    $('#testVmixTitleErrorMessage, #testVmixTitleSuccessMessage').attr('hidden', true);

    var testTitleDateString = 'Successful test from Web Captioner. The date is ' + new Date().toISOString() + '.';

    testVmixConnection(initialCheck)
        .then(function(response){
            // Success
            // There is an <input></input> element but the browser automatically interprets it as a self-closing <input> tag.
            // We need to rename it to something unique so we can get its children.
            var $xml = $(response.text.replace(/<input /gi,'<webcaptioner-vmix-input ').replace(/\<\/input\>/gi,'</webcaptioner-vmix-input>'));

            var $input = $xml.find('text[name="WebCaptionerCaptions"]').parent('webcaptioner-vmix-input').first();
            if ($input.length > 0) {
                window._wc_cached_vmix_guid = $input.attr('key');

                // Now that we have the GUID, make a request to update the title
                return sendVmixMessage(testTitleDateString).catch(function(){});
            }
            else {
                return Promise.reject('Web Captioner can connect to vMix, but it can\'t find the Web Captioner title template in an input.')
            }
        })
        .then(function() {
            // Success updating title
            updateVmixStepHeading(3, true, initialCheck);
            $('#testVmixTitleButton')
                .removeAttr('disabled')
                .addClass('btn-success')
                .removeClass('btn-info')
                .find('i').removeAttr('hidden');
            $('#testVmixTitleSpinner, #testVmixTitleErrorMessage').attr('hidden',true);
            $('#testVmixTitleSuccessMessage').removeAttr('hidden').text("Success! The title should now be set to \""+ testTitleDateString + "\"");
            $('#vmixWebControllerAddress').removeAttr('disabled');
        })
        .catch(function(message){
            // Error - can't connect
            updateVmixStepHeading(3, false);
            $('#testVmixTitleButton').removeAttr('disabled');
            $('#testVmixTitleSpinner, #testVmixTitleSuccessMessage').attr('hidden',true);
            if (!initialCheck) { // Don't show an error message on the iniital check
                $('#testVmixTitleErrorMessage').removeAttr('hidden');
                $('#testVmixTitleErrorMessage').text(message);
                // $('#testVmixTitleErrorMessage').text('Unable to connect to vMix. Go back to step 2.');
                // $('#testVmixTitleErrorMessage').text('Web Captioner can connect to vMix, but it can\'t find the Web Captioner title template in an input.');
            }
        });
}

function updateVmixOnOffBadge() {
    if (window._wc.vmix.on) {
        $('.badge-vmix-status-on').attr('hidden', false);
        $('.badge-vmix-status-off').attr('hidden', true);
    }
    else {
        $('.badge-vmix-status-off').attr('hidden', false);
        $('.badge-vmix-status-on').attr('hidden', true);
    }
}

function loadVmixSettings() {
    // Load settings
    var settings = window.localStorage.getItem("webcaptioner-settings");

    window._wc = window._wc || {};
    window._wc.vmix = {};
    if (settings) {
        settings = JSON.parse(settings);
        if (settings.vmix) {
            window._wc.vmix.on = settings.vmix.on;
            window._wc.vmix.address = settings.vmix.address;
        }
    }
    // Set defaults if none loaded from settings
    window._wc.vmix.on = window._wc.vmix.on || false;
    window._wc.vmix.address = window._wc.vmix.address || null;
}

function saveVmixOnOrOff(onOrOff) {
    var settings = JSON.parse(window.localStorage.getItem("webcaptioner-settings")) || {};
    settings.vmix = window._wc.vmix;
    settings.vmix.on = onOrOff;
    window.localStorage.setItem("webcaptioner-settings", JSON.stringify(settings));
    updateVmixOnOffBadge();
}