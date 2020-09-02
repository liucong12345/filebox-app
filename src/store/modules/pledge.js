const pledge = {
  state: {
    master: {
      currentPage: 1
    }
  },

  mutations: {
    SET_CURRENTPAGE: (state, currentPage) => {
      state.master.currentPage = currentPage
    }
  },

  actions: {
    // 取配置信息
    setPageNo ({ commit }, currentPageNo) {
      commit('SET_CURRENTPAGE', currentPageNo)
    }
  }
}

export default pledge
