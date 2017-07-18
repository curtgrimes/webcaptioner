$(function(){
    if (!$('#languageModal').length) {
        return;
    }

    function makeLanguageRowActive(languageCode, fromOrTo) {
        var $languageGroup = fromOrTo === 'from' 
                                ? $('#languageModal #from-language-group')
                                : $('#languageModal #to-language-group');
        
        var languageName = $('[data-language-code="'+ languageCode +'"]').attr('data-language-name') || languageCode;

        $languageGroup.find('.active').removeClass('active');
        $languageGroup.find('[data-language-code="'+ languageCode +'"]').first().addClass('active');
        $languageGroup.find('.group-selected-language-name').text(languageName);

        if ($('[data-language-code="'+ languageCode +'"]').length > 1) {
            // They selected the option that is the automatic one. Scroll to
            // the top to show them their selection.
            $languageGroup.find('.language-group-overflow').scrollTop(0);
        }
    }

    loadLanguageSettings();

    $('#languageModal').one('show.bs.modal', function() {
        // Init selected language in UI first time it is shown
        makeLanguageRowActive(window._wc.language.from, 'from');
        makeLanguageRowActive(window._wc.language.to, 'to');
    });

    $('#languageModal').on('shown.bs.modal', function() {
        // Set scroll positions
        $('.language-group-overflow').each(function() {
            $(this).scrollTop(0); // first, reset scroll position
            $(this).scrollTop($(this).find('.active').position().top - 140);
        });
    });

    $('#languageModal .language-selection').on('click', function() {
        makeLanguageRowActive(
            $(this).attr('data-language-code'),
            ($(this).parents('#from-language-group').length ? 'from' : 'to')
        );
    });

    $('.language-group-overflow').on('scroll click', function() {
        // Fix issue where tooltips get stuck on scroll or click
        $('.tooltip').tooltip('hide');
    });

    $('#cancelLanguageButton').on('click', function() {
        setTimeout(function(){
            // Wait for modal transition
            makeLanguageRowActive(window._wc.language.from, 'from');
            makeLanguageRowActive(window._wc.language.to, 'to');
        },500);

        $('#languageModal').modal('hide');
        ga('send', 'event', 'settings', 'cancelLanguage');
    });

    $('#saveLanguageButton').on('click', function() {
        window._wc.language.from = $('#languageModal #from-language-group .language-selection.active').attr('data-language-code');
        window._wc.language.to = $('#languageModal #to-language-group .language-selection.active').attr('data-language-code');

        var settings = JSON.parse(window.localStorage.getItem("webcaptioner-settings")) || {};
        settings.language = window._wc.language;
        window.localStorage.setItem("webcaptioner-settings", JSON.stringify(settings));
        
        $('#languageModal').modal('hide');
        ga('send', 'event', 'settings', 'saveLanguage');

        if (window.recognizing) {
            $('#startButton').click(); // stop it
            recognition = initRecognition(); // reinit recognition with new language
            setTimeout(function(){
                $('#startButton').click(); // start it
            }, 500);
        }
        
    });



});

function loadLanguageSettings() {
    // Load settings
    var settings = window.localStorage.getItem("webcaptioner-settings");
    var defaultFromLanguageCode = $('#languageModal').attr('data-default-from-language-code');
    var defaultToLanguageCode = $('#languageModal').attr('data-default-to-language-code');

    window._wc = window._wc || {};
    window._wc.language = {};
    if (settings) {
        settings = JSON.parse(settings);
        if (settings.language) {
            window._wc.language.from = settings.language.from;
            window._wc.language.to = settings.language.to;
        }
    }
    // Set defaults if none loaded from settings
    window._wc.language.from = window._wc.language.from || defaultFromLanguageCode;
    window._wc.language.to = window._wc.language.to || defaultToLanguageCode;
}
