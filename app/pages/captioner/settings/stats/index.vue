<template>
  <div>
    <div class="card card-body px-0">
      <div class="row small mb-3 mb-sm-2">
        <div class="col-sm-3 col-lg-2 font-weight-bold text-uppercase text-sm-right">Interim</div>
        <div ref="interimScroller" class="col-sm-9 scrollRight">{{$store.state.captioner.transcript.interim}}</div>
      </div>
      <hr/>
      <div class="row small mb-3 mb-sm-2 mt-2">
        <div class="col-sm-3 col-lg-2 font-weight-bold text-uppercase text-sm-right">Final</div>
        <div ref="finalScroller" class="col-sm-9 scrollRight">{{$store.state.captioner.transcript.final}}</div>
      </div>
      <hr/>
      <div class="row small mb-3 mb-sm-2 mt-2">
        <div class="col-sm-3 col-lg-2 font-weight-bold text-uppercase text-sm-right">Stabilized</div>
        <div ref="stabilizedScroller" class="col-sm-9 scrollRight">{{$store.state.captioner.transcript.stabilized}}</div>
      </div>
      <hr/>
      <div class="row mb-3 mb-sm-2 mt-2">
        <div class="col-sm-3 small col-lg-2 font-weight-bold text-uppercase text-sm-right">Cursor</div>
        <div class="col-sm-9">
          <div v-for="(phrase, index) in $store.state.captioner.transcript.cursorable" :key="index" class="d-inline">
            <div
              v-for="({word, firstSeen, stable}, index) in phrase"
              :key="index"
              class="card card-body p-0 d-inline-block small"
              style="overflow:hidden;"
            >
              <div class="row m-0 px-1" :class="stable ? 'bg-success' : 'bg-danger text-white'">{{word}}</div>
              <div class="row m-0 px-1" :class="stable ? 'text-muted' : 'text-danger'">{{Date.now() - firstSeen}}</div>
            </div>
            <div v-if="index != $store.state.captioner.transcript.cursorable.length - 1" class="card card-body p-0 d-inline-block small bg-primary" style="overflow:hidden">
              <div class="row m-0 px-1">&nbsp;</div>
              <div class="row m-0 px-1">&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
      <hr/>
      <div class="row mt-2">
        <div class="col-sm-3 small col-lg-2 font-weight-bold text-uppercase text-sm-right">Locale</div>
        <div class="col-sm-9 small">
          <table class="table table-sm mb-0">
            <tbody>
              <tr>
                <td>Automatically detected</td>
                <td><strong class="text-danger">{{$store.state.settings.locale.userDefault}}</strong></td>
              </tr>
              <tr>
                <td>Closest match recognized by Web Speech API</td>
                <td><strong class="text-danger">{{closestMatchLocale}}</strong></td>
              </tr>
              <tr>
                <td>Current user setting</td>
                <td><strong class="text-danger">{{$store.state.settings.locale.from}}</strong></td>
              </tr>
              <tr>
                <td>window.navigator.languages</td>
                <td><strong class="text-danger">{{windowLocaleData.windowNavigatorLanguages}}</strong></td>
              </tr>
              <tr>
                <td>window.navigator.userLanguage</td>
                <td><strong class="text-danger">{{windowLocaleData.windowNavigatorUserLanguage}}</strong></td>
              </tr>
              <tr>
                <td>window.clientInformation.language</td>
                <td><strong class="text-danger">{{windowLocaleData.windowClientInformationLanguage}}</strong></td>
              </tr>
              <tr>
                <td>All Web Speech API locales</td>
                <td>
                  <a href="javascript:void(0)"  v-b-toggle.localeList>Show list</a>
                  <b-collapse id="localeList">
                    <ul v-for="({code, nameEnglish}) in localesSortedByCode" :key="code" class="mb-0">
                      <li>{{code}} - {{nameEnglish}}</li>
                    </ul>
                  </b-collapse>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .transcriptGrid {
    display:grid;
    grid-template-columns: 15% auto;
    grid-column-gap:25px;
  }
  .transcriptGrid > div {
    padding:10px 0;
  }
  .scrollRight {
    white-space:nowrap;
    overflow-x:auto;
  }
</style>


<script>
import locales from '~/mixins/data/locales';

export default {
  transition: 'fade',
  middleware: [
    'settings-meta',
  ],
  meta: {
    settingsPageTitle: 'Stats',
  },
  data: function() {
    return {
      locales,
    };
  },
  computed: {
    windowLocaleData: function() {
      return {
        windowNavigatorLanguages: process.client ? window.navigator.languages : '',
        windowNavigatorUserLanguage: process.client ? window.navigator.userLanguage : '',
        windowClientInformationLanguage: process.client ? window.clientInformation.language : '',
      };
    },
    closestMatchLocale: function() {
      // TODO this function is copied from actions. Remove duplication at some point.
      let closestMatch = this.locales.find((l) => {
        return (l.code || '').toUpperCase() == (this.$store.state.settings.locale.userDefault || '').toUpperCase();
      });

      return closestMatch ? closestMatch.code : '';
    },
    localesSortedByCode: function() {
      return this.locales.sort((a, b) => {return this.sortByProperty('code', a, b); });
    },
  },
  methods: {
    sortByProperty: function(propertyName, a, b) {
      if (a[propertyName] < b[propertyName])
        return -1;
      else if (a[propertyName] > b[propertyName])
        return 1;
      else {
        return 0;
      }
    },
    scrollRight: function(el) {
      this.$nextTick(function() {
        el.scrollLeft = 9999999;
      });
    },
  },
  watch: {
    '$store.state.captioner.transcript.interim': function () {
      this.scrollRight(this.$refs.interimScroller);
    },
    '$store.state.captioner.transcript.final': function () {
      this.scrollRight(this.$refs.finalScroller);
    },
    '$store.state.captioner.transcript.stabilized': function () {
      this.scrollRight(this.$refs.stabilizedScroller);
    },
  },
}
</script>
