<template>
  <div class="settings-remote-displays-view">
    <p>Send live captions to another tablet, phone, computer, or browser on this computer.</p>
    <p>Visit <strong><a href="/connect" target="_blank">webcaptioner.com/connect</a></strong> on another device or browser to get its 6-digit connection code.</p>
    <div class="input-group">
        <input type="text" maxlength="6" @keydown="connectSuccessful = null" ref="connectIdInput" autofocus class="form-control" placeholder="Connection Code" v-model="connectId" />
        <div class="input-group-append">
            <button class="btn btn-secondary" :disabled="!Boolean(connectId)" type="submit" @click="approveRoomRequest(connectId)">Add Display</button>
        </div>
    </div>
    <b-alert :show="remoteDisplayConnectIdNotFoundError" variant="danger" class="my-3"><span class="fa fa-times" aria-hidden="true"></span> Display not found.</b-alert>
    <!-- <b-alert :show="remoteDisplayConnectIdFoundMessage" variant="success" class="my-3"><span class="fa fa-check" aria-hidden="true"></span> Added display.</b-alert> -->
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
</template>

<script>

export default {
  name: "remote-displays-view",
  data: function() {
    return {
      connectId: null,
      connectSuccessful: null,
    };
  },
  watch: {
      remoteDisplayConnectIdNotFoundError: function(on) {
          if (on) {
              // Turn it off after a few seconds
              let self = this;
              setTimeout(function(){
                  self.remoteDisplayConnectIdNotFoundError = false;
              },5000);
          }
      },
      remoteDisplayConnectIdFoundMessage: function(on) {
          if (on) {
              // Turn it off after a few seconds
              let self = this;
              setTimeout(function(){
                  self.remoteDisplayConnectIdFoundMessage = false;
              },5000);
          }
      },
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
    remoteDisplayConnectIdNotFoundError: {
      get () {
        return this.$store.state.remoteDisplayConnectIdNotFoundError;
      },
      set (on) {
        this.$store.commit('SET_REMOTE_DISPLAY_CONNECTED_ID_NOT_FOUND_ERROR', {on});
      },
    },
    remoteDisplayConnectIdFoundMessage: {
      get () {
        return this.$store.state.remoteDisplayConnectIdFoundMessage;
      },
      set (on) {
        this.$store.commit('SET_REMOTE_DISPLAY_CONNECTED_ID_FOUND_MESSAGE', {on});
      },
    },
  },
  methods: {
    approveRoomRequest: function(connectId) {
        this.$socket.sendObj({
            action: 'addMemberToMyRoom',
            connectId,
        });
        this.connectId = null;
        this.$refs.connectIdInput.focus();

    }
  }
};
</script>
