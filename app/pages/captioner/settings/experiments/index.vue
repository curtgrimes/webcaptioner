<template>
  <div class="settings-experiments-view">
    <p>Be sure to help out and give me feedback about experiments! Email me at <a href="mailto:github@curtgrimes.com">github@curtgrimes.com</a> or <a href="https://m.me/webcaptioner">message me on Facebook</a>.</p>
    <b-modal ref="invalidExperiment" class="text-center" hide-header @shown="focusInvalidExperimentModalOkButton()">
      <div style="font-size:7rem" class="p-0">&#129300;</div>
      <div slot="modal-footer">
        <b-btn class="float-right" variant="secondary" ref="invalidExperimentModalOkButton" @click="hideInvalidExperimentModal()">Ok</b-btn>
      </div>
    </b-modal>
    <b-modal ref="experimentConfirmation" hide-header>
      <h5 class="modal-title">Do you want to add the "{{experimentName}}" experiment?</h5>
      <div slot="modal-footer">
        <b-btn class="float-right" variant="secondary" @click="addExperiment({withConfirmation: false})">Add Experiment</b-btn>
        <b-btn class="float-right" variant="link" @click="hideExperimentConfirmationModal()">Cancel</b-btn>
      </div>
    </b-modal>
    <b-modal ref="experimentAlreadyAdded" hide-header>
      <h5 class="modal-title">You've already added the "{{alreadyAddedExperimentName}}" experiment.</h5>
      <div slot="modal-footer">
        <b-btn class="float-right" variant="secondary" @click="hideExperimentAlreadyAddedModal()">Ok</b-btn>
      </div>
    </b-modal>
    <b-input-group size="lg" class="mb-4">
      <b-form-input @keydown.enter.native="addExperiment({withConfirmation: false})" v-model="experimentName" autofocus placeholder="Experiment Name"></b-form-input>
      <b-input-group-append>
        <b-btn @click="addExperiment({withConfirmation: false})">Add</b-btn>
      </b-input-group-append>
    </b-input-group>
    <div v-if="experiments.length">
      <h4>Added Experiments</h4>
      <b-list-group class="mb-4">
        <b-list-group-item v-for="experiment in experiments" :key="experiment">
          <div class="row">
            <div class="col-8">
              <p class="mb-0"><strong>{{experiment}}</strong></p>
              <p class="small mb-0">{{getDescription(experiment)}}</p>
            </div>
            <div class="col-4 pr-2">
              <b-btn class="float-right" variant="danger" size="sm" @click="removeExperiment(experiment)">Remove</b-btn>
            </div>
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>

export default {
  name: 'settings-experiments-view',
  transition: 'fade',
  middleware: [
    'settings-meta',
  ],
  meta: {
    settingsPageTitle: 'Experiments',
  },
  data: function() {
    return {
      experimentName: '',
      alreadyAddedExperimentName: '',
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
          }
          else {
            this.experimentName = this.$route.query.add;
            this.addExperiment({withConfirmation: true});
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
      switch(experiment) {
          case 'science':
            return 'This will do something someday I think';
          case 'remoteDisplays':
            return 'Send captions to other phones or tablets.';
          case 'largerLayout':
            return 'Adds an option for a larger navbar layout under Settings > Controls.';
          case 'chromecast':
            return 'A cast button will show on the navbar when a Chromecast-enabled device is detected on the network.';
          default:
            return '';
      }
    },
    isValidExperiment: function() {
      return ['remoteDisplays','science','largerLayout','chromecast',].includes(this.experimentName);
    },
    addExperiment: function({withConfirmation}) {
      if (this.isValidExperiment()) {
        if (withConfirmation) {
          this.$refs.experimentConfirmation.show();
        }
        else {
          this.$store.commit('ADD_EXPERIMENT', {experiment: this.experimentName});
          this.experimentName = '';
          this.$refs.experimentConfirmation.hide();
        }
      }
      else {
        this.$refs.invalidExperiment.show();
      }
    },
    focusInvalidExperimentModalOkButton: function() {
      this.$refs.invalidExperimentModalOkButton.focus();
    },
    removeExperiment: function(experimentName) {
      this.$store.commit('REMOVE_EXPERIMENT', {experiment: experimentName});
    },
  },
}
</script>
