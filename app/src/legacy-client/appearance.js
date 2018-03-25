$(function(){
    if (!$('#appearanceModal').length) {
        return;
    }

    $('#capitalization-popover').popover();

    function hexToRgb(hex) {
        var arrBuff = new ArrayBuffer(4);
        var vw = new DataView(arrBuff);
        vw.setUint32(0,parseInt(hex, 16),false);
        var arrByte = new Uint8Array(arrBuff);

        return arrByte[1] + "," + arrByte[2] + "," + arrByte[3];
    }

    function updateScreenPreview() {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        var $screen = $('.screen-preview .screen');

        $screen.height(400);
        $screen.width((windowWidth*400)/windowHeight);

        var appearance = getAppearanceSettingsObject().appearance;
        /* Make adjustments to simulate smaller screen size */
        appearance['line-height'] -= 2;
        appearance['text-size'] -= 2;
        appearance['text-shadow-x-position'] -= .1;
        appearance['text-shadow-y-position'] -= .1;
        applyAppearanceSettingsToCaptionWrap('.screen-caption-wrap-preview', '#screen-preview-alignment-row', appearance);
    }

    $('#appearance-layout input').change(function() {
        updateScreenPreview();
    });

    $('#appearanceModal').on('shown.bs.modal', function(){
        // Init hidden typeface field
        var typefaceChoice = JSON.parse($('#typefaceDropdownButton [data-typeface-choice]').attr('data-typeface-choice'));
        $('[name="text-typeface"]').val(typefaceChoice.fontFamily);
        $('[name="text-typeface-weight"]').val(typefaceChoice.cssFontWeight);

        //applyAppearanceSettingsToCaptionWrap('.caption-wrap-preview');

        updateScreenPreview();
    });

    $('#appearanceModal [data-toggle="tab"]').on('shown.bs.tab', function(event) {
        if ($(event.target).is($('[href="#appearance-layout"]'))) {
            $('.caption-wrap-preview, .card-header-caption-wrap-preview').attr('hidden',true);
            $('.screen-preview, .card-header-screen-preview').removeAttr('hidden');
            updateScreenPreview();
        }
        else {
            $('.caption-wrap-preview, .card-header-caption-wrap-preview').removeAttr('hidden');
            $('.screen-preview, .card-header-screen-preview').attr('hidden',true);
        }
    });

    $('[name="text-color-interim-choice"]').change(function() {
        if ($('#text-color-interim-custom').is(':checked')) {
            $('[name="text-color-interim"],#previewInterimText')
                .removeAttr('hidden');
        }
        else {
            $('[name="text-color-interim"],#previewInterimText')
                .attr('hidden',true);
        }
    });

    $('.typeface-select .dropdown-item').on('click', function(){
        $('.typeface-select .dropdown-item').removeClass('active');
        $(this).addClass('active');
        $('#typefaceDropdownButton').html($(this).find('.type-example')[0].outerHTML);

        var typefaceChoice = JSON.parse($('#typefaceDropdownButton [data-typeface-choice]').attr('data-typeface-choice'));
        $('[name="text-typeface"]').val(typefaceChoice.fontFamily).trigger('change');
        $('[name="text-typeface-weight"]').val(typefaceChoice.cssFontWeight).trigger('change');
    });

    $('#previewInterimText').on('click', function() {
        $(this).attr('hidden', true);
        $('.caption-wrap-preview').attr('contenteditable', false);

        $('#appearanceModal').scrollTop($('.caption-wrap-preview').position().top);
        var words = $('.caption-wrap-preview .final').text().split(' ');
        $('.caption-wrap-preview .final').text('');

        // Cycle through first half of the words
        var wait = 0;
        for (var i = 1; i <= Math.floor(words.length/2); i++) {
            var delay = Math.max(350 * i + (Math.random() * 350), 300);
            wait = Math.max(delay, wait);
            setTimeout(function() {
                showWord(words.shift())
            }, delay);
        }

        // Simulate one pause
        wait += 700;
        setTimeout(function(){
            $('.caption-wrap-preview .final').text($('.caption-wrap-preview .interim').text());
            $('.caption-wrap-preview .interim').text('');
        }, wait);

        // Cycle through rest of the words
        for (var i = Math.floor(words.length/2) + 1; i <= words.length; i++) {
            var delay = Math.max(350 * i + (Math.random() * 350), 300);
            wait = Math.max(delay, wait);
            setTimeout(function() {
                showWord(words.shift())
            }, delay);
        }

        // Simulate one more pause
        wait += 1100;
        setTimeout(function(){
            $('.caption-wrap-preview .final').append($('.caption-wrap-preview .interim').text());
            $('.caption-wrap-preview .interim').text('');

            $('#previewInterimText').removeAttr('hidden');
            $('.caption-wrap-preview').attr('contenteditable', true);
        }, wait);

        function showWord(word) {
            $('.caption-wrap-preview .interim').append(word + ' '); // remove and return first element
            $('.caption-wrap-preview').scrollTop($('.caption-wrap-preview')[0].scrollHeight);
        }

        ga('send', 'event', 'settings', 'previewInterimText');
    });

    function updateChromaKeyLabel() {
        if (!$('[name="chroma-key-color"]').length) {
            return;
        }

        var rgb = hexToRgb($('[name="chroma-key-color"]').val().substring(1)).split(',');
        $('.chroma-key-red').text(rgb[0]);
        $('.chroma-key-green').text(rgb[1]);
        $('.chroma-key-blue').text(rgb[2]);
    }

    updateChromaKeyLabel(); // once on load
    $('[name="chroma-key-color"]').on('change', updateChromaKeyLabel);

    var gaLoggingTimeout;
    $('#appearanceModal input').on('change', function() {
        applyAppearanceSettingsToCaptionWrap('.caption-wrap-preview', '.screen.card,.caption-wrap-chroma-key-background', getAppearanceSettingsObject().appearance);
        var inputName = $(this).attr('name');
        var inputValue = $(this).val();

        // Crude throttling
        clearTimeout(gaLoggingTimeout);
        gaLoggingTimeout = setTimeout(function(){
            if ($('#appearanceModal').hasClass('show')) {
                ga('send', 'event', 'settings', 'set:'+inputName, inputValue);   
            }
        },250);
    });

    $('#saveAppearanceButton').on('click', function(){
        var wcSettings = window.localStorage.getItem("webcaptioner-settings");
        if (wcSettings) {
            wcSettings = JSON.parse(wcSettings);
        }
        else {
            wcSettings = {};
        }

        var settings = getAppearanceSettingsObject();
        applyAppearanceSettingsToCaptionWrap('.caption-wrap.caption-wrap-real', 'body', settings.appearance);
        $('#appearanceModal').modal('hide');
        wcSettings.appearance = settings.appearance;
        wcSettings.version = settings.version;
        window.localStorage.setItem("webcaptioner-settings", JSON.stringify(wcSettings));

        ga('send', 'event', 'settings', 'saveAppearance');
    });

    $('#appearanceModal').on('hidden.bs.modal', function(){
        var settings = window.localStorage.getItem("webcaptioner-settings");

        if (!settings) {
            settings = getDefaultSettings();
        }
        settings = JSON.parse(settings);
        
        applyAppearanceSettingsToCaptionWrap('.caption-wrap.caption-wrap-real', 'body', settings.appearance);
        updateAppearanceFormWithSettings(settings.appearance);
        applyAppearanceSettingsToCaptionWrap('.caption-wrap-preview', '.screen.card,.caption-wrap-chroma-key-background', settings.appearance);
    });

    $('#resetToDefaultAppearanceButton').on('click', function(){
        var settings = getDefaultSettings().appearance;
        updateAppearanceFormWithSettings(settings);
        applyAppearanceSettingsToCaptionWrap('.caption-wrap-preview', '.screen.card,.caption-wrap-chroma-key-background', settings);


        settings['line-height'] -= 2;
        settings['text-size'] -= 2;
        settings['text-shadow-x-position'] -= .1;
        settings['text-shadow-y-position'] -= .1;
        applyAppearanceSettingsToCaptionWrap('.screen-caption-wrap-preview', '#screen-preview-alignment-row', settings);

        ga('send', 'event', 'settings', 'resetToDefaultAppearance');
    });

    function getAppearanceSettingsObject() {
        return {
            'version':'1',
            'appearance': {
                'text-typeface': $('[name="text-typeface"]').val(),
                'text-color': $('[name="text-color"]').val(),
                'text-color-interim-choice': $('[name="text-color-interim-choice"]:checked').val(),
                'text-color-interim': $('[name="text-color-interim"]').val(),
                'text-size': $('[name="text-size"]').val(),
                'line-height': $('[name="line-height"]').val(),
                'letter-spacing': $('[name="letter-spacing"]').val(),
                'capitalization': $('[name="capitalization"]:checked').val(),
                'text-shadow-color': $('[name="text-shadow-color"]').val(),
                'text-shadow-opacity': $('[name="text-shadow-opacity"]').val(),
                'text-shadow-x-position': $('[name="text-shadow-x-position"]').val(),
                'text-shadow-y-position': $('[name="text-shadow-y-position"]').val(),
                'text-shadow-blur': $('[name="text-shadow-blur"]').val(),
                'background-color': $('[name="background-color"]').val(),
                'chroma-key-color': $('[name="chroma-key-color"]').val(),
                'text-background-transparent': $('[name="text-background-transparent"]:checked').val() == 'yes',
                'horizontal-alignment': $('[name="horizontal-alignment"]:checked').val(),
                'vertical-alignment': $('[name="vertical-alignment"]:checked').val(),
                'padding': $('[name="padding"]').val(),
            }
        };
    }

    function getDefaultSettings() {
        return {
            'version':'1',
            'appearance': {
                'text-typeface': 'Cousine',
                'text-color': '#ffffff',
                'text-color-interim-choice': 'same-as-text-color',
                'text-color-interim': '#fffeaf',
                'text-size': '4',
                'line-height': '5',
                'letter-spacing': '0',
                'capitalization': 'uppercase',
                'text-shadow-color': '#000000',
                'text-shadow-opacity': '100',
                'text-shadow-x-position': '0.25',
                'text-shadow-y-position': '0.25',
                'text-shadow-blur': '0',
                'background-color': '#000000',
                'chroma-key-color': '#00ff00',
                'text-background-transparent': false,
                'horizontal-alignment': 'full',
                'vertical-alignment': 'full',
                'padding': '1.25',
            }
        };
    }

    function updateAppearanceFormWithSettings(appearanceSettings) {
        for (var settingKey in appearanceSettings) {
            if (appearanceSettings.hasOwnProperty(settingKey)) {
                switch(settingKey) {
                    case 'text-typeface':
                        $('.typeface-select .dropdown-item[data-font-family="'+ appearanceSettings[settingKey]  +'"]').click();
                        break;
                    case 'text-color':
                        $('[name="text-color"]').val(appearanceSettings[settingKey]);
                        break;
                    case 'text-color-interim-choice':
                        $('[name="text-color-interim-choice"]').prop('checked', false);
                        $('[name="text-color-interim-choice"][value="'+ appearanceSettings[settingKey] +'"]').prop('checked', true).trigger('change');
                        break;
                    case 'text-color-interim':
                        $('[name="text-color-interim"]').val(appearanceSettings[settingKey]);
                        break;
                    case 'text-size':
                        $('[name="text-size"]').val(appearanceSettings[settingKey]);
                        break;
                    case 'line-height':
                        $('[name="line-height"]').val(appearanceSettings[settingKey]);
                        break;
                    case 'capitalization':
                        $('[name="capitalization"]').prop('checked', false);
                        $('[name="capitalization"][value="'+ appearanceSettings[settingKey] +'"]').prop('checked', true).trigger('change');
                        break;
                    case 'letter-spacing':
                        $('[name="letter-spacing"]').val(appearanceSettings[settingKey]);
                        break;
                    case 'text-shadow-color':
                        $('[name="text-shadow-color"]').val(appearanceSettings[settingKey]);
                        break;
                    case 'text-shadow-opacity':
                        $('[name="text-shadow-opacity"]').val(appearanceSettings[settingKey]);
                        break;
                    case 'text-shadow-x-position':
                        $('[name="text-shadow-x-position"]').val(appearanceSettings[settingKey]);
                        break;
                    case 'text-shadow-y-position':
                        $('[name="text-shadow-y-position"]').val(appearanceSettings[settingKey]);
                        break;
                    case 'text-shadow-blur':
                        $('[name="text-shadow-blur"]').val(appearanceSettings[settingKey]);
                        break;
                    case 'background-color':
                        $('[name="background-color"]').val(appearanceSettings[settingKey]);
                        break;
                    case 'chroma-key-color':
                        $('[name="chroma-key-color"]').val(appearanceSettings[settingKey]);
                        break;
                    case 'text-background-transparent':
                        $('[name="text-background-transparent"]').prop('checked', appearanceSettings[settingKey]);
                        break;
                    case 'horizontal-alignment':
                    case 'vertical-alignment':
                        $('[name="'+ settingKey +'"]').prop('checked', false).parent().removeClass('active');
                        $('[name="'+ settingKey +'"][value="'+ appearanceSettings[settingKey] +'"]').prop('checked', appearanceSettings[settingKey]).parent().addClass('active');
                        break;
                    case 'padding':
                        $('[name="padding"]').val(appearanceSettings[settingKey]);
                        break;
                }
            }
        }
    }

    function applyAppearanceSettingsToCaptionWrap(captionWrapSelector, chromaKeyBackgroundSelector, appearanceSettings) {
        var $captionWrap = $(captionWrapSelector);
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
                        if (appearanceSettings['text-color-interim-choice'] == 'same-as-text-color') {
                            $captions.find('.interim').css('color', appearanceSettings['text-color']);
                        }
                        break;
                    case 'text-color-interim':
                        if (appearanceSettings['text-color-interim-choice'] == 'custom') {
                            $captions.find('.interim').css('color', appearanceSettings[settingKey]);
                        }
                        break;
                    case 'text-size':
                        $captions.css('font-size', appearanceSettings[settingKey] + 'rem');
                        break;
                    case 'line-height':
                        $captions.css('line-height', appearanceSettings[settingKey] + 'rem');
                        break;
                    case 'letter-spacing':
                        $captions.css('letter-spacing', appearanceSettings[settingKey] + 'rem');
                        break;
                    case 'capitalization':
                        $captions.css('text-transform', appearanceSettings[settingKey]);
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
                            + appearanceSettings['text-shadow-blur'] + 'px '
                            + 'rgba('+ hexToRgb(appearanceSettings['text-shadow-color'].substring(1)) + ', '
                                + parseInt(appearanceSettings['text-shadow-opacity'])/100 +')'
                        );
                        break;
                    case 'background-color':
                        $captionWrap.css('background', appearanceSettings[settingKey]);
                        break;
                    case 'chroma-key-color':
                        if (chromaKeyBackgroundSelector) {
                            $(chromaKeyBackgroundSelector).css('background', appearanceSettings[settingKey]);
                        }
                        break;
                    case 'text-background-transparent':
                        if (appearanceSettings[settingKey]) {
                            $captionWrap.css('background','rgba(0,0,0,0)');
                            $('[name="background-color"]').attr('disabled', true);
                        }
                        else {
                            $('[name="background-color"]').removeAttr('disabled');
                        }
                        break;
                    case 'horizontal-alignment':
                        switch(appearanceSettings[settingKey]) {
                            case 'full':
                                $captionWrap.parents('.caption-wrap-col').removeClass().addClass('caption-wrap-col col-12 px-0');
                                break;
                            case 'left':
                                $captionWrap.parents('.caption-wrap-col').removeClass().addClass('caption-wrap-col col-5 px-0');
                                break;
                            case 'middle':
                                $captionWrap.parents('.caption-wrap-col').removeClass().addClass('caption-wrap-col col-8 px-0 mx-auto');
                                break;
                            case 'right':
                                $captionWrap.parents('.caption-wrap-col').removeClass().addClass('caption-wrap-col col-5 px-0 ml-auto');
                                break;
                        }
                        break;
                    case 'vertical-alignment':
                        switch(appearanceSettings[settingKey]) {
                            case 'full':
                                $captionWrap.parents('.caption-wrap-row').removeClass().addClass('row caption-wrap-row w-100 mx-0');
                                $captionWrap.parents('.caption-wrap-col').removeClass('h-50');
                                // $captionWrap.removeClass('h-100').css('overflow-y', 'visible');
                                break;
                            case 'top':
                                $captionWrap.parents('.caption-wrap-row').removeClass().addClass('row caption-wrap-row w-100 mx-0 align-items-start');
                                $captionWrap.parents('.caption-wrap-col').addClass('h-50');
                                // $captionWrap.addClass('h-100').css('overflow-y', 'auto');
                                break;
                            case 'middle':
                                $captionWrap.parents('.caption-wrap-row').removeClass().addClass('row caption-wrap-row w-100 mx-0 align-items-center');
                                $captionWrap.parents('.caption-wrap-col').addClass('h-50');
                                // $captionWrap.addClass('h-100').css('overflow-y', 'auto');
                                break;
                            case 'bottom':
                                $captionWrap.parents('.caption-wrap-row').removeClass().addClass('row caption-wrap-row w-100 mx-0 align-items-end');
                                $captionWrap.parents('.caption-wrap-col').addClass('h-50');
                                // $captionWrap.addClass('h-100').css('overflow-y', 'auto');
                                break;
                            case 'lower-third':
                                $captionWrap.parents('.caption-wrap-row').removeClass().addClass('row caption-wrap-row w-100 mx-0 align-items-end');
                                $captionWrap.parents('.caption-wrap-col').addClass('h-25');
                                // $captionWrap.addClass('h-100').css('overflow-y', 'auto');
                                break;
                        }
                        break;
                    case 'padding':
                        $captionWrap.css('padding', appearanceSettings[settingKey] + 'rem');
                        break;
                }
            }
        }

    }

    // Load settings
    var settings = window.localStorage.getItem("webcaptioner-settings");
    if (settings) {
        settings = JSON.parse(settings);
        updateAppearanceFormWithSettings(settings.appearance);
        applyAppearanceSettingsToCaptionWrap('.caption-wrap.caption-wrap-real', 'body', settings.appearance);
        applyAppearanceSettingsToCaptionWrap('.caption-wrap-preview', '.screen.card,.caption-wrap-chroma-key-background', settings.appearance);
    }

});
