<template>
  <div>
    <h2>{{ $parent.name }}</h2>
    <article-list :articles="articles" />
  </div>
</template>

<script>
import ArticleList from '~/components/help/ArticleList';

export default {
  layout: 'site',
  components: {
    ArticleList,
  },
  async asyncData({ app, params, res }) {
    try {
      let articles = await app.$axios.$get(
        `/api/docs/categories/${params.category}/articles`
      );
      return {
        articles,
      };
    } catch (error) {
      if (res) {
        res.statusCode = 404; // send 404 back
        return { notFound: true };
      }
    }
  },
  data: function() {
    return {
      articles: {},
    };
  },
};
</script>
