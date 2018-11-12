<template>
  <div class="d-flex flex-grow-1">
    <div class="d-flex flex-grow-1 position-relative">
      <transcript :allow-disable-auto-scroll="true" />
      <toast-group>
        <toast-welcome/>
        <toast-donation/>
        <toast-share/>
      </toast-group>
    </div>
    <nuxt-child/>
  </div>
</template>


<script>
import transcript from '~/components/Transcript.vue'
import toastGroup from '~/components/ToastGroup.vue'
import toastWelcome from '~/components/toasts/Welcome.vue'
import toastDonation from '~/components/toasts/Donation.vue'
import toastShare from '~/components/toasts/Share.vue'

export default {
  components: {
    transcript,
    toastGroup,
    toastDonation,
    toastShare,
    toastWelcome,
  },
}
</script>