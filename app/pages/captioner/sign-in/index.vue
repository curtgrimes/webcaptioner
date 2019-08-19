<template>
  <div class="d-flex flex-grow-1 bg-dark bg-zigzag">
    <div class="container m-auto">
      <div class="row">
        <div class="col-md-10 col-lg-9 mx-auto">
          <div class="card card-body bg-primary">
            <div class="d-flex">
              <h2>Sign In</h2>
              <router-link
                aria-label="Close Settings"
                :to="localePath('captioner')"
                class="btn btn-link ml-auto text-dark px-2 py-0"
                role="tab"
                active-class
              >
                <fa icon="times" size="2x" />
              </router-link>
            </div>
            <hr />
            <b-spinner
              v-show="$store.state.user.signedIn === null || !firebaseUILoaded"
              class="mx-auto mt-4 mb-3"
              style="width: 4rem; height: 4rem;"
            />
            <div
              v-show="$store.state.user.signedIn === false && firebaseUILoaded"
              id="firebaseui-auth-container"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('firebaseui/dist/firebaseui.css');
</style>


<script>
import { BSpinner } from 'bootstrap-vue';

if (process.client) {
  let firebaseui = require('firebaseui');
}

export default {
  transition: 'fade',

  data: function() {
    return {
      firebaseUILoaded: false,
    };
  },

  components: {
    BSpinner,
  },

  watch: {
    '$store.state.user.signedIn': function(signedIn) {
      if (signedIn === true) {
        this.postSignInRedirect();
      }
    },
  },

  mounted: function() {
    this.initAuth();
  },
  methods: {
    initAuth: function() {
      let ui =
        firebaseui.auth.AuthUI.getInstance() || // if hot reloading the app in nuxt dev environment
        new firebaseui.auth.AuthUI(this.$firebase.auth());
      let store = this.$store;
      let postSignInRedirect = this.postSignInRedirect;
      let sateSettingsOnNextLogin = () => {
        store.commit('SAVE_SETTINGS_TO_FIRESTORE_ON_NEXT_LOGIN', true);
      };
      ui.start('#firebaseui-auth-container', {
        callbacks: {
          signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            if (authResult.additionalUserInfo.isNewUser) {
              // User is signing in for the first time. Do an initial save.
              sateSettingsOnNextLogin();
            }

            postSignInRedirect();
            return false; // don't redirect
          },
          uiShown: () => {
            this.firebaseUILoaded = true;
            this.$store.commit('SET_SIGNED_IN_STATUS', false);
          },
        },
        signInOptions: [
          this.$firebase.auth.EmailAuthProvider.PROVIDER_ID,
          this.$firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          this.$firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          this.$firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        privacyPolicyUrl: '/privacy-policy',
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        tosUrl: '/terms-of-service',
      });
    },
    postSignInRedirect: function() {
      this.$router.replace('/captioner');
      this.$store.commit('SHOW_TOAST', { toastName: 'signedIn' });
    },
  },
};
</script>