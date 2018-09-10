<template>
  <div>
    <transcript/>
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