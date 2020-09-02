const uploadfiles = {
  state: {
    dfs: {
      files: [],
      loading: null,
      footerDataSource: {},
      beforeunload: null
    }
  },
  mutations: {
    'upload_add': (state, file) => {
      state.dfs.files.push(file)
    },
    'upload_rm': (state, file) => {
      state.dfs.files = state.dfs.files.filter(v => v !== file)
    },
    'upload_loading': (state, loading) => {
      state.dfs.loading = loading
    },
    'update_footerDataSource': (state, footerDataSource) => {
      state.dfs.footerDataSource = footerDataSource
    },
    'update_beforeunload': (state, beforeunload) => {
      state.dfs.beforeunload = beforeunload
    }
  },
  actions: {
    addUploadFile ({ commit }, file) {
      commit('upload_add', file)
    },
    rmUploadFile ({ commit }, file) {
      commit('upload_rm', file)
    },
    UploadFileLoading ({ commit, state }, loading) {
      let hasDownloadFile = false
      const fs = [...state.dfs.files]
      const ldg = state.dfs.loading
      for (let i = 0; i < fs.length; i++) {
        if (!fs[i].isCanceled && !fs[i].isDownloaded) {
          hasDownloadFile = true
          break
        }
      }
      if (!hasDownloadFile) {
        ldg && ldg()
        commit('upload_loading', loading)
      }
    },
    updateFooterDataSource ({ commit }, footerDataSource) {
      commit('update_footerDataSource', footerDataSource)
    },
    updateBeforeunload ({ commit }, beforeunload) {
      commit('update_beforeunload', beforeunload)
    }
  }
}

export default uploadfiles
