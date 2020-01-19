<template>
  <div>
    <ul class="list-unstyled mb-5 mb-md-0 help-columns">
      <li v-for="article in articles" :key="article.id" class="mb-2">
        <nuxt-link :to="article.url">{{ article.name }}</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    articles: {
      type: Array,
      required: true,
    },
  },
};
</script>
