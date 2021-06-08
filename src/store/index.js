import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // this is the "cached" package data
    packages: {
      1: 'Package_1',
      2: 'Package_2',
      3: 'Package_3',
      4: 'Package_4',
      5: 'Package_5'
    }
  },
  mutations: {},
  actions: {},
  modules: {}
})
