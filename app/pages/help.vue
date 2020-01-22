<template>
  <div>
    <div class="jumbotron bg-primary bg-zigzag pt-5 pb-4">
      <div class="container pt-5">
        <div class="row">
          <div class="col-lg-6">
            <h1 class="display-4">
              Help Center
            </h1>
          </div>
          <div class="col-lg-4 ml-auto">
            <input
              type="text"
              class="form-control mt-2 help-search-header"
              placeholder="Search..."
              v-model="query"
              @focus="searchFocus()"
            />
          </div>
        </div>
      </div>
    </div>
    <nuxt-child class="layout-site-content container my-4 my-sm-5" />
  </div>
</template>

<script>
export default {
  layout: 'site',
  computed: {
    query: {
      get() {
        return this.$store.state.help.query;
      },
      set(query) {
        this.$store.state.help.query = query;
      },
    },
  },
  methods: {
    searchFocus() {
      if (this.query) {
        this.$router.replace({
          path: '/help/search',
          query: { query: this.query },
        });
      }
    },
  },
  watch: {
    query() {
      if (this.query) {
        const path = '/help/search';
        if (this.$route.path === path) {
          // We're already on the search page.
          // Do $router.replace instead of .push.
          this.$router.replace({
            path,
            query: { query: this.query },
          });
        } else {
          // Navigate to it for the first time
          this.$router.push({
            path,
            query: { query: this.query },
          });
        }
      }
    },
  },
};
</script>
