<template>
  <div class="settings-experiments-view">
    <p>Be sure to help out and give me feedback about experiments! Email me at <a href="mailto:github@curtgrimes.com">github@curtgrimes.com</a> or <a href="https://m.me/webcaptioner">message me on Facebook</a>.</p>
    <b-modal ref="invalidExperiment" class="text-center" hide-header @shown="focusInvalidExperimentModalOkButton()">
      <div style="font-size:7rem" class="p-0">&#129300;</div>
      <div slot="modal-footer">
        <b-btn class="float-right" variant="secondary" ref="invalidExperimentModalOkButton" @click="hideInvalidExperimentModal()">Ok</b-btn>
      </div>
    </b-modal>
    <b-input-group size="lg" class="mb-4">
      <b-form-input @keydown.enter.native="addExperiment" v-model="experimentName" autofocus placeholder="Experiment Name"></b-form-input>
      <b-input-group-append>
        <b-btn @click="addExperiment()">Add</b-btn>
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
    <div class="embed-responsive embed-responsive-16by9">
      <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/Y2VNxmn0lNA?rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
  </div>
</template>

<script>

export default {
  name: 'settings-experiments-view',
  data: function() {
    return {
      experimentName: '',
    };
  },
  computed: {
    experiments: function() {
      return this.$store.state.settings.exp;
    },
  },
  methods: {
    hideInvalidExperimentModal: function() {
      this.$refs.invalidExperiment.hide();
    },
    getDescription: function(experiment) {
      switch(experiment) {
          case 'science':
            return 'Add a persistent "Experiments" menu item to settings for easy access.';
          case 'remoteDisplays':
            return 'Send captions to other phones or tablets.';
          default:
            return '';
      }
    },
    isValidExperiment: function() {
      return ['remoteDisplays','science'].includes(this.experimentName);
    },
    addExperiment: function() {
      if (this.isValidExperiment()) {
        this.$store.commit('ADD_EXPERIMENT', {experiment: this.experimentName});

        this.experimentName = '';
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
