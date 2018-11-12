<template>
    <toast title="What's New" :show="shouldShow">
      <whats-new limit="1" :hide-title="true" :small="true"></whats-new>
    </toast>
</template>


<script>
import toast from '~/components/Toast.vue'
import whatsNew from './../WhatsNew.vue';

export default {
  components: {
    toast,
    whatsNew,
  },
  computed: {
    shouldShow: function() {
      return !this.$store.state.captioner.transcript.interim
              && !this.$store.state.captioner.transcript.final
              && !this.$store.state.captioner.transcript.typed
              && !this.$store.state.captioner.shouldBeOn
              && !this.$store.state.donation.message.show;
    },
  },
}
</script>
