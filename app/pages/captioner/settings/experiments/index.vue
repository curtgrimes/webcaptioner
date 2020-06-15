<template>
  <div class="settings-experiments-view">
    <p>
      Have feedback about experiments? Contact me at
      <a href="mailto:REMOVED">REMOVED</a>.
    </p>
    <b-modal
      ref="invalidExperiment"
      class="text-center"
      hide-header
      @shown="focusInvalidExperimentModalOkButton()"
    >
      <div style="font-size:7rem" class="p-0 text-center">&#129300;</div>
      <div slot="modal-footer">
        <b-button
          class="float-right"
          variant="secondary"
          ref="invalidExperimentModalOkButton"
          @click="hideInvalidExperimentModal()"
          >{{ $t('common.ok') }}</b-button
        >
      </div>
    </b-modal>
    <b-modal ref="experimentConfirmation" hide-header>
      <h3 class="modal-title">
        Do you want to add the "{{ experimentName }}" experiment?
      </h3>
      <p>This feature is still in the oven and may not work right.</p>
      <div class="text-danger font-weight-bold">
        <b-form-checkbox
          v-model="acknowledgements.experimentMayNotWorkOrBreakThings"
        >
          I understand that this experiment may not work perfectly and things
          might break.
        </b-form-checkbox>
        <b-form-checkbox v-model="acknowledgements.couldGoAwayAtAnyTime">
          I understand that this experiment could go away at any time.
        </b-form-checkbox>
        <b-form-checkbox
          v-model="acknowledgements.iWillGiveFeedbackOnHowTheExperimentWorks"
        >
          I'll give Curt feedback on how well this experiment works for me (<a
            href="mailto:REMOVED"
            target="_blank"
            >REMOVED</a
          >
          or
          <a
            href="javascript:void(0)"
            @click="$store.dispatch('START_SUPPORT_POPUP')"
            >online chat</a
          >).
        </b-form-checkbox>
      </div>
      <div slot="modal-footer">
        <b-button
          :disabled="
            !acknowledgements.experimentMayNotWorkOrBreakThings ||
              !acknowledgements.couldGoAwayAtAnyTime ||
              !acknowledgements.iWillGiveFeedbackOnHowTheExperimentWorks
          "
          class="float-right"
          :variant="
            !acknowledgements.experimentMayNotWorkOrBreakThings ||
            !acknowledgements.couldGoAwayAtAnyTime ||
            !acknowledgements.iWillGiveFeedbackOnHowTheExperimentWorks
              ? 'outline-dark'
              : 'secondary'
          "
          @click="addExperiment({ withConfirmation: false })"
          >{{ $t('settings.experiments.addExperiment') }}</b-button
        >
        <b-button
          class="float-right"
          variant="link"
          @click="hideExperimentConfirmationModal()"
          >{{ $t('common.cancel') }}</b-button
        >
      </div>
    </b-modal>
    <b-modal ref="experimentAlreadyAdded" hide-header>
      <h5 class="modal-title">
        {{
          $t('settings.experiments.alreadyAdded', {
            alreadyAddedExperimentName,
          })
        }}
      </h5>
      <div slot="modal-footer">
        <b-button
          class="float-right"
          variant="secondary"
          @click="hideExperimentAlreadyAddedModal()"
          >{{ $t('common.ok') }}</b-button
        >
      </div>
    </b-modal>
    <b-input-group size="lg" class="mb-4">
      <b-form-input
        @keydown.enter.native="addExperiment({ withConfirmation: true })"
        v-model="experimentName"
        autofocus
        autocomplete="off"
        :placeholder="$t('settings.experiments.experimentName')"
      ></b-form-input>
      <b-input-group-append>
        <b-button @click="addExperiment({ withConfirmation: true })">{{
          $t('common.add')
        }}</b-button>
      </b-input-group-append>
    </b-input-group>
    <div v-if="experiments.length">
      <h4>{{ $t('settings.experiments.addedExperiments') }}</h4>
      <b-list-group class="mb-4">
        <b-list-group-item v-for="experiment in experiments" :key="experiment">
          <div class="row">
            <div class="col-8">
              <p class="mb-0">
                <strong>{{ experiment }}</strong>
              </p>
              <p class="small mb-0">{{ getDescription(experiment) }}</p>
            </div>
            <div class="col-4 pr-2">
              <b-button
                class="float-right"
                variant="danger"
                size="sm"
                @click="removeExperiment(experiment)"
                >{{ $t('common.remove') }}</b-button
              >
            </div>
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import {
  BButton,
  BModal,
  BInputGroup,
  BInputGroupAppend,
  BListGroup,
  BListGroupItem,
  BFormInput,
  BFormCheckbox,
} from 'bootstrap-vue';

