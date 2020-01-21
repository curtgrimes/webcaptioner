<template>
  <div>
    <b-breadcrumb
      :items="[
        {
          text: 'Help Center',
          to: '/help',
        },
        {
          text: $parent.name,
          to: $parent.url,
        },
        {
          text: title,
          active: true,
        },
      ]"
    ></b-breadcrumb>
    <main>
      <h2 class="mt-0">{{ title }}</h2>
      <div v-html="body" />
    </main>
  </div>
</template>

<script>
import { BBreadcrumb } from 'bootstrap-vue';

export default {
  layout: 'site',
  components: { BBreadcrumb },
  scrollToTop: true,
  data: function() {
    return {
      title: '',
      body: '',
      url: '',
    };
  },
  async asyncData({ app, params, error }) {
    try {
      let { title, body, url } = await app.$axios.$get(
        `/api/docs/categories/${params.category}/articles/${params.article}`
      );

      return {
        title,
        body,
        url,
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
