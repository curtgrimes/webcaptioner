<template>
    <div class="settings-view bg-primary h-100">
        <div class="container d-flex align-items-center h-100">
            <div class="text-center w-100">
                <img src="/public/logo-inverse.svg" width="170" height="170" class="mb-4" alt="Web Captioner" />
                <h2>Web Captioner</h2>
                <hr/>
                <p>Your connect ID is</p>
                <span class="connectId">{{connectId}}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .connectId {
        font-family:'Cousine', monospace;
        font-size:4rem;
    }
</style>


<script>

export default {
  name: "connect-view",
  data: function() {
      return {
          connectId: null,
      }
  },
  mounted: function() {
    // let self = this;
    // socket.emit('getMyConnectId', {device: self.getDeviceInfo()}, ({connectId}) => {
    //     self.connectId = connectId;
    // });
    // this.$socket.sendObj({awesome: 'data2'});

  },
  methods: {
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
  }
};
</script>
