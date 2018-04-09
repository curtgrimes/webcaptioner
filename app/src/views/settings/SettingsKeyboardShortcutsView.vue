<template>
  <div class="settings-word-replacements-view">
    <h2>Keyboard Shortcuts</h2>

    <div class="list-group">
      <div class="list-group-item">
        <div class="row">
          <div class="col-6">Toggle Captioning On/Off</div>
          <div class="col-6 text-right"><kbd>w</kbd> then <kbd>c</kbd></div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-6">Settings</div>
          <div class="col-6 text-right"><kbd>w</kbd> then <kbd>s</kbd></div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="row">
          <div class="col-6">List Keyboard Shortcuts</div>
          <div class="col-6 text-right"><kbd>?</kbd></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'settings-keyboard-shortcuts-view',
}
</script>
