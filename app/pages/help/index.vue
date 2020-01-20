<template>
  <div>
    <p class="lead">
      Have questions about Web Captioner? We're here to help!
    </p>
    <hr class="my-5" />
    <h2>Getting Started</h2>
    <article-list :articles="articles.gettingStarted" />
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
      let gettingStarted = await app.$axios.$get(
        '/api/docs/categories/getting-started/articles'
      );

      // let integratingArticles = await app.$axios.$get(
      //   '/api/docs/categories/5e10265604286364bc937611/articles'
      // );

      // let troubleshootingArticles = await app.$axios.$get(
      //   '/api/docs/categories/5e10265604286364bc937611/articles'
      // );
      return {
        articles: {
          gettingStarted,
        },
      };
    } catch (error) {
      // if (res) {
      //   res.statusCode = 404; // send 404 back
      //   return { notFound: true };
      // }
    }
  },
  data: function() {
    return {
      articles: {},
    };
  },
};
</script>
