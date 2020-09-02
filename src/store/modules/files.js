const files = {
  state: {
    dfs: {
      files: [],
      loading: null
    }
  },
  mutations: {
    'download_add': (state, file) => {
      state.dfs.files.push(file)
    },
    'download_rm': (state, file) => {
      state.dfs.files = state.dfs.files.filter(v => v !== file)
    },
    'download_loading': (state, loading) => {
      state.dfs.loading = loading
    }
  },
  actions: {
    addDownloadFile ({ commit }, file) {
      commit('download_add', file)
    },
    rmDownloadFile ({ commit }, file) {
      commit('download_rm', file)
    },
    downloadFileLoading ({ commit, state }, loading) {
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
        commit('download_loading', loading)
      }
    }
  }
}

export default files
