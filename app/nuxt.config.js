require('dotenv').config()

const serveStatic = require('serve-static')
const path = require('path')
const redirectSSL = require('redirect-ssl')
const sourcemapMiddleware = require('./middleware/server/sourcemaps.js')

module.exports = {
  env: {
    GOOGLE_CAST_APP_ID: process.env.GOOGLE_CAST_APP_ID,
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Web Captioner',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Real-time captioning for your event, speech, classroom lecture, or church service.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=2' }, // https://github.com/nuxt/nuxt.js/issues/1204
    ],
  },
  modules: [
    '@nuxtjs/ngrok',
    ['bootstrap-vue/nuxt', { css: false }],
    // ['@nuxtjs/sentry'],
    ['@nuxtjs/google-analytics', {
      id: 'REMOVED',
      batch: {
        enabled: true,
        amount: 2,
        delay: 400, // ms
      },
    }],
    ['nuxt-fontawesome', {
      component: 'fa', 
      imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['faFileAlt', 'faFileWord', 'faExclamationTriangle', 'faTimes', 'faMicrophone', 'faDesktop', 'faExternalLinkAlt', 'faSave', 'faTrashAlt', 'faCog', 'faCheckCircle', 'faSpinner', 'faChevronRight', 'faMinusCircle', 'faPlusCircle', 'faArrowLeft', 'faFlask', 'faCaretRight', 'faCaretDown', 'faKeyboard', ],
        },
        {
          set: '@fortawesome/free-regular-svg-icons',
          icons: ['faThumbsUp'],
        },
        {
          set: '@fortawesome/free-brands-svg-icons',
          icons: ['faApple', 'faWindows', 'faAndroid', 'faChrome'],
        },
      ]
    }],
  ],
  plugins: [
    '~/node_modules/vue-contenteditable-directive',
  ],
  css: [
    '@/assets/scss/app.scss',
  ],
  sentry: {
    public_key: 'REMOVED',
    project_id: 'web-captioner',
    config: {},
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
    hook ('render:setupMiddleware', (app) => {
      app.use(sourcemapMiddleware);
    })
  },
  serverMiddleware: [
    // Put this first
    redirectSSL,

    // // Put this before /
    // { path: '/feedback', handler: '~/middleware/server/feedback.js' },

    // { path: '/', handler: serveStatic(path.resolve(__dirname + '/../static-site/public')) },
    // { path: '/health-check', handler: '~/middleware/server/health-check.js' },
  ],
}

