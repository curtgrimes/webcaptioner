import Vue from 'vue'
import VueTimeago from 'vue-timeago'

Vue.use(VueTimeago, {
  name: 'timeago', // Component name, `Timeago` by default
  locale: 'en', // Default locale
  // We use `date-fns` under the hood
  // So you can use all locales from it
  locales: {
    // 'zh-CN': require('date-fns/locale/zh_cn'),
    // 'ja': require('date-fns/locale/ja'),
  }
})