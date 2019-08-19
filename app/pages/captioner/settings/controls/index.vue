<template>
  <div class="settings-controls-view">
    <div class="row">
      <div class="col-md-6">
        <h3>{{$t('settings.controls.screenLayout')}}</h3>
        <b-list-group>
          <b-list-group-item
            button
            :active="!largerLayout"
            @click="largerLayout = false"
            @mouseover="largerPreview = false"
            @mouseleave="largerPreview = largerLayout"
          >
            <p class="font-weight-bold mb-0">{{$t('settings.controls.default')}}</p>
            <p class="small mb-0">{{$t('settings.controls.defaultDescription')}}</p>
          </b-list-group-item>
          <b-list-group-item
            button
            :active="largerLayout"
            @click="largerLayout = true"
            @mouseover="largerPreview = true"
            @mouseleave="largerPreview = largerLayout"
          >
            <p class="font-weight-bold mb-0">{{$t('settings.controls.larger')}}</p>
            <p class="small mb-0">{{$t('settings.controls.largerDescription')}}</p>
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="col-md-6 mt-3 mt-md-0">
        <h3 class="d-none d-md-block">&nbsp;</h3>
        <div class="preview" :class="{'default-size': !largerPreview}" style="min-height:300px">
          <div
            class="text-preview-mockup-wrap main-preview w-100 d-flex"
            v-bind:style="{backgroundColor: backgroundColor, padding: (alignmentPadding/2)+'em'}"
            v-bind:class="previewWrapTextPositionClass"
          >
            <div
              class="text-preview-mockup p-1 d-flex"
              style="cursor:default"
              v-bind:style="{color: textColor}"
              v-bind:class="previewTextPositionClass"
            >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce est ligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fus Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligdiam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauriula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fus Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris necligulamauris necligula, tristique at lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congueat lectus aliquet, pellentesque rutrum diam. Fusce molestie mauris nec congue placerat.</div>
          </div>
          <b-navbar variant="dark" class="px-2 py-1 d-flex flex-column">
            <div v-if="largerPreview" class="d-flex w-100 pb-1">
              <b-button variant="danger" disabled class="mr-auto">Xxxxx</b-button>
              <b-button variant="info" disabled>Xxxx xx Xxxx</b-button>
            </div>
            <div class="d-flex w-100 align-items-center">
              <img src="/static/img/logo.svg" width="8" height="8" class="align-middle mr-auto" />
              <b-dropdown variant="primary" split text="Xxxxx Xxxxxxxx" disabled></b-dropdown>
            </div>
          </b-navbar>
        </div>
      </div>
    </div>
    <h3 class="mt-3">Volume Meter</h3>
    <p
      class="mb-2"
    >By default, a volume meter appears during captioning if your volume level is low.</p>
    <div class="custom-control custom-checkbox">
      <input
        v-model="volumeMeterShow"
        class="custom-control-input"
        type="checkbox"
        name="showVolumeMeter"
        id="showVolumeMeter"
        value="uppercase"
      />
      <label
        class="custom-control-label"
        for="showVolumeMeter"
      >Show volume meter when volume level is low</label>
    </div>
    <transition name="fade">
      <div class="form-inline" v-if="volumeMeterShow">
        <div class="form-group ml-4 small">
          <label for="volumeMeterSensitivity" class="mr-2">
            <strong>Sensitivity</strong>
          </label>
          <select
            v-model="volumeMeterSensitivity"
            class="form-control form-control-sm"
            id="volumeMeterSensitivity"
          >
            <option value="high">High sensitivity (default)</option>
            <option value="low">Low sensitivity</option>
          </select>
        </div>
      </div>
    </transition>
    <h3 class="mt-5">{{$t('settings.controls.keyboardShortcuts')}}</h3>
    <div class="list-group mt-sm-3">
      <div class="list-group-item">
        <div class="row">
          <div class="col-sm-6 mb-1 mb-sm-0">{{$t('settings.controls.toggleCaptioning')}}</div>
          <div class="col-sm-6 text-sm-right">
            <kbd>w</kbd>
            {{$t('settings.controls.then')}}
            <kbd>c</kbd>
          </div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-sm-6 mb-1 mb-sm-0">{{$t('settings.controls.toggleFullscreen')}}</div>
          <div class="col-sm-6 text-sm-right">
            <kbd>w</kbd>
            {{$t('settings.controls.then')}}
            <kbd>x</kbd>
          </div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-sm-6 mb-1 mb-sm-0">{{$t('settings.controls.showNewWindow')}}</div>
          <div class="col-sm-6 text-sm-right">
            <kbd>w</kbd>
            {{$t('settings.controls.then')}}
            <kbd>n</kbd>
          </div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-sm-6 mb-1 mb-sm-0">{{$t('settings.controls.openSettings')}}</div>
          <div class="col-sm-6 text-sm-right">
            <kbd>w</kbd>
            {{$t('settings.controls.then')}}
            <kbd>s</kbd>
          </div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-sm-6 mb-1 mb-sm-0">{{$t('settings.controls.increaseTextSize')}}</div>
          <div class="col-sm-6 text-sm-right">
            <kbd v-if="isMac">&#8984;</kbd>
            <kbd v-else>{{$t('settings.controls.ctrl')}}</kbd> +
            <kbd>{{$t('settings.controls.shift')}}</kbd> +
            <kbd>&gt;</kbd>
          </div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-sm-6 mb-1 mb-sm-0">{{$t('settings.controls.decreaseTextSize')}}</div>
          <div class="col-sm-6 text-sm-right">
            <kbd v-if="isMac">&#8984;</kbd>
            <kbd v-else>{{$t('settings.controls.ctrl')}}</kbd> +
            <kbd>{{$t('settings.controls.shift')}}</kbd> +
            <kbd>&lt;</kbd>
          </div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-sm-6 mb-1 mb-sm-0">{{$t('settings.controls.openSave')}}</div>
          <div class="col-sm-6 text-sm-right">
            <kbd>w</kbd>
            {{$t('settings.controls.then')}}
            <kbd>f</kbd>
          </div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-sm-6 mb-1 mb-sm-0">{{$t('settings.controls.clearTranscript')}}</div>
          <div class="col-sm-6 text-sm-right">
            <kbd>w</kbd>
            {{$t('settings.controls.then')}}
            <kbd>p</kbd>
            {{$t('settings.controls.then')}}
            <kbd>p</kbd>
          </div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-sm-6 mb-1 mb-sm-0">{{$t('settings.controls.listKeyboardShortcuts')}}</div>
          <div class="col-sm-6 text-sm-right">
            <kbd>?</kbd>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BButton,
  BListGroup,
  BListGroupItem,
  BNavbar,
  BDropdown,
} from 'bootstrap-vue';

