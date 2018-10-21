<template>
    <toast title="Share Captions" :show="show" :onShow="onShow" :onClose="onClose">
        <div v-if="!hasValidShareLink">
            <div v-if="expired" class="alert bg-danger small text-white p-2">Your previous link expired, but you can get a new one.</div>
            <p class="mb-2">Get a link to share live captions with others.</p>
            <form ref="shareLinkForm" action="javascript:void(0)" onsubmit="return false">
                <!--
                <h5>Appearance</h5>
                <div class="row mb-3">
                    <div class="col-6">
                        <label class="btn btn-light btn-block text-left p-2 m-0" v-bind:class="{ active: shareStyle == 'current' }">
                            <input v-model="shareStyle" type="radio" name="share-style-current" id="share-style-current" value="current"> Current
                            <div class="text-preview-mockup-wrap w-100 mt-2" v-bind:style="{backgroundColor: $store.state.settings.appearance.background.color}">
                            <div class="text-preview-mockup mx-auto p-1" v-bind:style="{color: $store.state.settings.appearance.text.textColor}">Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et. Temporibus autem quibusdam et aut officiis autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et. Temporibus autem quibusdam et aut officiis autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et. </div>
                            </div>
                        </label>
                    </div>
                    <div class="col-6">
                        <label class="btn btn-light btn-block text-left p-2 m-0" v-bind:class="{ active: shareStyle == 'default' }">
                            <input v-model="shareStyle" type="radio" name="share-style-default" id="share-style-default" value="default"> Default
                            <div class="text-preview-mockup-wrap w-100 mt-2" style="background:#000">
                            <div class="text-preview-mockup p-1 text-white">Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et. Temporibus autem quibusdam et aut officiis autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et. Temporibus autem quibusdam et aut officiis autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et. </div>
                            </div>
                        </label>
                    </div>
                </div>
                -->
                <div class="custom-control custom-checkbox">
                    <input v-model="showBacklink" class="custom-control-input" name="showBacklink" type="checkbox" id="show-backlink">
                    <label class="custom-control-label" for="show-backlink">Show a link back to my stream or website</label>
                    <input ref="backlinkInput" required v-if="showBacklink" type="url" class="form-control mt-2" v-model="backlink" placeholder="Stream or website URL" />
                </div>
            </form>
        </div>
        <div v-else style="width:500px; min-width:200px; max-width:100%">
            <p class="mb-2">Share live captions with this link.</p>
            <input @focus="shareLinkSelect()" @click="shareLinkSelect()" ref="shareLinkInput" type="text" class="form-control mb-2" readonly :value="shareLink"  :disabled="expiringLink"/>
            <p class="small text-muted mb-2">Link expires <timeago :datetime="expireDate"></timeago></p>
            <div class="card p-2 bg-primary text-info mb-3">
                <p class="text-monospace text-uppercase font-weight-bold mb-1"><fa icon="info-circle"/> Enjoy this Preview!</p>
                <span class="small">I hope you enjoy the preview of this new feature! Please send me feedback on <a href="https://facebook.com/webcaptioner" target="_blank">Facebook</a> or <a href="https://twitter.com/webcaptioner" target="_blank">Twitter</a> about how well it works for you and your viewers.</span>
            </div>

            <b-dropdown text="Options" variant="outline-secondary" size="sm" toggle-class="px-2 py-1" :disabled="expiringLink">
            <template slot="button-content">
                <fa icon="cog"/>
            </template>
            <!-- <b-dropdown-item :to="localePath('captioner-share')">Customize Link</b-dropdown-item>
            <b-dropdown-divider/> -->
            <b-dropdown-item @click="expireLink()">Expire Now</b-dropdown-item>
            </b-dropdown> <span class="pl-2 text-secondary"><fa v-if="expiringLink" icon="spinner" spin /></span>
            <b-btn size="sm" variant="light" class="text-white px-2 py-1 float-right" style="background:#1b95e0;border-color:#1b95e0;font-family:'Roboto', sans-serif;text-transform:none" :href="twitterShareLink" target="_blank" v-b-tooltip.hover title="Share on Twitter"><fa :icon="['fab', 'twitter']" /></b-btn>
            <!-- <b-btn size="sm" variant="light" class="text-white px-2 py-1 float-right mr-1" style="background:#3B5998;border-color:#3B5998;font-family:'Roboto', sans-serif;text-transform:none" :href="facebookShareLink" target="_blank" v-b-tooltip.hover title="Share on Facebook"><fa :icon="['fab', 'facebook']" /></b-btn> -->
        </div>
        <div v-if="somethingWentWrong" class="alert bg-danger text-white mt-2 mb-0 p-2">Something went wrong.</div>
        <template v-if="!hasValidShareLink" slot="footer">
            <b-btn @click="getLink()" :disabled="gettingLink" variant="secondary">Get Link <fa v-if="gettingLink" icon="spinner" spin /></b-btn>
        </template>
    </toast>
</template>

<script>
import toast from '~/components/Toast.vue'

