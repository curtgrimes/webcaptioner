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
const SettingsControlsView = () => import('../views/settings/SettingsControlsView.vue')
const SettingsVmixView = () => import('../views/settings/SettingsVmixView.vue')
const SettingsRemoteDisplaysView = () => import('../views/settings/SettingsRemoteDisplaysView.vue')
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
          {
            path: 'settings',
            component: SettingsView,
            meta: {
              navbarTitle: 'Settings',
            },
            children: [
              {
                path: 'about',
                component: SettingsAboutView,
                meta: {
                  navbarTitle: 'About',
                },
              },
              {
                path: 'appearance',
                component: SettingsAppearanceView,
                meta: {
                  navbarTitle: 'Appearance',
                },
              },
              {
                path: 'word-replacements',
                component: SettingsWordReplacementsView,
                meta: {
                  navbarTitle: 'Word Replacements',
                },
              },
              {
                path: 'censor',
                component: SettingsCensorView,
                meta: {
                  navbarTitle: 'Censor',
                },
              },
              {
                path: 'controls',
                component: SettingsControlsView,
                meta: {
                  navbarTitle: 'Controls',
                },
              },
              {
                path: 'language',
                component: SettingsLanguageView,
                meta: {
                  navbarTitle: 'Language',
                },
              },
              {
                path: 'remote-displays',
                component: SettingsRemoteDisplaysView,
                meta: {
                  navbarTitle: 'Remote Displays',
                },
              },
              {
                path: 'vmix',
                component: SettingsVmixView,
                meta: {
                  navbarTitle: 'vMix',
                },
              },
            ]
          },
        ]
      },
      {
        path: '/receivers',
        component: ReceiverView,
        children: [
          {
            path: 'chromecast',
            component: ReceiverView,
            name: 'receiver-chromecast',
            meta: {
              disableShortcutKeys: true,
            },
          },
          {
            path: 'chromeless',
            component: ReceiverView,
            name: 'receiver-chromeless',
            meta: {
              disableShortcutKeys: true,
            },
          },
          {
            path: 'connect',
            component: ReceiverView,
            name: 'receiver-remote-display',
          },
        ]
      },
      {
        path: '/connect',
        redirect: '/receivers/connect',
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
