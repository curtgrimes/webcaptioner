<template>
  <toast
    title="Support Web Captioner"
    :show="$store.state.donation.message.show"
  >
    <p>I hope you've been enjoying Web Captioner!</p>
    <p>
      Generous donations keep Web Captioner going. If you've found this helpful,
      please consider donating.
    </p>
    <div class="mb-n2">
      <b-button
        size="sm"
        variant="secondary"
        class="mr-2 mb-2"
        to="/donate"
        target="_blank"
        >$2.50</b-button
      ><b-button
        size="sm"
        variant="secondary"
        class="mr-2 mb-2"
        to="/donate"
        target="_blank"
        >$5</b-button
      ><b-button
        size="sm"
        variant="secondary"
        class="mr-2 mb-2"
        to="/donate"
        target="_blank"
        >$10</b-button
      ><b-button
        size="sm"
        variant="secondary"
        class="mr-2 mb-2"
        to="/donate"
        target="_blank"
        >$20</b-button
      ><b-button
        size="sm"
        variant="secondary"
        class="mr-2 mb-2"
        to="/donate"
        target="_blank"
        >Other amount</b-button
      ><b-button
        size="sm"
        variant="outline-info"
        class="mr-2 mb-2"
        to="/donate"
        target="_blank"
        >More info</b-button
      >
    </div>
  </toast>
</template>

<script>
import toast from '~/components/Toast.vue';

import { BButton } from 'bootstrap-vue';

export default {
  components: {
    toast,
    BButton,
  },
};
</script>
