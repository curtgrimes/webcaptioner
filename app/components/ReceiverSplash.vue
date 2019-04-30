<template>
  <transition name="fade">
    <div v-if="show">
      <div
        :class="minimized ? 'w-100 splash-background-minimized animate-background' : 'bg-primary bg-zigzag splash-background animate-background'"
        style="pointer-events:none"
      >
        <div
          :class="minimized ? 'animate-all pt-4' : 'd-flex py-3 py-md-5 splash-background-child animate-all'"
        >
          <div
            ref="autoMarginContainer"
            :class="minimized ? 'container animate-all' : 'container m-auto animate-all'"
            style="pointer-events:auto"
          >
            <div class="row">
              <div class="col-md-10 col-lg-9 mx-auto">
                <div class="card bg-light">
                  <div
                    :class="minimized ? 'mh-0 card-header p-0 border-0 animate-all' : 'mh-210px card-header pb-0 animate-all'"
                    style="overflow:hidden"
                  >
                    <div class="row">
                      <div class="col-md-10 mx-auto">
                        <div class="bg-dark pt-4 pl-4 pr-4 screen-frame">
                          <div
                            class="h-100 p-2 px-3"
                            :style="{color: $store.state.settings.appearance.text.textColor || '#ffffff', backgroundColor: $store.state.settings.appearance.background.color || '#000000'}"
                          >
                            <div v-if="notFound" class="h-100">
                              <transition-group name="drop">
                                <span
                                  v-for="(word, index) in this.sampleTextArrayTimed"
                                  :key="index + word"
                                  class="fade-up-initial text-danger redacted-text-wrap"
                                >
                                  <span class="redacted-text">{{word}}</span>&nbsp;&nbsp;&nbsp;
                                </span>
                              </transition-group>
                              <transition name="zoom">
                                <div v-show="showNotFoundIcon" class="h-100">
                                  <div class="text-center d-flex h-100">
                                    <fa
                                      :icon="['far', 'times-circle']"
                                      class="m-auto text-danger"
                                      style="font-size:7rem"
                                    />
                                  </div>
                                </div>
                              </transition>
                            </div>
                            <transition-group name="fade-up" v-else>
                              <span
                                v-for="(word, index) in this.sampleTextArrayTimed"
                                :key="index + word"
                                class="fade-up-initial redacted-text-wrap"
                              >
                                <span class="redacted-text">{{word}}</span>&nbsp;&nbsp;&nbsp;
                              </span>
                            </transition-group>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    :class="minimized ? 'card-body animate-all p-3' : 'card-body p-4 py-lg-5 animate-all'"
                  >
                    <div class="row">
                      <div :class="minimized ? 'col-12' : 'col-md-10 mx-auto'">
                        <div v-if="notFound">
                          <h3
                            class="font-weight-normal"
                            style="font-size:2rem"
                          >Uh oh &mdash; it looks like that link to live captions is missing or expired.</h3>
                          <p class="lead text-muted mb-0">
                            But you can still use
                            <a href="/">Web Captioner</a> to share your own live captions.
                          </p>
                        </div>
                        <div v-else>
                          <h3
                            :class="minimized ? 'm-0 animate-all font-weight-normal' : 'animate-all font-weight-normal'"
                            :style="{fontSize: minimized ? '1.6rem' : '2rem', marginTop: minimized ? '3px' : '0'}"
                          >
                            <span v-if="message">{{message}}</span>
                            <span v-else-if="minimized">
                              <div class="row">
                                <div
                                  class="col-8 text-muted"
                                  style="line-height:2.3rem"
                                >Live captioning is in progress.</div>
                                <div class="col-4 d-flex">
                                  <b-btn
                                    size="sm"
                                    @click="show = false"
                                    variant="outline-secondary"
                                    class="ml-auto close-btn-outer text-left text-secondary px-4"
                                  >
                                    Close
                                    <div
                                      class="close-btn-inner-wrap"
                                      v-bind:style="{width: ((closeCountdownCurrentMs/closeCountdownMaxMs)*100) +'%'}"
                                    >
                                      <b-btn
                                        size="sm"
                                        @click="show = false"
                                        variant="secondary"
                                        class="close-btn-inner border-0 px-3 text-left rounded-0"
                                      >
                                        <span class="px-2">Close</span>
                                      </b-btn>
                                    </div>
                                  </b-btn>
                                </div>
                              </div>
                            </span>
                            <span v-else>
                              <span
                                v-if="backlinkData && backlinkData.author"
                              >{{backlinkData.author}} is live captioning with Web Captioner.</span>
                              <span v-else>
                                <span
                                  v-if="customWelcomeMessageAuthor"
                                >{{customWelcomeMessageAuthor}} has invited you to watch live captions with Web Captioner.</span>
                                <span
                                  v-else
                                >You've been invited to watch live captions with Web Captioner.</span>
                              </span>
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div class="row" v-if="!notFound">
                      <div class="col-md-10 mx-auto">
                        <div v-if="!message">
                          <transition name="expand">
                            <p v-show="!minimized" class="lead text-muted mb-0">
                              <fa icon="circle-notch" spin class="mr-2"/>You'll see captions soon.
                            </p>
                          </transition>
                          <backlink
                            :show="!minimized"
                            :backlink-data="backlinkData"
                            :inline="true"
                            :always-expanded="true"
                            class="mt-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <transition name="expand">
                    <div class="card-footer" v-if="!minimized">
                      <div class="row">
                        <div class="col-md-12">
                          <a href="/" class="navbar-brand text-dark">
                            <img
                              src="/static/img/logo-inverse.svg"
                              width="22"
                              height="22"
                              class="d-inline-block align-top"
                              alt
                            >
                            Web Captioner
                          </a>
                        </div>
                        <!-- <div class="col-md-8 text-md-right pt-2 text-muted small">
                                                    Free browser-based captioning. Just bring a microphone. 
                        </div>-->
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import backlink from '~/components/Backlink.vue';
import bBtn from 'bootstrap-vue/es/components/button/button';

