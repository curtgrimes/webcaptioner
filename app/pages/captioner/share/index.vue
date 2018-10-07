<template>
  <div class="d-flex flex-grow-1">
    <transcript/>
    <b-modal v-model="showModal" lazy ref="modal" hide-footer :title="'Customize Link'" @hide="replaceRouteToParent">
      <!--
      <div v-if="shareLink">
        <input @focus="shareLinkSelect()" @click="shareLinkSelect()" ref="shareLinkInput" type="text" class="form-control small mb-3" style="font-size:.7rem" readonly :value="shareLink"/>
        <b-form-checkbox v-model="link.hideNavbar" class="mb-3">
          <strong>Hide navigation bar and Web Captioner logo</strong>
          <div v-if="link.hideNavbar" class="mt-1">You can hide the Web Captioner logo, but please consider mentioning Web Captioner in some way.</div>
        </b-form-checkbox>
        <b-form-checkbox v-model="link.transparentBackground" class="mb-3">
          <strong>Use transparent background</strong>
          <div class="mt-1">Helpful when using as a browser source in streaming software like OBS.</div>
        </b-form-checkbox>
      </div>
      <div v-else>
        You don't have a link to share right now.
      </div>
      -->
      <div class="text-right">
        <b-btn class="mt-3" variant="outline-info" :to="localePath('captioner')" replace>{{$t('common.done')}}</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
import transcript from '~/components/Transcript.vue'

const routeName = 'share';

export default {
  name: 'share-modal',
  components: {
    transcript,
  },
  data: function() {
    return {
      showModal: true,
      link: {
        transparentBackground: false,
      }
    };
  },
  computed: {
    shareLink() {
      return this.$store.state.settings.share.url
        + (this.link.hideNavbar || this.link.transparentBackground ? '?' : '')
        + (this.link.hideNavbar ? 'navbar=0' : '')
        + (this.link.hideNavbar && this.link.transparentBackground ? '&' : '')
        + (this.link.transparentBackground ? 'transparentBackground=1' : '');
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
    shareLinkSelect() {
      this.$nextTick(function () {
        if (this.$refs.shareLinkInput) {
          this.$refs.shareLinkInput.focus();
          this.$refs.shareLinkInput.select();
        }
      });
    },
    replaceRouteToParent(e) {
      // e.trigger is set if the user interacted with the dialog UI directly
      // to cause it to close. Only replace the state when this happens. Otherwise,
      // if e.trigger isn't set, the dialog closing is due to a route change already
      // in progress, (keyboard shortcuts, etc.) so we don't want to change the route.
      if (e.trigger) {
        this.$router.replace(this.localePath('captioner'));
      }
    },
  },
}
</script>
