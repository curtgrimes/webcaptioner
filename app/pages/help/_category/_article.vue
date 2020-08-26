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
          to: categoryUrl,
        },
        {
          text: title,
          active: true,
        },
      ]"
    ></b-breadcrumb>
    <h1 class="mb-4">{{ title }}</h1>
    <div class="row">
      <div class="col-md-8">
        <main>
          <div v-html="body" />
        </main>
      </div>
      <div class="col-md-4">
        <div
          class="sticky-top card card-body mt-4 mt-md-0"
          style="top: 5.5rem;z-index:5"
        >
          <h2 class="h4 mb-3 text-muted">
            <nuxt-link :to="categoryUrl" class="text-dark font-weight-normal">
              {{ categoryName }}
            </nuxt-link>
          </h2>
          <ul class="list-unstyled mb-n2">
            <li class="mb-2" v-for="(article, index) in articles" :key="index">
              <nuxt-link
                :to="article.url"
                :class="article.url === $route.path ? 'font-weight-bold' : ''"
              >
                {{ article.name }}
              </nuxt-link>
            </li>
          </ul>
          <hr class="my-3" />
          <nuxt-link to="/help" class="text-muted">
            <fa icon="arrow-left" size="sm" fixed-width class="mr-1" /><!--
            -->Help Center Home
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BBreadcrumb } from 'bootstrap-vue';

export default {
  layout: 'site',
  head() {
    return {
      title: `${this.title} - Web Captioner Help`,
    };
  },
  components: { BBreadcrumb },
  scrollToTop: true,
  data: function() {
    return {
      title: '',
      body: '',
      url: '',
      categoryName: '',
      categoryUrl: '',
      articles: [],
    };
  },
  async asyncData({ app, params, error }) {
    try {
      const { title, body, url } = await app.$axios.$get(
        `/api/docs/categories/${params.category}/articles/${params.article}`
      );

      const { name: categoryName, url: categoryUrl } = await app.$axios.$get(
        '/api/docs/categories/' + params.category
      );

      const articles = await app.$axios.$get(
        '/api/docs/categories/' + params.category + '/articles'
      );

      return {
        title,
        body,
        url,
        categoryName,
        categoryUrl,
        articles,
      };
    } catch (e) {
      error({
        statusCode: e.response.status,
        message: e.response.data,
        header: 'Help Center',
      });
    }
  },
};
</script>