export default {
  components: {
    BButton,
    BListGroup,
    BListGroupItem,
    BNavbar,
    BDropdown,
  },
  middleware: ['settings-meta'],
  meta: {
    settingsPageTitleKey: 'settings.controls.controls',
  },
  data: function() {
    return {
      largerPreview: false,
      isMac: false,
    };
  },
  mounted: function() {
    this.largerPreview = this.largerLayout;

    // Do only client-side
    this.isMac = navigator
      ? navigator.platform.toUpperCase().indexOf('MAC') >= 0
      : false;
  },
  computed: {
    largerLayout: {
      get() {
        return this.$store.state.settings.controls.layout.larger;
      },
      set(on) {
        this.$store.commit('SET_LAYOUT_LARGER', { on });
      },
    },
    volumeMeterShow: {
      get() {
        return this.$store.state.settings.controls.volumeMeter.show;
      },
      set(on) {
        this.$store.commit('SET_VOLUME_METER_SHOW', { on });
      },
    },
    volumeMeterSensitivity: {
      get() {
        return this.$store.state.settings.controls.volumeMeter.sensitivity;
      },
      set(sensitivity) {
        this.$store.commit('SET_VOLUME_METER_SENSITIVITY', { sensitivity });
      },
    },
    backgroundColor: function() {
      return this.$store.state.settings.appearance.background.color;
    },
    alignmentPadding: function() {
      return this.$store.state.settings.appearance.text.alignment.padding;
    },
    previewWrapTextPositionClass: function() {
      return {
        /* Vertical alignments */
        'align-items-start': ['full', 'top'].includes(this.alignmentVertical),
        'align-items-center': this.alignmentVertical == 'middle',
        'align-items-end': ['bottom', 'lowerThird'].includes(
          this.alignmentVertical
        ),
      };
    },
    textColor: function() {
      return this.$store.state.settings.appearance.text.textColor;
    },
    previewTextPositionClass: function() {
      return {
        /* Horizontal alignments */
        'w-100 mx-0': this.alignmentHorizontal == 'full',
        'w-50 mr-auto': this.alignmentHorizontal == 'left',
        'w-50 mx-auto': this.alignmentHorizontal == 'middle',
        'w-50 ml-auto': this.alignmentHorizontal == 'right',

        /* Vertical alignments */
        'h-100': this.alignmentVertical == 'full',
        'h-50': ['top', 'middle', 'bottom'].includes(this.alignmentVertical),
        'h-25': this.alignmentVertical == 'lowerThird',
      };
    },
  },
};
</script>

<style>
@font-face {
  font-family: 'Redacted';
  src: url('~static/redacted-regular.ttf');
}

.preview * {
  font-family: 'Redacted';
}

.preview .btn {
  font-size: 0.2rem;
  cursor: default;
}

.preview.default-size .btn {
  padding: 0.2rem 0.4rem;
}

.text-preview-mockup-wrap {
  border: 1px solid rgba(0, 0, 0, 0.2);
  height: 65px;
  overflow: hidden;
}

.text-preview-mockup-wrap.main-preview {
  height: 200px;
}

.text-preview-mockup {
  font-family: 'Redacted';
  white-space: normal;
  font-size: 5px;
  line-height: 8px;
  overflow: hidden;
}

.text-preview-mockup-wrap.main-preview .text-preview-mockup {
  font-size: 9px;
  line-height: 14px;
}
</style>
