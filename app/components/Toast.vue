<template>
    <div class="corner-modal card fade mt-1 rounded w-100 flex-shrink-0" v-if="displayElement" :class="isVisible ? 'show' : ''" style="max-width: calc(100% - 30px)">
        <div class="card-header py-2 pr-0">
            <button type="button" class="close px-4 py-1 float-right" aria-label="Close" @click="closeButtonClick()">
                <span aria-hidden="true">&times;</span>
            </button>
            <h2 class="m-0" style="font-size:1.2rem;padding-top:0.4rem">{{title}}</h2>
        </div>
        <div class="card-body">
            <slot/>
        </div>
        <div class="card-body border-top" v-if="this.$slots.footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>


<script>
export default {
  name: 'shareButton',
  props: {
      title: String,
      show: {
        type: Boolean,
        default: true,
      },
      onShow: Function,
      onClose: Function,
  },
  data: function() {
      return {
          isVisible: this.show,
          displayElement: this.show,
      }
  },
  mounted: function() {
      if (this.show && this.onShow) {
          this.onShow();
      }
  },
  methods: {
      closeButtonClick: function() {
          this.isVisible = false;
          if (this.onClose) {
              this.onClose();
          }
      },
  },
  watch: {
      show(show) {
          // 'show' prop updated
          if (show) {
              // Make element exist in DOM before triggering CSS animation
              this.displayElement = true;
              setTimeout(() => {
                  this.isVisible = true;
              }, 100);
            if (this.onShow) {
                this.onShow();
            }
          }
          else {
              this.isVisible = false;
          }
      },
      isVisible(isVisible) {
          if (!isVisible) {
              setTimeout(() => {
                  this.displayElement = false;
              },100);
          }
          else {
              this.displayElement = true;
          }
      }
  },
}
</script>
