<template>
    <b-modal lazy ref="modal" hide-footer title="Clear transcript?" @shown="autofocusElement()">
      <div class="text-right">
        <b-btn ref="cancelButton" class="mr-2" variant="outline-info" @click="hideModal">Cancel</b-btn>
        <b-btn variant="danger" @click="clearTranscript">Clear Transcript</b-btn>
      </div>
    </b-modal>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'save-as-file-modal',
  computed: {
    transcriptEmpty() {
      return !this.$store.state.captioner.transcript.interim
        && !this.$store.state.captioner.transcript.final;
    },
  },
  methods: {
    showModal () {
      this.$refs.modal.show();
    },
    hideModal () {
      this.$refs.modal.hide();
    },
    autofocusElement () {
      this.$refs.cancelButton.focus();
    },
    clearTranscript () {
      this.$store.dispatch('captioner/restart');
      this.$store.commit('captioner/CLEAR_TRANSCRIPT');
      this.$refs.modal.hide();
    },
  },
}
</script>
