import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting
const createListView = id => () => import('../views/CreateListView').then(m => m.default(id))
const ItemView = () => import('../views/ItemView.vue')
const UserView = () => import('../views/UserView.vue')


const SettingsView = () => import('../views/SettingsView.vue')
const SettingsAboutView = () => import('../views/settings/SettingsAboutView.vue')
const SettingsAppearanceView = () => import('../views/settings/SettingsAppearanceView.vue')
const SettingsLanguageView = () => import('../views/settings/SettingsLanguageView.vue')
const SettingsWordReplacementsView = () => import('../views/settings/SettingsWordReplacementsView.vue')
const SettingsCensorView = () => import('../views/settings/SettingsCensorView.vue')
const SettingsVmixView = () => import('../views/settings/SettingsVmixView.vue')
const SettingsKeyboardShortcutsView = () => import('../views/settings/SettingsKeyboardShortcutsView.vue')
const CaptionerView = () => import('../views/CaptionerView.vue')
const Transcript = () => import('../components/Transcript.vue')
const SaveToFileModal = () => import('../components/SaveToFileModal.vue')
const ClearTranscriptModal = () => import('../components/ClearTranscriptModal.vue')
const ReceiverView = () => import('../views/ReceiverView.vue')

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/captioner', component: CaptionerView,
        children: [
          { path: '', component: Transcript },
          { path: 'save-to-file', component: Transcript, name: 'save-to-file' },
          { path: 'clear', component: Transcript, name: 'clear-transcript' },
          { path: 'settings', component: SettingsView, redirect: '/captioner/settings/about',
            children: [
              {
                path: 'about',
                component: SettingsAboutView
              },
              {
                path: 'appearance',
                component: SettingsAppearanceView
              },
              {
                path: 'word-replacements',
                component: SettingsWordReplacementsView
              },
              {
                path: 'censor',
                component: SettingsCensorView
              },
              {
                path: 'language',
                component: SettingsLanguageView
              },
              {
                path: 'vmix',
                component: SettingsVmixView
              },
              {
                path: 'keyboard-shortcuts',
                component: SettingsKeyboardShortcutsView
              },
            ]
          },
        ]
      },
      { path: '/receiver', component: ReceiverView},
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
