<template>
  <b-modal
    ref="modal"
    :title="$t('incompatibleBrowser.incompatibleBrowser')"
    no-close-on-esc
    no-close-on-backdrop
  >
    <p>
      <i18n path="incompatibleBrowser.message.i0" tag="span">
        <template v-slot:reliesOnTechnologyCalledWebSpeechAPI>
          <a
            href="/help/getting-started/web-speech-api"
            target="_blank"
            class="text-secondary"
            >{{
              $t(
                'incompatibleBrowser.message.reliesOnTechnologyCalledWebSpeechAPI'
              )
            }}</a
          >
        </template>
      </i18n>
    </p>
    <p>
      <i18n path="incompatibleBrowser.message.i1" tag="span">
        <template v-slot:switchToGoogleChrome>
          <strong>{{
            $t('incompatibleBrowser.message.switchToGoogleChrome')
          }}</strong>
        </template>
      </i18n>
    </p>
    <p class="mb-0">
      <i18n path="incompatibleBrowser.message.i2" tag="span">
        <template v-slot:castAVoteHere>
          <a
            href="https://feedback.webcaptioner.com/posts/28/make-web-captioner-work-on-browsers-other-than-chrome"
            target="_blank"
            class="text-secondary"
            >{{ $t('incompatibleBrowser.message.castAVoteHere') }}</a
          >
        </template>
      </i18n>
    </p>
    <div slot="modal-footer" class="w-100">
      <div class="row">
        <div class="col-sm-6">
          <p class="ml-sm-3 mt-sm-2 mb-sm-0">
            <a
              href="/help/getting-started/web-speech-api"
              target="_blank"
              class="text-secondary"
              >{{ $t('incompatibleBrowser.whyJustChrome') }}</a
            >
          </p>
        </div>
        <div class="col-sm-6 text-sm-right">
          <b-button
            ref="getStartedButton"
            variant="secondary"
            @click="hideModal()"
            >{{ $t('incompatibleBrowser.lookAroundAnyway') }}</b-button
          >
        </div>
      </div>
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
      this.$store.commit('SET_INCOMPATIBLE_BROWSER_MODAL_INVISIBLE');
    },
  },
};
</script>
