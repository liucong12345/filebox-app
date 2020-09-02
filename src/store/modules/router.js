import { ROUTER_LOADING } from '@/store/mutation-types'

const routerState = {
  state: {
    isLoading: false
  },

  mutations: {
    [ROUTER_LOADING]: (state, loading) => {
      state.isLoading = loading
    }
  }
}

export default routerState
