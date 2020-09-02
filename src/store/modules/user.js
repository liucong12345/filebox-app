import storage from 'store'
import { login, logout } from '@/api/login'
import { getUserSpaceInfo } from '@/api/userinfo'
import { ADDRESS, KEY_STORE } from '@/store/mutation-types'

const user = {
  state: {
    keystore: '',
    address: '',
    totalSize: 0,
    currentSize: 0,
    buyCnt: 0
  },

  mutations: {
    SET_KEYSTORE: (state, keystore) => {
      state.keystore = keystore
    },
    SET_ADDRESS: (state, address) => {
      state.address = address
    },
    SET_TOTAL_SIZE: (state, totalSize) => {
      state.totalSize = totalSize
    },
    SET_CURRENT_SIZE: (state, currentSize) => {
      state.currentSize = currentSize
    },
    SET_BUY_CNT: (state, buyCnt) => {
      state.buyCnt = buyCnt
    }
  },

  actions: {
    // 登录
    Login ({ commit }, { address, keystore }) {
      return new Promise((resolve, reject) => {
        login({ publicKey: address }).then(response => {
          if (response.resultCode === '0') {
            storage.set(KEY_STORE, keystore, 7 * 24 * 60 * 60 * 1000)
            storage.set(ADDRESS, address, 7 * 24 * 60 * 60 * 1000)
            commit('SET_KEYSTORE', keystore)
            commit('SET_ADDRESS', address)
            resolve()
          } else {
            reject(new Error())
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).finally(() => {
          commit('SET_KEYSTORE', '')
          storage.remove(KEY_STORE)
          commit('SET_ADDRESS', '')
          storage.remove(ADDRESS)
          resolve()
        })
      })
    },
    GetSpaceInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getUserSpaceInfo().then(response => {
          if (response.resultCode === '0') {
            const { totalSize, currentSize, buyCnt } = response.data
            commit('SET_TOTAL_SIZE', totalSize)
            commit('SET_CURRENT_SIZE', currentSize)
            commit('SET_BUY_CNT', buyCnt)
            resolve()
          } else {
            reject(new Error())
          }
        }).catch(() => {
          resolve()
        }).finally(() => {
        })
      })
    }
  }
}

export default user
