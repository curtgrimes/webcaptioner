require('dotenv').config()

const serveStatic = require('serve-static')
const path = require('path')
const redirectSSL = require('redirect-ssl')
const healthCheckMiddleware = require('./middleware/server/health-check.js')
const sourcemapMiddleware = require('./middleware/server/sourcemaps.js')
const url = require('url');
const wsServer = require('./socket.io/server');
const gitRevision = require('git-rev-sync');

module.exports = {
  head: {
    title: 'Web Captioner',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Free, real-time captioning for your event.' },
      { name: 'theme-color', content: '#ffe200' },
      { name: 'google', content: 'notranslate' },
      { property: 'og:image', content: 'https://webcaptioner.com/static/og-image.jpg' },
      { property: 'og:image:secure_url', content: 'https://webcaptioner.com/static/og-image.jpg' },
      { property: 'og:image:type', content: 'image/jpg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=2' }, // https://github.com/nuxt/nuxt.js/issues/1204
    ],
  },
  modules: [
    ['nuxt-env', {
      keys: [
        'GOOGLE_CAST_APP_ID',
        'CHROME_EXTENSION_ID',
      ],
    }],
    'nuxt-trailingslash-module',
    '@nuxtjs/axios',
    ['bootstrap-vue/nuxt', { css: false }],
    ['nuxt-i18n', {
      defaultLocale: 'en-US',
      locales: [
        {
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
      langDir: 'lang/'
    }],
    ['@nuxtjs/sentry'],
    ['@nuxtjs/google-analytics', {
      id: 'REMOVED',
      batch: {
        enabled: true,
        amount: 2,
        delay: 400, // ms
      },
      autoTracking: {
        pageviewTemplate: function(route) {
          return {
            page: route.path.replace(/\/$/, ''), // path with trailing slash removed
            title: document.title,
            location: window.location.href,
          };
        }
      },
    }],
    ['nuxt-fontawesome', {
      component: 'fa', 
      imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['faFileAlt', 'faFileWord', 'faExclamationTriangle', 'faTimes', 'faMicrophone', 'faDesktop', 'faExternalLinkAlt', 'faSave', 'faTrashAlt', 'faCog', 'faCheckCircle', 'faSpinner', 'faChevronLeft', 'faChevronDown', 'faChevronRight', 'faMinusCircle', 'faPlusCircle', 'faPlus', 'faMinus', 'faArrowLeft', 'faFlask', 'faCaretRight', 'faCaretDown', 'faKeyboard', 'faHeart', 'faBroadcastTower',],
        },
        {
          set: '@fortawesome/free-regular-svg-icons',
          icons: ['faThumbsUp'],
        },
        {
          set: '@fortawesome/free-brands-svg-icons',
          icons: ['faApple', 'faWindows', 'faAndroid', 'faChrome', 'faTwitter'],
        },
      ]
    }],
  ],
  plugins: [
    { src: '~/plugins/websocket', ssr: false },
    '~/plugins/vue-timeago',
    '~/node_modules/vue-contenteditable-directive',
    '~/plugins/performance.js',
  ],
  css: [
    '@/assets/scss/app.scss',
  ],
  sentry: {
    public_key: 'REMOVED',
    project_id: 'REMOVED',
    config: {
      release: gitRevision.short(),
      environment: process.env.HOSTNAME,
    },
  },
  axios: {
    proxy: true,
    timeout: 7000, // ms
  },
  /*
  ** Customize the progress bar color
  */
  loading: false,
  /*
  ** Build configuration
  */
  build: {
    // analyze: true,
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient, isServer }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      if (isClient) {
        config.devtool = '#source-map';
      }

      if (isServer) {

      }
    }
  },
  hooks(hook) {
    hook('listen', (server) => {
      wsServer.createSocket(server);
    }),
    hook('render:setupMiddleware', (app) => {
      app.use('/health-check', healthCheckMiddleware);

      if (process.env.DISABLE_SSL_REDIRECT !== 'true') {
        app.use(redirectSSL.create({
          redirectHost: url.parse(process.env.HOSTNAME).hostname,
        }));
      }

      app.use(sourcemapMiddleware);
    })
  },
  serverMiddleware: [
    '~/api/index.js',
    { path: '/admin', handler: '~/middleware/server/admin.js'},
    { path: '/feedback', handler: '~/middleware/server/feedback.js' },
    { path: '/', handler: serveStatic(path.resolve(__dirname + '/../static-site/public')) },
  ],
}

