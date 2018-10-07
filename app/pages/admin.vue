<template>
    <div class="bg-primary" style="min-height:100vh">
        <div class="container py-5">
            <h1>Admin</h1>
            <transition name="fade">
              <div v-if="rooms !== null">
                <h3>Rooms ({{rooms.length}})</h3>
                <div class="row px-4 small font-weight-bold mb-2">
                  <div class="col-6">
                    ID
                  </div>
                  <div class="col-6">
                    Expire Date
                  </div>
                </div>
                <b-list-group>
                  <b-list-group-item v-for="room in rooms" :key="room.id" :href="'/s/' + room.id" target="_blank">
                    <div class="row">
                      <div class="col-6">
                        {{room.id}}
                      </div>
                      <div class="col-6">
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