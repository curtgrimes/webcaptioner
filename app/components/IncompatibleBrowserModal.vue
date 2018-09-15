<template>
    <b-modal ref="modal" :title="$t('incompatibleBrowser.incompatibleBrowser')" no-close-on-esc no-close-on-backdrop>
      <p>{{$t('incompatibleBrowser.message.i0')}}</p>
      <p>
        <i18n path="incompatibleBrowser.message.i1" tag="span">
          <strong place="switchToGoogleChrome">{{$t('incompatibleBrowser.message.switchToGoogleChrome')}}</strong>
        </i18n>
      </p>
      <p class="mb-0">
        <i18n path="incompatibleBrowser.message.i2" tag="span">
          <a place="castAVoteHere" href="https://feedback.webcaptioner.com/posts/28/make-web-captioner-work-on-browsers-other-than-chrome" target="_blank">{{$t('incompatibleBrowser.message.castAVoteHere')}}</a>
        </i18n>
      </p>
      <div slot="modal-footer" class="w-100">
        <div class="row">
          <div class="col-sm-6">
              <p class="ml-sm-3 mt-sm-2 mb-sm-0"><a href="/help/general/browser-compatibility/" target="_blank">{{$t('incompatibleBrowser.whyJustChrome')}}</a></p>
          </div>
          <div class="col-sm-6 text-sm-right">
            <b-btn ref="getStartedButton" variant="secondary" @click="hideModal()">
              {{$t('incompatibleBrowser.lookAroundAnyway')}}
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
