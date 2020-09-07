<template>
  <div>
    <ul class="list-unstyled row mb-4" style="font-size: 1.2rem">
      <li
        v-for="article in articles"
        :key="article.id"
        class="col-md-6 position-relative"
      >
        <div class="border-top w-100 py-3 d-flex align-items-center h-100">
          <nuxt-link
            :to="article.url"
            class="stretched-link d-flex align-items-center w-100"
          >
            {{ article.name }}
            <span class="ml-auto">
              <fa icon="arrow-right" class="text-muted mx-2" />
            </span>
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