export default {
  components: {
    backlink,
    bBtn,
  },
  props: {
    roomId: String,
    backlinkData: Object,
    customWelcomeMessageAuthor: {
      type: String,
      required: false,
    },
    notFound: {
      type: Boolean,
      default: false,
    },
    message: String,
    minimized: {
      type: Boolean,
      default: false,
    },
  },
  data: function() {
    return {
      show: true,
      sampleText:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in pellentesque sem, at venenatis tellus. Donec facilisis dui nec iaculis auctor. Praesent fermentum tristique ante, non placerat magna faucibus a. Praesent elementum auctor elit, id efficitur justo dignissim quis. Donec ultrices id felis tincidunt euismod. Proin sit amet.',
      sampleTextArray: [],
      sampleTextArrayTimedIndex: 0,
      sampleTextArrayTimed: [],
      maxTextTickMs: 300, // Update CSS with this value
      showNotFoundIcon: false,
      closeCountdownMaxMs: 3000,
      closeCountdownCurrentMs: 0,
      closeCountdownInterval: null,
    };
  },
  mounted: function() {
    this.initSampleTextArray();

    if (this.notFound) {
      this.sampleTextArrayTimed = this.sampleTextArray;
      this.startNotFoundTextTimer();
    } else {
      this.startSampleTextTimer();
    }
  },
  methods: {
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    initSampleTextArray: function() {
      this.sampleTextArray = this.sampleText.split(' ');
    },
    startSampleTextTimer: function() {
      setTimeout(() => {
        const index =
          (this.sampleTextArrayTimed.length + 1) % this.sampleTextArray.length;
        this.sampleTextArrayTimed = this.sampleTextArray.slice(0, index);

        setTimeout(
          this.startSampleTextTimer.bind(this),
          index === 0 ? this.maxTextTickMs : 0 // If we're resetting the list, pause for transition out to finish
        );
      }, this.getRandomInt(10, this.maxTextTickMs));
    },
    startNotFoundTextTimer: function() {
      // Remove text from the array until there's none left
      setTimeout(() => {
        this.sampleTextArrayTimed.pop();

        if (this.sampleTextArrayTimed.length > 0) {
          setTimeout(this.startNotFoundTextTimer.bind(this), 5);
        } else {
          // End of animation
          setTimeout(() => {
            this.showNotFoundIcon = true;
          }, 200); /* make equal to drop animation duration */
        }
      }, 5);
    },
    startCloseCountdown: function() {
      this.closeCountdownCurrentMs = 0;

      this.closeCountdownInterval = setInterval(() => {
        if (!this.minimized) {
          // It became un-minimized during our countdown. Cancel it.
          clearInterval(this.closeCountdownInterval);
          this.closeCountdownCurrentMs = 0;
          return;
        }
        this.closeCountdownCurrentMs += 30;

        if (this.closeCountdownCurrentMs >= this.closeCountdownMaxMs) {
          this.show = false;
          clearInterval(this.closeCountdownInterval);
          setTimeout(() => {
            this.closeCountdownCurrentMs = 0;
          }, 800);
        }
      }, 30);
    },
  },
  watch: {
    minimized: function(minimized) {
      if (minimized) {
        if (this.$refs.autoMarginContainer) {
          this.$refs.autoMarginContainer.style.marginTop = window
            .getComputedStyle(this.$refs.autoMarginContainer)
            .getPropertyValue('margin-top');
          this.$nextTick(() => {
            this.$refs.autoMarginContainer.style.marginTop = 0;
          });

          setTimeout(() => {
            this.startCloseCountdown();
          }, 700); // after animation finishes
        }
      } else {
        this.show = true;
      }
    },
  },
};
</script>

