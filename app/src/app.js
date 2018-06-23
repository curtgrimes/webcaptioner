import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import titleMixin from './util/title'
import * as filters from './util/filters'
import BootstrapVue from 'bootstrap-vue'
import dateFormat from 'date-fns/format'
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faFileAlt, faFileWord, faExclamationTriangle, faTimes, faMicrophone, faDesktop, faExternalLinkAlt, faSave, faTrashAlt, faCog, faCheckCircle, faSpinner, faChevronRight, faMinusCircle, faPlusCircle, faArrowLeft, faFlask } from '@fortawesome/free-solid-svg-icons'

import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'

import { faApple, faWindows, faAndroid, faChrome } from '@fortawesome/fontawesome-free-brands'

library.add(faFileAlt, faThumbsUp, faFileWord, faExclamationTriangle, faTimes, faMicrophone, faDesktop, faApple, faWindows, faAndroid, faExternalLinkAlt, faSave, faTrashAlt, faCog, faCheckCircle, faSpinner, faChrome,faChevronRight, faMinusCircle, faPlusCircle, faArrowLeft, faFlask)

Vue.component('fa', {
  functional: true,
  props: FontAwesomeIcon.props,
  render (h, context) {
    if (context.parent._isMounted) {
      return h(FontAwesomeIcon, context)
    } else {
      context.parent.$once('hook:mounted', () => {
        context.parent.$forceUpdate()
      })
    }
  }
})

Raven
    .config('REMOVED')
    .addPlugin(RavenVue, Vue)
    .install();

const dateFormatPlugin = {
  install () {
      Vue.helpers = {dateFormat}
      Vue.prototype.$helpers = {dateFormat}
  }
};

Vue.use(dateFormatPlugin);
Vue.use(BootstrapVue);

Vue.directive('autofocus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
})

// mixin for handling title
Vue.mixin(titleMixin)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp () {
  // create store and router instances
  const store = createStore()
  const router = createRouter()

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store }
}
