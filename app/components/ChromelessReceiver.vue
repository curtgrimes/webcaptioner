<template>
  <transcript show-typed-live-read-only></transcript>
</template>

<script>
import Transcript from '~/components/Transcript.vue';

export default {
  name: "chromeless-receiver",
  components: {
    Transcript,
  },
  mounted: function() {

    if (window) {
      window.addEventListener('processVuexMutation', this.processVuexMutation);
      window.addEventListener('processVuexAction', this.processVuexAction);
    }

    // When opener window refreshes or closes, close this window
    if (window.opener) {
      window.opener.addEventListener('unload', () => {
        window.close();
      });
    }

    setInterval(() => {
      if (!window.opener) {
        window.close();
      }
    },250);
    
    if (window.opener) {
      window.opener.dispatchEvent(new CustomEvent('receiverIsReadyToReceiveMutations'));
    }
  },
  methods: {
    processVuexMutation: function ({detail:{type, payload}}) {
      this.$store.commit(type, payload);
    },
    processVuexAction: function ({detail:{type, payload}}) {
      this.$store.dispatch(type, payload);
    },
  }
};
</script>
