<template>
  <div>
    <Header>Help Center</Header>
    <breadcrumbs
      :breadcrumbs="[
        { text: 'Help Center', url: '/help' },
        { text: category.title, url: category.slug },
        { text: title, url: url },
      ]"
    ></breadcrumbs>
    <div class="container my-4 my-sm-5">
      <h2>{{ title }}</h2>
      <div v-html="body" />
    </div>
  </div>
</template>

<script>
import Header from '~/components/static-site/Header';
import Breadcrumbs from '~/components/static-site/Breadcrumbs';

export default {
  layout: 'site',
  components: { Header, Breadcrumbs },
  data: function() {
    return {
      title: '',
      body: '',
      url: '',
      category: {
        name: '',
        slug: '',
      },
    };
  },
  async asyncData({ app, params, res }) {
    try {
      let {
        title,
        body,
        url,
        categoryTitle,
        categorySlug,
      } = await app.$axios.$get(
        `/api/docs/categories/${params.category}/articles/${params.article}`
      );

      return {
        title,
        body,
        url,
        category: {
          title: categoryTitle,
          slug: '/help/' + categorySlug,
        },
      };
    } catch (error) {
      // if (res) {
      //   res.statusCode = 404; // send 404 back
      //   return { notFound: true };
      // }
    }
  },
};
</script>
