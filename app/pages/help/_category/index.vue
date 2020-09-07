<template>
  <div>
    <b-breadcrumb
      :items="[
        {
          text: 'Help Center',
          to: '/help',
        },
        {
          text: categoryName,
          active: true,
        },
      ]"
    ></b-breadcrumb>
    <h1 class="mb-4">{{ categoryName }}</h1>
    <article-list :articles="articles" />
  </div>
</template>

<script>
import ArticleList from '~/components/help/ArticleList';
import { BBreadcrumb } from 'bootstrap-vue';

export default {
  layout: 'site',
  components: {
    BBreadcrumb,
    ArticleList,
  },
  async asyncData({ app, params, res }) {
    try {
      const { name: categoryName } = await app.$axios.$get(
        `/api/docs/categories/${params.category}`
      );

      const articles = await app.$axios.$get(
        `/api/docs/categories/${params.category}/articles`
      );
      return {
        articles,
        categoryName,
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
      categoryName: '',
    };
  },
};
</script>