<style scoped>
.animate-all {
  transition: all 700ms;
}

.animate-background {
  transition: background 400ms;
}

.bg-primary.bg-zigzag.animate-background {
  transition: background 0s;
}

.splash-background {
  height: 100%;
  min-height: 100%;
  background-attachment: fixed;
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
}
.splash-background-child {
  height: 100%;
  overflow: auto;
}

.splash-background-minimized {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
}

.screen-frame {
  height: 200px;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  border: 6px solid #bbb;
  border-bottom: none;
  overflow: hidden;
  line-height: 1.8rem;
  font-size: 1.1rem;
}

.mh-210px {
  max-height: 210px;
}

.mh-0 {
  max-height: 0;
}

.bg-black {
  background: #000;
}

.close-btn-outer {
  position: relative;
  overflow: hidden;
}

.close-btn-outer:hover {
  color: #fff !important;
}

.close-btn-inner-wrap {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  transition: width 100ms;
}

.close-btn-inner {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
}

.redacted-text-wrap {
  user-select: none;
}

.redacted-text {
  font-family: 'Redacted';
}

.fade-up-initial {
  display: inline-block;
}
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 400ms ease-in-out; /* make this match maxTextTickMs */
  transform: translateY(0);
}
.fade-up-enter {
  opacity: 0;
  transform: translateY(15px) scale(0.7);
}
.fade-up-leave-to {
  opacity: 0;
}

.drop-enter-active,
.drop-leave-active {
  transition: all 200ms ease-in-out; /* make equal to end of animation timeout above */
  transform: translateY(0);
}
.drop-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

.zoom-enter-active,
.zoom-leave-active {
  transition: all 300ms cubic-bezier(0, 0, 0.2, 1.5);
  transform: scale(1);
}
.zoom-enter {
  opacity: 0;
  transform: scale(0.5);
}
.zoom-leave-to {
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 200ms ease-out;
  max-height: 100px;
  overflow: hidden;
  opacity: 1;
  filter: brightness(1);
}
.expand-enter,
.expand-leave-to {
  max-height: 0;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin: 0 !important;
  opacity: 0;
  filter: brightness(3);
}
</style>