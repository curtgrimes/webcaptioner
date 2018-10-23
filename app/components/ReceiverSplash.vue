<template>
    <div class="bg-primary bg-zigzag" style="height:100%;min-height:100%;background-attachment: fixed;overflow:hidden;">
        <div class="d-flex py-3 py-md-5" style="height:100%;overflow:auto">
            <div class="container m-auto">
                <div class="row">
                    <div class="col-md-10 col-lg-9 mx-auto">
                        <div class="card bg-light">
                            <div class="card-header pb-0 pt-4">
                                <div class="row">
                                    <div class="col-md-10 mx-auto">
                                        <div class="bg-dark pt-4 pl-4 pr-4" style="height:200px;border-top-left-radius:1.5rem;border-top-right-radius:1.5rem;border:6px solid #bbb;border-bottom:none;overflow:hidden;line-height:1.8rem;font-size:1.1rem">
                                            <div class="h-100 p-2 px-3 text-white" style="background:#000">
                                                <div v-if="notFound" class="h-100">
                                                    <transition-group name="drop">
                                                        <span v-for="(word, index) in this.sampleTextArrayTimed" :key="index" class="fade-up-initial text-danger">
                                                            <span style="font-family:'Redacted'">{{word}}</span>&nbsp;&nbsp;&nbsp;
                                                        </span>
                                                    </transition-group>
                                                    <transition name="zoom">
                                                        <div v-show="showNotFoundIcon" class="h-100">
                                                            <div class="text-center d-flex h-100">
                                                                <fa :icon="['far', 'times-circle']" class="m-auto text-danger" style="font-size:7rem" />
                                                            </div>
                                                        </div>
                                                    </transition>
                                                </div>
                                                <transition-group name="fade-up" v-else>
                                                    <span v-for="(word, index) in this.sampleTextArrayTimed" :key="index" class="fade-up-initial">
                                                        <span style="font-family:'Redacted'">{{word}}</span>&nbsp;&nbsp;&nbsp;
                                                    </span>
                                                </transition-group>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-4 py-lg-5">
                                <div class="row">
                                    <div class="col-md-10 mx-auto">
                                        <div v-if="notFound">
                                            <h3 class="font-weight-normal" style="font-size:2rem">Uh oh &mdash; it looks like that link to live captions is missing or expired.</h3>
                                            <p class="lead text-muted mb-0">But you can still use <a href="/">Web Captioner</a> to share your own live captions.</p>
                                        </div>
                                        <div v-else>
                                            <h3 class="font-weight-normal" style="font-size:2rem">
                                                <span v-if="message">
                                                    {{message}}
                                                </span>
                                                <span v-else>
                                                    <span v-if="backlinkData && backlinkData.author">{{backlinkData.author}} is live captioning with Web Captioner.</span>
                                                    <span v-else>You've been invited to watch live captions with Web Captioner.</span>
                                                </span>
                                            </h3>
                                            <div v-if="!message">
                                                <p class="lead text-muted mb-0"><fa icon="circle-notch" spin/> You'll start seeing captions soon.</p>
                                                <backlink :backlink-data="backlinkData" :inline="true" :always-expanded="true" class="mt-3" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer">
                                <div class="row">
                                    <div class="col-md-12">
                                        <a href="/" class="navbar-brand text-dark">
                                            <img src="/static/img/logo-inverse.svg" width="22" height="22" class="d-inline-block align-top" alt="">
                                            Web Captioner
                                        </a>
                                    </div>
                                    <!-- <div class="col-md-8 text-md-right pt-2 text-muted small">
                                        Free browser-based captioning. Just bring a microphone. 
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import backlink from '~/components/Backlink.vue'

export default {
    components: {
        backlink,
    },
    props: {
        roomId: String,
        backlinkData: Object,
        notFound: {
            type: Boolean,
            default: false,
        },
        message: String,
    },
    data: function() {
        return {
            sampleText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in pellentesque sem, at venenatis tellus. Donec facilisis dui nec iaculis auctor. Praesent fermentum tristique ante, non placerat magna faucibus a. Praesent elementum auctor elit, id efficitur justo dignissim quis. Donec ultrices id felis tincidunt euismod. Proin sit amet.',
            sampleTextArray: [],
            sampleTextArrayTimedIndex: 0,
            sampleTextArrayTimed: [],
            maxTextTickMs: 300, // Update CSS with this value
            showNotFoundIcon: false,
        };
    },
    mounted: function() {
        this.initSampleTextArray();

        if (this.notFound) {
            this.sampleTextArrayTimed = this.sampleTextArray;
            this.startNotFoundTextTimer();
        }
        else {
            this.startSampleTextTimer();
        }
    },
    methods: {
        getRandomInt (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        initSampleTextArray: function() {
            this.sampleTextArray = this.sampleText.split(' ');
        },
        startSampleTextTimer: function() {
            setTimeout(() => {
                const index = (this.sampleTextArrayTimed.length + 1) % this.sampleTextArray.length;
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
                }
                else {
                    // End of animation
                    setTimeout(() => {
                        this.showNotFoundIcon = true;
                    },200); /* make equal to drop animation duration */
                }
            },5);
        },
    },
}
</script>

<style scoped>
    .fade-up-initial {
        display:inline-block;
    }
    .fade-up-enter-active, .fade-up-leave-active {
        transition: all 300ms ease-in-out; /* make this match maxTextTickMs */
        transform: translateY(0);
    }
    .fade-up-enter {
        opacity: 0;
        transform: translateY(15px)  scale(0.7);
    }
    .fade-up-leave-to {
        opacity: 0;
    }


    .drop-enter-active, .drop-leave-active {
        transition: all 200ms ease-in-out; /* make equal to end of animation timeout above */
        transform: translateY(0);
    }
    .drop-leave-to {
        opacity: 0;
        transform: translateY(50px);
    }

    .zoom-enter-active, .zoom-leave-active {
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
</style>