<template>
  <div class="settings-experiments-view">
    <i18n path="settings.experiments.description" tag="p">
      <a place="email" href="mailto:github@curtgrimes.com">github@curtgrimes.com</a>
      <a place="messageMeOnFacebook" href="https://m.me/webcaptioner">{{$t('settings.experiments.messageMeOnFacebook')}}</a>
    </i18n>
    <b-modal ref="invalidExperiment" class="text-center" hide-header @shown="focusInvalidExperimentModalOkButton()">
      <div style="font-size:7rem" class="p-0">&#129300;</div>
      <div slot="modal-footer">
        <b-btn class="float-right" variant="secondary" ref="invalidExperimentModalOkButton" @click="hideInvalidExperimentModal()">{{$t('common.ok')}}</b-btn>
      </div>
    </b-modal>
    <b-modal ref="experimentConfirmation" hide-header>
      <h5 class="modal-title">{{$t('settings.experiments.addExperimentConfirmation', {experimentName})}}</h5>
      <div slot="modal-footer">
        <b-btn class="float-right" variant="secondary" @click="addExperiment({withConfirmation: false})">{{$t('settings.experiments.addExperiment')}}</b-btn>
        <b-btn class="float-right" variant="link" @click="hideExperimentConfirmationModal()">{{$t('common.cancel')}}</b-btn>
      </div>
    </b-modal>
    <b-modal ref="experimentAlreadyAdded" hide-header>
      <h5 class="modal-title">{{$t('settings.experiments.alreadyAdded', {alreadyAddedExperimentName})}}</h5>
      <div slot="modal-footer">
        <b-btn class="float-right" variant="secondary" @click="hideExperimentAlreadyAddedModal()">{{$t('common.ok')}}</b-btn>
      </div>
    </b-modal>
    <b-input-group size="lg" class="mb-4">
      <b-form-input @keydown.enter.native="addExperiment({withConfirmation: false})" v-model="experimentName" autofocus :placeholder="$t('settings.experiments.experimentName')"></b-form-input>
      <b-input-group-append>
        <b-btn @click="addExperiment({withConfirmation: false})">{{$t('common.add')}}</b-btn>
      </b-input-group-append>
    </b-input-group>
    <div v-if="experiments.length">
      <h4>{{$t('settings.experiments.addedExperiments')}}</h4>
      <b-list-group class="mb-4">
        <b-list-group-item v-for="experiment in experiments" :key="experiment">
          <div class="row">
            <div class="col-8">
              <p class="mb-0"><strong>{{experiment}}</strong></p>
              <p class="small mb-0">{{getDescription(experiment)}}</p>
            </div>
            <div class="col-4 pr-2">
              <b-btn class="float-right" variant="danger" size="sm" @click="removeExperiment(experiment)">{{$t('common.remove')}}</b-btn>
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
    settingsPageTitleKey: 'settings.experiments.experiments',
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
          case 'demo':
            return 'Enter a demo mode when you start captioning.';
          case 'typingMode':
            return 'Add a manual typing mode.';
          case 'share':
            return 'Get a link you can use to share captions.';
          case 'webhooks':
            return 'Use webhooks to integrate your application with Web Captioner.';
          default:
            return '';
      }
    },
    isValidExperiment: function() {
      return ['demo', 'typingMode','share','science','','webhooks',].includes(this.experimentName);
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
