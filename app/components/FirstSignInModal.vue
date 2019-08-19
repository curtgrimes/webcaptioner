<template>
  <b-modal lazy centered ref="modal" title="Your Web Captioner Account">
    Your settings will now be saved to your account whenever you're signed in.
    <div slot="modal-footer" class="w-100">
      <div class="d-flex">
        <b-button class="ml-auto" variant="secondary" @click="hideModal()">Got it</b-button>
      </div>
    </div>
  </b-modal>
</template>



<script>
import { BModal, BButton } from 'bootstrap-vue';

export default {
  components: {
    BModal,
    BButton,
  },
  methods: {
    showModal() {
      this.$refs.modal.show();
    },
    hideModal() {
      this.$refs.modal.hide();
      this.$store.commit('SHOW_FIRST_SIGN_IN_MESSAGE', false);
    },
  },
};
</script>
