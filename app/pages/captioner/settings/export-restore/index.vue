<template>
  <div>
    <b-modal
      ref="invalidSettingsFile"
      class="text-center"
      hide-header
      @shown="focusInvalidSettingsFileModalOkButton()"
    >
      <div class="py-2">
        <div class="pb-2 h4">
          <fa icon="exclamation-triangle" size="3x" />
        </div>
        <p class="lead">
          {{ $t('settings.exportRestore.somethingWrongWithFile') }}
        </p>
      </div>
      <div slot="modal-footer">
        <b-button
          class="float-right"
          variant="secondary"
          ref="invalidSettingsFileModalOkButton"
          @click="hideInvalidSettingsFileModal()"
          >{{ $t('common.ok') }}</b-button
        >
      </div>
    </b-modal>
    <b-modal
      ref="confirmRestore"
      hide-header
      @shown="focusConfirmRestoreModalOkButton()"
    >
      <div class="py-2">
        <h2>{{ $t('settings.exportRestore.restoreSettingsQuestion') }}</h2>
        <p class="lead">
          {{ $t('settings.exportRestore.settingsWillBeLost') }}
        </p>
      </div>
      <div slot="modal-footer">
        <b-button
          class="float-right ml-2"
          variant="secondary"
          ref="confirmRestoreModalOkButton"
          @click="restoreSettings()"
          >{{ $t('settings.exportRestore.restore') }}</b-button
        >
        <b-button
          class="float-right"
          variant="link"
          @click="cancelConfirmRestoreModal()"
          >{{ $t('common.cancel') }}</b-button
        >
      </div>
    </b-modal>
    <b-modal
      ref="confirmReset"
      hide-header
      @shown="focusConfirmResetModalOkButton()"
    >
      <div class="py-2">
        <h2>{{ $t('settings.exportRestore.resetSettingsQuestion') }}</h2>
        <p class="lead">
          {{ $t('settings.exportRestore.settingsWillBeLost') }}
        </p>
      </div>
      <div slot="modal-footer">
        <b-button
          class="float-right ml-2"
          variant="danger"
          ref="confirmResetModalOkButton"
          @click="resetSettings()"
          >{{ $t('settings.exportRestore.reset') }}</b-button
        >
        <b-button
          class="float-right"
          variant="link"
          @click="cancelConfirmResetModal()"
          >{{ $t('common.cancel') }}</b-button
        >
      </div>
    </b-modal>
    <b-modal
      class="text-center"
      ref="restoreSuccessModal"
      ok-only
      hide-header
      ok-variant="secondary"
    >
      <div class="pb-2 h4">
        <fa icon="check-circle" size="3x" />
      </div>
      <h2>{{ $t('settings.exportRestore.restoredSettings') }}</h2>
    </b-modal>
    <b-modal
      class="text-center"
      ref="resetSuccessModal"
      ok-only
      hide-header
      ok-variant="secondary"
    >
      <div class="pb-2 h4">
        <fa icon="check-circle" size="3x" />
      </div>
      <h2>{{ $t('settings.exportRestore.settingsReset') }}</h2>
    </b-modal>
    <div class="card mb-3">
      <div class="card-body">
        <h3>{{ $t('settings.exportRestore.export') }}</h3>
        <p>{{ $t('settings.exportRestore.exportDescription') }}</p>
        <button
          class="btn btn-secondary d-inline-block"
          @click="exportSettings()"
        >
          {{ $t('settings.exportRestore.export') }}
        </button>
      </div>
    </div>
    <div class="card mb-3">
      <div class="card-body">
        <h3>{{ $t('settings.exportRestore.restore') }}</h3>
        <p>{{ $t('settings.exportRestore.restoreDescription') }}</p>
        <input
          ref="settingsFileUpload"
          type="file"
          accept=".json"
          @change="loadSettingsFile($event)"
        />
      </div>
    </div>
    <div class="card mb-3">
      <div class="card-body">
        <h3>{{ $t('settings.exportRestore.reset') }}</h3>
        <p>{{ $t('settings.exportRestore.resetDescription') }}</p>
        <button class="btn btn-danger d-inline-block" @click="confirmReset()">
          {{ $t('settings.exportRestore.reset') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import saveToFile from '~/mixins/saveToFile';
import getDefaultSettings from '~/store/settingsState';
import { BButton, BModal } from 'bootstrap-vue';

export default {
  components: {
    BButton,
    BModal,
  },
  middleware: ['settings-meta'],
  meta: {
    settingsPageTitleKey: 'settings.exportRestore.exportRestoreSettings',
  },
  mixins: [saveToFile],
  data: function() {
    return {
      importedSettings: {},
    };
  },
  methods: {
    exportSettings: function() {
      this.saveToJSONFile({
        settings: JSON.stringify(this.$store.state.settings),
      });
    },
    async loadSettingsFile(event) {
      try {
        this.importedSettings = JSON.parse(
          await event.target?.files?.[0].text()
        );
        this.$refs.confirmRestore.show();
      } catch (e) {
        this.$refs.invalidSettingsFile.show();
      }
    },
    restoreSettings: function() {
      this.$store
        .dispatch('RESTORE_SETTINGS_OBJECT', { settings: getDefaultSettings() })
        .then(() => {
          return this.$store.dispatch('RESTORE_SETTINGS_OBJECT', {
            settings: this.importedSettings,
          });
        })
        .then(() => {
          this.cancelConfirmRestoreModal();
          this.$refs.restoreSuccessModal.show();
          this.$store.dispatch('SAVE_SETTINGS');
        });
    },
    resetSettings: function() {
      this.$store
        .dispatch('RESTORE_SETTINGS_OBJECT', { settings: getDefaultSettings() })
        .then(() => {
          this.$refs.confirmReset.hide();
          this.$refs.resetSuccessModal.show();

          this.$store.dispatch('SAVE_SETTINGS');
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
  },
};
</script>
