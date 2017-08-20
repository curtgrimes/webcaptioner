$(function(){
    if (!$('#vmixModal').length) {
        return;
    }

    loadVmixSettings();

    window.showVmixOption = function() {
        // Expand the dropdown
        $('#settingsDropdownContainer .dropdown-toggle[aria-expanded="false"]').click();
        window.localStorage.setItem("webcaptioner-settings-show-vmix",true);

        setTimeout(function(){
            $('#sendToVmixOptionExperimental').removeAttr('hidden');
            setTimeout(function(){
                $('#sendToVmixOptionExperimental').addClass('show');
            },0);

        },300);

        return "You're a superstar! ⭐ Report any issues with this to webcaptioner.com/feedback or facebook.com/webcaptioner. Thanks. ~ Curt";
    };

    if (window._wc.vmix.on) {
        $('#sendToVmixSettingToggle').click().removeAttr('disabled');
    }

    if (window.localStorage.getItem("webcaptioner-settings-show-vmix")) {
        // If this option was ever on, this object exists, so show it in the menu
        $('#sendToVmixOptionExperimental').removeAttr('hidden').addClass('show');
    }
    
    $('#vmixModal').on('show.bs.modal', function() {
        checkIfVmixToggleShouldBeEnabled(window._wc.vmix.on);
        updateVmixSteps();
    });

    $('#vmixWebControllerAddress').val(window._wc.vmix.address);

    $('#sendToVmixSettingToggle').on('click', function() {
        if ($(this).hasClass('active')) {
            // active to inactive
            $(this).removeClass('btn-success active').addClass('btn-secondary');
            $(this).find('i').removeClass('fa-check').addClass('fa-times');
            $(this).find('#send-to-vmix-status-text').text('off');
        }
        else {
            // inactive to active
            $(this).removeClass('btn-secondary').addClass('btn-success active');
            $(this).find('i').removeClass('fa-times').addClass('fa-check');
            $(this).find('#send-to-vmix-status-text').text('on');
        }
    });

    $('#vmixWebControllerAddress').on('change keyup', function() {
        checkIfVmixToggleShouldBeEnabled($('#sendToVmixSettingToggle').hasClass('active'));
    });

    $('#saveVmixButton').on('click', function() {
        window._wc.vmix.on = $('#sendToVmixSettingToggle').hasClass('active');
        window._wc.vmix.address = $('#vmixWebControllerAddress').val().trim();

        var settings = JSON.parse(window.localStorage.getItem("webcaptioner-settings")) || {};
        settings.vmix = window._wc.vmix;

        window.localStorage.setItem("webcaptioner-settings", JSON.stringify(settings));

        $('#vmixModal').modal('hide');
        
        ga('send', 'event', 'settings', 'setVmixOn', (window._wc.vmix.on ? 'true' : 'false'));
    });

    $('#cancelVmixButton').on('click', function() {
        $('#vmixWebControllerAddress').val(window._wc.vmix.address);
        checkIfVmixToggleShouldBeEnabled(window._wc.vmix.on);

        $('#vmixModal').modal('hide');
        ga('send', 'event', 'settings', 'cancelVmix');
    });

    $('#addExtensionToChromeButton').on('click', function() {
        chrome.webstore.install();
    });

    $('#testConnectionButton').on('click', function() {
        testVmixConnection();
    });
    $('#testVmixTitleButton').on('click', function() {
        testVmixTitleExists();
    });
});

function updateVmixSteps() { 
    // Step 1
    if (chrome.app.isInstalled || true) {
        // Show "Extension added" button
        $('#addExtensionToChromeButton').attr('hidden', true);
        $('#extensionIsAddedToChromeButton').removeAttr('hidden');
        updateVmixStepHeading(1, true, true);
    }
    else {
        $('#addExtensionToChromeButton').removeAttr('hidden');
        $('#extensionIsAddedToChromeButton').attr('hidden', true);
        updateVmixStepHeading(1, false, true);
    }


    // Step 2
    updateVmixStepHeading(2, false, true);
    testVmixConnection(true);

    // Step 3
    updateVmixStepHeading(3, false, true);
    testVmixTitleExists(true);
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
        checkIfVmixToggleShouldBeEnabled(window._wc.vmix.on);
        $('#sendToVmixSettingToggle').attr('disabled',true);
    }
    else {
        $('#vmixStepHasErrorStateIndicator').attr('hidden', true);
        $('#sendToVmixSettingToggle').removeAttr('disabled');
    }
}

