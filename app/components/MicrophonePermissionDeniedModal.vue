<template>
  <b-modal
    lazy
    ref="modal"
    title="Microphone Permission Denied"
    no-close-on-backdrop
    hide-header-close
    @shown="focusButton()"
  >
    <p>Uh oh &mdash; Web Captioner currently doesn't have permission to use your microphone.</p>
    <p class="mb-0">
      That's okay. You can fix it. Find a
      <strong>camera or microphone icon</strong> near the top of your screen. Click it and
      <strong>allow Web Captioner to use your microphone</strong>.
    </p>
    <div slot="modal-footer">
      <b-button ref="closeButton" class="float-right" variant="secondary" @click="hideModal()">Close</b-button>
    </div>
  </b-modal>
</template>



<script>
import { BButton, BModal } from 'bootstrap-vue';

export default {
  components: {
    BButton,
    BModal,
  },
  methods: {
    showModal() {
      this.$refs.modal.show();
    },
    hideModal() {
      this.$refs.modal.hide();
      document.querySelector('#startCaptioningDropdown').focus();
    },
    focusButton() {
      this.$refs.closeButton.focus();
    },
  },
};
</script>
