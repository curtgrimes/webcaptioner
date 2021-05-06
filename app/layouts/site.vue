<template>
  <div class="bg-white min-vh-100 layout-site">
    <div class="bg-primary sticky-top">
      <b-navbar
        toggleable="lg"
        id="main-navbar"
        class="navbar navbar-light navbar-expand-md"
      >
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <a
          href="https://webcaptioner.com/"
          class="navbar-brand d-none d-md-block"
        >
          <img
            src="/static/img/logo-inverse.svg"
            width="22"
            height="22"
            class="d-inline-block align-top mr-1"
            alt=""
          />
          Web Captioner
        </a>
        <a
          href="https://webcaptioner.com/"
          class="navbar-brand d-md-none mx-auto"
        >
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
            <b-nav-item href="https://webcaptioner.com/blog"> Blog </b-nav-item>
            <b-nav-item
              href="/help"
              :class="
                $route.name && $route.name.startsWith('help') ? 'active' : ''
              "
            >
              Help Center
            </b-nav-item>
            <b-nav-item href="https://webcaptioner.com/community">
              Community
            </b-nav-item>
            <b-nav-item href="https://webcaptioner.com/donate">
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
    <nuxt />
  </div>
</template>

<script>
export default {
  mounted() {
    if (this.$route.path?.startsWith('/help')) {
      this.showHelpButton(true);
    }

    // Open details element if location.hash. points to one
    function openTarget() {
      const hash = location.hash.substring(1);
      if (!hash) {
        return;
      }

      const details = document.getElementById(hash);
      if (details && details.tagName.toLowerCase() === 'details') {
        details.open = true;
        details.querySelector('summary')?.focus();
      }
    }
    window.addEventListener('hashchange', openTarget);
    openTarget();
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
