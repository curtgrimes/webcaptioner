<template>
  <div class="d-flex flex-grow-1">
    <transcript />
    <nuxt-child/>
  </div>
</template>


<script>
import transcript from '~/components/Transcript.vue'

export default {
  components: {
    transcript,
  }
}
</script>