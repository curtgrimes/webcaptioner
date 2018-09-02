<template>
    <b-modal lazy size="lg" ref="modal" hide-header no-close-on-esc no-close-on-backdrop @shown="focusOkButton()">
      <div class="p-3 logo-animated-wrap" ref="logoAnimatedWrap">
        <div class="row">
          <div class="d-none d-lg-block col-lg-3 text-center splash-logo-wrap" style="overflow:hidden">
            <div style="margin-right:-100px" class="py-2">
              <img src="/static/img/logo-inverse.svg" style="width:100%" class="mt-3 mw-100 mx-auto d-block mb-3 logo-animated" alt="" />
            </div>
          </div>
          <div class="col-lg-9 pl-4">
            <div class="splash-text d-flex align-items-center h-100">
              <div>
                <h2>What's New in Web Captioner</h2>
                <div style="max-height:60vh;overflow-y:auto">
                  <whats-new limit="1" :hide-title="true"></whats-new>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="w-100">
        <div class="row">
          <div class="col-6">
              <p class="ml-3 mt-2 mb-0"><router-link to="/captioner/settings/about" @click.native="hideModal()">Learn more</router-link></p>
          </div>
          <div class="col-6">
            <b-btn ref="getStartedButton" class="float-right" variant="secondary" @click="hideModal()">
              Get Started
            </b-btn>
          </div>
        </div>
      </div>
    </b-modal>
</template>

<style lang="scss" scoped>

  .logo-animated-wrap {
    perspective: 700px;
    perspective-origin: 200px 130px;
  }

  .logo-animated {
    transition: all 1.4s 0.3s ease-out;
    transform: translateX(20px) rotateY(-20deg) scale(0.8);
    opacity:0;
  }

  .logo-animated-wrap.animate .logo-animated {
    transform: translateX(0) rotateY(30deg) scale(1);
    opacity:0.3;
  }

  @keyframes fade-in {
    0% {
      opacity:0;
    }

    100% {
      opacity: 1;
    }
  }

  .splash-logo-wrap {
    border-right:1px solid rgba(0,0,0,.4)
  }

  .splash-text h2 {
    letter-spacing:-1px;
  }
</style>


<script>
import whatsNew from './WhatsNew.vue';

export default {
  name: 'welcome-modal',
  components: {
    whatsNew,
  },
  mounted: function() {
    let self = this;
    setTimeout(() => {
      if (self.$refs.logoAnimatedWrap) {
        self.$refs.logoAnimatedWrap.classList.add('animate');
      }
    }, 50);
  },
  computed: {
    incompatibleBrowser: function() {
      return this.$store.state.incompatibleBrowser;
    },
  },
  methods: {
    showModal() {
      this.$refs.modal.show();
    },
    hideModal () {
      this.$refs.modal.hide();
      if (this.incompatibleBrowser) {
        this.$store.dispatch('SHOW_INCOMPATIBLE_BROWSER_MODAL');
      }
    },
    focusOkButton () {
      console.log('here');
      console.log(this.$refs.getStartedButton);
      this.$refs.getStartedButton.focus();
    },
  },
}
</script>