var showDidNotConnectMessage;
function testVmixConnection(initialCheck) {
    $('#testConnectionButton')
        .attr('disabled', true)
        .removeClass('btn-success')
        .addClass('btn-info')
        .find('i').attr('hidden',true);
    $('#vmixWebControllerAddress').attr('disabled', true);
    $('#testConnectionSpinner').removeAttr('hidden');
    $('#couldNotConnectMessage, #connectionSuccessMessage').attr('hidden', true);

    chrome.runtime.sendMessage(
        chromeExtensionId,
        {
            path: $('#vmixWebControllerAddress').val().trim() + '/API',
        },
        function(response) {
            if (response && response.code && response.code == 200) {
                // Success!
                clearTimeout(showDidNotConnectMessage);
                setTimeout(function(){
                    // Add a short artificial delay so that it looks like
                    // we were actually checking. If it's running on localhost
                    // it will respond instantly.
                    updateVmixStepHeading(2, true, initialCheck);
                    $('#testConnectionButton')
                        .removeAttr('disabled')
                        .addClass('btn-success')
                        .removeClass('btn-info')
                        .find('i').removeAttr('hidden');
                    $('#testConnectionSpinner, #couldNotConnectMessage').attr('hidden',true);
                    $('#connectionSuccessMessage').removeAttr('hidden');
                    $('#vmixWebControllerAddress').removeAttr('disabled');
                },500);
            }
        }
    );
    showDidNotConnectMessage = setTimeout(function(){
        updateVmixStepHeading(2, false);
        $('#testConnectionButton').removeAttr('disabled');
        $('#testConnectionSpinner, #connectionSuccessMessage').attr('hidden',true);
        if (!initialCheck) {
            // Don't show an error message on the iniital check
            $('#couldNotConnectMessage').removeAttr('hidden');
        }
        $('#vmixWebControllerAddress').removeAttr('disabled');
    },5000);
}

var testTitleDateString, showDidNotFinishTestMessage, wasAbleToConnect;
function testVmixTitleExists(initialCheck) {
    $('#testVmixTitleButton')
        .attr('disabled', true)
        .removeClass('btn-success')
        .addClass('btn-info')
        .find('i').attr('hidden',true);
    $('#testVmixTitleSpinner').removeAttr('hidden');
    $('#testVmixTitleErrorMessage, #testVmixTitleSuccessMessage').attr('hidden', true);

    wasAbleToConnect = false;
    testTitleDateString = 'Successful test from Web Captioner. The date is ' + new Date().toISOString() + '.';
    chrome.runtime.sendMessage(
        chromeExtensionId,
        {
            path: $('#vmixWebControllerAddress').val().trim() + '/API',
        },
        function(response) {
            if (response && response.code && response.code == 200) {
                wasAbleToConnect = true;
                var $xml = $(response.text);
                var $inputs = $xml.find('text[name="WebCaptionerCaptions"]').parents('inputs').find('input');
                if ($inputs.length > 0) {
                    var guid = $inputs.attr('key');
                    // Now that we have the GUID, make a request to update the title
                    chrome.runtime.sendMessage(
                        chromeExtensionId,
                        {
                            path: $('#vmixWebControllerAddress').val().trim() + '/API/?Function=SetText&Input='+ guid +'&SelectedName=WebCaptionerCaptions&Value='+encodeURIComponent(testTitleDateString),
                        },
                        function(response) {
                            // Success!
                            clearTimeout(showDidNotFinishTestMessage);
                            updateVmixStepHeading(3, true, initialCheck);
                            $('#testVmixTitleButton')
                                .removeAttr('disabled')
                                .addClass('btn-success')
                                .removeClass('btn-info')
                                .find('i').removeAttr('hidden');
                            $('#testVmixTitleSpinner, #testVmixTitleErrorMessage').attr('hidden',true);
                            $('#testVmixTitleSuccessMessage').removeAttr('hidden').text("Success! The title should now be set to \""+ testTitleDateString + "\"");
                            $('#vmixWebControllerAddress').removeAttr('disabled');
                        }
                    );
                }
            }
        }
    );

    showDidNotFinishTestMessage = setTimeout(function() {
        updateVmixStepHeading(3, false);
        $('#testVmixTitleButton').removeAttr('disabled');
        $('#testVmixTitleSpinner, #testVmixTitleSuccessMessage').attr('hidden',true);
        if (!initialCheck) { // Don't show an error message on the iniital check
            $('#testVmixTitleErrorMessage').removeAttr('hidden');
            if (wasAbleToConnect) {
                $('#testVmixTitleErrorMessage').text('Web Captioner can connect to vMix, but it can\'t find the Web Captioner title template in an input.');
            }
            else {
                $('#testVmixTitleErrorMessage').text('Unable to connect to vMix. Go back to step 2.');
            }
        }
    }, 5000);
}


function checkIfVmixToggleShouldBeEnabled(vmixOnOrOff) {
    if ($('#vmixWebControllerAddress').val().length > 0) {
        $('#sendToVmixSettingToggle').removeAttr('disabled');

        if (vmixOnOrOff === true && !$('#sendToVmixSettingToggle').hasClass('active')) {
            $('#sendToVmixSettingToggle').click(); // make it inactive
        }
    }
    else {
        $('#sendToVmixSettingToggle').attr('disabled', 'disabled');

        if ($('#sendToVmixSettingToggle').hasClass('active')) {
            $('#sendToVmixSettingToggle').click(); // Turn it off
        }
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