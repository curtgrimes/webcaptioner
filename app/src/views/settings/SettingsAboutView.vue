<template>
  <div class="settings-about-view">
    <h2>About</h2>
    <p>Version {{changelogSortedByVersionNumber[changelogSortedByVersionNumber.length - 1].version}}</p>

    <hr class="my-4" />
    
    <h2>What's New</h2>
    
    <div v-for="releaseNoteEntry in changelogSortedByVersionNumber" v-bind:key="releaseNoteEntry.version">
      <h3>Version {{releaseNoteEntry.version}} <small class="text-dark pl-3 text-capitalize">{{formatDate('2014-02-02')}}</small></h3>
      <div v-if="Array.isArray(releaseNoteEntry.notes)">
        <ul>
          <li v-for="note in releaseNoteEntry.notes" v-bind:key="note" v-html="note"></li>
        </ul>
      </div>
      <div v-else v-html="releaseNoteEntry.notes"></div>
    </div>
  </div>
</template>

<script>
import {changelog} from '../../data/changelog.json'
import format from 'date-fns/format'
import versionSort from 'version-sort'

export default {
  name: 'settings-about-view',
  computed: {
    changelogSortedByVersionNumber: function () {
      return versionSort(changelog, { nested: 'version' }).reverse();
    },
  },
  methods: {
    formatDate: function (date) {
      return format(date, 'MMM. D, YYYY');
    }
  },
}
</script>
