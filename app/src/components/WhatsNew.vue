<template>
  <div>
    <div v-for="releaseNoteEntry in changelogSortedByVersionNumber" v-bind:key="releaseNoteEntry.version">
      <h3 v-if="hideTitle !== true">Version {{releaseNoteEntry.version}} <small class="text-dark pl-3 text-capitalize">{{formatDate(releaseNoteEntry.date)}}</small></h3>
      <div v-if="Array.isArray(releaseNoteEntry.notes) && releaseNoteEntry.notes.length > 0">
        <ul>
          <li v-for="note in releaseNoteEntry.notes" v-bind:key="note" v-html="note"></li>
        </ul>
      </div>
      <div v-else-if="typeof releaseNoteEntry.notes === 'string'" v-html="releaseNoteEntry.notes" class="ml-4"></div>
      <div v-else class="ml-4"><fa :icon="['far', 'thumbs-up']" class="mr-1" />  Just working on making some stuff run better. </div>
    </div>
  </div>
</template>

<script>
import changelog from '../data/changelog.js'
import versionSort from 'semver-compare'

export default {
  name: 'whatsNew',
  props: ['limit', 'hideTitle'],
  computed: {
    changelogSortedByVersionNumber: function () {
      let sortedChangelog = changelog.sort(function (changelogEntryA, changelogEntryB) {
        return versionSort(changelogEntryA.version, changelogEntryB.version);
      });
      return sortedChangelog.slice(0, this.limit || 10);
    },
  },
  methods: {
    formatDate: function (date) {
      return this.$helpers.dateFormat(date, 'MMM. D, YYYY');
    }
  },
}
</script>
