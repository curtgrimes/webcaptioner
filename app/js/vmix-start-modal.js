$(function(){
    if (!$('#vmixStartModal').length) {
        return;
    }

    $('#vmixStartModalSetUpButton').on('click',function(){
        setTimeout(function(){
            $('#vmixModal').modal('show');
        },500);
    });

    $('#startStopVmixToggle').on('click', function(){
        if (window._wc.vmix.on) {
            // It's already on; turn it off
            saveVmixOnOrOff(false);
            $('#vmixStopModal').modal('show');
            setTimeout(function(){
                $('#vmixStopModal').modal('hide');
            },2000);
        }
        else {
            // It's not on yet; turn it on
            checkIfExtensionInstalled()
                .then(function() {
                    return sendVmixMessage('');
                })
                .then(function(){
                    $('#vmixStartModalConnected').attr('hidden',false);
                    $('#vmixStartModalNotConnected').attr('hidden',true);

                    saveVmixOnOrOff(true);

                    $('#vmixStartModal').modal('show');
                    setTimeout(function(){
                        $('#vmixStartModal').modal('hide');
                    },2000);
                })
                .catch(function(){
                    $('#vmixStartModal').modal('show');
                    $('#vmixStartModalNotConnected').attr('hidden',false);
                    $('#vmixStartModalConnected').attr('hidden',true);
                    saveVmixOnOrOff(false);
                });
        }
    });
});