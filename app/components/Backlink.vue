<template>
  <transition :name="inline ? 'expand' : 'fade'">
    <b-btn
      v-if="show && backlink"
      @mouseover="backlinkHovering = true"
      @mouseleave="backlinkHovering = false"
      :href="backlink.url"
      target="_blank"
      rel="noopener noreferrer"
      class="text-left d-flex align-items-center backlink-button p-2 border border-0"
      :style="backlinkStyle"
      variant="dark"
    >
      <div
        v-if="backlink.imageUrl"
        class="og-image flex-shrink-0"
        :style="{backgroundImage: 'url(\''+ backlink.imageUrl +'\')'}"
      ></div>
      <fa v-else icon="info-circle" class="m-1" size="2x"/>
      <transition name="fade">
        <div v-show="shouldShowInfo || alwaysExpanded" class="og-text px-1 ml-2">
          {{backlink.title}}
          <br>
          <span class="normal-text small">{{backlink.description}}</span>
        </div>
      </transition>
    </b-btn>
  </transition>
</template>

<script>
import bBtn from 'bootstrap-vue/es/components/button/button';

export default {
  components: {
    bBtn,
  },
  props: {
    backlinkData: Object,
    roomId: String,
    inline: {
      type: Boolean,
      default: false,
    },
    alwaysExpanded: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  data: function() {
    return {
      backlink: null,
      backlinkHovering: false,
      shouldShowInfo: false,
      aboutToCloseTimeout: null,
    };
  },
  mounted: function() {
    setInterval(this.updateRoomBacklink, 1000 * 60 * 2);

    if (this.backlinkData) {
      // We already have data to hydrate with from parent. Use it for the initial load.
      this.backlink = this.backlinkData;
    } else {
      this.updateRoomBacklink();
    }
  },
  methods: {
    updateRoomBacklink: async function() {
      if (!this.roomId) {
        return;
      }

      try {
        const { backlink } = await this.$axios.$get(
          '/api/rooms/' + this.roomId + '/backlink'
        );
        this.backlink = backlink;
      } catch (e) {}
    },
  },
  computed: {
    backlinkStyle: function() {
      return {
        ...(this.backlink.colors
          ? {
              backgroundColor: this.backlink.colors.background,
              color: this.backlink.colors.text,
            }
          : {}),
        ...(this.inline
          ? {}
          : { position: 'absolute', top: '15px', right: '15px', zIndex: 1 }),
      };
    },
  },
  watch: {
    backlinkHovering: function(backlinkHovering) {
      if (backlinkHovering) {
        this.shouldShowInfo = true;
        clearTimeout(this.aboutToCloseTimeout);
      } else {
        this.aboutToCloseTimeout = setTimeout(() => {
          if (!this.backlinkHovering) {
            // if we're still not hoving on it
            this.shouldShowInfo = false;
          }
        }, 400);
      }
    },
  },
};
</script>

<style scoped>
.backlink-button {
  max-width: 350px;
}

.og-text {
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1.2rem;
}

.og-image {
  width: 45px;
  height: 45px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 300ms ease-out;
  max-height: 100px;
  overflow: hidden;
  opacity: 1;
  filter: brightness(1);
}
.expand-enter,
.expand-leave-to {
  max-height: 0;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin: 0 !important;
  opacity: 0;
  filter: brightness(3);
}
</style>