export default {
  components: {
    BButton,
    BInputGroup,
    BInputGroupAppend,
    BListGroup,
    BListGroupItem,
    BFormInput,
    BFormCheckbox,
    BModal,
  },
  middleware: ['settings-meta'],
  meta: {
    settingsPageTitleKey: 'settings.experiments.experiments',
  },
  data() {
    return {
      experimentName: '',
      alreadyAddedExperimentName: '',
      acknowledgements: {
        experimentMayNotWorkOrBreakThings: false,
        couldGoAwayAtAnyTime: false,
        iWillGiveFeedbackOnHowTheExperimentWorks: false,
      },
    };
  },
  computed: {
    experiments: function() {
      return this.$store.state.settings.exp;
    },
  },
  mounted: function() {
    this.$nextTick(() => {
      if (this.$route.query.add) {
        if (this.experiments.includes(this.$route.query.add)) {
          this.alreadyAddedExperimentName = this.$route.query.add;
          this.$refs.experimentAlreadyAdded.show();
        } else {
          this.experimentName = this.$route.query.add;
          this.addExperiment({ withConfirmation: true });
        }
      }
    });
  },
  methods: {
    hideInvalidExperimentModal: function() {
      this.$refs.invalidExperiment.hide();
    },
    hideExperimentConfirmationModal: function() {
      this.$refs.experimentConfirmation.hide();
    },
    hideExperimentAlreadyAddedModal: function() {
      this.$refs.experimentAlreadyAdded.hide();
    },
    getDescription: function(experiment) {
      switch (experiment) {
        case 'science':
          return 'This will do something someday I think';
        case 'demo':
          return 'Enter a demo mode when you start captioning.';
        case 'typingMode':
          return 'Add a manual typing mode.';
        case 'share':
          return 'Get a link you can use to share captions.';
        case 'saveTranscriptWithTimingsToDropbox':
          return 'Save transcript with timings to Dropbox.';
        case 'zoom':
          return 'Test Zoom integration. Once enabled, go to the Zoom tab in settings.';
        default:
          return '';
      }
    },
    isValidExperiment: function() {
      return [
        'demo',
        'typingMode',
        'share',
        'science',
        'saveTranscriptWithTimingsToDropbox',
        'zoom',
      ].includes(this.experimentName);
    },
    addExperiment: function({ withConfirmation }) {
      if (this.isValidExperiment()) {
        if (withConfirmation) {
          this.$refs.experimentConfirmation.show();
        } else {
          this.$store.commit('ADD_EXPERIMENT', {
            experiment: this.experimentName,
          });
          this.experimentName = '';
          this.$refs.experimentConfirmation.hide();
        }
      } else {
        this.$refs.invalidExperiment.show();
      }
    },
    focusInvalidExperimentModalOkButton: function() {
      this.$refs.invalidExperimentModalOkButton.focus();
    },
    removeExperiment: function(experimentName) {
      this.$store.commit('REMOVE_EXPERIMENT', { experiment: experimentName });
    },
  },
};
</script>
