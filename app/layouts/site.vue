<template>
  <div class="bg-white min-vh-100 layout-site">
    <div class="bg-primary navbar-border-bottom fixed-top">
      <div class="px-0">
        <nav id="main-navbar" class="navbar navbar-light navbar-expand-md">
          <button
            class="btn btn-link text-dark px-0 d-inline-block d-md-none"
            type="button"
            data-toggle="collapse"
            data-target="#navbarHiddenContentToToggle"
            aria-controls="navbarHiddenContentToToggle"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            Menu
          </button>
          <a href="/" class="navbar-brand d-none d-md-block">
            <img
              src="/static/img/logo-inverse.svg"
              width="22"
              height="22"
              class="d-inline-block align-top"
              alt=""
            />
            Web Captioner
          </a>
          <a href="/" class="navbar-brand d-md-none mx-auto pr-5">
            <img
              src="/static/img/logo-inverse.svg"
              width="28"
              height="28"
              class="d-inline-block align-top"
              alt="Web Captioner"
            />
          </a>
          <div
            class="collapse navbar-collapse"
            id="navbarHiddenContentToToggle"
          >
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link mr-3 mr-md-0" href="/blog">Blog</a>
              </li>
              <li class="nav-item">
                <a class="nav-link mr-3 mr-md-0" href="/help">Help Center</a>
              </li>
              <li class="nav-item">
                <a class="nav-link mr-3 mr-md-0" href="/community">Community</a>
              </li>
              <li class="nav-item">
                <a class="nav-link mr-3 mr-md-0" href="/donate">Donate</a>
              </li>
              <li>
                <nuxt-link
                  class="btn btn-sm btn-secondary text-white px-3 ml-md-2 mr-0 mr-md-0"
                  to="/captioner"
                >
                  Start Captioning
                </nuxt-link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <nuxt />
  </div>
</template>

<script>
export default {
  mounted() {
    if (this.$route.path.startsWith('/help')) {
      this.showHelpButton(true);
    }
  },
  watch: {
    $route() {
      if (this.$route.path.startsWith('/help')) {
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
          display: {
            style: on ? 'iconAndText' : 'manual',
          },
        });
      }
    },
  },
};
</script>
