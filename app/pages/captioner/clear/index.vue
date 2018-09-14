<template>
  <div>
    <transcript/>
    <b-modal v-model="modalShow" lazy ref="modal" hide-footer :title="$t('captioner.clearTranscript.title')" @shown="autofocusElement()" @hide="replaceRouteToParent">
      <div class="text-right">
        <b-btn ref="cancelButton" class="mr-2" variant="outline-info" @click="cancelModal()">{{$t('common.cancel')}}</b-btn>
        <b-btn variant="danger" @click="clearTranscript">{{$t('captioner.clearTranscript.ok')}}</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>

const routeName = 'clear-transcript';
import transcript from '~/components/Transcript.vue'

export default {
  components: {
    transcript,
  },
    data: function() {
        return {
            modalShow: true,
        };
    },
  computed: {
    transcriptEmpty() {
      return !this.$store.state.captioner.transcript.interim
        && !this.$store.state.captioner.transcript.final;
    },
  },
  mounted: function() {
    if (this.$route.name == routeName) {
      this.$refs.modal.show();
    }
  },
  watch: {
    '$route.name': function (routeTo, routeFrom) {
      if (routeTo == routeName) {
        this.$refs.modal.show();
      }
      else if (routeFrom == routeName) {
        this.$refs.modal.hide();
      }
    }
  },
  methods: {
    replaceRouteToParent(e) {
      // e.trigger is set if the user interacted with the dialog UI directly
      // to cause it to close. Only replace the state when this happens. Otherwise,
      // if e.trigger isn't set, the dialog closing is due to a route change already
      // in progress, (keyboard shortcuts, etc.) so we don't want to change the route.
      if (e.trigger) {
        this.$router.replace('/captioner');
      }
    },
    showModal () {
      this.$refs.modal.show();
    },
    cancelModal() {
      this.$refs.modal.hide();
      this.$router.replace('/captioner');
    },
    hideModal () {
      this.$refs.modal.hide();
    },
    autofocusElement () {
      this.$refs.cancelButton.focus();
    },
    clearTranscript () {
      if (this.$store.state.captioner.on) {
        this.$store.dispatch('captioner/restart');
      }
      this.$store.commit('captioner/CLEAR_TRANSCRIPT');

      // Close dialog
      this.$router.replace('/captioner');
    },
  },
}
</script>
