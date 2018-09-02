<template>
  <div>
    <b-modal ref="invalidSettingsFile" class="text-center" hide-header @shown="focusInvalidSettingsFileModalOkButton()">
      <div class="py-2">
        <div class="pb-2 h4"><fa icon="exclamation-triangle" size="3x" /></div>
        <h2>Hmmm</h2>
        <p class="lead">It looks like something's wrong with that file.</p>
      </div>
      <div slot="modal-footer">
        <b-btn class="float-right" variant="secondary" ref="invalidSettingsFileModalOkButton" @click="hideInvalidSettingsFileModal()">Ok</b-btn>
      </div>
    </b-modal>
    <b-modal ref="confirmRestore" hide-header @shown="focusConfirmRestoreModalOkButton()">
      <div class="py-2">
        <h2>Restore settings from this file?</h2>
        <p class="lead">All of your current settings will be lost.</p>
      </div>
      <div slot="modal-footer">
        <b-btn class="float-right ml-2" variant="secondary" ref="confirmRestoreModalOkButton" @click="restoreSettings()">Restore</b-btn>
        <b-btn class="float-right" variant="primary" @click="cancelConfirmRestoreModal()">Cancel</b-btn>
      </div>
    </b-modal>
    <b-modal ref="confirmReset" hide-header @shown="focusConfirmResetModalOkButton()">
      <div class="py-2">
        <h2>Reset all your settings?</h2>
        <p class="lead">All of your current settings will be lost.</p>
      </div>
      <div slot="modal-footer">
        <b-btn class="float-right ml-2" variant="danger" ref="confirmResetModalOkButton" @click="resetSettings()">Reset</b-btn>
        <b-btn class="float-right" variant="primary" @click="cancelConfirmResetModal()">Cancel</b-btn>
      </div>
    </b-modal>
    <b-modal class="text-center" ref="restoreSuccessModal" ok-only hide-header>
      <div class="pb-2 h4"><fa icon="check-circle" size="3x" /></div>
      <h2>Settings Restored</h2>
    </b-modal>
    <b-modal class="text-center" ref="resetSuccessModal" ok-only hide-header>
      <div class="pb-2 h4"><fa icon="check-circle" size="3x" /></div>
      <h2>Settings Reset</h2>
    </b-modal>
    <div class="card mb-3">
      <div class="card-body">
        <h3>Export</h3>
        <p>Your settings will be saved locally as a JSON file.</p>
        <button class="btn btn-secondary d-inline-block" @click="exportSettings()">Export</button>
      </div>
    </div>
    <div class="card mb-3">
      <div class="card-body">
        <h3>Restore</h3>
        <p>Restore settings (appearance, censor settings, word replacements, vMix settings, etc.) from a settings file you previously exported.</p>
        <input ref="settingsFileUpload" type="file" accept=".json" @change="loadSettingsFile($event)" />
      </div>
    </div>
    <div class="card mb-3">
      <div class="card-body">
        <h3>Reset</h3>
        <p>Reset all of your settings.</p>
        <button class="btn btn-danger d-inline-block" @click="confirmReset()">Reset</button>
      </div>
    </div>
  </div>
</template>

<script>
import saveToFile from '~/mixins/saveToFile'
import getDefaultSettings from '~/store/settingsState'

export default {
  transition: 'fade',
  middleware: [
    'settings-meta',
  ],
  meta: {
    settingsPageTitle: 'Export/Restore Settings',
  },
  mixins: [
    saveToFile,
  ],
  data: function() {
    return {
      importedSettings: {},
    };
  },
  methods: {
    exportSettings: function() {
      this.saveToJSONFile({
        settings: JSON.stringify(this.$store.state.settings)
      });
    },
    loadSettingsFile: function(event) {
      let input = event.target;

      var reader = new FileReader();
      reader.onload = () => {
        let result = reader.result;
        try {
          this.importedSettings = JSON.parse(reader.result);
          this.$refs.confirmRestore.show();
        }
        catch (e) {
          this.$refs.invalidSettingsFile.show();
        }
      };
      reader.readAsText(input.files[0]);
    },
    restoreSettings: function() {
      this.$store.dispatch('RESTORE_SETTINGS', {settings: getDefaultSettings() })
        .then(() => {
          return this.$store.dispatch('RESTORE_SETTINGS', {settings: this.importedSettings });
        })
        .then(() => {
          this.cancelConfirmRestoreModal();
          this.$refs.restoreSuccessModal.show();
        });
    },
    resetSettings: function() {
      this.$store.dispatch('RESTORE_SETTINGS', {settings: getDefaultSettings() })
        .then(() => {
          this.$refs.confirmReset.hide();
          this.$refs.resetSuccessModal.show();
        });
    },
    focusInvalidSettingsFileModalOkButton: function() {
      this.$refs.invalidSettingsFileModalOkButton.focus();
    },
    hideInvalidSettingsFileModal: function() {
      this.$refs.invalidSettingsFile.hide();
    },
    focusConfirmRestoreModalOkButton: function() {
      this.$refs.confirmRestoreModalOkButton.focus();
    },
    cancelConfirmRestoreModal: function() {
      this.loadedSettings = null;
      this.$refs.settingsFileUpload.value = null;
      this.$refs.confirmRestore.hide();
    },
    confirmReset: function() {
      this.$refs.confirmReset.show();
    },
    focusConfirmResetModalOkButton: function() {
      this.$refs.confirmResetModalOkButton.focus();
    },
    cancelConfirmResetModal: function() {
      this.$refs.confirmReset.hide();
    },
  }
}
</script>
