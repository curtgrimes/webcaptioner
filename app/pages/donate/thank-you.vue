<template>
  <div class="row">
    <div class="col-12 col-sm-7 col-md-9">
      <h1 class="mb-3">Thank you</h1>
      <div class="lead">
        <p>
          Thank you for donating. Contributions like this help keep Web
          Captioner going.
        </p>
        <p>
          <a href="mailto:REMOVED">Send me a message</a> if you
          would like to chat about Web Captioner. I'd love to see how you're
          using it and hear about how I can make it work better for you.
        </p>
        <p>&mdash; Curt</p>
      </div>
    </div>
    <div class="col-4 mx-auto col-sm-5 col-md-3">
      <img
        src="~/assets/img/curt-square.jpg"
        class="w-100 img-responsive rounded-circle"
      />
    </div>
  </div>
</template>

<script>
export default {
  layout: 'site',
  mounted() {
    // this.$store.commit('SET_DONATION_DATE', {
    //   donationDate: new Date().getTime(),
    // });
    // this.$store.commit('donation/SET_MESSAGE_SHOW', { on: false });
  },
};
</script>
