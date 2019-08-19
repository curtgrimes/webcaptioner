<template>
  <b-modal
    lazy
    ref="modal"
    size="sm"
    hide-footer
    title="Microphone Permission"
    no-close-on-esc
    no-close-on-backdrop
    hide-header-close
  >Web Captioner needs your permission to use your microphone. It only uses it during captioning.</b-modal>
</template>



<script>
import { BModal } from 'bootstrap-vue';

export default {
  components: {
    BModal,
  },
  methods: {
    showModal() {
      this.$refs.modal.show();
    },
    hideModal() {
      this.$refs.modal.hide();
      this.$store.commit('captioner/SET_MICROPHONE_PERMISSION_NEEDED', {
        microphonePermissionNeeded: false,
      });
    },
  },
};
</script>
