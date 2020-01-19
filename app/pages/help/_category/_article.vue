<template>
  <div>
    <Header>Help Center</Header>
    <div class="layout-site-content container my-4 my-sm-5">
      <div class="row">
        <div class="col-md-4 order-2 order-md-1">
          <hr class="my-4 d-md-none" />
          <div>
            <h3 class="mt-0 mb-3 text-muted">{{ category.title }}</h3>
            <ul class="list-unstyled small">
              <li
                class="mb-2"
                v-for="(article, index) in category.articles"
                :key="index"
              >
                <nuxt-link
                  :to="article.url"
                  :class="article.url === url ? 'font-weight-bold' : ''"
                  >{{ article.name }}</nuxt-link
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="col-md-8 order-1 order-md-2">
          <breadcrumbs
            :breadcrumbs="[
              { text: 'Help Center', url: '/help' },
              { text: category.title, url: category.slug },
              { text: title },
            ]"
          ></breadcrumbs>
          <main>
            <h2 class="mt-0">{{ title }}</h2>
            <div v-html="body" />
          </main>
        </div>
      </div>
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
        title: '',
        slug: '',
        id: '',
        articles: [],
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
        categoryId,
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
          id: categoryId,
          articles: [],
        },
      };
    } catch (error) {
      // if (res) {
      //   res.statusCode = 404; // send 404 back
      //   return { notFound: true };
      // }
    }
  },
  mounted: async function() {
    const categoryArticles = await this.$axios.$get(
      '/api/docs/categories/' + this.category.id + '/articles'
    );
    this.category.articles = categoryArticles;
  },
};
</script>
