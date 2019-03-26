// Returns the Vuex store.
export const getStore = () => cy.window().its('$nuxt.$store')
