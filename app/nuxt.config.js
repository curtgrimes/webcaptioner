require('dotenv').config();

import serveStatic from 'serve-static';
import path from 'path';
import redirectSSL from 'redirect-ssl';
import healthCheckMiddleware from './middleware/server/health-check.js';
import sourcemapMiddleware from './middleware/server/sourcemaps.js';
import url from 'url';
import wsServer from './socket.io/server';
import parseDomain from 'parse-domain';
// import gitRevision from 'git-rev-sync';

module.exports = {
  head: {
    title: 'Web Captioner',
    meta: [{
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Free, real-time captioning for your event.',
      },
      {
        name: 'theme-color',
        content: '#ffe200',
      },
      {
        name: 'google',
        content: 'notranslate',
      },
      {
        property: 'og:image',
        content: 'https://webcaptioner.com/static/og-image.jpg',
      },
      {
        property: 'og:image:secure_url',
        content: 'https://webcaptioner.com/static/og-image.jpg',
      },
      {
        property: 'og:image:type',
        content: 'image/jpg',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
    ],
    link: [{
        // https://github.com/nuxt/nuxt.js/issues/1204
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico?v=2',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Cousine:400,700|Source+Sans+Pro:400,700',
      },
    ],
  },
  css: [],
  modules: [
    ['nuxt-env', {
      // These will be available via this.$env at runtime. We can't use
      // Nuxt's env property in this config unless we're okay with the
      // env variable being baked in at build time.
      keys: [
        'CHROME_EXTENSION_ID',
        'FIREBASE_API_KEY',
        'FIREBASE_AUTH_DOMAIN',
        'FIREBASE_DATABASE_URL',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_STORAGE_BUCKET',
        'FIREBASE_MESSAGING_SENDER_ID',
        'GOOGLE_CAST_APP_ID',
        'HOSTNAME',
        'STRIPE_API_KEY_PUBLIC',
      ]
    }],
    'nuxt-trailingslash-module',
    '@nuxtjs/axios',
    [
      'nuxt-i18n',
      {
        defaultLocale: 'en-US',
        locales: [{
            code: 'en-US',
            file: 'en-US.js',
            iso: 'en-US',
          },
          // {
          //   code: 'pt-BR',
          //   file: 'pt-BR.js',
          //   iso: 'pt-BR',
          // },
        ],
        lazy: true,
        langDir: 'lang/',
      },
    ],
    ['@nuxtjs/sentry'],
    [
      '@nuxtjs/google-analytics',
      {
        id: 'REMOVED',
        batch: {
          enabled: true,
          amount: 2,
          delay: 1000, // ms
        },
        autoTracking: {
          pageviewTemplate: function (route) {
            return {
              page: route.path.replace(/\/$/, ''), // path with trailing slash removed
              title: document.title,
              location: window.location.href,
            };
          },
        },
      },
    ],
    [
      'nuxt-fontawesome',
      {
        component: 'fa',
        imports: [{
            set: '@fortawesome/free-solid-svg-icons',
            icons: [
              'faFileAlt',
              'faFileWord',
              'faExclamationTriangle',
              'faTimes',
              'faMicrophone',
              'faDesktop',
              'faExternalLinkAlt',
              'faSave',
              'faTrashAlt',
              'faCog',
              'faCheckCircle',
              'faSpinner',
              'faCircleNotch',
              'faChevronLeft',
              'faChevronDown',
              'faChevronRight',
              'faInfoCircle',
              'faMinusCircle',
              'faPlusCircle',
              'faPlus',
              'faMinus',
              'faArrowLeft',
              'faArrowRight',
              'faFlask',
              'faCaretRight',
              'faCaretDown',
              'faKeyboard',
              'faHeart',
              'faBroadcastTower',
              'faWindowRestore',
              'faBars',
              'faUserCircle',
              'faStar',
              'faToggleOn',
              'faToggleOff',
            ],
          },
          {
            set: '@fortawesome/free-regular-svg-icons',
            icons: ['faThumbsUp', 'faTimesCircle', 'faUserCircle'],
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: [
              'faApple',
              'faWindows',
              'faAndroid',
              'faChrome',
              'faTwitter',
              'faFacebook',
              'faDropbox',
            ],
          },
        ],
      },
    ],
  ],
  plugins: [{
      src: '~/plugins/websocket',
      mode: 'client',
    },
    {
      src: '~/plugins/firebase.js',
      mode: 'client',
    },
    '~/plugins/vue-timeago',
    '~/plugins/performance.js',
  ],
  sentry: {
    public_key: 'REMOVED',
    project_id: 'REMOVED',
    config: {
      // release: gitRevision.short(),
      environment: process.env.HOSTNAME,
    },
  },
  axios: {
    proxy: true,
    timeout: 7000, // ms
  },
  // Nuxt loading bar
  loading: false,
  /*
   ** Build configuration
   */
  build: {
    // analyze: true,
    extend(config, {
      isDev
    }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }

      if (process.client) {
        config.devtool = '#source-map';
      }

      if (process.server) {}

    },
  },
  hooks(hook) {
    hook('listen', (server) => {
        wsServer.createSocket(server);
      }),
      hook('render:setupMiddleware', (app) => {
        app.use('/health-check', healthCheckMiddleware);

        if (process.env.DISABLE_SSL_REDIRECT !== 'true') {
          app.use(
            redirectSSL.create({
              redirectHost: url.parse(process.env.HOSTNAME).hostname,
            })
          );
        }

        app.use(sourcemapMiddleware);
      });
  },
  serverMiddleware: [
    // Redirect subdomain. Remove this after main page is part of the Nuxt app
    // and can handle redirects that /captioner is currently responsible for
    (req, res, next) => {
      // Redirect to share URL if arriving here from a subdomain
      let {
        subdomain
      } = parseDomain(req.headers.host) || {};

      if (subdomain) {
        // Subdomain will look like "asdf.staging" or "asdf"
        // Remove ".staging" from subdomain if it's there
        subdomain = subdomain.replace('.staging', '');

        // ?d will cause replaceState to be triggered to clear out the URL client-side
        let redirectPath = '/s/' + subdomain + '?d';

        if (!['feedback', 'signin', 'staging'].includes(subdomain) && req.url !== redirectPath) {
          // It's not a protected WC subdomain
          res.writeHead(301, {
            Location: redirectPath
          });
          res.end();
          return;
        }
      }
      next();
    },
    '~/api/index.js',
    {
      path: '/admin',
      handler: '~/middleware/server/admin.js',
    },
    {
      path: '/feedback',
      handler: '~/middleware/server/feedback.js',
    },
    {
      path: '/',
      handler: serveStatic(path.resolve(__dirname + '/../static-site/public')),
    },
  ],
};
