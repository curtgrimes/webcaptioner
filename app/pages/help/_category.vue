<template>
  <div>
    <div class="row">
      <div class="col-md-4 order-2 order-md-1">
        <hr class="my-4 d-md-none" />
        <div class="sticky-top" style="top: 5.5rem">
          <div v-if="$route.params.article">
            <!-- Article is selected -->
            <h3 class="mt-0 mb-3 text-muted">{{ name }}</h3>
            <ul class="list-unstyled small">
              <li
                class="mb-2"
                v-for="(article, index) in articles"
                :key="index"
              >
                <nuxt-link
                  :to="article.url"
                  :class="article.url === $route.path ? 'font-weight-bold' : ''"
                  >{{ article.name }}</nuxt-link
                >
              </li>
            </ul>
          </div>
          <div v-else>
            <!-- Looking at category article listing -- article is not selected -->
            <ul class="list-unstyled">
              <li class="mb-2">
                <nuxt-link
                  :to="'/help/getting-started'"
                  class="text-muted font-weight-bold"
                >
                  Getting Started
                </nuxt-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-8 order-1 order-md-2">
        <nuxt-child />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'site',
  data: function() {
    return {
      name: '',
      url: '',
      articles: [],
    };
  },
  async asyncData({ app, params, res }) {
    try {
      const { name, url } = await app.$axios.$get(
        '/api/docs/categories/' + params.category
      );
      const articles = await app.$axios.$get(
        '/api/docs/categories/' + params.category + '/articles'
      );
      return { name, url, articles };
    } catch (error) {
      if (res) {
        res.statusCode = 404; // send 404 back
        return { notFound: true };
      }
    }
  },
};
</script>
