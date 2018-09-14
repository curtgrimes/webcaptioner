<template>
  <div class="settings-language-view">
    <i18n path="settings.language.description.text" tag="p">
      <a place="supportedLanguagesAndDialects" href="/help/general/supported-languages/" target="_blank">{{$t('settings.language.description.supportedLanguagesAndDialects')}}</a>
    </i18n>
    <h3>{{$t('settings.language.selectALanguage')}}</h3>
    <div class="row mb-3">
      <div class="col-sm-7" :class="{'col-9': showClearButton}">
        <input ref="search" type="text" v-model="searchQuery" :placeholder="$t('common.search')" class="form-control" />
      </div>
      <div class="col-3 col-sm-3 col-lg-2 pl-0" v-if="showClearButton">
        <button v-bind:class="{'show' : showClearButton, 'invisible' : !showClearButton}" class="btn btn-sm btn-outline-dark fade w-100" type="button" @click="clearSearch()">{{$t('common.clear')}}</button>
      </div>
    </div>
    <div class="list-group">
      <button v-for="locale in filteredLocales" v-bind:key="locale.code" @click="localeFrom = locale.code" class="list-group-item list-group-item-action" v-bind:class="{'active': localeFrom == locale.code}">
        <span class="row">
          <span class="col-1 pr-1 text-center"><span class="mt-2 d-block"><fa v-if="localeFrom == locale.code" icon="check-circle" size="2x" /></span></span>
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
import locales from '~/mixins/data/locales';
import normalize from 'normalize-strings';

export default {
  name: 'settings-language-view',
  transition: 'fade',
  middleware: [
    'settings-meta',
  ],
  meta: {
    settingsPageTitleKey: 'settings.language.language',
  },
  created: function () {
    if (!this.$store.state.settings.locale.from) {
      this.$forceUpdate();
    }
  },
  mounted: function() {
    if (this.$refs.search) {
      this.$refs.search.focus();
    }
  },
  data: function () {
    return {
      searchQuery: '',
    }
  },
  methods: {
    clearSearch: function () {
      this.searchQuery = '';
      this.$refs.search.focus();
    },
  },
  computed: {
    showClearButton: function() {
      return this.searchQuery !== '';
    },
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
