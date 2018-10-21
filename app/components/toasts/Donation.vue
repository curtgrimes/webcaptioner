<template>
    <toast title="Help Support Web Captioner" :show="show" :onShow="onShow" :onClose="onClose">
        <p>I hope you've been enjoying Web Captioner!</p>
        <p>Generous donations keep Web Captioner going. If you've found this helpful, please consider donating.</p>
        <div v-if="!showOtherAmountField">
        <b-btn size="sm" variant="outline-info" class="mr-2" @click="donate(100)">$1</b-btn>
        <b-btn size="sm" variant="outline-info" class="mr-2" @click="donate(500)">$5</b-btn>
        <b-btn size="sm" variant="outline-info" class="mr-2" @click="donate(1000)">$10</b-btn>
        <b-btn size="sm" variant="outline-info" class="mr-2" @click="showOtherAmountField = true">Other amount...</b-btn>
        </div>
        <div v-else>
        <div class="row">
            <div class="col-xs-3">
            <b-btn size="sm" variant="link" @click="showOtherAmountField = false"><fa icon="chevron-left" class="mr-2" />Back</b-btn>
            </div>
            <div class="col-xs-9">
            <b-input-group>
                <b-form-input autofocus required v-model="customDonationAmount" placeholder="Amount" ref="customDonationAmountInput" type="number"></b-form-input>
                <b-input-group-append>
                <b-btn variant="outline-info" size="sm" @click="donateOtherAmount(customDonationAmount)">Donate</b-btn>
                </b-input-group-append>
            </b-input-group>
            </div>
        </div>
        </div>
    </toast>
</template>

<script>
import toast from '~/components/Toast.vue'
import loadScript from 'load-script'

export default {
    components: {
        toast,
    },
    data: function() {
        return {
            stripeCheckout: null,
            showOtherAmountField: false,
            customDonationAmount: null,
        };
    },
    methods: {
        donateOtherAmount: function(amount) {
            // Validate the amount
            amount = amount.replace(/\$/g, '').replace(/\,/g, '') // remove any dollar signs or commas
            amount = parseFloat(amount);
            if (isNaN(amount)) {
                this.customAmountInvalid = true;
            }
            else {
                this.donate(amount * 100); // dollars to cents
            }
        },
        donate: function(amount) {
            this.stripeCheckout.open({
                name: 'Web Captioner',
                description: 'One-Time Donation',
                zipCode: true,
                amount, // in cents
            });
        },
        onShow: function() {
            if (!this.stripeCheckout) {
                loadScript('https://checkout.stripe.com/checkout.js', { async: false }, (err, script) => {
                    this.stripeCheckout = StripeCheckout.configure({
                        key: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
                        image: '/logo-solid-bg.png',
                        locale: 'auto',
                        panelLabel: 'Donate {{amount}}',
                        token: function(token) {
                        alert('done');
                        // You can access the token ID with `token.id`.
                        // Get the token ID to your server-side code for use.
                        }
                    });
                });
            }
        },
        onClose: function() {
            this.$store.commit('donation/SET_MESSAGE_SHOW', {on: false});
        },
    },
    watch: {
        show: function(show) {
            this.$parent.$emit('toastChange', show);
        },
        showOtherAmountField: function() {
            this.customDonationAmount = null;
            this.$nextTick(() => {
                if (this.$refs.customDonationAmountInput) {
                    this.$refs.customDonationAmountInput.focus();
                }
            });
        },
    },
    computed: {
        show: function () {
            return this.$store.state.donation.message.show;
        },
    },
};
</script>