<template>
  <div>
    <Header>Help Center</Header>
    <nuxt-child class="layout-site-content container my-4 my-sm-5" />
  </div>
</template>

<script>
import Header from '~/components/static-site/Header';

export default {
  layout: 'site',
  components: {
    Header,
  },
};
</script>