export default {
    components: {
        toast,
    },
    data: () => {
        return {
            somethingWentWrong: false,
            gettingLink: false,
            expiringLink: false,
            showPopover: false,
            shareStyle: 'current',
            showBacklink: false,
            backlink: '',
        };
    },
    mounted: function() {

    },
    methods: {
        onShow () {
            // Called just after popover is shown
            // Hide any tooltips that may be open on the cast button
            this.$root.$emit('bv::hide::tooltip');
            if (this.$refs.shareLinkInput) {
                this.$refs.shareLinkInput.focus();
                this.$refs.shareLinkInput.select();
            }

            // Check if the link is expired
            if (this.expired) {
                this.nullLinkProperties();
            }
        },
        onClose() {
            this.$store.commit('share/SET_SHOW_SETTINGS', { on: false });
            this.somethingWentWrong = false;
        },
        async getLink() {
            this.somethingWentWrong = false;
            this.gettingLink = true;

            if (!this.$refs.shareLinkForm.reportValidity()) {
                // Form is invalid
                this.gettingLink = false;
                return;
            }

            try {
                const {
                    roomId,
                    ownerKey,
                    url,
                    expireDate,
                } = await this.$axios.$post('/api/rooms', {backlink: this.backlink});

                this.$store.commit('SET_SHARE_ROOM_ID', { roomId });
                this.$store.commit('SET_SHARE_OWNER_KEY', { ownerKey });
                this.$store.commit('SET_SHARE_URL', { url });
                this.$store.commit('SET_SHARE_EXPIRE_DATE', { expireDate });
                this.$store.commit('SET_SHARE_SUBSCRIBER_COUNT', { subscriberCount: 0 });
                this.$store.commit('share/SET_EXPIRED', {expired: false});

                this.$socket.sendObj({
                action: 'authenticateRoomOwner',
                roomId: this.$store.state.settings.share.roomId,
                ownerKey: this.$store.state.settings.share.ownerKey,
                });
            }
            catch (e) {
                this.somethingWentWrong = true;
            }
            finally {
                this.gettingLink = false;
            }
        },
        async expireLink() {
            this.expiringLink = true;
            const ownerKey = this.$store.state.settings.share.ownerKey;
            
            try {
                await this.$axios.$delete('/api/rooms/' + this.roomId + '?ownerKey=' + ownerKey) === 'OK';
                this.nullLinkProperties();
            }
            catch(e) {
                // We might get a 403 if the wrong ownerKey is provided or 404 if the given roomKey doesn't 
                // exist for some reason. We won't invalidate the link server-side, but as far as this client
                // is concerned, we'll remove our references to that link so they 
                // can generate a new one.
                this.nullLinkProperties();
            }
            finally {
                this.expiringLink = false;
            }
        },
        nullLinkProperties() {
            this.$store.commit('SET_SHARE_ROOM_ID', { roomId: null });
            this.$store.commit('SET_SHARE_OWNER_KEY', { ownerKey: null });
            this.$store.commit('SET_SHARE_URL', { url: null });
            this.$store.commit('SET_SHARE_EXPIRE_DATE', { expireDate: null });
        },
        shareLinkSelect() {
            this.$nextTick(function () {
                if (this.$refs.shareLinkInput) {
                this.$refs.shareLinkInput.focus();
                this.$refs.shareLinkInput.select();
                }
            });
        },
    },
    watch: {
        show: function(show) {
            this.$parent.$emit('toastChange', show);
        },
        hasValidShareLink: function () {
            this.shareLinkSelect();
        },
        showBacklink: function(showBacklink) {
            if (!showBacklink) {
                this.backlink = '';
            }
        },
        subscriberCount: function() {
            // Hide any tooltips that may be open
            this.$root.$emit('bv::hide::tooltip');
        },
        showBacklink: function (showBacklink) {
            this.$nextTick(function() {
                if (showBacklink && this.$refs.backlinkInput) {
                    this.$refs.backlinkInput.focus();
                }
            });
        },
    },
    computed: {
        show: function () {
            return this.$store.state.share.settings.show;
        },
        subscriberCount: function() {
            return this.$store.state.receivers.share.subscriberCount;
        },
        shareLink: function() {
            return this.$store.state.settings.share.url;
        },
        roomId: function() {
            return this.$store.state.settings.share.roomId;
        },
        expireDate: function() {
            return this.$store.state.settings.share.expireDate;
        },
        hasValidShareLink() {
            return this.shareLink && this.roomId && this.expireDate;
        },
        // facebookShareLink() {
            // return 'https://www.facebook.com/dialog/share?app_id=1339681726086659&amp;display=popup&amp;href=' + encodeURIComponent(this.shareLink);
            
            // return 'https://twitter.com/intent/tweet?' + 'text=' + encodeURIComponent('I\'m now captioning live with @WebCaptioner') + '&url='+ this.shareLink;
        // },
        twitterShareLink() {
            return 'https://twitter.com/intent/tweet?' + 'text=' + encodeURIComponent('I\'m now captioning live with @WebCaptioner') + '&url='+ this.shareLink;
        },
        expired: function() {
            return this.$store.state.share.expired;
        },
    },
};
</script>