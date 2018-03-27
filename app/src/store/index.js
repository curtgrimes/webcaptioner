import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import fontChocies from '../util/fontChoices'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      captioner: {
        active: null,
        transcript: {
          final: 'Final transcript here',
          interim: 'Interim',
        },
      },
      appearance: {
        textColor: '#ffffff',
        textColorInterim: '#ffffff',
        fontFamily: fontChocies[0].displayName, // first is default
        textSize: 4, // em
        lineHeight: 5, // em
        letterSpacing: 0, // em

      },
      activeType: null,
      itemsPerPage: 20,
      items: {/* [id: number]: Item */},
      users: {/* [id: string]: User */},
      lists: {
        top: [/* number */],
        new: [],
        show: [],
        ask: [],
        job: []
      }
    },
    actions,
    mutations,
    getters
  })
}
