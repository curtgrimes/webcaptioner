var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  var randomJuliaChildQuote = (function(){
    var quotes = [
      'Find something you\'re passionate about and keep tremendously interested in it.',
      'In France, cooking is a serious art form and a national sport.',
      'You don\'t have to cook fancy or complicated masterpieces – just good food from fresh ingredients.',
      'I was 32 when I started cooking; up until then, I just ate.',
      'I enjoy cooking with wine. Sometimes I even put it in the food.',
      'The only time to eat diet food is while you’re waiting for the steak to cook.',
      'It is hard to imagine a civilization without onions.',
      'Always remember: If you\'re alone in the kitchen and you drop the lamb, you can always just pick it up. Who\'s going to know?',
    ];
    return quotes[Math.floor(Math.random()*quotes.length)];
  })();

  var fromLanguages = [
    {
      name: 'Afrikaans (Suid-Afrika)',
      code: 'af-ZA',
      nameEnglish: 'Afrikaans (South Africa)',
    },
    {
      name: 'Bahasa Indonesia (Indonesia)',
      code: 'id-ID',
      nameEnglish: 'Indonesian (Indonesia)',
    },
    {
      name: 'Bahasa Melayu (Malaysia)',
      code: 'ms-MY',
      nameEnglish: 'Malay (Malaysia)',
    },
    {
      name: 'Català (Espanya)',
      code: 'ca-ES',
      nameEnglish: 'Catalan (Spain)',
    },
    {
      name: 'Čeština (Česká republika)',
      code: 'cs-CZ',
      nameEnglish: 'Czech (Czech Republic)',
    },
    {
      name: 'Dansk (Danmark)',
      code: 'da-DK',
      nameEnglish: 'Danish (Denmark)',
    },
    {
      name: 'Deutsch (Deutschland)',
      code: 'de-DE',
      nameEnglish: 'German (Germany)',
    },
    {
      name: 'English (Australia)',
      code: 'en-AU',
      nameEnglish: 'English (Australia)',
    },
    {
      name: 'English (Canada)',
      code: 'en-CA',
      nameEnglish: 'English (Canada)',
    },
    {
      name: 'English (Great Britain)',
      code: 'en-GB',
      nameEnglish: 'English (United Kingdom)',
    },
    {
      name: 'English (India)',
      code: 'en-IN',
      nameEnglish: 'English (India)',
    },
    {
      name: 'English (Ireland)',
      code: 'en-IE',
      nameEnglish: 'English (Ireland)',
    },
    {
      name: 'English (New Zealand)',
      code: 'en-NZ',
      nameEnglish: 'English (New Zealand)',
    },
    {
      name: 'English (Philippines)',
      code: 'en-PH',
      nameEnglish: 'English (Philippines)',
    },
    {
      name: 'English (South Africa)',
      code: 'en-ZA',
      nameEnglish: 'English (South Africa)',
    },
    {
      name: 'English (United States)',
      code: 'en-US',
      nameEnglish: 'English (United States)',
    },
    {
      name: 'Español (Argentina)',
      code: 'es-AR',
      nameEnglish: 'Spanish (Argentina)',
    },
    {
      name: 'Español (Bolivia)',
      code: 'es-BO',
      nameEnglish: 'Spanish (Bolivia)',
    },
    {
      name: 'Español (Chile)',
      code: 'es-CL',
      nameEnglish: 'Spanish (Chile)',
    },
    {
      name: 'Español (Colombia)',
      code: 'es-CO',
      nameEnglish: 'Spanish (Colombia)',
    },
    {
      name: 'Español (Costa Rica)',
      code: 'es-CR',
      nameEnglish: 'Spanish (Costa Rica)',
    },
    {
      name: 'Español (Ecuador)',
      code: 'es-EC',
      nameEnglish: 'Spanish (Ecuador)',
    },
    {
      name: 'Español (El Salvador)',
      code: 'es-SV',
      nameEnglish: 'Spanish (El Salvador)',
    },
    {
      name: 'Español (España)',
      code: 'es-ES',
      nameEnglish: 'Spanish (Spain)',
    },
    {
      name: 'Español (Estados Unidos)',
      code: 'es-US',
      nameEnglish: 'Spanish (United States)',
    },
    {
      name: 'Español (Guatemala)',
      code: 'es-GT',
      nameEnglish: 'Spanish (Guatemala)',
    },
    {
      name: 'Español (Honduras)',
      code: 'es-HN',
      nameEnglish: 'Spanish (Honduras)',
    },
    {
      name: 'Español (México)',
      code: 'es-MX',
      nameEnglish: 'Spanish (Mexico)',
    },
    {
      name: 'Español (Nicaragua)',
      code: 'es-NI',
      nameEnglish: 'Spanish (Nicaragua)',
    },
    {
      name: 'Español (Panamá)',
      code: 'es-PA',
      nameEnglish: 'Spanish (Panama)',
    },
    {
      name: 'Español (Paraguay)',
      code: 'es-PY',
      nameEnglish: 'Spanish (Paraguay)',
    },
    {
      name: 'Español (Perú)',
      code: 'es-PE',
      nameEnglish: 'Spanish (Peru)',
    },
    {
      name: 'Español (Puerto Rico)',
      code: 'es-PR',
      nameEnglish: 'Spanish (Puerto Rico)',
    },
    {
      name: 'Español (República Dominicana)',
      code: 'es-DO',
      nameEnglish: 'Spanish (Dominican Republic)',
    },
    {
      name: 'Español (Uruguay)',
      code: 'es-UY',
      nameEnglish: 'Spanish (Uruguay)',
    },
    {
      name: 'Español (Venezuela)',
      code: 'es-VE',
      nameEnglish: 'Spanish (Venezuela)',
    },
    {
      name: 'Euskara (Espainia)',
      code: 'eu-ES',
      nameEnglish: 'Basque (Spain)',
    },
    {
      name: 'Filipino (Pilipinas)',
      code: 'fil-PH',
      nameEnglish: 'Filipino (Philippines)',
    },
    {
      name: 'Français (Canada)',
      code: 'fr-CA',
      nameEnglish: 'French (Canada)',
    },
    {
      name: 'Français (France)',
      code: 'fr-FR',
      nameEnglish: 'French (France)',
    },
    {
      name: 'Galego (España)',
      code: 'gl-ES',
      nameEnglish: 'Galician (Spain)',
    },
    {
      name: 'Hrvatski (Hrvatska)',
      code: 'hr-HR',
      nameEnglish: 'Croatian (Croatia)',
    },
    {
      name: 'IsiZulu (Ningizimu Afrika)',
      code: 'zu-ZA',
      nameEnglish: 'Zulu (South Africa)',
    },
    {
      name: 'Íslenska (Ísland)',
      code: 'is-IS',
      nameEnglish: 'Icelandic (Iceland)',
    },
    {
      name: 'Italiano (Italia)',
      code: 'it-IT',
      nameEnglish: 'Italian (Italy)',
    },
    {
      name: 'Lietuvių (Lietuva)',
      code: 'lt-LT',
      nameEnglish: 'Lithuanian (Lithuania)',
    },
    {
      name: 'Magyar (Magyarország)',
      code: 'hu-HU',
      nameEnglish: 'Hungarian (Hungary)',
    },
    {
      name: 'Nederlands (Nederland)',
      code: 'nl-NL',
      nameEnglish: 'Dutch (Netherlands)',
    },
    {
      name: 'Norsk bokmål (Norge)',
      code: 'nb-NO',
      nameEnglish: 'Norwegian Bokmål (Norway)',
    },
    {
      name: 'Polski (Polska)',
      code: 'pl-PL',
      nameEnglish: 'Polish (Poland)',
    },
    {
      name: 'Português (Brasil)',
      code: 'pt-BR',
      nameEnglish: 'Portuguese (Brazil)',
    },
    {
      name: 'Português (Portugal)',
      code: 'pt-PT',
      nameEnglish: 'Portuguese (Portugal)',
    },
    {
      name: 'Română (România)',
      code: 'ro-RO',
      nameEnglish: 'Romanian (Romania)',
    },
    {
      name: 'Slovenčina (Slovensko)',
      code: 'sk-SK',
      nameEnglish: 'Slovak (Slovakia)',
    },
    {
      name: 'Slovenščina (Slovenija)',
      code: 'sl-SI',
      nameEnglish: 'Slovenian (Slovenia)',
    },
    {
      name: 'Suomi (Suomi)',
      code: 'fi-FI',
      nameEnglish: 'Finnish (Finland)',
    },
    {
      name: 'Svenska (Sverige)',
      code: 'sv-SE',
      nameEnglish: 'Swedish (Sweden)',
    },
    {
      name: 'Tiếng Việt (Việt Nam)',
      code: 'vi-VN',
      nameEnglish: 'Vietnamese (Vietnam)',
    },
    {
      name: 'Türkçe (Türkiye)',
      code: 'tr-TR',
      nameEnglish: 'Turkish (Turkey)',
    },
    {
      name: 'Ελληνικά (Ελλάδα)',
      code: 'el-GR',
      nameEnglish: 'Greek (Greece)',
    },
    {
      name: 'Български (България)',
      code: 'bg-BG',
      nameEnglish: 'Bulgarian (Bulgaria)',
    },
    {
      name: 'Русский (Россия)',
      code: 'ru-RU',
      nameEnglish: 'Russian (Russia)',
    },
    {
      name: 'Српски (Србија)',
      code: 'sr-RS',
      nameEnglish: 'Serbian (Serbia)',
    },
    {
      name: 'Українська (Україна)',
      code: 'uk-UA',
      nameEnglish: 'Ukrainian (Ukraine)',
    },
    {
      name: 'עברית (ישראל)',
      code: 'he-IL',
      nameEnglish: 'Hebrew (Israel)',
    },
    {
      name: 'العربية (إسرائيل)',
      code: 'ar-IL',
      nameEnglish: 'Arabic (Israel)',
    },
    {
      name: 'العربية (الأردن)',
      code: 'ar-JO',
      nameEnglish: 'Arabic (Jordan)',
    },
    {
      name: 'العربية (الإمارات)',
      code: 'ar-AE',
      nameEnglish: 'Arabic (United Arab Emirates)',
    },
    {
      name: 'العربية (البحرين)',
      code: 'ar-BH',
      nameEnglish: 'Arabic (Bahrain)',
    },
    {
      name: 'العربية (الجزائر)',
      code: 'ar-DZ',
      nameEnglish: 'Arabic (Algeria)',
    },
    {
      name: 'العربية (السعودية)',
      code: 'ar-SA',
      nameEnglish: 'Arabic (Saudi Arabia)',
    },
    {
      name: 'العربية (العراق)',
      code: 'ar-IQ',
      nameEnglish: 'Arabic (Iraq)',
    },
    {
      name: 'العربية (الكويت)',
      code: 'ar-KW',
      nameEnglish: 'Arabic (Kuwait)',
    },
    {
      name: 'العربية (المغرب)',
      code: 'ar-MA',
      nameEnglish: 'Arabic (Morocco)',
    },
    {
      name: 'العربية (تونس)',
      code: 'ar-TN',
      nameEnglish: 'Arabic (Tunisia)',
    },
    {
      name: 'العربية (عُمان)',
      code: 'ar-OM',
      nameEnglish: 'Arabic (Oman)',
    },
    {
      name: 'العربية (فلسطين)',
      code: 'ar-PS',
      nameEnglish: 'Arabic (State of Palestine)',
    },
    {
      name: 'العربية (قطر)',
      code: 'ar-QA',
      nameEnglish: 'Arabic (Qatar)',
    },
    {
      name: 'العربية (لبنان)',
      code: 'ar-LB',
      nameEnglish: 'Arabic (Lebanon)',
    },
    {
      name: 'العربية (مصر)',
      code: 'ar-EG',
      nameEnglish: 'Arabic (Egypt)',
    },
    {
      name: 'فارسی (ایران)',
      code: 'fa-IR',
      nameEnglish: 'Persian (Iran)',
    },
    {
      name: 'हिन्दी (भारत)',
      code: 'hi-IN',
      nameEnglish: 'Hindi (India)',
    },
    {
      name: 'ไทย (ประเทศไทย)',
      code: 'th-TH',
      nameEnglish: 'Thai (Thailand)',
    },
    {
      name: '한국어 (대한민국)',
      code: 'ko-KR',
      nameEnglish: 'Korean (South Korea)',
    },
    {
      name: '國語 (台灣)',
      code: 'cmn-Hant-TW',
      nameEnglish: 'Chinese, Mandarin (Traditional, Taiwan)',
    },
    {
      name: '廣東話 (香港)',
      code: 'yue-Hant-HK',
      nameEnglish: 'Chinese, Cantonese (Traditional, Hong Kong)',
    },
    {
      name: '日本語（日本）',
      code: 'ja-JP',
      nameEnglish: 'Japanese (Japan)',
    },
    {
      name: '普通話 (香港)',
      code: 'cmn-Hans-HK',
      nameEnglish: 'Chinese, Mandarin (Simplified, Hong Kong)',
    },
    {
      name: '普通话 (中国大陆)',
      code: 'cmn-Hans-CN',
      nameEnglish: 'Chinese, Mandarin (Simplified, China)',
    },
  ];

  var toLanguages = [
    {
      name: '',
      code: 'af',
      nameEnglish: 'Afrikaans',
    },
    {
      name: '',
      code: 'sq',
      nameEnglish: 'Albanian',
    },
    {
      name: '',
      code: 'am',
      nameEnglish: 'Amharic',
    },
    {
      name: '',
      code: 'ar',
      nameEnglish: 'Arabic',
    },
    {
      name: '',
      code: 'hy',
      nameEnglish: 'Armenian',
    },
    {
      name: '',
      code: 'az',
      nameEnglish: 'Azeerbaijani',
    },
    {
      name: '',
      code: 'eu',
      nameEnglish: 'Basque',
    },
    {
      name: '',
      code: 'be',
      nameEnglish: 'Belarusian',
    },
    {
      name: '',
      code: 'bn',
      nameEnglish: 'Bengali',
    },
    {
      name: '',
      code: 'bs',
      nameEnglish: 'Bosnian',
    },
    {
      name: '',
      code: 'bg',
      nameEnglish: 'Bulgarian',
    },
    {
      name: '',
      code: 'ca',
      nameEnglish: 'Catalan',
    },
    {
      name: '',
      code: 'ceb',
      nameEnglish: 'Cebuano',
    },
    {
      name: '',
      code: 'ny',
      nameEnglish: 'Chichewa',
    },
    {
      name: '',
      code: 'zh-CN',
      nameEnglish: 'Chinese (Simplified)',
    },
    {
      name: '',
      code: 'zh-TW',
      nameEnglish: 'Chinese (Traditional)',
    },
    {
      name: '',
      code: 'co',
      nameEnglish: 'Corsican',
    },
    {
      name: '',
      code: 'hr',
      nameEnglish: 'Croatian',
    },
    {
      name: '',
      code: 'cs',
      nameEnglish: 'Czech',
    },
    {
      name: '',
      code: 'da',
      nameEnglish: 'Danish',
    },
    {
      name: '',
      code: 'nl',
      nameEnglish: 'Dutch',
    },
    {
      name: '',
      code: 'en',
      nameEnglish: 'English',
    },
    {
      name: '',
      code: 'eo',
      nameEnglish: 'Esperanto',
    },
    {
      name: '',
      code: 'et',
      nameEnglish: 'Estonian',
    },
    {
      name: '',
      code: 'tl',
      nameEnglish: 'Filipino',
    },
    {
      name: '',
      code: 'fi',
      nameEnglish: 'Finnish',
    },
    {
      name: '',
      code: 'fr',
      nameEnglish: 'French',
    },
    {
      name: '',
      code: 'fy',
      nameEnglish: 'Frisian',
    },
    {
      name: '',
      code: 'gl',
      nameEnglish: 'Galician',
    },
    {
      name: '',
      code: 'ka',
      nameEnglish: 'Georgian',
    },
    {
      name: '',
      code: 'de',
      nameEnglish: 'German',
    },
    {
      name: '',
      code: 'el',
      nameEnglish: 'Greek',
    },
    {
      name: '',
      code: 'gu',
      nameEnglish: 'Gujarati',
    },
    {
      name: '',
      code: 'ht',
      nameEnglish: 'Haitian Creole',
    },
    {
      name: '',
      code: 'ha',
      nameEnglish: 'Hausa',
    },
    {
      name: '',
      code: 'haw',
      nameEnglish: 'Hawaiian',
    },
    {
      name: '',
      code: 'iw',
      nameEnglish: 'Hebrew',
    },
    {
      name: '',
      code: 'hi',
      nameEnglish: 'Hindi',
    },
    {
      name: '',
      code: 'hmn',
      nameEnglish: 'Hmong',
    },
    {
      name: '',
      code: 'hu',
      nameEnglish: 'Hungarian',
    },
    {
      name: '',
      code: 'is',
      nameEnglish: 'Icelandic',
    },
    {
      name: '',
      code: 'ig',
      nameEnglish: 'Igbo',
    },
    {
      name: '',
      code: 'id',
      nameEnglish: 'Indonesian',
    },
    {
      name: '',
      code: 'ga',
      nameEnglish: 'Irish',
    },
    {
      name: '',
      code: 'it',
      nameEnglish: 'Italian',
    },
    {
      name: '',
      code: 'ja',
      nameEnglish: 'Japanese',
    },
    {
      name: '',
      code: 'jw',
      nameEnglish: 'Javanese',
    },
    {
      name: '',
      code: 'kn',
      nameEnglish: 'Kannada',
    },
    {
      name: '',
      code: 'kk',
      nameEnglish: 'Kazakh',
    },
    {
      name: '',
      code: 'km',
      nameEnglish: 'Khmer',
    },
    {
      name: '',
      code: 'ko',
      nameEnglish: 'Korean',
    },
    {
      name: '',
      code: 'ku',
      nameEnglish: 'Kurdish',
    },
    {
      name: '',
      code: 'ky',
      nameEnglish: 'Kyrgyz',
    },
    {
      name: '',
      code: 'lo',
      nameEnglish: 'Lao',
    },
    {
      name: '',
      code: 'la',
      nameEnglish: 'Latin',
    },
    {
      name: '',
      code: 'lv',
      nameEnglish: 'Latvian',
    },
    {
      name: '',
      code: 'lt',
      nameEnglish: 'Lithuanian',
    },
    {
      name: '',
      code: 'lb',
      nameEnglish: 'Luxembourgish',
    },
    {
      name: '',
      code: 'mk',
      nameEnglish: 'Macedonian',
    },
    {
      name: '',
      code: 'mg',
      nameEnglish: 'Malagasy',
    },
    {
      name: '',
      code: 'ms',
      nameEnglish: 'Malay',
    },
    {
      name: '',
      code: 'ml',
      nameEnglish: 'Malayalam',
    },
    {
      name: '',
      code: 'mt',
      nameEnglish: 'Maltese',
    },
    {
      name: '',
      code: 'mi',
      nameEnglish: 'Maori',
    },
    {
      name: '',
      code: 'mr',
      nameEnglish: 'Marathi',
    },
    {
      name: '',
      code: 'mn',
      nameEnglish: 'Mongolian',
    },
    {
      name: '',
      code: 'my',
      nameEnglish: 'Burmese',
    },
    {
      name: '',
      code: 'ne',
      nameEnglish: 'Nepali',
    },
    {
      name: '',
      code: 'no',
      nameEnglish: 'Norwegian',
    },
    {
      name: '',
      code: 'ps',
      nameEnglish: 'Pashto',
    },
    {
      name: '',
      code: 'fa',
      nameEnglish: 'Persian',
    },
    {
      name: '',
      code: 'pl',
      nameEnglish: 'Polish',
    },
    {
      name: '',
      code: 'pt',
      nameEnglish: 'Portuguese',
    },
    {
      name: '',
      code: 'ma',
      nameEnglish: 'Punjabi',
    },
    {
      name: '',
      code: 'ro',
      nameEnglish: 'Romanian',
    },
    {
      name: '',
      code: 'ru',
      nameEnglish: 'Russian',
    },
    {
      name: '',
      code: 'sm',
      nameEnglish: 'Samoan',
    },
    {
      name: '',
      code: 'gd',
      nameEnglish: 'Scots Gaelic',
    },
    {
      name: '',
      code: 'sr',
      nameEnglish: 'Serbian',
    },
    {
      name: '',
      code: 'st',
      nameEnglish: 'Sesotho',
    },
    {
      name: '',
      code: 'sn',
      nameEnglish: 'Shona',
    },
    {
      name: '',
      code: 'sd',
      nameEnglish: 'Sindhi',
    },
    {
      name: '',
      code: 'sk',
      nameEnglish: 'Slovak',
    },
    {
      name: '',
      code: 'sl',
      nameEnglish: 'Slovenian',
    },
    {
      name: '',
      code: 'so',
      nameEnglish: 'Somali',
    },
    {
      name: '',
      code: 'es',
      nameEnglish: 'Spanish',
    },
    {
      name: '',
      code: 'su',
      nameEnglish: 'Sundanese',
    },
    {
      name: '',
      code: 'sw',
      nameEnglish: 'Swahili',
    },
    {
      name: '',
      code: 'sv',
      nameEnglish: 'Swedish',
    },
    {
      name: '',
      code: 'tg',
      nameEnglish: 'Tajik',
    },
    {
      name: '',
      code: 'ta',
      nameEnglish: 'Tamil',
    },
    {
      name: '',
      code: 'te',
      nameEnglish: 'Telugu',
    },
    {
      name: '',
      code: 'th',
      nameEnglish: 'Thai',
    },
    {
      name: '',
      code: 'tr',
      nameEnglish: 'Turkish',
    },
    {
      name: '',
      code: 'uk',
      nameEnglish: 'Ukrainian',
    },
    {
      name: '',
      code: 'ur',
      nameEnglish: 'Urdu',
    },
    {
      name: '',
      code: 'uz',
      nameEnglish: 'Uzbek',
    },
    {
      name: '',
      code: 'vi',
      nameEnglish: 'Vietnamese',
    },
    {
      name: '',
      code: 'cy',
      nameEnglish: 'Welsh',
    },
    {
      name: '',
      code: 'xh',
      nameEnglish: 'Xhosa',
    },
    {
      name: '',
      code: 'yi',
      nameEnglish: 'Yiddish',
    },
    {
      name: '',
      code: 'yo',
      nameEnglish: 'Yoruba',
    },
    {
      name: '',
      code: 'zu',
      nameEnglish: 'Zulu',
    },
  ];

  var defaultFromLanguage = req.acceptsLanguages().length
                          ? fromLanguages.find((language) => {
                                return language.code.toUpperCase() == req.acceptsLanguages()[0].toUpperCase()
                              })
                          : null;

  var defaultToLanguage = req.acceptsLanguages().length
                          ? toLanguages.find((language) => {
                                return language.code.toUpperCase() == req.acceptsLanguages()[0].split('-')[0].toUpperCase()
                              })
                          : null;

  res.render('index', {
    title: 'Web Captioner',
    randomJuliaChildQuote: randomJuliaChildQuote,
    fromLanguages: fromLanguages.sort((langA, langB) => {
      var nameA = langA.nameEnglish.toUpperCase();
      var nameB = langB.nameEnglish.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0; // names must be equal
    }),
    randomJuliaChildQuote: randomJuliaChildQuote,
    toLanguages: toLanguages.sort((langA, langB) => {
      var nameA = langA.nameEnglish.toUpperCase();
      var nameB = langB.nameEnglish.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0; // names must be equal
    }),
    defaultFromLanguage: defaultFromLanguage,
    defaultToLanguage: defaultToLanguage,
    captionTypefaceChoices: [
      { // This list must have at least one and the default must be first
        'googleFontName': 'Cousine',
        'fontFamily': 'Cousine',
        'displayName': 'Cousine',
      },
      {
        'googleFontName': 'Roboto',
        'fontFamily': 'Roboto',
        'displayName': 'Roboto',
      },
      {
        'googleFontName': 'Oswald',
        'fontFamily': 'Oswald',
        'displayName': 'Oswald',
      },
      {
        'googleFontName': 'Lato:700',
        'fontFamily': 'Lato',
        'displayName': 'Lato Bold',
        'cssFontWeight': '700',
      },
      {
        'googleFontName': 'Archivo Black',
        'fontFamily': 'Archivo Black',
        'displayName': 'Archivo Black',
      },
      {
        'googleFontName': 'Bree Serif',
        'fontFamily': 'Bree Serif',
        'displayName': 'Bree Serif',
      },
      {
        'googleFontName': 'Arvo',
        'fontFamily': 'Arvo',
        'displayName': 'Arvo',
      },
      {
        'googleFontName': 'Concert One',
        'fontFamily': 'Concert One',
        'displayName': 'Concert One',
      },
      {
        'googleFontName': 'Boogaloo',
        'fontFamily': 'Boogaloo',
        'displayName': 'Boogaloo',
      },

    ]
  });
});

module.exports = router;
