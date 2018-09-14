export default ({ app, store, route }) => {
  const settingsPageTitle = (route.meta || []).map((meta) => {
    if (meta && typeof meta.settingsPageTitle !== 'undefined') {
      return meta.settingsPageTitle;
    }
    else if (meta && typeof meta.settingsPageTitleKey !== 'undefined') {
      return app.i18n.t(meta.settingsPageTitleKey);
    }
  }).find(title => title) || '';

  store.commit('SET_SETTINGS_PAGE_TITLE', {settingsPageTitle, omitFromGoogleAnalytics: true});
}