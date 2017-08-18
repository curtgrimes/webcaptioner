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
        window._wc.vmix.address = $('#vmixWebControllerAddress').val();

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
});

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