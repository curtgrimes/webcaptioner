<template>
  <div class="d-flex flex-grow-1" >
    <transcript class="flex-grow-1" />
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