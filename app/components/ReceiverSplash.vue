<template>
    <div class="bg-primary" style="height:100vh">
        <div style="z-index:5;position:absolute;left:0;right:0;top:0;bottom:0">
            <div class="text-container">
                <div v-if="false && !roomMembershipId">
                    <div :class="{show: connectId}" class="fade">
                        <transition-group name="connectId" tag="div">
                            <span class="connectId" v-for="(n, $index) in connectIdSplitToArray" :key="$index">{{n}}</span>
                        </transition-group>
                        <p class="underConnectIdText">{{$t('receiver.splash.useThisCodeToConnect')}}</p>
                    </div>
                </div>
                <div v-else class="display-3 w-75">
                    <span v-if="roomMembershipId">{{$t('receiver.splash.connected')}}</span> {{$t('receiver.splash.captionsWillBeginShortly')}}
                </div>
            </div>
            <div v-if="false" v-bind:class="{show: loopVideoLoaded}" class="fade d-none d-md-block video-container" style="position:absolute;right:7vw;bottom:10vh;width:43vw;height:65vh;">
                <video ref="loopVideo" src="/static/img/cast-loop.mp4" loop preload autoplay type="video/mp4" class="mw-100 mh-100" style="position:absolute;bottom:0;right:0;box-shadow: 0 2px 57px rgba(0, 0, 0, 0.3);"></video>
            </div>
            <div class="h-25 d-flex align-items-center " style="position:absolute;left:7vw;right:0;bottom:0">
                <div class="h2 logo-container">
                    <img src="/static/img/logo-wordmark-inverse.svg" class="d-inline-block" :alt="$t('app.webCaptioner')" />
                </div>
            </div>
        </div>
        <div class="h-25 bg-primary bg-zigzag bottom-zigzag-background" style="z-index:4;position:absolute;left:0;right:0;bottom:0"></div>
    </div>
</template>

<script>
export default {
  data: function() {
      return {
          loopVideoLoaded: false,
          now: Date.now(),
          transcriptLastUpdated: 'b',
          connectIdSplitToArray: [], // for animation
      };
  },
  mounted: function() {
    if (!this.socketConnected) {
        this.$watch('socketConnected', function(socketConnected) {
            this.initConnectId();
        });
    }
    else {
        this.initConnectId();
    }

    this._dateUpdateInterval = setInterval(() => { this.now = Date.now(); }, 250);
    
    if (!this.transcriptExists) {
        this.initVideo();
    }

    this.$watch('transcriptExists', function(transcriptExists) {
        this.initVideo();
    });

    this.$watch('transcript', function() {
        this.transcriptLastUpdated = Date.now();
    });

    this.$watch('recentlyHadCaptions', function() {
        this.initVideo();
    });

    this.$watch('connectId', function(connectId) {
        if (connectId) {
            let self = this;
            this.connectIdSplitToArray = [];
            const connectIdstring = String(connectId);
            for(let i = 0; i < connectIdstring.length; i++) {
                
                setTimeout(function() {
                    self.connectIdSplitToArray.push(connectIdstring[i]);
                }, i * 100);
            }
        }
    });
  },
  methods: {
    initVideo: function() {
        if (this.$refs.loopVideo) {
            let self = this;
            this.$refs.loopVideo.addEventListener("play", function() {
                self.loopVideoLoaded = true;
            }, false);
            this.$refs.loopVideo.play();
        }
    },
    initConnectId: function() {
        this.$socket.sendObj({
            action: 'getMyConnectId',
            deviceInfo: this.getDeviceInfo(),
        });
    },
    getDeviceInfo: function() {
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return {
            isAndroid: /android/i.test(userAgent),
            isIosPhone: /iPhone|iPod/.test(userAgent) && !window.MSStream,
            isIosTablet: /iPad/.test(userAgent) && !window.MSStream,
            isMac: navigator ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : false,
            isLinux: navigator ? navigator.platform.toUpperCase().indexOf('Linux') >= 0 : false,
            isWindows: navigator ? navigator.platform.toUpperCase().indexOf('Win') >= 0 : false,
        }
    },
  },
  watch: {
      roomMembershipId: function() {
        // Terrible temporary hack until I can figure out why
        // vuexPersist isn't writing these changes when the window
        // is inactive
        let self = this;
        setTimeout(function(){
            if (window.localStorage) {
                let wcSettings = window.localStorage.getItem('webcaptioner-settings');
                wcSettings = JSON.parse(wcSettings);
                wcSettings.settings.roomMembershipId = self.$store.state.settings.roomMembershipId;
                window.localStorage.setItem('webcaptioner-settings', JSON.stringify(wcSettings));
            }
        },500);
      },
  },
  computed: {
    roomMembershipId: function() {
        return this.$store.state.settings.roomMembershipId;
    },
    socketConnected: function() {
      return this.$store.state.socket.isConnected;
    },
    transcript: function() {
        return this.$store.state.captioner.transcript.final + this.$store.state.captioner.transcript.interim;
    },
    connectId: function() {
        return this.$store.state.connectId;
    },
  }
}
</script>

<style scoped>
    .text-container {
        position:absolute;
        left:7vw;
        top:10vh;
        right:7vw;
    }

    .underConnectIdText {
        font-size:3.5vw;
    }

    .connectId {
        font-family:'Cousine',monospace;
        font-size:11.5vw;
        font-weight:bold;
        display: inline-block;
        margin: 0 10px 15px 0;

        vertical-align: top;
        background: #000;
        color: #ffe200;
        border-radius: 4px;
        line-height: 15vw;
        height: 13vw;
        width: 9vw;
        text-align: center;
    }
    .connectId-enter-active, .connectId-leave-active {
        transition: all 0.3s;
        -webkit-transform: scale(1);
        -moz-transform: scale(1);
        -ms-transform: scale(1);
        transform: scale(1);
    }
    .connectId-enter, .connectId-leave-to {
        /* -webkit-transform: scale(0.8);
        -moz-transform: scale(0.8);
        -ms-transform: scale(0.8); */
        transform: scale(0.8) translate(15px, 10px);
        opacity: .4;
    }
    .logo-container img {
        height:7vw;
        max-height:4rem;
        min-height:3rem;
    }

    @media (max-width:930px) {
        .video-container {
            display:none !important;
        }

        .connectId {
            font-size:15.5vw;
            line-height:18.5vw;
            height:16vw;
            width:11vw;
        }

        .underConnectIdText {
            font-size:5.5vw;
        }
    }

    @media (max-width:530px) {
        /* .logo-container img {
            height:10vw;
        }    */
    }

    @media (max-height:400px) {
        .bottom-zigzag-background {
            display:none;
        }
    }

    @media (max-height:290px) {
        .bottom-zigzag-background, .logo-container {
            display:none;
        }
    }

    /* Short and wide */
    @media (max-height:300px) and (min-width:800px) {
        .bottom-zigzag-background, .logo-container {
            display:none;
        }
    }

    /* Short and wide */
    @media (max-height:370px) and (min-width:1100px) {
        .bottom-zigzag-background, .logo-container {
            display:none;
        }
    }
</style>