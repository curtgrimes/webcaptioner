<template>
    <div class="bg-primary" style="min-height:100vh">
        <div class="container py-5">
            <h1>Admin</h1>
            <transition name="fade">
              <div v-if="rooms !== null">
                <h3>Rooms ({{rooms.length}})</h3>
                <div class="row px-4 small font-weight-bold mb-2" v-if="rooms.length">
                  <div class="col-4">
                    ID
                  </div>
                  <div class="col-4">
                    Viewers
                  </div>
                  <div class="col-4">
                    Expire Date
                  </div>
                </div>
                <b-list-group>
                  <b-list-group-item v-for="room in rooms" :key="room.id" :href="'/s/' + room.id + '?s'" target="_blank">
                    <div class="row">
                      <div class="col-4">
                        {{room.id}}
                      </div>
                      <div class="col-4">
                        {{room.subscriberCount}}
                      </div>
                      <div class="col-4">
                        {{new Date(room.expireDate).toISOString()}}
                      </div>
                    </div>
                  </b-list-group-item>
                </b-list-group>
              </div>
              <div v-else-if="roomsError">
                Unable to get rooms. <a href="javascript:void(0)" @click="updateRooms()">Retry.</a>
              </div>
            </transition>
        </div>
    </div>
</template>


<script>

export default {
  data: function() {
    return {
      rooms: null,
      roomsError: false,
    };
  },
  mounted: function () {
    this.updateRooms();
    setInterval(this.updateRooms, 7000);
  },
  methods: {
    updateRooms: async function() {
      this.roomsError = false;
      try {
        let {rooms} = await this.$axios.$get('/api/rooms?token=' + this.$route.query.token);
        this.rooms = rooms;
      }
      catch (error) {
        this.roomsError = true;
      }
    },
  },
}
</script>