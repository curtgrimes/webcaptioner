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
      settings: {
        appearance: {
          text: {
            textColor: '#ffffff',
            textColorInterim: '#ffffff',
            fontFamily: fontChocies[0].displayName, // first is default
            textSize: "4", // em
            lineHeight: "5", // em
            letterSpacing: "0", // em
            textTransform: "uppercase", // or "capitalize" or "initial"
            alignment: {
              horizontal: 'full', // left, middle, right
              vertical: 'full', // top, middle, bottom, lowerThird
            }
          },
          shadow: {
            color: '#000000',
            opacity: '100',
            blur: '0',
            xPosition: '0.25',
            yPosition: '0.25',
          },
          background: {
            color: '#000000',
          },
        },
        wordReplacements: [],
        censor: {
          on: true,
          replaceWith: 'nothing', // or 'asterisks'
        },
        locale: {
          from: null,
          userDefault: null,
        }
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
