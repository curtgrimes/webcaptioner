<template>
  <div class="settings-word-replacements-view">
    <div class="list-group mt-sm-3">
      <div class="list-group-item">
        <div class="row">
          <div class="col-6">Toggle captioning on/off</div>
          <div class="col-6 text-right"><kbd>w</kbd> then <kbd>c</kbd></div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-6">Toggle fullscreen mode on/off</div>
          <div class="col-6 text-right"><kbd>w</kbd> then <kbd>x</kbd></div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-6">Show captions in new window</div>
          <div class="col-6 text-right"><kbd>w</kbd> then <kbd>n</kbd></div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-6">Open Settings</div>
          <div class="col-6 text-right"><kbd>w</kbd> then <kbd>s</kbd></div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-6">Increase text size</div>
          <div class="col-6 text-right"><kbd v-if="isMac">&#8984;</kbd><kbd v-else>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>&gt;</kbd></div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-6">Decrease text size</div>
          <div class="col-6 text-right"><kbd v-if="isMac">&#8984;</kbd><kbd v-else>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>&lt;</kbd></div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-6">Open "Save as File" dialog</div>
          <div class="col-6 text-right"><kbd>w</kbd> then <kbd>f</kbd></div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-6">Clear transcript</div>
          <div class="col-6 text-right"><kbd>w</kbd> then <kbd>p</kbd> then <kbd>p</kbd></div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-6">List keyboard shortcuts</div>
          <div class="col-6 text-right"><kbd>?</kbd></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'settings-keyboard-shortcuts-view',
  data: function () {
    return {
      isMac: false,
    };
  },
  mounted: function() {
    // Do only client-side after mount
    this.isMac = navigator ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : false;
  },
}
</script>
