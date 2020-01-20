<template>
  <div>
    <breadcrumbs
      v-if="$route.params.article"
      :breadcrumbs="[
        { text: 'Help Center', url: '/help' },
        { text: $parent.name, url: $parent.url },
        { text: title },
      ]"
    ></breadcrumbs>
    <main>
      <h2 class="mt-0">{{ title }}</h2>
      <div v-html="body" />
    </main>
  </div>
</template>

<script>
import Breadcrumbs from '~/components/static-site/Breadcrumbs';

export default {
  layout: 'site',
  components: { Breadcrumbs },
  scrollToTop: true,
  data: function() {
    return {
      title: '',
      body: '',
      url: '',
    };
  },
  async asyncData({ app, params, res }) {
    try {
      let { title, body, url } = await app.$axios.$get(
        `/api/docs/categories/${params.category}/articles/${params.article}`
      );

      return {
        title,
        body,
        url,
      };
    } catch (error) {
      // if (res) {
      //   res.statusCode = 404; // send 404 back
      //   return { notFound: true };
      // }
    }
  },
  // mounted: async function() {
  //   const categoryArticles = await this.$axios.$get(
  //     '/api/docs/categories/' + this.category.id + '/articles'
  //   );
  //   this.category.articles = categoryArticles;
  // },
};
</script>
