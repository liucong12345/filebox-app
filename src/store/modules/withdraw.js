import { withdrawReward } from '@/api/withdraw'

const withdraw = {
  state: {
  },

  actions: {
    // 提现
    DoWithdraw ({ commit }, parameter) {
      return new Promise((resolve, reject) => {
        withdrawReward(parameter).then(response => {
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

export default withdraw
