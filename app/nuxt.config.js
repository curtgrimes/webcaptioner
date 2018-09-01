const serveStatic = require('serve-static')
const path = require('path')

module.exports = {
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
          icons: ['faFileAlt', 'faFileWord', 'faExclamationTriangle', 'faTimes', 'faMicrophone', 'faDesktop', 'faExternalLinkAlt', 'faSave', 'faTrashAlt', 'faCog', 'faCheckCircle', 'faSpinner', 'faChevronRight', 'faMinusCircle', 'faPlusCircle', 'faArrowLeft', 'faFlask'],
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

      // if (isClient) {
      //   config.devtool = '#source-map';
      // }

      if (isServer) {

      }
    }
  },
  serverMiddleware: [
    // Put this first
    'redirect-ssl',

    // Put this before /
    { path: '/feedback', handler: '~/api/feedback/index.js' },

    { path: '/', handler: serveStatic(path.resolve(__dirname + '/../static-site/public')) },
    { path: '/health-check', handler: '~/api/health-check/index.js' },
  ],
}

