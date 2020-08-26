<template>
  <div>
    <ul class="list-unstyled row mb-4" style="font-size:1.2rem">
      <li
        v-for="article in articles"
        :key="article.id"
        class="col-md-6 position-relative"
      >
        <div class="border-top w-100 py-3">
          <nuxt-link
            :to="article.url"
            class="stretched-link d-flex align-items-center"
          >
            {{ article.name }}
            <fa icon="arrow-right" class="text-muted ml-auto mr-2" />
          </nuxt-link>
        </div>
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
