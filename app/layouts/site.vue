<template>
  <div class="bg-white">
    <div class="bg-primary sticky-top">
      <b-navbar
        toggleable="lg"
        id="main-navbar"
        class="navbar navbar-light navbar-expand-md"
      >
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <a href="/" class="navbar-brand d-none d-md-block">
          <img
            src="/static/img/logo-inverse.svg"
            width="22"
            height="22"
            class="d-inline-block align-top mr-1"
            alt=""
          />
          Web Captioner
        </a>
        <a href="/" class="navbar-brand d-md-none mx-auto">
          <img
            src="/static/img/logo-inverse.svg"
            width="28"
            height="28"
            class="d-inline-block align-top"
            alt="Web Captioner"
          />
        </a>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item href="/blog"> Blog </b-nav-item>
            <b-nav-item
              to="/help"
              :class="
                $route.name && $route.name.startsWith('help') ? 'active' : ''
              "
            >
              Help Center
            </b-nav-item>
            <b-nav-item href="/community">
              Community
            </b-nav-item>
            <b-nav-item to="/donate">
              Donate
            </b-nav-item>
            <b-nav-item
              to="/captioner"
              link-classes="text-white rounded bg-secondary text-white ml-md-1 px-3"
            >
              Start Captioning
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <div
      :class="{ 'container py-5': !($route.name || '').startsWith('help___') }"
    >
      <nuxt />
    </div>
    <div class=" bg-primary bg-zigzag">
      <div class="container pt-5 pb-4">
        <div class="row">
          <div class="col-12 col-md mb-4 mb-md-0">
            <a href="/">
              <img
                class="mb-2"
                src="/static/img/logo-inverse.svg"
                alt=""
                width="35"
                height="35"
              />
              <span
                class="d-block text-black font-weight-bold"
                style="font-size:1.75rem;line-height:2rem;"
              >
                Web Captioner
              </span>
            </a>
          </div>
          <div class="col-sm-6 col-md">
            <h5 class="text-dark">Find out more</h5>
            <ul class="list-unstyled text-small">
              <li><a class="text-secondary" href="/blog">Blog</a></li>
              <li>
                <nuxt-link class="text-secondary" to="/donate"
                  >Donate</nuxt-link
                >
              </li>
              <li>
                <a class="text-secondary" href="/privacy-policy"
                  >Privacy Policy</a
                >
              </li>
              <li>
                <a class="text-secondary" href="/terms-of-service"
                  >Terms of Service</a
                >
              </li>
            </ul>
          </div>
          <div class="col-sm-6 col-md">
            <h5 class="text-dark">Community</h5>
            <ul class="list-unstyled text-small">
              <li>
                <a
                  class="text-secondary"
                  href="https://facebook.com/webcaptioner"
                  >Facebook</a
                >
              </li>
              <li>
                <a
                  class="text-secondary"
                  href="https://twitter.com/webcaptioner"
                  >Twitter</a
                >
              </li>
            </ul>
          </div>
          <div class="col-sm-6 col-md">
            <h5 class="text-dark">Support</h5>
            <ul class="list-unstyled text-small">
              <li>
                <nuxt-link class="text-secondary" to="/help"
                  >Help Center</nuxt-link
                >
              </li>
              <li>
                <a
                  class="text-secondary"
                  href="https://www.facebook.com/groups/webcaptioner/"
                  >Facebook Group</a
                >
              </li>
              <li><a class="text-secondary" href="/feedback">Feedback</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    if (this.$route.path?.startsWith('/help')) {
      this.showHelpButton(true);
    }
  },
  beforeDestroy() {
    this.showHelpButton(false);
  },
  watch: {
    $route() {
      if (this.$route.path?.startsWith('/help')) {
        this.showHelpButton(true);
      } else {
        this.showHelpButton(false);
      }
    },
  },
  head() {
    return {
      bodyAttrs: {
        class: 'bg-primary',
      },
    };
  },
  methods: {
    showHelpButton(on) {
      if (window && window.Beacon) {
        // @ts-ignore
        Beacon('config', {
          hideAvatars: true,
          display: {
            style: on ? 'iconAndText' : 'manual',
          },
        });
      }
    },
  },
};
</script>
