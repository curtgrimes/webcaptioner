<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li
        class="breadcrumb-item"
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="index"
      >
        <nuxt-link v-if="breadcrumb.url" :to="breadcrumb.url">
          {{ breadcrumb.text }}
        </nuxt-link>
        <span v-else class="text-muted">
          {{ breadcrumb.text }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  props: {
    breadcrumbs: {
      type: Array,
    },
  },
};
</script>
