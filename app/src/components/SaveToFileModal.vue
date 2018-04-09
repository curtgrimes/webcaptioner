<template>
    <b-modal lazy ref="modal" hide-footer title="Save to File" @shown="autofocusElement()">
      <p>Save your current transcript to file.</p>
      <b-alert v-if="transcriptEmpty" show variant="info" class="small text-center">
        Psst... you know you don't have anything to save yet, right?
      </b-alert>
      <div class="row">
        <div class="col-6">
          <b-button @click="saveAsText()" :disabled="transcriptEmpty" variant="secondary" block class="py-3" ref="textFileButton">
              <i class="fa fa-file-text-o d-block fa-3x pb-3" aria-hidden="true"></i>
              Text File
          </b-button>
        </div>
        <div class="col-6">
          <b-button @click="saveAsWord()" :disabled="transcriptEmpty" variant="secondary" block class="py-3">
              <i class="fa fa-file-word-o d-block fa-3x pb-3" aria-hidden="true"></i>
              Word Document
          </b-button>
        </div>
      </div>
      <b-btn class="mt-3" variant="outline-info" block @click="hideModal">Close</b-btn>
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
      this.$refs.textFileButton.focus();
    },
    saveAsText () {
      var a = document.createElement('a');
      a.href = 'data:text/plain;base64,' + btoa(this.$store.state.captioner.transcript.final + this.$store.state.captioner.transcript.interim);
      a.textContent = 'download';
      a.download = 'web-captioner-'+ format(new Date(), 'YYYY-MM-DD-HH-mm-ss') +'.txt';
      a.click();
    },
    saveAsWord () {
      var a = document.createElement('a');
      a.href = 'data:text/html;base64,' + btoa('<html><body>' + this.$store.state.captioner.transcript.final + this.$store.state.captioner.transcript.interim + '</body></html>');
      a.textContent = 'download';
      a.download = 'web-captioner-'+ format(new Date(), 'YYYY-MM-DD-HH-mm-ss') +'.doc';
      a.click();
    },
  },
}
</script>
