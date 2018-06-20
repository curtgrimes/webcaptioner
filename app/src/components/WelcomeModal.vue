<template>
    <b-modal lazy size="lg" ref="modal" hide-header @shown="autofocusElement()">
      <div class="p-3 logo-animated-wrap" ref="logoAnimatedWrap">
        <div class="row">
          <div class="col-sm-4 text-center">
            <div>
              <img src="/public/logo-inverse.svg" style="width:150px;height:150px" class="mw-100 mx-auto d-block mb-3 logo-animated" alt="" />
              <span class="logo-text">Web Captioner</span>
            </div>
          </div>
          <div class="col-sm-8 pl-4 splash-text">
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
    perspective: 600px; 
  }

  .logo-animated {
    transition: all 1s;
    transform: translateY(50px) rotateX(60deg);
    opacity:0;
  }

  .logo-animated-wrap.animate .logo-animated {
    transform: translateY(0) rotateX(0);
    opacity:1;
  }

  .logo-text, .splash-text, .below-logo-text {
    opacity:0;
  }

  .logo-animated-wrap.animate .logo-text, .logo-animated-wrap.animate .below-logo-text {
    animation: fade-in 0.5s;
    animation-delay: 0.35s;
    animation-fill-mode: forwards;
  }

  .logo-animated-wrap.animate .splash-text {
    animation: fade-in 0.5s;
    animation-delay: 0.8s;
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

  .splash-text {
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
    }, 0);
    
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
