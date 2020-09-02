import { buy, master } from '@/api/order'

const order = {
  state: {
    master: {
      timePercentageList: [],
      unitFNCoin: 0,
      unitSpace: 0,
      address: ''
    }
  },

  mutations: {
    SET_MASTER: (state, master) => {
      state.master = master
    }
  },

  actions: {
    // 取配置信息
    GetOrderMaster ({ commit }) {
      return new Promise((resolve, reject) => {
        master().then(response => {
          if (response.resultCode === '0') {
            commit('SET_MASTER', response.data)
            resolve()
          } else {
            reject(new Error())
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 购买云空间
    BuySpace ({ commit }, parameter) {
      return new Promise((resolve, reject) => {
        buy(parameter).then(response => {
          if (response.resultCode === '0') {
            resolve()
          } else {
            reject(new Error())
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default order
