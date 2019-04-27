<template>
  <b-modal lazy centered ref="modal" title="Your Web Captioner Account">
    Your settings will now be saved to your account whenever you're signed in.
    <div slot="modal-footer" class="w-100">
      <div class="d-flex">
        <b-btn class="ml-auto" variant="secondary" @click="hideModal()">Got it</b-btn>
      </div>
    </div>
  </b-modal>
</template>



<script>
import bModal from 'bootstrap-vue/es/components/modal/modal';
import bBtn from 'bootstrap-vue/es/components/button/button';

export default {
  components: {
    bModal,
    bBtn,
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
