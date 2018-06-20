<template>
    <b-modal lazy size="lg" ref="modal" hide-header @shown="autofocusElement()">
      <div class="p-3 logo-animated-wrap" ref="logoAnimatedWrap">
        <div class="row">
          <div class="col-lg-3 text-center" style="overflow:hidden">
            <div style="margin-right:-100px" class="py-2">
              <img src="/public/logo-inverse.svg" style="width:100%" class="mt-3 mw-100 mx-auto d-block mb-3 logo-animated" alt="" />
            </div>
          </div>
          <div class="col-lg-9 pl-4 splash-text-wrap">
            <div class="splash-text">
              <h2>What's New: {{formatDate(latestRelease.date)}}</h2>
              <p class="small"><router-link to="/captioner/settings/about" @click.native="hideModal()">View more updates<span class="ml-1"><fa icon="chevron-right" /></span></router-link></p>
              <div>
                <div v-if="Array.isArray(latestRelease.notes) && latestRelease.notes.length > 0">
                  <ul>
                    <li v-for="note in latestRelease.notes" v-bind:key="note" v-html="note"></li>
                  </ul>
                </div>
                <div v-else-if="typeof latestRelease.notes === 'string'" v-html="latestRelease.notes" class="ml-4"></div>
                <div v-else class="ml-4"><fa :icon="['far', 'thumbs-up']" class="mr-1" />  Just working on making some stuff run better. </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="w-100">
        <div class="row">
          <div class="col-6">
            <b-form-checkbox class="pt-2">
              Hide until the next update
            </b-form-checkbox>
          </div>
          <div class="col-6">
            <b-btn ref="doneButton" class="float-right" variant="info" @click="hideModal()">
              Done
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
    transition: all 0.8s 0.4s ease-out;
    transform: translateX(20px) rotateY(-20deg) scale(0.8);
    opacity:0;
  }

  .logo-animated-wrap.animate .logo-animated {
    transform: translateX(0) rotateY(30deg) scale(1);
    opacity:0.3;
  }

  .logo-text, .splash-text {
    opacity:0;
  }

  .logo-animated-wrap.animate .splash-text {
    animation: fade-in 1s 0.5s;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    0% {
      opacity:0;
    }

    100% {
      opacity: 1;
    }
  }

  .splash-text-wrap {
    border-left:1px solid rgba(0,0,0,.4)
  }

  .splash-text h2 {
    font-size:1.5rem;
  }
</style>


<script>
import changelog from '../data/changelog.js'
import versionSort from 'semver-compare'

export default {
  name: 'welcome-modal',
  mounted: function() {
    // if (this.$route.name == routeName) {
    //   this.$refs.modal.show();
    // }

    let self = this;
    setTimeout(() => {
      if (self.$refs.logoAnimatedWrap) {
        self.$refs.logoAnimatedWrap.classList.add('animate');
      }
    }, 50);
    
  },
  computed: {
    latestRelease: function () {
      return changelog.sort(function (changelogEntryA, changelogEntryB) {
        return versionSort(changelogEntryA.version, changelogEntryB.version);
      })[0];
    },
  },
  methods: {
    formatDate: function (date) {
      return this.$helpers.dateFormat(date, 'MMM. D, YYYY');
    },
    showModal() {
      this.$refs.modal.show()
    },
    hideModal () {
      this.$refs.modal.hide();
    },
    autofocusElement () {
      // this.$refs.doneButton.focus();
    },
  },
}
</script>
