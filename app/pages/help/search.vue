<template>
  <div>
    <h2>Search</h2>
    <b-spinner v-if="loading"></b-spinner>
    <transition name="fade">
      <article-list v-show="!loading" :articles="searchResultArticles" />
    </transition>
  </div>
</template>

<script>
import ArticleList from '~/components/help/ArticleList';
import debounce from 'lodash.debounce';
import { BSpinner } from 'bootstrap-vue';

export default {
  layout: 'site',
  components: {
    ArticleList,
    BSpinner,
  },
  data() {
    return {
      loading: false,
      searchResultArticles: [],
    };
  },
  mounted() {
    if (this.query) {
      this.startSearch();
    }
  },
  computed: {
    query: {
      get() {
        return this.$store.state.help.query;
      },
    },
  },
  methods: {
    startSearch() {
      this.loading = true;
      this.searchDebounced();
    },
    searchDebounced: debounce(async function() {
      this.searchResultArticles = await this.$axios.$get('/api/docs/articles', {
        params: { query: this.query },
      });
      this.loading = false;
    }, 500),
  },
  watch: {
    query() {
      this.startSearch();
    },
  },
};
</script>
