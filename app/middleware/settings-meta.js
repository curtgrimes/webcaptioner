export default ({ store, route }) => {
  const settingsPageTitle = (route.meta || []).map((meta) => {
    if (meta && typeof meta.settingsPageTitle !== 'undefined') {
      return meta.settingsPageTitle;
    }
  }).find(title => title) || '';

  store.commit('SET_SETTINGS_PAGE_TITLE', {settingsPageTitle, omitFromGoogleAnalytics: true});
}