<template>
  <div class="settings-language-view">
    <h2>Language</h2>
    <p>Recognize speech in another language.</p>
    <div class="list-group">
      <button v-if="selectedLocale" class="list-group-item list-group-item-action active">
        <span class="row">
          <span class="col-1 pr-1 text-center"><i class="fa fa-check-circle fa-2x mt-2" aria-hidden="true"></i></span>
          <span class="col-11">
            {{selectedLocale.nameEnglish}}<br/>
            <span class="small">{{selectedLocale.name}}</span>
          </span>
        </span>
      </button>
    </div>

    <hr class="my-4" />

    <h3>Other Languages</h3>
    <p class="small">Learn more about <a href="https://webcaptioner.com/help/general/supported-languages/" target="_blank">supported languages and dialects</a>.</p>
    <div class="row mb-3">
      <div class="col-sm-6">
        <input type="text" v-model="searchQuery" placeholder="Search..." class="form-control" />
      </div>
    </div>
    <div class="list-group">
      <button v-for="locale in filteredLocales" v-bind:key="locale.code" @click="localeFrom = locale.code" class="list-group-item list-group-item-action" v-bind:class="{'active': localeFrom == locale.code}">
        <span class="row">
          <span class="col-1 pr-1 text-center"><i v-if="localeFrom == locale.code" class="fa fa-check-circle fa-2x mt-2" aria-hidden="true"></i></span>
          <span class="col-11">
            {{locale.nameEnglish}}<br/>
            <span class="small">{{locale.name}}</span>
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<style>
  .list-group button {
    cursor: pointer;
  }
</style>

<script>
import locales from '../../data/locales';
import normalize from 'normalize-strings';

export default {
  name: 'settings-language-view',
  created: function () {
    if (!this.$store.state.settings.locale.from) {
      this.$forceUpdate();
    }
  },
  data: function () {
    return {
      searchQuery: '',
    }
  },
  computed: {
    selectedLocale: function() {
      return locales.find((l) => {
        return l.code == this.localeFrom;
      });
    },
    filteredLocales: function () {
      return locales.filter((l) => {
        var self = this;
        function includesSearchQuery(string) {
          return normalize(string)
                  .toLowerCase()
                  .includes(
                    normalize(self.searchQuery)
                      .toLowerCase()
                  );
        }

        return this.searchQuery == '' // return all of them if searchQuery is empty
          || includesSearchQuery(l.name)
          || includesSearchQuery(l.code)
          || includesSearchQuery(l.nameEnglish)
      });
    },
    localeFrom: {
      get () {
        this.$forceUpdate();
        return this.$store.state.settings.locale.from;
      },
      set (locale) {
        this.$store.commit('SET_LOCALE_FROM', { locale });
      },
    },
  },
}
</script>
