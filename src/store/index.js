import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import order from './modules/order'
import router from './modules/router'
import pledge from './modules/pledge'
// default router permission control
import permission from './modules/permission'
import files from './modules/files'
import uploadfiles from './modules/uploadfiles'
// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    order,
    permission,
    router,
    files,
    uploadfiles,
    pledge
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
