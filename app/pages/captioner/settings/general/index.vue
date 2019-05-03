<template>
  <div>
    <hr>
    <label for="censor-profane-language" class="mb-0">Censor profane language</label>
    <b-form-checkbox id="censor-profane-language" v-model="censor" switch class="float-right"></b-form-checkbox>
    <div class="clearfix"></div>
    <transition name="fade-in">
      <div v-if="censor">
        <div class="form-inline small mt-1">
          <div class="form-group">
            <label>
              <span class="pr-2">{{$t('settings.censor.replaceCensoredWordsWith')}}</span>
              <select
                v-model="censorReplaceWith"
                class="form-control form-control-sm"
                id="volumeMeterSensitivity"
              >
                <option value="nothing">{{$t('settings.censor.nothing')}}</option>
                <option value="asterisks">{{$t('settings.censor.asterisks')}} (*****)</option>
              </select>
            </label>
          </div>
        </div>
        <p class="mb-0 small text-muted mt-2">
          {{$t('settings.censor.usEnglishOnly')}}
          <i18n path="settings.censor.censorProfaneLanguageDescription.text" tag="span">
            <a
              place="seeThisList"
              href="https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words"
              target="_blank"
            >{{$t('settings.censor.censorProfaneLanguageDescription.seeThisList')}}</a>
            <router-link
              place="useWordReplacements"
              to="word-replacements"
            >{{$t('settings.censor.censorProfaneLanguageDescription.useWordReplacements')}}</router-link>
          </i18n>
        </p>
      </div>
      <p v-else class="mb-0 text-muted small mt-2">
        Censorship is off. However, the speech-to-text service that Web Captioner runs on currently does not give an option to completely disable censorship. Web Captioner applies a heuristic to uncensor words that are returned from this service that still appear to be censored. If you are running into issues with words being censored even when censorship is off,
        <a
          href="https://feedback.webcaptioner.com/"
        >leave feedback</a> or
        <a href="https://m.me/webcaptioner">contact Web Captioner</a>.
      </p>
    </transition>
    <div class="clearfix"></div>
    <hr>
    <!--
    <div class="row">
      <div class="col-md-4">
        <label
          for="adjust-speed-accuracy"
          class="mb-0 form-group form-inline float-left"
        >Adjust speed/accuracy</label>
      </div>
      <div class="col-md-8">
        <div class="d-flex">
          <div class="small text-muted font-weight-bold text-right">More real-time captions</div>
          <div class="form-group mx-auto w-100 px-2">
            <b-form-input
              id="adjust-speed-accuracy"
              v-model="value"
              type="range"
              min="2000"
              max="5000"
              step="1000"
            ></b-form-input>
          </div>
          <div class="small text-muted font-weight-bold text-left">More real-time captions</div>
        </div>
      </div>
    </div>
    <div class="clearfix"></div>
    <hr>
    -->
    <label for="show-volume-meter" class="mb-0">Show volume meter when volume level is low</label>
    <b-form-checkbox id="show-volume-meter" v-model="volumeMeterShow" switch class="float-right"></b-form-checkbox>
    <div class="clearfix"></div>
    <transition name="fade-in">
      <div class="form-inline small mt-1" v-if="volumeMeterShow">
        <div class="form-group">
          <label>
            <span class="pr-2">Sensitivity</span>
            <select
              v-model="volumeMeterSensitivity"
              class="form-control form-control-sm"
              id="volumeMeterSensitivity"
            >
              <option value="high">High (default)</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
      </div>
    </transition>
    <div class="clearfix"></div>
    <hr>
    <label for="large-navigation-bar-buttons" class="mb-0">Use large navigation bar buttons</label>
    <b-form-checkbox
      id="large-navigation-bar-buttons"
      v-model="largerLayout"
      switch
      class="float-right"
    ></b-form-checkbox>
    <div class="clearfix"></div>
    <hr>
    <label for="action-after-no-audio" class="mb-0 form-group form-inline float-left">
      After
      <select class="form-control form-control-sm mx-2" v-model="afterNoAudioSeconds">
        <option v-for="val in [1,2,3,4,5,10,20,30]" :key="val" :value="val">{{val}}</option>
      </select>
      <span v-if="afterNoAudioSeconds === 1">second&nbsp;</span>
      <span v-else>seconds&nbsp;</span>of no audio while captioning
    </label>
    <div class="form-group float-right mb-0">
      <select
        class="form-control form-control-sm"
        id="action-after-no-audio"
        v-model="afterNoAudioAction"
      >
        <option value="doNothing">Do nothing</option>
        <option value="lineBreak1">Add 1 line break</option>
        <option value="lineBreak2">Add 2 line breaks</option>
        <option value="lineBreak3">Add 3 line breaks</option>
        <option value="lineBreak5">Add 5 line breaks</option>
        <option value="clearTranscript">Clear transcript</option>
      </select>
    </div>
    <div class="clearfix"></div>
    <hr>

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
import bBtn from 'bootstrap-vue/es/components/button/button';
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input';
import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox';
import bListGroup from 'bootstrap-vue/es/components/list-group/list-group';
import bListGroupItem from 'bootstrap-vue/es/components/list-group/list-group-item';
import bNavbar from 'bootstrap-vue/es/components/navbar/navbar';
import bDropdown from 'bootstrap-vue/es/components/dropdown/dropdown';

export default {
  components: {
    bBtn,
    bFormInput,
    bFormCheckbox,
    bListGroup,
    bListGroupItem,
    bNavbar,
    bDropdown,
  },
  middleware: ['settings-meta'],
  meta: {
    settingsPageTitleKey: 'settings.general',
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
    censor: {
      get() {
        return this.$store.state.settings.censor.on;
      },
      set(censor) {
        this.$store.commit('SET_CENSOR', { censor });
      },
    },
    censorReplaceWith: {
      get() {
        return this.$store.state.settings.censor.replaceWith;
      },
      set(replaceWith) {
        this.$store.commit('SET_CENSOR_REPLACE_WITH', { replaceWith });
      },
    },
    afterNoAudioSeconds: {
      get() {
        return this.$store.state.settings.afterNoAudio.seconds;
      },
      set(seconds) {
        this.$store.commit('SET_AFTER_NO_AUDIO_SECONDS', { seconds });
      },
    },
    afterNoAudioAction: {
      get() {
        return this.$store.state.settings.afterNoAudio.action;
      },
      set(action) {
        this.$store.commit('SET_AFTER_NO_AUDIO_ACTION', { action });
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
