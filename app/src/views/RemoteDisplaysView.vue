<template>
  <div class="bg-primary" style="min-height:100%">
    <router-link to="/captioner" class="btn btn-primary position-fixed py-md-3 px-3 px-md-4" style="z-index:2;right:0;top:0" role="tab" active-class=""><i class="fa fa-times fa-2x" aria-label="Close"></i></router-link>
    <div class="container pb-5 h-100 py-5">
        <h2>Remote Displays</h2>
        <p>Connect and send live captions to another tablet, phone, computer, or browser on this computer.</p>
        <div class="card">
            <div class="card-body bg-secondary text-white">
                <div class="row">
                    <div class="col-sm-2 d-none d-sm-flex">
                        <i class="d-none d-sm-block d-md-none fa fa-tablet" aria-hidden="true" style="font-size: 7.5rem;position: relative;top: -8px;height:50px;overflow: visible;"></i>
                        <i class="d-none d-md-block d-lg-none fa fa-tablet" aria-hidden="true" style="font-size: 11rem;position: relative;top: -12px;height:50px;overflow: visible;"></i>
                        <i class="d-none d-lg-block fa fa-tablet" aria-hidden="true" style="font-size: 12rem;position: relative;top: -12px;height:155px;overflow: visible;"></i>
                    </div>
                    <div class="col-sm-10 pl-sm-4">
                        <h5 class="card-title">Add a Display</h5>
                        <p class="card-text">Visit <strong><a href="/connect" class="text-primary" target="_blank">webcaptioner.com/connect</a></strong> on another device or browser. Enter the 6-digit connection code here.</p>
                        <div class="row">
                            <div class="col-md-6">
                                <div>
                                <!-- <form @submit.prevent="approveRoomRequest(connectId)"> -->
                                    <div class="input-group">
                                        <input type="text" @keydown="connectSuccessful = null" ref="connectIdInput" autofocus class="form-control" placeholder="Connection Code" v-model="connectId" />
                                        <div class="input-group-append">
                                            <button class="btn btn-primary" type="submit" @click="approveRoomRequest(connectId)">Add Display</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 py-2 pl-md-0">
                                <span v-if="connectSuccessful === false" class="badge badge-danger">Display not found</span>
                                <span v-if="connectSuccessful === true" class="badge badge-success"><span class="fa fa-check" aria-hidden="true"></span> Added display</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <div v-if="remoteDisplays.length">
            <hr class="my-4" />
            <div class="mb-4">
                {{remoteDisplays.length}} <span v-if="remoteDisplays.length > 1">displays</span><span v-else>display</span> connected
            </div>
            <div class="list-group">
                <div class="list-group-item" v-for="remoteDisplay in remoteDisplays" v-bind:key="remoteDisplay.remoteDisplayId">
                    <div class="row">
                        <div class="col-3 py-2">
                            <span v-if="remoteDisplay.device.isAndroid">
                                <i class="fa fa-android" aria-hidden="true"></i> Android
                            </span>
                            <span v-else-if="remoteDisplay.device.isIosPhone">
                                <i class="fa fa-apple" aria-hidden="true"></i> iPhone
                            </span>
                            <span v-else-if="remoteDisplay.device.isIosTablet">
                                <i class="fa fa-apple" aria-hidden="true"></i> iPad
                            </span>
                            <span v-else-if="remoteDisplay.device.isMac">
                                <i class="fa fa-apple" aria-hidden="true"></i> Mac
                            </span>
                            <span v-else-if="remoteDisplay.device.isLinux">
                                Linux Device
                            </span>
                            <span v-else-if="remoteDisplay.device.isWindows">
                                <i class="fa fa-windows" aria-hidden="true"></i> Windows Device
                            </span>
                            <span v-else>
                                Device
                            </span>
                        </div>
                        <div class="col-6 py-2">
                            Connected {{$helpers.dateFormat(remoteDisplay.joinDate, 'MMMM D [at] h:mm A')}}
                        </div>
                        <div class="col-3 text-right">
                            <button class="btn btn-danger btn-sm">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import socket from "../api/socket";

export default {
  name: "remote-displays-view",
  data: function() {
    return {
      connectId: null,
      connectSuccessful: null,
    };
  },
  computed: {
    remoteDisplays: {
      get () {
        return this.$store.state.remoteDisplays;
      },
      set (remoteDisplays) {
        this.$store.commit('SET_REMOTE_DISPLAYS', {remoteDisplays});
      },
    },
  },
  methods: {
    approveRoomRequest: function(connectId) {
      let self = this;
      socket.emit("addConnectIdToMyRoom", { connectId }, function({
        success
      }) {
        if (success) {
          self.connectId = null;
          self.connectSuccessful = true;
        } else {
          self.connectSuccessful = false;
          self.$refs.connectIdInput.select();
        }
      });
    }
  }
};
</script>
