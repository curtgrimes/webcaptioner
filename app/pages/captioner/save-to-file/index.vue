<template>
  <div class="d-flex flex-grow-1">
    <transcript />
    <b-modal
      v-model="showModal"
      lazy
      ref="modal"
      hide-footer
      :title="$t('captioner.saveToFile.title')"
      @shown="autofocusElement()"
      @hide="replaceRouteToParent"
    >
      <p>{{$t('captioner.saveToFile.description')}}</p>
      <b-alert
        v-if="transcriptEmpty"
        show
        variant="info"
        class="small text-center"
      >{{$t('captioner.saveToFile.transcriptEmptyMessage')}}</b-alert>
      <div class="row">
        <div class="col-6">
          <b-button
            @click="saveAsText()"
            :disabled="transcriptEmpty"
            variant="secondary"
            block
            class="py-3"
            ref="textFileButton"
          >
            <div class="mx-auto mb-3 mt-2">
              <fa icon="file-alt" size="3x" />
            </div>
            <span class="d-inline d-sm-none">{{$t('captioner.saveToFile.text')}}</span>
            <span class="d-none d-sm-inline">{{$t('captioner.saveToFile.textFile')}}</span>
          </b-button>
        </div>
        <div class="col-6">
          <b-button
            @click="saveAsWord()"
            :disabled="transcriptEmpty"
            variant="secondary"
            block
            class="py-3"
          >
            <div class="mx-auto mb-3 mt-2">
              <fa icon="file-word" size="3x" />
            </div>
            <span class="d-inline d-sm-none">{{$t('captioner.saveToFile.word')}}</span>
            <span class="d-none d-sm-inline">{{$t('captioner.saveToFile.wordDocument')}}</span>
          </b-button>
        </div>
      </div>
      <b-button
        class="mt-3"
        variant="outline-info"
        block
        :to="localePath('captioner')"
        replace
      >{{$t('common.close')}}</b-button>
    </b-modal>
  </div>
</template>

<script>
import saveToFile from '~/mixins/saveToFile';
import transcript from '~/components/Transcript.vue';
import dateFormat from '~/mixins/dateFormat';
import { BButton, BAlert, BModal } from 'bootstrap-vue';

const routeName = 'save-to-file';

export default {
  name: 'save-as-file-modal',
  components: {
    transcript,
    BButton,
    BAlert,
    BModal,
  },
  mixins: [saveToFile, dateFormat],
  data: function() {
    return {
      showModal: true,
    };
  },
  computed: {
    transcriptEmpty() {
      return (
        !this.$store.state.captioner.transcript.interim &&
        !this.$store.state.captioner.transcript.final
      );
    },
  },
  mounted: function() {
    if (this.$route.name == routeName) {
      this.$refs.modal.show();
    }
  },
  watch: {
    '$route.name': function(routeTo, routeFrom) {
      if (routeTo == routeName) {
        this.$refs.modal.show();
      } else if (routeFrom == routeName) {
        this.$refs.modal.hide();
      }
    },
  },
  methods: {
    replaceRouteToParent(e) {
      // e.trigger is set if the user interacted with the dialog UI directly
      // to cause it to close. Only replace the state when this happens. Otherwise,
      // if e.trigger isn't set, the dialog closing is due to a route change already
      // in progress, (keyboard shortcuts, etc.) so we don't want to change the route.
      if (e.trigger) {
        this.$router.replace(this.localePath('captioner'));
      }
    },
    autofocusElement() {
      this.$refs.textFileButton.focus();
    },
    saveAsText() {
      this.saveToTextFile({
        transcript:
          this.$store.state.captioner.transcript.final +
          this.$store.state.captioner.transcript.interim,
        dateFormatter: this.dateFormat,
        onDone: () => {
          this.$router.replace(this.localePath('captioner')); // Close dialog
        },
      });
    },
    saveAsWord() {
      this.saveToWordFile({
        transcript:
          this.$store.state.captioner.transcript.final +
          this.$store.state.captioner.transcript.interim,
        dateFormatter: this.dateFormat,
        onDone: () => {
          this.$router.replace(this.localePath('captioner')); // Close dialog
        },
      });
    },
  },
};
</script>
