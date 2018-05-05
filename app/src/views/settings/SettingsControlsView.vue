<template>
  <div class="settings-controls-view">
    <div class="row">
      <div class="col-sm-6">
        <h3>Screen Layout</h3>
        <b-list-group>
          <b-list-group-item button :active="!largerLayout" @click="largerLayout = false" @mouseover="largerPreview = false" @mouseleave="largerPreview = largerLayout">
            <p class="font-weight-bold mb-0">Default</p>
            <p class="small mb-0">Regular-sized controls</p>
          </b-list-group-item>
          <b-list-group-item button :active="largerLayout" @click="largerLayout = true" @mouseover="largerPreview = true" @mouseleave="largerPreview = largerLayout">
            <p class="font-weight-bold mb-0">Larger</p>
            <p class="small mb-0">Larger controls and additional buttons for one-click saving and clearing the transcript</p>
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="col-sm-6">
        <h3>&nbsp;</h3>
        <div class="preview" :class="{'default-size': !largerPreview}">
          <div class="text-preview-mockup-wrap main-preview w-100 d-flex" v-bind:style="{backgroundColor: backgroundColor, padding: (alignmentPadding/2)+'em'}" v-bind:class="previewWrapTextPositionClass">
            <div class="text-preview-mockup p-1 d-flex" style="cursor:default" v-bind:style="{color: textColor}" v-bind:class="previewTextPositionClass">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce est ligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fus Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligdiam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauriula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fus Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congue placerat.</div>
          </div>
          <b-navbar variant="dark" class="px-2 py-1 d-flex flex-column" >
            <div v-if="largerPreview" class="d-flex w-100 pb-1">
              <b-button variant="danger" disabled class="mr-auto">Clear</b-button>
              <b-button variant="info" disabled>Save to File</b-button>
            </div>
            <div class="d-flex w-100 align-items-center">
              <img src="/public/logo.svg" width="8" height="8" alt="Web Captioner" class="align-middle mr-auto" />
              <b-dropdown variant="primary" split text="Start Captioning" disabled></b-dropdown>
            </div>
          </b-navbar>
        </div>
        <!-- <b-card img-src="https://placekitten.com/1000/300"
                img-alt="Card image"
                img-bottom>
            <p class="card-text">
                Some quick example text to build on the card and make up the bulk of the card's content.
            </p>
        </b-card> -->
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'settings-controls-view',
  data: function() {
    return {
      largerPreview: false,
    };
  },
  mounted: function() {
    this.largerPreview = this.largerLayout;
  },
  computed: {
    largerLayout: {
      get () {
        return this.$store.state.settings.controls.layout.larger;
      },
      set (on) {
        this.$store.commit('SET_LAYOUT_LARGER', {on});
      },
    },
    backgroundColor: function () {
      return this.$store.state.settings.appearance.background.color;
    },
    alignmentPadding: function () {
      return this.$store.state.settings.appearance.text.alignment.padding;
    },
    previewWrapTextPositionClass: function () {
      return {
        /* Vertical alignments */
        'align-items-start': ['full','top'].includes(this.alignmentVertical),
        'align-items-center': this.alignmentVertical == 'middle',
        'align-items-end': ['bottom','lowerThird'].includes(this.alignmentVertical),
      }
    },
    textColor: function () {
      return this.$store.state.settings.appearance.text.textColor;
    },
    previewTextPositionClass: function () {
      return {
        /* Horizontal alignments */
        'w-100 mx-0': this.alignmentHorizontal == 'full',
        'w-50 mr-auto': this.alignmentHorizontal == 'left',
        'w-50 mx-auto': this.alignmentHorizontal == 'middle',
        'w-50 ml-auto': this.alignmentHorizontal == 'right',

        /* Vertical alignments */
        'h-100': this.alignmentVertical == 'full',
        'h-50': ['top','middle','bottom'].includes(this.alignmentVertical),
        'h-25': this.alignmentVertical == 'lowerThird',
      }
    },
  },
}
</script>

<style>
  @font-face {
      font-family: "Redacted";
      src: url("/public/redacted-regular.ttf");
  }

  .preview * {
    font-family:'Redacted';
  }

  .preview .btn {
    font-size:0.2rem;
    cursor:default;
  }

  .preview.default-size .btn {
    padding:0.2rem 0.4rem;
  }

  .text-preview-mockup-wrap {
    border:1px solid rgba(0,0,0,.2);
    height: 65px;
    overflow:hidden;
  }

  .text-preview-mockup-wrap.main-preview {
    height:200px;
  }

  .text-preview-mockup {
    font-family:'Redacted';
    white-space: normal;
    font-size: 5px;
    line-height:8px;
    overflow: hidden;
  }

  .text-preview-mockup-wrap.main-preview .text-preview-mockup {
    font-size:9px;
    line-height:14px;
  }
</style>
