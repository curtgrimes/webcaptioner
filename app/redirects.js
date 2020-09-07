export default [
  // Getting Started
  {
    from: '^/help/general/?$',
    to: '/help/getting-started',
  },
  {
    from: '^/help/general/what-is-web-captioner/?$',
    to: '/help/getting-started/what-is-web-captioner',
  },
  {
    from: '^/help/general/how-much-does-it-cost/?$',
    to: '/help/getting-started/cost',
  },
  {
    from: '^/help/general/what-equipment-do-i-need/?$',
    to: '/help/getting-started/what-equipment-do-i-need',
  },
  {
    from: '^/help/general/supported-languages/?$',
    to: '/help/getting-started/supported-languages',
  },
  {
    from: '^/help/general/mobile-device-compatibility/?$',
    to: '/help/getting-started/mobile-device-compatibility',
  },
  {
    from: '^/help/general/browser-compatibility/?$',
    to: '/help/getting-started/browser-compatibility',
  },
  {
    from: '^/help/general/autostart/?$',
    to: '/help/getting-started/automatically-start-captions',
  },
  {
    from: '^/help/general/change-microphone/?$',
    to: '/help/getting-started/change-microphone',
  },
  {
    from: '^/help/general/web-speech-api/?$',
    to: '/help/getting-started/web-speech-api',
  },
  {
    from: '^/help/general/fonts-colors/?$',
    to: '/help/getting-started/change-color-and-font',
  },

  // Integrations
  {
    from: '^/help/integrations/vmix/?$',
    to: '/help/integrations/vmix',
  },
  {
    from: `^\\/vmix\\/?(\\?.*)?$`,
    to: '/help/integrations/vmix',
  },
  {
    from: '^/help/integrations/add-captions-in-obs/?$',
    to: '/help/integrations/obs',
  },
  {
    from: `^\\/obs\\/?(\\?.*)?$`,
    to: '/help/integrations/obs',
  },
  {
    from: `^\\/zoom\\/?(\\?.*)?$`,
    to: '/help/integrations/zoom',
  },
  {
    from: `^\\/dropbox\\/?(\\?.*)?$`,
    to: '/help/integrations/dropbox',
  },
  {
    from: '^/help/integrations/export-to-word/?$',
    to: '/help/integrations/export-to-microsoft-word',
  },
  {
    from: '^/help/integrations/recording-audio/?$',
    to: '/help/integrations/record-audio',
  },
  {
    from: '^/help/integrations/recording-audio/?$',
    to: '/help/integrations/record-audio',
  },
];
