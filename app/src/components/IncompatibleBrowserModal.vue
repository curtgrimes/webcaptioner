<template>
    <b-modal ref="modal" title="Incompatible Browser" no-close-on-esc no-close-on-backdrop>
      <p>Sorry, currently Web Captioner only works in Google Chrome.</p>
      <p class="mb-0">You can still look around and play with settings, but in order to start captioning, you'll have to <strong>switch to Google Chrome</strong>.</p>
      <div slot="modal-footer" class="w-100">
        <div class="row">
          <div class="col-6">
              <p class="ml-3 mt-2 mb-0"><a href="/help/general/browser-compatibility/" target="_blank">Why?</a></p>
          </div>
          <div class="col-6">
            <b-btn ref="getStartedButton" class="float-right" variant="secondary" @click="hideModal()">
              Look Around Anyway
            </b-btn>
          </div>
        </div>
      </div>
    </b-modal>
</template>


<script>
export default {
  name: 'incompatible-browser-modal',
  methods: {
    showModal() {
      this.$refs.modal.show()
    },
    hideModal () {
      this.$refs.modal.hide();
      this.$store.commit('SET_INCOMPATIBLE_BROWSER_MODAL_INVISIBLE');
    },
  },
}
</script>
