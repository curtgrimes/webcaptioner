<template>
  <div class="settings-experiments-view">
    <p class="mb-0">
      These are some features that aren't quite ready yet. You're welcome to try
      them out! Feel free to send feedback to
      <a href="mailto:REMOVED">REMOVED</a> or
      through
      <a
        href="javascript:void(0)"
        @click="$store.dispatch('START_SUPPORT_POPUP')"
        >online chat</a
      >.
    </p>
    <hr class="my-3" />
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
      <h3 class="modal-title text-center mb-3">
        Do you want to add this experiment?
      </h3>
      <div class="card card-body mb-3 d-flex h-100">
        <fa icon="flask" size="3x" class="mx-auto mb-3" />
        <h3 class="h4 text-center mb-0">
          {{ experimentToAdd.name }}
        </h3>
        <p class="mb-0 text-center mt-2 text-muted small">
          <span v-if="experimentToAdd.description">
            {{ experimentToAdd.description }}asdf
          </span>
          <span v-else class="font-italic">No description</span>
        </p>
      </div>
      <p class="text-center">
        This feature is still in the oven and may not work right.
      </p>
      <hr />
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
          I'll give feedback on how well this experiment works for me (<a
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
    <div class="row">
      <div
        class="col-md-6 mb-3"
        v-for="experiment in experimentsWithHiddenExperiments"
        :key="experiment.id"
      >
        <div
          class="card card-body mb-3 d-flex h-100"
          :class="
            experimentLoaded(experiment.id) ? 'bg-white shadow' : 'bg-light'
          "
        >
          <h3 class="h5">
            {{ experiment.name }}
          </h3>
          <p class="small mb-0">
            <span v-if="experiment.description">{{
              experiment.description
            }}</span>
            <span v-else class="font-italic">No description</span>
          </p>
          <hr class="mt-auto" />
          <div class="d-flex mb-n2 mt-1 align-items-center">
            <span
              v-if="experimentLoaded(experiment.id)"
              class="small text-muted"
              ><fa icon="check" fixed-width /> Added
            </span>
            <b-button
              v-if="experimentLoaded(experiment.id)"
              class="ml-auto stretched-link"
              @click="
                $store.commit('REMOVE_EXPERIMENT', {
                  experiment: experiment.id,
                })
              "
              variant="outline-danger"
            >
              Remove
            </b-button>
            <b-button
              v-else
              class="ml-auto stretched-link"
              @click="
                experimentIdToAdd = experiment.id;
                addExperiment({ withConfirmation: true });
              "
            >
              Add
            </b-button>
          </div>
        </div>
      </div>
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
      experiments: [
        {
          id: 'typingMode',
          name: 'Manually type captions',
          description: 'Adds a button to manually type captions.',
        },
        {
          id: 'demo',
          name: 'Demo mode',
          description:
            'Fills the captionining window automatically with dummy text and ignores any microphone input.',
        },
        {
          id: 'speakBack',
          name: 'Speak everything back',
          description:
            'After speech is converted to text, convert the text back to speech using speech synthesis.',
        },
      ],

      experimentIdToAdd: '',
      alreadyAddedExperimentName: '',
      acknowledgements: {
        experimentMayNotWorkOrBreakThings: false,
        couldGoAwayAtAnyTime: false,
        iWillGiveFeedbackOnHowTheExperimentWorks: false,
      },
    };
  },
  computed: {
    loadedExperiments() {
      return this.$store.state.settings.exp;
    },
    experimentToAdd() {
      const experiment = this.experiments.find(
        (e) => e.id === this.experimentIdToAdd
      );
      return experiment || { name: this.experimentIdToAdd }; // it's a hidden experiment
    },
    experimentsWithHiddenExperiments() {
      return [
        ...this.experiments,

        // With added experiments that aren't in our static list
        // of experiments we present on load
        ...this.loadedExperiments
          // Remove experiments that are already in our static list
          .filter(
            (loadedExperiment) =>
              !this.experiments.map((e) => e.id).includes(loadedExperiment)
          )
          .map((loadedExperimentId) => ({
            id: loadedExperimentId,
            name: loadedExperimentId,
          })),
      ];
    },
  },
  methods: {
    experimentLoaded(experimentId) {
      return this.loadedExperiments.includes(experimentId);
    },
    hideInvalidExperimentModal: function() {
      this.$refs.invalidExperiment.hide();
    },
    hideExperimentConfirmationModal: function() {
      this.$refs.experimentConfirmation.hide();
      Object.keys(this.acknowledgements).forEach(
        (acknowledgementKey) =>
          (this.acknowledgements[acknowledgementKey] = false)
      );
    },
    hideExperimentAlreadyAddedModal: function() {
      this.$refs.experimentAlreadyAdded.hide();
    },
    isValidExperiment: function() {
      return [
        'share',
        'saveTranscriptWithTimingsToDropbox',
        'zoom',
        ...this.experiments.map((e) => e.id),
      ].includes(this.experimentIdToAdd);
    },
    addExperiment: function({ withConfirmation }) {
      if (this.isValidExperiment()) {
        if (withConfirmation) {
          this.$refs.experimentConfirmation.show();
        } else {
          this.$store.commit('ADD_EXPERIMENT', {
            experiment: this.experimentIdToAdd,
          });
          this.experimentIdToAdd = '';
          this.$refs.experimentConfirmation.hide();
        }
      } else {
        this.$refs.invalidExperiment.show();
      }

      Object.keys(this.acknowledgements).forEach(
        (acknowledgementKey) =>
          (this.acknowledgements[acknowledgementKey] = false)
      );
    },
    focusInvalidExperimentModalOkButton: function() {
      this.$refs.invalidExperimentModalOkButton.focus();
    },
    parseExperimentFromURL() {
      if (this.$route.query.add) {
        if (this.loadedExperiments.includes(this.$route.query.add)) {
          this.alreadyAddedExperimentName = this.$route.query.add;
          this.$refs.experimentAlreadyAdded.show();
        } else {
          this.experimentIdToAdd = this.$route.query.add;
          this.addExperiment({ withConfirmation: true });
        }
      }
    },
  },
  watch: {
    '$store.state.settingsLoaded'() {
      this.parseExperimentFromURL();
    },
  },
};
</script>
