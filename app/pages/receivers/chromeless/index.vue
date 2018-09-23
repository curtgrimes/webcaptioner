<template>
  <chromeless-receiver style="height:100vh" />
</template>

<script>
import ChromelessReceiver from '~/components/ChromelessReceiver.vue'
export default {
  head () {
    return {
      title: 'Captions (Windowed)',
    }
  },
  components: {
    ChromelessReceiver,
  },
}
</script>
