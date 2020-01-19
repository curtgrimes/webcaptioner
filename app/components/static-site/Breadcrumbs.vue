<template>
  <div class="bg-breadcrumb">
    <div class="container">
      <ol
        class="breadcrumb px-0"
        vocab="http://schema.org/"
        typeof="BreadcrumbList"
      >
        <li
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
          class="breadcrumb-item"
          property="itemListElement"
          typeof="ListItem"
        >
          <a :href="breadcrumb.url" property="item" typeof="WebPage">
            <span property="name">{{ breadcrumb.text }}</span>
          </a>
          <meta property="position" :content="index + 1" />
        </li>
      </ol>
    </div>
  </div>
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
