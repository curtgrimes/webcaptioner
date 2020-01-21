<template>
  <div>
    <Header v-if="error.header">{{ error.header }}</Header>
    <div class="container py-5">
      <div class="card card-body bg-light text-muted col-md-10 mx-auto py-5">
        <h2 class="text-center mt-0">
          <fa icon="exclamation-triangle" fixed-width class="mr-1" />
          {{ error.message || 'An error occurred.' }}
        </h2>
        <p class="text-center mb-0">
          <nuxt-link to="/help" class="btn btn-outline-secondary mr-1">
            Help Center</nuxt-link
          >
          <nuxt-link to="/" class="btn btn-outline-secondary ml-1">
            Home
          </nuxt-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '~/components/static-site/Header';
export default {
  components: {
    Header,
  },
  props: ['error'],
  layout: 'site',
};
</script>
