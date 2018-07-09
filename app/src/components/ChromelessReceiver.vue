<template></template>

<script>

export default {
  name: "chromeless-receiver",
  mounted: function() {

    if (window) {
      window.addEventListener('processMessage', this.processMessage);
    }

    // When opener window refreshes or closes, close this window
    window.opener.addEventListener('unload', () => {
      window.close();
    });
    setInterval(() => {
      if (!window.opener) {
        window.close();
      }
    },250);
    
  },
  methods: {
    processMessage: function ({detail:{type, payload}}) {
      this.$store.commit(type, payload);
    },
  }
};
</script>
