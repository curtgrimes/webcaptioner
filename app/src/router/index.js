import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting
const createListView = id => () => import('../views/CreateListView').then(m => m.default(id))
const ItemView = () => import('../views/ItemView.vue')
const UserView = () => import('../views/UserView.vue')


const SettingsView = () => import('../views/SettingsView.vue')
const SettingsAppearanceView = () => import('../views/settings/SettingsAppearanceView.vue')
const SettingsLanguageView = () => import('../views/settings/SettingsLanguageView.vue')
const SettingsWordReplacementsView = () => import('../views/settings/SettingsWordReplacementsView.vue')
const SettingsVmixView = () => import('../views/settings/SettingsVmixView.vue')
const CaptionerView = () => import('../views/CaptionerView.vue')
const CaptionerCaptionView = () => import('../views/CaptionerCaptionView.vue')

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/captioner', component: CaptionerView,
        children: [
          { path: '', component: CaptionerCaptionView },
          { path: 'settings', component: SettingsView, redirect: '/captioner/settings/appearance',
            children: [
              {
                path: 'appearance',
                component: SettingsAppearanceView
              },
              {
                path: 'word-replacements',
                component: SettingsWordReplacementsView
              },
              {
                path: 'language',
                component: SettingsLanguageView
              },
              {
                path: 'vmix',
                component: SettingsVmixView
              },
            ]
          },
        ]
      },
      { path: '/top/:page(\\d+)?', component: createListView('top') },
      { path: '/new/:page(\\d+)?', component: createListView('new') },
      { path: '/show/:page(\\d+)?', component: createListView('show') },
      { path: '/ask/:page(\\d+)?', component: createListView('ask') },
      { path: '/job/:page(\\d+)?', component: createListView('job') },
      { path: '/item/:id(\\d+)', component: ItemView },
      { path: '/user/:id', component: UserView },
      { path: '/', redirect: '/captioner' }
    ]
  })
}
