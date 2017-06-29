$(function(){
    $('#onboardingModal .btn').click();
    $('[data-target="#appearanceModal"]').click();

    $('#appearanceModal').on('shown.bs.modal', function(){
        // Init hidden typeface field
        $('[name="text-typeface"]').val($('#typefaceDropdownButton').text());

        applyAppearanceSettingsToCaptionWrap('.caption-wrap-preview');
    });

    $('[name="text-color-interim-choice"]').change(function() {
        if ($('#text-color-interim-2').is(':checked')) {
            $('[name="text-color-interim"]')
                .removeAttr('hidden');
        }
        else {
            $('[name="text-color-interim"]')
                .attr('hidden',true);
        }
    });

    $('.typeface-select .dropdown-item').on('click', function(){
        $('.typeface-select .dropdown-item').removeClass('active');
        $(this).addClass('active');
        $('#typefaceDropdownButton').html($(this).find('.type-example')[0].outerHTML);
        $('[name="text-typeface"]').val($(this).find('.type-example').text()).trigger('change');
    });

    $('#appearanceModal input').on('change', function() {

        applyAppearanceSettingsToCaptionWrap('.caption-wrap-preview', getAppearanceSettingsObject().appearance);
    });

    function getAppearanceSettingsObject() {
        return {
            'appearance': {
                'text-typeface': $('[name="text-typeface"]').val(),
                'text-color': $('[name="text-color"]').val(),
                'text-color-interim-choice': $('[name="text-color-interim-choice"]').val(),
                'text-color-interim': $('[name="text-color-interim"]').val(),
                'text-size': $('[name="text-size"]').val(),
                'line-height': $('[name="line-height"]').val(),
                'text-shadow-color': $('[name="text-shadow-color"]').val(),
                'text-shadow-opacity': $('[name="text-shadow-opacity"]').val(),
                'text-shadow-x-position': $('[name="text-shadow-x-position"]').val(),
                'text-shadow-y-position': $('[name="text-shadow-y-position"]').val(),
                'text-shadow-blur': $('[name="text-shadow-blur"]').val(),
                'background-color': $('[name="background-color"]').val(),
            }
        };
    }

    function applyAppearanceSettingsToCaptionWrap(selector, appearanceSettings) {
        var $captionWrap = $(selector);
        var $captions = $captionWrap.find('.captions');

        for (var settingKey in appearanceSettings) {
            if (appearanceSettings.hasOwnProperty(settingKey)) {
                switch(settingKey) {
                    case 'text-typeface':
                        $captions.css('font-family', appearanceSettings[settingKey]);
                        break;
                    case 'text-color':
                        $captions.css('color', appearanceSettings[settingKey]);
                        break;
                    case 'text-color-interim-choice':
                        $captionWrap.find('[name="text-color-interim-choice"]').prop('checked', false)
                            .find('[value="'+ appearanceSettings[settingKey] +'"]').prop('checked', true);
                        break;
                    case 'text-color-interim':
                        $captions.find('.interim').css('color', appearanceSettings[settingKey]);
                        break;
                    case 'text-color-interim':
                        $captions.find('.interim').css('color', appearanceSettings[settingKey]);
                        break;
                    case 'text-size':
                        $captions.css('font-size', appearanceSettings[settingKey] + 'rem');
                        break;
                    case 'line-height':
                        $captions.css('line-height', appearanceSettings[settingKey] + 'rem');
                        break;
                    case 'text-shadow-color':
                    case 'text-shadow-opacity':
                    case 'text-shadow-x-position':
                    case 'text-shadow-y-position':
                    case 'text-shadow-blur':
                        $captions.css(
                            'textShadow',
                            appearanceSettings['text-shadow-x-position'] + 'rem '
                            + appearanceSettings['text-shadow-y-position'] + 'rem '
                            + appearanceSettings['text-shadow-blur'] + 'rem '
                            + 'rgba('+ hexToRgb(appearanceSettings['text-shadow-color']) + ', ' + parseInt(appearanceSettings['text-shadow-opacity'])/100 +')'
                        );
                        break;
                    case 'background-color':
                        $captionWrap.css('background', appearanceSettings[settingKey]);
                        break;
                }
            }
        }

        function hexToRgb(hex) {
            var arrBuff = new ArrayBuffer(4);
            var vw = new DataView(arrBuff);
            vw.setUint32(0,parseInt(hex, 16),false);
            var arrByte = new Uint8Array(arrBuff);

            return arrByte[1] + "," + arrByte[2] + "," + arrByte[3];
        }

    }

});
